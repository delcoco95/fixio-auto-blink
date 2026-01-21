import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, MapPin, ChevronRight, Clock, Shield, Star, Car, Wrench, Sparkles } from 'lucide-react'

const SERVICES = [
  { id: 'entretien', name: 'Entretien', icon: Wrench },
  { id: 'pneus', name: 'Pneus', icon: Car },
  { id: 'carrosserie', name: 'Carrosserie', icon: Sparkles },
  { id: 'diagnostic', name: 'Diagnostic', icon: Search },
  { id: 'clim', name: 'Climatisation', icon: Star },
  { id: 'freins', name: 'Freins', icon: Shield },
]

const POPULAR_CITIES = [
  'Paris', 'Lyon', 'Marseille', 'Bordeaux', 'Toulouse', 'Nantes', 'Nice', 'Lille'
]

export function Home() {
  const [query, setQuery] = useState('')
  const [location, setLocation] = useState('')
  const navigate = useNavigate()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    navigate(`/search?q=${query}&l=${location}`)
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section - Style Planity ultra minimaliste */}
      <section className="pt-20 pb-16 md:pt-32 md:pb-24">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-foreground mb-6">
            Réservez votre garagiste en ligne
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Trouvez un professionnel de l'automobile près de chez vous et réservez en quelques clics.
          </p>
          
          {/* Search Form */}
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3 max-w-2xl mx-auto">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                placeholder="Service (vidange, pneus...)"
                className="pl-11 h-12 bg-secondary/50 border-border"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <div className="flex-1 relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                placeholder="Ville ou code postal"
                className="pl-11 h-12 bg-secondary/50 border-border"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <Button type="submit" className="h-12 px-8">
              Rechercher
            </Button>
          </form>
          
          {/* Quick Filters */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            <span className="text-sm text-muted-foreground mr-2">Urgence :</span>
            <Button 
              variant="outline" 
              size="sm" 
              className="rounded-full h-8 text-xs"
              onClick={() => navigate('/search?urgency=today')}
            >
              <Clock size={12} className="mr-1.5" />
              Disponible aujourd'hui
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="rounded-full h-8 text-xs"
              onClick={() => navigate('/search?urgency=tomorrow')}
            >
              Demain
            </Button>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-semibold text-center mb-10">Nos services</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-4xl mx-auto">
            {SERVICES.map((service) => (
              <button
                key={service.id}
                onClick={() => navigate(`/search?cat=${service.id}`)}
                className="flex flex-col items-center p-6 bg-background rounded-xl border hover:border-foreground/20 hover:shadow-sm transition-all group"
              >
                <service.icon className="mb-3 text-muted-foreground group-hover:text-foreground transition-colors" size={24} />
                <span className="text-sm font-medium">{service.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-2xl font-semibold text-center mb-16">Comment ça marche</h2>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mx-auto mb-5 text-lg font-semibold">
                1
              </div>
              <h3 className="font-semibold mb-2">Recherchez</h3>
              <p className="text-muted-foreground text-sm">
                Trouvez un professionnel par service, localisation ou disponibilité.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mx-auto mb-5 text-lg font-semibold">
                2
              </div>
              <h3 className="font-semibold mb-2">Comparez</h3>
              <p className="text-muted-foreground text-sm">
                Consultez les avis, les prix et les disponibilités de chaque garage.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mx-auto mb-5 text-lg font-semibold">
                3
              </div>
              <h3 className="font-semibold mb-2">Réservez</h3>
              <p className="text-muted-foreground text-sm">
                Choisissez votre créneau et confirmez. C'est instantané.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Cities */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-semibold text-center mb-10">Villes populaires</h2>
          <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
            {POPULAR_CITIES.map((city) => (
              <Button
                key={city}
                variant="outline"
                className="rounded-full"
                onClick={() => navigate(`/search?l=${city}`)}
              >
                {city}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-4xl font-semibold mb-2">500+</p>
              <p className="text-muted-foreground text-sm">Garages partenaires</p>
            </div>
            <div>
              <p className="text-4xl font-semibold mb-2">50k+</p>
              <p className="text-muted-foreground text-sm">Rendez-vous pris</p>
            </div>
            <div>
              <p className="text-4xl font-semibold mb-2">4.8</p>
              <p className="text-muted-foreground text-sm">Note moyenne</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Pro */}
      <section className="py-20 bg-foreground text-background">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h2 className="text-3xl font-semibold mb-4">Vous êtes professionnel ?</h2>
          <p className="text-background/70 mb-8 max-w-xl mx-auto">
            Rejoignez FIXIO pour augmenter votre visibilité et simplifier la gestion de vos rendez-vous.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              variant="secondary" 
              size="lg"
              onClick={() => navigate('/pro/register')}
            >
              Créer mon compte pro
              <ChevronRight size={18} className="ml-1" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-background/20 text-background hover:bg-background/10"
              onClick={() => navigate('/pro-landing')}
            >
              En savoir plus
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-8">
              <span className="font-semibold text-lg">FIXIO</span>
              <nav className="flex items-center gap-6 text-sm text-muted-foreground">
                <Link to="/pro-landing" className="hover:text-foreground transition-colors">Professionnels</Link>
                <a href="#" className="hover:text-foreground transition-colors">Aide</a>
                <a href="#" className="hover:text-foreground transition-colors">CGU</a>
              </nav>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} FIXIO. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
