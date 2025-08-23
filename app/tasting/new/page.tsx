"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Wine, ArrowRight, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export default function TastingConfig() {
  const router = useRouter()
  const [bottleCount, setBottleCount] = useState(6)
  const [nameBottlesNow, setNameBottlesNow] = useState(false)
  const [bottleNames, setBottleNames] = useState<string[]>(Array(6).fill(""))

  const handleBottleCountChange = (value: number) => {
    const newCount = Math.max(2, Math.min(12, value))
    setBottleCount(newCount)
    
    // Adjust bottle names array
    if (newCount > bottleNames.length) {
      setBottleNames([...bottleNames, ...Array(newCount - bottleNames.length).fill("")])
    } else {
      setBottleNames(bottleNames.slice(0, newCount))
    }
  }

  const handleBottleNameChange = (index: number, name: string) => {
    const newNames = [...bottleNames]
    newNames[index] = name
    setBottleNames(newNames)
  }

  const handleStartGame = () => {
    // Save configuration to localStorage
    const gameConfig = {
      createdAt: new Date().toISOString(),
      settings: {
        bottleCount,
        names: nameBottlesNow ? bottleNames : undefined
      },
      tiers: ["S", "A", "B", "C", "D", "F"],
      placements: {}
    }
    
    localStorage.setItem("sommwhere:tasting:v1", JSON.stringify(gameConfig))
    router.push("/tasting/board")
  }

  return (
    <div className="min-h-screen bg-ivory text-charcoal flex flex-col">
      {/* Header */}
      <header className="container mx-auto py-6 px-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Wine className="h-8 w-8 text-plum-secondary" />
          <h1 className="text-2xl font-marcellus font-normal text-charcoal">Sommwhere</h1>
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-marcellus font-normal mb-2 text-charcoal">
            Configure Your Tasting
          </h1>
          <p className="text-charcoal-muted font-pt-serif">
            Set up your wine tasting experience
          </p>
        </div>

        <div className="bg-stone rounded-lg p-6 md:p-8 space-y-6">
          {/* Bottle Count */}
          <div className="space-y-2">
            <Label htmlFor="bottle-count" className="text-charcoal font-pt-serif">
              Number of Bottles
            </Label>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <Input
                id="bottle-count"
                type="number"
                min="2"
                max="12"
                value={bottleCount}
                onChange={(e) => handleBottleCountChange(parseInt(e.target.value) || 2)}
                className="w-full sm:w-24 bg-white border-linen-border"
              />
              <span className="text-sm text-charcoal-muted font-pt-serif">
                Between 2 and 12 bottles
              </span>
            </div>
          </div>

          {/* Name Bottles Toggle */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="name-bottles" className="text-charcoal font-pt-serif">
                Name bottles now
              </Label>
              <Switch
                id="name-bottles"
                checked={nameBottlesNow}
                onCheckedChange={setNameBottlesNow}
                className="data-[state=checked]:bg-plum-secondary"
              />
            </div>
            
            {nameBottlesNow && (
              <div className="space-y-3 pt-2">
                <p className="text-sm text-charcoal-muted font-pt-serif">
                  Give each wine a name (optional)
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Array.from({ length: bottleCount }, (_, i) => (
                    <Input
                      key={i}
                      placeholder={`Wine ${i + 1}`}
                      value={bottleNames[i]}
                      onChange={(e) => handleBottleNameChange(i, e.target.value)}
                      className="bg-white border-linen-border font-pt-serif"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between mt-8">
          <Link href="/tasting">
            <Button 
              variant="outline" 
              className="border-linen-border text-charcoal hover:bg-stone font-pt-serif"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          
          <Button 
            onClick={handleStartGame}
            className="bg-plum-secondary hover:bg-plum-secondary/90 text-white font-pt-serif"
          >
            Start Game
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </main>
    </div>
  )
}