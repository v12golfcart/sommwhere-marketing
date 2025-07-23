import Link from "next/link"
import { ArrowRight, Camera, Share2, Wine } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="min-h-screen bg-off-white text-primary-dark">
      {/* Hero Section with Background Image */}
      <section className="relative h-screen flex flex-col">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-primary-dark/50 z-10"></div>
          <img src="/images/wine-background.png" alt="Wine background" className="w-full h-full object-cover" />
        </div>

        {/* Content */}
        <div className="relative z-20 flex-1 flex flex-col">
          {/* Header */}
          <header className="container mx-auto py-6 px-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Wine className="h-8 w-8 text-white" />
              <h1 className="text-2xl font-marcellus font-normal text-white">Sommwhere</h1>
            </div>
          </header>

          {/* Hero Content */}
          <div className="flex-1 container mx-auto px-4 flex flex-col justify-center items-center text-center">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-marcellus font-normal mb-6 leading-tight text-white">
              Fine Wine, Effortlessly Curated
            </h2>
            <p className="text-lg md:text-xl max-w-2xl mb-10 text-white/90 font-pt-serif">
              Instantly photograph any label or list and receive refined, tailor-made pairings wherever you are.
            </p>
            <Link href="https://chrisramesh.typeform.com/to/aFzznCNs" target="_blank" rel="noopener noreferrer">
              <Button className="bg-wine-red hover:bg-wine-red/90 text-white text-lg px-8 py-6 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2 font-pt-serif">
                Join Waitlist
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <h2 className="text-3xl md:text-4xl font-marcellus font-normal mb-16 text-center text-primary-dark">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Step 1 */}
          <div className="flex flex-col items-center text-center">
            <div className="bg-wine-red/10 p-6 rounded-full mb-6">
              <Camera className="h-10 w-10 text-wine-red" />
            </div>
            <h3 className="text-xl font-marcellus font-normal mb-3 text-primary-dark">Snap & Scan</h3>
            <p className="text-primary-dark/80 font-pt-serif">
              Take a photo of any wine label or restaurant wine list to instantly identify the wine.
            </p>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center text-center">
            <div className="bg-wine-red/10 p-6 rounded-full mb-6">
              <Wine className="h-10 w-10 text-wine-red" />
            </div>
            <h3 className="text-xl font-marcellus font-normal mb-3 text-primary-dark">Get Smart Recommendations</h3>
            <p className="text-primary-dark/80 font-pt-serif">
              Receive personalized recommendations based on your taste profile and preferences.
            </p>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center text-center">
            <div className="bg-wine-red/10 p-6 rounded-full mb-6">
              <Share2 className="h-10 w-10 text-wine-red" />
            </div>
            <h3 className="text-xl font-marcellus font-normal mb-3 text-primary-dark">Track & Share</h3>
            <p className="text-primary-dark/80 font-pt-serif">
              Build your personal wine collection, track favorites, and share recommendations with friends.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-16 md:py-24 flex flex-col items-center">
        <h2 className="text-2xl md:text-3xl font-marcellus font-normal mb-6 text-center text-primary-dark">
          Join Our Waitlist Today
        </h2>
        <p className="text-lg max-w-xl mb-10 text-center text-primary-dark/80 font-pt-serif">
          Be among the first to experience Sommwhere and help shape the future of wine discovery.
        </p>
        <Link href="https://chrisramesh.typeform.com/to/aFzznCNs" target="_blank" rel="noopener noreferrer">
          <Button className="bg-wine-red hover:bg-wine-red/90 text-white text-lg px-8 py-6 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2 font-pt-serif">
            Take Survey
            <ArrowRight className="h-5 w-5" />
          </Button>
        </Link>
      </footer>
    </div>
  )
}
