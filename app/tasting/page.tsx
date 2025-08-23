import Link from "next/link"
import { Wine, Sparkles, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function TastingLanding() {
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
      <main className="flex-1 container mx-auto px-4 flex flex-col justify-center items-center text-center max-w-2xl">
        <div className="mb-8">
          <Sparkles className="h-16 w-16 text-plum-secondary mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-marcellus font-normal mb-4 text-charcoal">
            Wine Tasting Game
          </h1>
          <p className="text-lg md:text-xl text-charcoal-muted font-pt-serif mb-2">
            Create your own wine tier list
          </p>
          <p className="text-base text-charcoal-muted font-pt-serif">
            Rank wines from S-tier to F-tier in this interactive tasting experience
          </p>
        </div>

        <Link href="/tasting/new">
          <Button className="bg-plum-secondary hover:bg-plum-secondary/90 text-white text-lg px-8 py-6 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2 font-pt-serif">
            Start a Game
            <ArrowRight className="h-5 w-5" />
          </Button>
        </Link>

        <div className="mt-12 text-sm text-charcoal-muted font-pt-serif">
          Single-player mode • No sign-up required
        </div>
      </main>
    </div>
  )
}