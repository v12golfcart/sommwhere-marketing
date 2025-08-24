"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Wine, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSorting,
} from "@dnd-kit/sortable"
import {
  useSortable,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

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

// Sortable Wine Card Component
function SortableWineCard({ wine, tier }: { wine: WineCard; tier: string | null }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: wine.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    WebkitUserSelect: 'none',
    userSelect: 'none',
    WebkitTouchCallout: 'none',
  } as React.CSSProperties

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onContextMenu={(e) => e.preventDefault()}
      className={`bg-white px-3 py-2 rounded-md shadow-sm cursor-move hover:shadow-md transition-shadow border-2 select-none touch-none ${
        tier ? TIER_TEXT_COLORS[tier as keyof typeof TIER_TEXT_COLORS] : "border-linen-border"
      }`}
    >
      <span className="text-sm font-pt-serif font-semibold pointer-events-none">{wine.name}</span>
    </div>
  )
}

// Droppable Container Component
function DroppableContainer({ 
  id, 
  children, 
  className,
  items 
}: { 
  id: string; 
  children: React.ReactNode; 
  className?: string;
  items: number[]
}) {
  const {
    setNodeRef,
    isOver,
    over
  } = useDroppable({ 
    id,
    data: {
      type: 'container'
    }
  })

  // Check if we're over this container OR any item in this container
  const isOverContainer = isOver || (over && items.includes(over.id as number))

  return (
    <div
      ref={setNodeRef}
      className={
        isOverContainer 
          ? className?.replace("border-2 border-dashed border-linen-border", "border-2 border-solid border-plum-secondary")
          : className
      }
    >
      {children}
    </div>
  )
}

