"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Wine, RotateCcw, Download, Share2, FileDown } from "lucide-react"
import { Button } from "@/components/ui/button"

interface GameConfig {
  createdAt: string
  settings: {
    bottleCount: number
    names?: string[]
  }
  tiers: string[]
  placements: Record<number, string | null>
}

interface WineCard {
  id: number
  name: string
}

const TIER_COLORS = {
  S: "bg-red-400",     // Red/Pink - Superior
  A: "bg-orange-400",  // Orange - Excellent
  B: "bg-yellow-400",  // Yellow - Good
  C: "bg-green-400",   // Green - Average
  D: "bg-blue-400",    // Blue - Below Average
  F: "bg-purple-400"   // Purple - Fail
}

const TIER_TEXT_COLORS = {
  S: "text-red-500 border-red-300",
  A: "text-orange-500 border-orange-300",
  B: "text-yellow-600 border-yellow-300",
  C: "text-green-600 border-green-300",
  D: "text-blue-600 border-blue-300",
  F: "text-purple-600 border-purple-300"
}

export default function TastingBoard() {
  const router = useRouter()
  const [config, setConfig] = useState<GameConfig | null>(null)
  const [wines, setWines] = useState<WineCard[]>([])
  const [placements, setPlacements] = useState<Record<number, string | null>>({})
  const [draggedWine, setDraggedWine] = useState<number | null>(null)

  // Load game configuration on mount
  useEffect(() => {
    const savedConfig = localStorage.getItem("sommwhere:tasting:v1")
    if (!savedConfig) {
      router.push("/tasting/new")
      return
    }

    const gameConfig: GameConfig = JSON.parse(savedConfig)
    setConfig(gameConfig)
    setPlacements(gameConfig.placements)

    // Generate wine cards based on config
    const wineCards: WineCard[] = []
    for (let i = 0; i < gameConfig.settings.bottleCount; i++) {
      wineCards.push({
        id: i,
        name: gameConfig.settings.names?.[i] || `Wine ${i + 1}`
      })
    }
    setWines(wineCards)
  }, [router])

  const handleDragStart = (wineId: number) => {
    setDraggedWine(wineId)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (tier: string | null) => {
    if (draggedWine === null) return

    const newPlacements = { ...placements }
    newPlacements[draggedWine] = tier

    setPlacements(newPlacements)
    setDraggedWine(null)

    // Update localStorage
    if (config) {
      const updatedConfig = {
        ...config,
        placements: newPlacements
      }
      localStorage.setItem("sommwhere:tasting:v1", JSON.stringify(updatedConfig))
    }
  }

  const handleReset = () => {
    setPlacements({})
    if (config) {
      const updatedConfig = {
        ...config,
        placements: {}
      }
      localStorage.setItem("sommwhere:tasting:v1", JSON.stringify(updatedConfig))
    }
  }

  const getWinesInTier = (tier: string) => {
    return wines.filter(wine => placements[wine.id] === tier)
  }

  const getUnplacedWines = () => {
    return wines.filter(wine => !placements[wine.id])
  }

  if (!config) {
    return <div className="min-h-screen bg-ivory flex items-center justify-center">
      <p className="text-charcoal-muted">Loading...</p>
    </div>
  }

  return (
    <div className="min-h-screen bg-ivory text-charcoal flex flex-col">
      {/* Header */}
      <header className="container mx-auto py-4 px-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Wine className="h-8 w-8 text-plum-secondary" />
          <h1 className="text-2xl font-marcellus font-normal text-charcoal">Sommwhere</h1>
        </Link>
        
        {/* Toolbar */}
        <div className="flex gap-2">
          <Button
            onClick={handleReset}
            size="sm"
            variant="outline"
            className="border-linen-border text-charcoal hover:bg-stone"
          >
            <RotateCcw className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Reset</span>
          </Button>
        </div>
      </header>

      {/* Main Board */}
      <main className="flex-1 container mx-auto px-4 pb-4">
        {/* Wine Tray */}
        <div className="mb-6">
          <h2 className="text-sm font-pt-serif text-charcoal-muted mb-2">Drag wines to rank them:</h2>
          <div 
            className="bg-stone rounded-lg p-4 min-h-[80px] border-2 border-dashed border-linen-border"
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(null)}
          >
            <div className="flex flex-wrap gap-2">
              {getUnplacedWines().map(wine => (
                <div
                  key={wine.id}
                  draggable
                  onDragStart={() => handleDragStart(wine.id)}
                  className="bg-white px-3 py-2 rounded-md shadow-sm cursor-move hover:shadow-md transition-shadow border border-linen-border"
                >
                  <span className="text-sm font-pt-serif text-charcoal">{wine.name}</span>
                </div>
              ))}
              {getUnplacedWines().length === 0 && (
                <p className="text-charcoal-muted text-sm font-pt-serif italic">
                  All wines have been ranked!
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Tier Rows */}
        <div className="space-y-3">
          {config.tiers.map(tier => (
            <div key={tier} className="flex gap-3">
              {/* Tier Label */}
              <div className={`w-12 h-20 sm:w-16 sm:h-24 rounded-lg flex items-center justify-center font-marcellus text-2xl sm:text-3xl font-bold text-white ${TIER_COLORS[tier as keyof typeof TIER_COLORS]}`}>
                {tier}
              </div>
              
              {/* Tier Drop Zone */}
              <div
                className="flex-1 bg-white/50 rounded-lg p-3 sm:p-4 min-h-[80px] sm:min-h-[96px] border-2 border-dashed border-linen-border"
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(tier)}
              >
                <div className="flex flex-wrap gap-2">
                  {getWinesInTier(tier).map(wine => (
                    <div
                      key={wine.id}
                      draggable
                      onDragStart={() => handleDragStart(wine.id)}
                      className={`bg-white px-3 py-2 rounded-md shadow cursor-move hover:shadow-lg transition-shadow border-2 ${TIER_TEXT_COLORS[tier as keyof typeof TIER_TEXT_COLORS]}`}
                    >
                      <span className="text-sm font-pt-serif font-semibold">{wine.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}