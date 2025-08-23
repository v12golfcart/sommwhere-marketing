import Link from "next/link"
import { Wine, Sparkles, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function TastingLanding() {
  return (
    <div className="min-h-screen bg-off-white text-primary-dark flex flex-col">
      {/* Header */}
      <header className="container mx-auto py-6 px-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Wine className="h-8 w-8 text-wine-red" />
          <h1 className="text-2xl font-marcellus font-normal text-primary-dark">Sommwhere</h1>
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 flex flex-col justify-center items-center text-center max-w-2xl">
        <div className="mb-8">
          <Sparkles className="h-16 w-16 text-wine-red mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-marcellus font-normal mb-4 text-primary-dark">
            Wine Tasting Game
          </h1>
          <p className="text-lg md:text-xl text-primary-dark/80 font-pt-serif mb-2">
            Create your own wine tier list
          </p>
          <p className="text-base text-primary-dark/60 font-pt-serif">
            Rank wines from S-tier to F-tier in this interactive tasting experience
          </p>
        </div>

        <Link href="/tasting/new">
          <Button className="bg-wine-red hover:bg-wine-red/90 text-white text-lg px-8 py-6 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2 font-pt-serif">
            Start a Game
            <ArrowRight className="h-5 w-5" />
          </Button>
        </Link>

        <div className="mt-12 text-sm text-primary-dark/50 font-pt-serif">
          Single-player mode • No sign-up required
        </div>
      </main>
    </div>
  )
}