export default function TastingBoard() {
  const router = useRouter()
  const [config, setConfig] = useState<GameConfig | null>(null)
  const [wines, setWines] = useState<WineCard[]>([])
  const [containers, setContainers] = useState<Record<string, number[]>>({
    tray: [],
    S: [],
    A: [],
    B: [],
    C: [],
    D: [],
    F: [],
  })
  const [activeId, setActiveId] = useState<number | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Load game configuration on mount
  useEffect(() => {
    const savedConfig = localStorage.getItem("sommwhere:tasting:v1")
    if (!savedConfig) {
      router.push("/tasting/new")
      return
    }

    const gameConfig: GameConfig = JSON.parse(savedConfig)
    setConfig(gameConfig)

    // Generate wine cards based on config
    const wineCards: WineCard[] = []
    const initialContainers: Record<string, number[]> = {
      tray: [],
      S: [],
      A: [],
      B: [],
      C: [],
      D: [],
      F: [],
    }

    for (let i = 0; i < gameConfig.settings.bottleCount; i++) {
      wineCards.push({
        id: i,
        name: gameConfig.settings.names?.[i] || `Wine ${i + 1}`
      })

      // Place wines in their saved containers
      const placement = gameConfig.placements[i]
      if (placement) {
        initialContainers[placement].push(i)
      } else {
        initialContainers.tray.push(i)
      }
    }

    setWines(wineCards)
    setContainers(initialContainers)
  }, [router])

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as number)
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event

    if (!over) return

    console.log('Dragging over:', over.id)

    const activeContainer = findContainer(active.id as number)
    const overContainer = over.data.current?.type === 'container' 
      ? over.id as string 
      : findContainer(over.id as number)

    if (!activeContainer || !overContainer || activeContainer === overContainer) {
      return
    }

    setContainers((prev) => {
      const activeItems = [...prev[activeContainer]]
      const overItems = [...prev[overContainer]]

      // Remove active item from its container
      const activeIndex = activeItems.indexOf(active.id as number)
      activeItems.splice(activeIndex, 1)

      // Add active item to new container
      overItems.push(active.id as number)

      return {
        ...prev,
        [activeContainer]: activeItems,
        [overContainer]: overItems,
      }
    })
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over) {
      setActiveId(null)
      return
    }

    const activeContainer = findContainer(active.id as number)
    const overContainer = over.data.current?.type === 'container' 
      ? over.id as string 
      : findContainer(over.id as number)

    if (!activeContainer || !overContainer) {
      setActiveId(null)
      return
    }

    if (activeContainer === overContainer) {
      // Reorder within the same container
      const containerItems = containers[overContainer]
      const activeIndex = containerItems.indexOf(active.id as number)
      const overIndex = containerItems.indexOf(over.id as number)

      if (activeIndex !== overIndex) {
        setContainers((prev) => ({
          ...prev,
          [overContainer]: arrayMove(prev[overContainer], activeIndex, overIndex),
        }))
      }
    }

    // Save to localStorage
    saveToLocalStorage()
    setActiveId(null)
  }

  const findContainer = (id: number) => {
    for (const [key, items] of Object.entries(containers)) {
      if (items.includes(id)) {
        return key
      }
    }
    return null
  }

  const saveToLocalStorage = () => {
    if (!config) return

    const newPlacements: Record<number, string | null> = {}
    for (const [container, items] of Object.entries(containers)) {
      for (const itemId of items) {
        newPlacements[itemId] = container === "tray" ? null : container
      }
    }

    const updatedConfig = {
      ...config,
      placements: newPlacements,
    }
    localStorage.setItem("sommwhere:tasting:v1", JSON.stringify(updatedConfig))
  }

  const handleReset = () => {
    const resetContainers: Record<string, number[]> = {
      tray: wines.map(w => w.id),
      S: [],
      A: [],
      B: [],
      C: [],
      D: [],
      F: [],
    }
    setContainers(resetContainers)
    
    if (config) {
      const updatedConfig = {
        ...config,
        placements: {}
      }
      localStorage.setItem("sommwhere:tasting:v1", JSON.stringify(updatedConfig))
    }
  }

  const getActiveWine = () => {
    if (activeId === null) return null
    return wines.find(w => w.id === activeId)
  }

  if (!config) {
    return <div className="min-h-screen bg-ivory flex items-center justify-center">
      <p className="text-charcoal-muted">Loading...</p>
    </div>
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
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
            <SortableContext 
              items={containers.tray}
              strategy={verticalListSorting}
            >
              <DroppableContainer
                id="tray"
                className="bg-stone rounded-lg p-4 min-h-[80px] border-2 border-dashed border-linen-border"
                items={containers.tray}
              >
                <div className="flex flex-wrap gap-2">
                  {containers.tray.map(id => {
                    const wine = wines.find(w => w.id === id)
                    if (!wine) return null
                    return <SortableWineCard key={wine.id} wine={wine} tier={null} />
                  })}
                  {containers.tray.length === 0 && (
                    <p className="text-charcoal-muted text-sm font-pt-serif italic">
                      All wines have been ranked!
                    </p>
                  )}
                </div>
              </DroppableContainer>
            </SortableContext>
          </div>

          {/* Tier Rows */}
          <div className="space-y-3">
            {["S", "A", "B", "C", "D", "F"].map(tier => (
              <div key={tier} className="flex gap-3">
                {/* Tier Label */}
                <div className={`w-12 h-20 sm:w-16 sm:h-24 rounded-lg flex items-center justify-center font-marcellus text-2xl sm:text-3xl font-bold text-white ${TIER_COLORS[tier as keyof typeof TIER_COLORS]}`}>
                  {tier}
                </div>
                
                {/* Tier Drop Zone */}
                <SortableContext 
                  items={containers[tier]}
                  strategy={verticalListSorting}
                >
                  <DroppableContainer
                    id={tier}
                    className="flex-1 bg-white/50 rounded-lg p-3 sm:p-4 min-h-[80px] sm:min-h-[96px] border-2 border-dashed border-linen-border"
                    items={containers[tier]}
                  >
                    <div className="flex flex-wrap gap-2">
                      {containers[tier].map(id => {
                        const wine = wines.find(w => w.id === id)
                        if (!wine) return null
                        return <SortableWineCard key={wine.id} wine={wine} tier={tier} />
                      })}
                    </div>
                  </DroppableContainer>
                </SortableContext>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* Drag Overlay */}
      <DragOverlay>
        {activeId !== null && getActiveWine() ? (
          <div className="bg-white px-3 py-2 rounded-md shadow-lg border-2 border-plum-secondary cursor-move">
            <span className="text-sm font-pt-serif font-semibold">{getActiveWine()!.name}</span>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}