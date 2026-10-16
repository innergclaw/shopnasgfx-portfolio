import * as React from "react"
import { cn } from "@/lib/utils"

export interface Position {
  x: number
  y: number
}

export interface RenderItemProps {
  gridIndex: number
  position: Position
  isMoving: boolean
}

export interface InfiniteGridProps {
  gridSize: number
  renderItem: (props: RenderItemProps) => React.ReactNode
  className?: string
  initialPosition?: Position
}

interface InfiniteGridState {
  offset: Position
  isDragging: boolean
  isMoving: boolean
  containerSize: { width: number; height: number }
  scale: number
}

const FRICTION = 0.9
const MIN_VELOCITY = 0.2
const UPDATE_INTERVAL = 16
const VELOCITY_HISTORY_SIZE = 5
const VELOCITY_THRESHOLD = 0.3
const MIN_SCALE = 0.5
const MAX_SCALE = 2.5

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function throttle<T extends (...args: any[]) => void>(fn: T, wait: number) {
  let last = 0
  let timer: ReturnType<typeof setTimeout> | null = null
  return (...args: Parameters<T>) => {
    const now = Date.now()
    const remaining = wait - (now - last)
    if (remaining <= 0) {
      if (timer) {
        clearTimeout(timer)
        timer = null
      }
      last = now
      fn(...args)
    } else if (!timer) {
      timer = setTimeout(() => {
        last = Date.now()
        timer = null
        fn(...args)
      }, remaining)
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function debounce<T extends (...args: any[]) => void>(fn: T, wait: number) {
  let timer: ReturnType<typeof setTimeout> | null = null
  const debounced = (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => fn(...args), wait)
  }
  debounced.cancel = () => {
    if (timer) clearTimeout(timer)
  }
  return debounced
}

const clampScale = (s: number) => Math.min(MAX_SCALE, Math.max(MIN_SCALE, s))

export class InfiniteGrid extends React.Component<InfiniteGridProps, InfiniteGridState> {
  private containerRef = React.createRef<HTMLDivElement>()
  private lastPos: Position = { x: 0, y: 0 }
  private velocity: Position = { x: 0, y: 0 }
  private velocityHistory: Position[] = []
  private lastMoveTime = 0
  private animationFrame: number | null = null
  private resizeObserver: ResizeObserver | null = null
  private pinchStartDistance = 0
  private pinchStartScale = 1
  private isPinching = false

  constructor(props: InfiniteGridProps) {
    super(props)
    this.state = {
      offset: props.initialPosition ?? { x: 0, y: 0 },
      isDragging: false,
      isMoving: false,
      containerSize: { width: 0, height: 0 },
      scale: 1,
    }
  }

  componentDidMount() {
    const el = this.containerRef.current
    if (!el) return
    this.updateContainerSize()
    this.resizeObserver = new ResizeObserver(this.debouncedUpdateContainerSize)
    this.resizeObserver.observe(el)
    el.addEventListener("wheel", this.handleWheel, { passive: false })
    el.addEventListener("touchstart", this.handleTouchStart, { passive: false })
    el.addEventListener("touchmove", this.handleTouchMove, { passive: false })
    el.addEventListener("touchend", this.handleTouchEnd)
    el.addEventListener("touchcancel", this.handleTouchEnd)
    window.addEventListener("mousemove", this.handleMouseMove)
    window.addEventListener("mouseup", this.handleMouseUp)
  }

  componentWillUnmount() {
    const el = this.containerRef.current
    this.resizeObserver?.disconnect()
    this.debouncedUpdateContainerSize.cancel()
    this.debouncedStopMoving.cancel()
    if (el) {
      el.removeEventListener("wheel", this.handleWheel)
      el.removeEventListener("touchstart", this.handleTouchStart)
      el.removeEventListener("touchmove", this.handleTouchMove)
      el.removeEventListener("touchend", this.handleTouchEnd)
      el.removeEventListener("touchcancel", this.handleTouchEnd)
    }
    window.removeEventListener("mousemove", this.handleMouseMove)
    window.removeEventListener("mouseup", this.handleMouseUp)
    this.stopInertia()
  }

  private updateContainerSize = () => {
    const el = this.containerRef.current
    if (!el) return
    const { width, height } = el.getBoundingClientRect()
    this.setState({ containerSize: { width, height } })
  }

  private debouncedUpdateContainerSize = debounce(this.updateContainerSize, 100)

  private debouncedStopMoving = debounce(() => {
    this.setState({ isMoving: false })
  }, 200)

  private getItemIndexForPosition(x: number, y: number): number {
    if (x === 0 && y === 0) return 0
    const layer = Math.max(Math.abs(x), Math.abs(y))
    const inner = (2 * layer - 1) ** 2
    const side = 2 * layer
    // right side: x = layer, y from -layer+1 up to layer
    if (x === layer && y > -layer) return inner + (y + layer - 1)
    // top side: y = layer, x from layer-1 down to -layer
    if (y === layer) return inner + side + (layer - 1 - x)
    // left side: x = -layer, y from layer-1 down to -layer
    if (x === -layer) return inner + 2 * side + (layer - 1 - y)
    // bottom side: y = -layer, x from -layer+1 up to layer
    return inner + 3 * side + (x + layer - 1)
  }

  private panBy(dx: number, dy: number) {
    const s = this.state.scale
    this.setState((prev) => ({
      offset: { x: prev.offset.x + dx / s, y: prev.offset.y + dy / s },
      isMoving: true,
    }))
    this.debouncedStopMoving()
  }

  private stopInertia() {
    if (this.animationFrame !== null) {
      cancelAnimationFrame(this.animationFrame)
      this.animationFrame = null
    }
  }

  private recordVelocity(dx: number, dy: number) {
    const now = Date.now()
    const dt = Math.max(now - this.lastMoveTime, 1)
    this.lastMoveTime = now
    const v = { x: (dx / dt) * UPDATE_INTERVAL, y: (dy / dt) * UPDATE_INTERVAL }
    this.velocityHistory.push(v)
    if (this.velocityHistory.length > VELOCITY_HISTORY_SIZE) this.velocityHistory.shift()
    const sum = this.velocityHistory.reduce((a, b) => ({ x: a.x + b.x, y: a.y + b.y }), { x: 0, y: 0 })
    this.velocity = { x: sum.x / this.velocityHistory.length, y: sum.y / this.velocityHistory.length }
  }

  private startInertia = () => {
    if (Date.now() - this.lastMoveTime > 100) return
    if (Math.abs(this.velocity.x) < VELOCITY_THRESHOLD && Math.abs(this.velocity.y) < VELOCITY_THRESHOLD) return
    const step = () => {
      this.velocity = { x: this.velocity.x * FRICTION, y: this.velocity.y * FRICTION }
      if (Math.abs(this.velocity.x) < MIN_VELOCITY && Math.abs(this.velocity.y) < MIN_VELOCITY) {
        this.animationFrame = null
        return
      }
      this.panBy(this.velocity.x, this.velocity.y)
      this.animationFrame = requestAnimationFrame(step)
    }
    this.animationFrame = requestAnimationFrame(step)
  }

  private beginDrag(x: number, y: number) {
    this.stopInertia()
    this.lastPos = { x, y }
    this.lastMoveTime = Date.now()
    this.velocity = { x: 0, y: 0 }
    this.velocityHistory = []
    this.setState({ isDragging: true })
  }

  private dragTo = throttle((x: number, y: number) => {
    if (!this.state.isDragging) return
    const dx = x - this.lastPos.x
    const dy = y - this.lastPos.y
    this.lastPos = { x, y }
    this.recordVelocity(dx, dy)
    this.panBy(dx, dy)
  }, UPDATE_INTERVAL)

  private endDrag() {
    if (!this.state.isDragging) return
    this.setState({ isDragging: false })
    this.startInertia()
  }

  private handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return
    this.beginDrag(e.clientX, e.clientY)
  }

  private handleMouseMove = (e: MouseEvent) => this.dragTo(e.clientX, e.clientY)

  private handleMouseUp = () => this.endDrag()

  private zoomAt(nextScale: number) {
    this.setState({ scale: clampScale(nextScale) })
  }

  private handleWheel = (e: WheelEvent) => {
    e.preventDefault()
    if (e.ctrlKey || e.metaKey) {
      this.zoomAt(this.state.scale * Math.exp(-e.deltaY * 0.01))
      return
    }
    this.stopInertia()
    this.panBy(-e.deltaX, -e.deltaY)
  }

  private touchDistance(t: TouchList) {
    return Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY)
  }

  private handleTouchStart = (e: TouchEvent) => {
    if (e.touches.length === 2) {
      this.isPinching = true
      this.pinchStartDistance = this.touchDistance(e.touches)
      this.pinchStartScale = this.state.scale
      this.setState({ isDragging: false })
      return
    }
    if (e.touches.length === 1) this.beginDrag(e.touches[0].clientX, e.touches[0].clientY)
  }

  private handleTouchMove = (e: TouchEvent) => {
    e.preventDefault()
    if (e.touches.length === 2 && this.isPinching) {
      const d = this.touchDistance(e.touches)
      if (this.pinchStartDistance > 0) this.zoomAt(this.pinchStartScale * (d / this.pinchStartDistance))
      return
    }
    if (e.touches.length === 1 && !this.isPinching) this.dragTo(e.touches[0].clientX, e.touches[0].clientY)
  }

  private handleTouchEnd = (e: TouchEvent) => {
    if (this.isPinching) {
      if (e.touches.length === 0) this.isPinching = false
      return
    }
    this.endDrag()
  }

  private getVisibleCells() {
    const { gridSize } = this.props
    const { offset, containerSize, scale } = this.state
    const w = containerSize.width / scale
    const h = containerSize.height / scale
    const cols = Math.ceil(w / gridSize) + 2
    const rows = Math.ceil(h / gridSize) + 2
    const centerX = -Math.round(offset.x / gridSize)
    const centerY = -Math.round(offset.y / gridSize)
    const cells: { x: number; y: number }[] = []
    const halfC = Math.ceil(cols / 2)
    const halfR = Math.ceil(rows / 2)
    for (let y = centerY - halfR; y <= centerY + halfR; y++) {
      for (let x = centerX - halfC; x <= centerX + halfC; x++) cells.push({ x, y })
    }
    return cells
  }

  render() {
    const { gridSize, renderItem, className } = this.props
    const { offset, containerSize, isDragging, isMoving, scale } = this.state
    const cx = containerSize.width / 2 - gridSize / 2
    const cy = containerSize.height / 2 - gridSize / 2
    return (
      <div
        ref={this.containerRef}
        className={cn("relative h-full w-full touch-none select-none overflow-hidden", isDragging ? "cursor-grabbing" : "cursor-grab", className)}
        onMouseDown={this.handleMouseDown}
      >
        <div
          className="absolute inset-0"
          style={{ transform: `scale(${scale})`, transformOrigin: "50% 50%", transition: this.isPinching ? "none" : "transform 120ms ease-out" }}
        >
          {containerSize.width > 0 &&
            this.getVisibleCells().map(({ x, y }) => {
              const px = cx + x * gridSize + offset.x
              const py = cy + y * gridSize + offset.y
              return (
                <div
                  key={`${x}:${y}`}
                  className="absolute left-0 top-0"
                  style={{ width: gridSize, height: gridSize, transform: `translate3d(${px}px, ${py}px, 0)`, willChange: "transform" }}
                >
                  {renderItem({ gridIndex: this.getItemIndexForPosition(x, y), position: { x, y }, isMoving })}
                </div>
              )
            })}
        </div>
      </div>
    )
  }
}

export default InfiniteGrid
