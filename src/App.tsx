import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { InfiniteGrid } from "@/components/ui/infinite-grid"
import logosData from "@/data/logos.json"

interface Logo {
  id: string
  business: string
  whatTheyDo: string
  year: string
  designNotes: string
  image: string
}

const logos = logosData as Logo[]
const isLight = (l: Logo) => /white/i.test(l.id)

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <dt className="text-[11px] uppercase tracking-[0.18em] text-stone-500">{label}</dt>
      <dd className={value ? "text-[15px] leading-relaxed text-stone-800" : "text-[15px] italic text-stone-400"}>
        {value || "To be confirmed"}
      </dd>
    </div>
  )
}

export default function App() {
  const [selected, setSelected] = useState<Logo | null>(null)
  const [gridSize, setGridSize] = useState(260)
  const down = useRef<{ x: number; y: number } | null>(null)

  useEffect(() => {
    const fit = () => setGridSize(window.innerWidth < 640 ? 180 : 260)
    fit()
    window.addEventListener("resize", fit)
    return () => window.removeEventListener("resize", fit)
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSelected(null)
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  return (
    <main className="fixed inset-0 bg-[#f6f1e9] text-stone-800">
      <InfiniteGrid
        gridSize={gridSize}
        renderItem={({ gridIndex, isMoving }) => {
          const logo = logos[gridIndex % logos.length]
          const light = isLight(logo)
          return (
            <motion.button
              type="button"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
              onPointerDown={(e) => (down.current = { x: e.clientX, y: e.clientY })}
              onClick={(e) => {
                const d = down.current
                const moved = d ? Math.hypot(e.clientX - d.x, e.clientY - d.y) > 6 : false
                if (!moved && !isMoving) setSelected(logo)
              }}
              className={`absolute inset-3 flex items-center justify-center flex-col gap-2 rounded-2xl border p-5 transition-shadow hover:shadow-[0_6px_24px_-12px_rgba(60,45,30,0.35)] focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 ${
                light ? "border-stone-700/40 bg-[#2b2724]" : "border-stone-200/80 bg-[#fbf8f3]"
              }`}
              aria-label={`${logo.business || "To be confirmed"} logo`}
            >
              <div className="flex min-h-0 w-full flex-1 items-center justify-center">
                <img src={logo.image} alt={logo.business || "Logo, business to be confirmed"} loading="lazy" draggable={false} className="pointer-events-none h-full w-full rounded-lg object-contain" />
              </div>
              <span className={`w-full truncate text-center text-[11px] tracking-wide ${light ? "text-stone-300" : logo.business ? "text-stone-600" : "italic text-stone-400"}`}>
                {logo.business || "To be confirmed"}
              </span>
            </motion.button>
          )
        }}
      />

      <header className="pointer-events-none absolute left-4 top-4 z-10 rounded-2xl bg-[#f6f1e9]/90 px-4 py-3 backdrop-blur-sm sm:left-6 sm:top-6">
        <h1 className="text-[13px] font-semibold tracking-[0.32em] text-stone-800">SHOPNASGFX</h1>
        <p className="mt-1 text-[12px] text-stone-500">Logo work by Nasirr Mayo</p>
      </header>

      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end justify-center bg-stone-900/20 p-4 backdrop-blur-[2px] sm:items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={selected.business || "To be confirmed"}
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 16, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md overflow-hidden rounded-3xl border border-stone-200 bg-[#fdfbf7] shadow-[0_20px_60px_-24px_rgba(60,45,30,0.45)]"
            >
              <div className={`flex h-48 items-center justify-center p-8 ${isLight(selected) ? "bg-[#2b2724]" : "bg-[#f3ede3]"}`}>
                <img src={selected.image} alt={selected.business || "Logo, business to be confirmed"} className="max-h-full max-w-full object-contain" />
              </div>
              <dl className="space-y-4 p-6">
                <Field label="Business" value={selected.business} />
                <Field label="What they do" value={selected.whatTheyDo} />
                <Field label="Year" value={selected.year} />
                <Field label="Design notes" value={selected.designNotes} />
              </dl>
              <div className="flex justify-end px-6 pb-6">
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="rounded-full border border-stone-300 px-4 py-1.5 text-[13px] text-stone-600 hover:bg-stone-100"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
