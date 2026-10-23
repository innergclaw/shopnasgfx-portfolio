// PROPOSED PRICES ~ pending Mr G's approval. Edit numbers here only; every section reads from this file.
// Sources: /workspace/niche-lab/shopnasgfx-pricing-2026-10-23.md (18 public comparables).
export const PRICES_ARE_PROPOSED = true
export const DEPOSIT_PERCENT = 25
export const PHONE = "+12674730397"
export const PHONE_DISPLAY = "267 473 0397"

export interface Tier { id: string; name: string; price: string; turnaround: string; for: string; deliverables: string[] }

export const brandTiers: Tier[] = [
  { id: "spark", name: "Brand Spark", price: "$1,500 to $2,200", turnaround: "2 to 3 weeks", for: "Pre-launch founders and side businesses",
    deliverables: ["60 minute strategy session + written brief", "2 logo concepts, 2 revision rounds", "Color palette and type pairing", "Full file suite", "Starter SI prompt kit (voice + captions)"] },
  { id: "system", name: "Brand System", price: "$3,500 to $4,500", turnaround: "4 to 6 weeks", for: "Small businesses launching or rebranding",
    deliverables: ["Everything in Brand Spark", "Positioning and competitor audit", "3 logo concepts", "Full brand guidelines + voice guide", "Social launch kit", "SI prompt library trained on your brand"] },
  { id: "pro", name: "Brand Foundation Pro", price: "$6,500 to $9,500", turnaround: "6 to 10 weeks", for: "Funded startups and multi-location businesses",
    deliverables: ["Everything in Brand System", "3 hour strategy workshop", "Messaging framework + naming support", "Deck, social, and stationery templates", "Custom SI brand assistant setup"] },
  { id: "refresh", name: "Brand Refresh", price: "$1,200 to $2,000", turnaround: "2 to 3 weeks", for: "Existing brands with equity to keep",
    deliverables: ["Logo modernization", "Updated palette and type", "Voice guide", "SI prompt kit"] },
]

export const retainers: Tier[] = [
  { id: "keep", name: "Keep", price: "$750/mo", turnaround: "2 to 3 business days", for: "3 month minimum",
    deliverables: ["Up to 8 requests a month", "1 active request", "SI prompt library upkeep"] },
  { id: "grow", name: "Grow", price: "$1,500/mo", turnaround: "1 to 2 business days", for: "3 month minimum",
    deliverables: ["Up to 20 requests a month", "2 active requests", "Monthly brand check-in"] },
  { id: "lead", name: "Lead", price: "$3,000/mo", turnaround: "Priority", for: "6 month minimum",
    deliverables: ["About 40 hours a month", "3 active requests", "Quarterly campaign concepts", "SI workflow tuning"] },
]
export const RETAINER_NOTE = "10% off when you prepay a quarter."

export const workshops: Tier[] = [
  { id: "seat", name: "SI Brand Workshop seat", price: "$97 ($79 early)", turnaround: "Live group session", for: "Owners and solo founders", deliverables: ["Use SI without losing your identity", "Prompt templates to keep"] },
  { id: "series", name: "4 session series", price: "$297", turnaround: "4 weeks", for: "Done-with-you setup", deliverables: ["Build your own brand prompt kit", "Weekly review"] },
  { id: "half", name: "Private half day", price: "$1,800", turnaround: "Scheduled", for: "Your team", deliverables: ["On-brand SI workflow for your team"] },
  { id: "full", name: "Private full day", price: "$3,200", turnaround: "Scheduled", for: "Your team", deliverables: ["Strategy, prompts, and workflow build"] },
]
export const WORKSHOP_NOTE = "Workshop fees credit toward a Brand System booked within 30 days."

export const SERVICES = ["Brand Spark", "Brand System", "Brand Foundation Pro", "Brand Refresh", "Brand on Retainer", "SI Brand Workshop", "Not sure yet"]
export const BUDGETS = ["Under $1,500", "$1,500 to $3,500", "$3,500 to $6,500", "$6,500+", "Monthly retainer"]
export const DELIVERY = ["ASAP", "A few weeks", "1 to 2 months", "Not sure"]
export const AGREEMENT = "I understand that by submitting this form or texting, a 25% deposit is required on all projects discussed before any work begins."
