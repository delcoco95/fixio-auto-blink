import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Star, MapPin, Zap, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ProCardProps {
  id: string
  name: string
  address: string
  rating: number
  reviewCount: number
  nextAvailability?: string
  logoUrl?: string
  distance?: string
}

export function ProCard({ id, name, address, rating, reviewCount, nextAvailability = 'Prochainement', logoUrl, distance }: ProCardProps) {
  return (
    <Card className="overflow-hidden group hover:border-primary/50 transition-all hover:shadow-xl hover:shadow-primary/5 rounded-3xl">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          {/* Image/Logo Placeholder */}
          <div className="w-full md:w-48 h-48 md:h-auto bg-muted relative">
            {logoUrl ? (
              <img src={logoUrl} alt={name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground text-4xl font-bold bg-slate-100">
                {name.charAt(0)}
              </div>
            )}
            <Badge className="absolute top-3 left-3 bg-white/90 backdrop-blur text-primary border-none shadow-sm flex gap-1 items-center">
              <Zap size={12} className="fill-primary" />
              Pro Premium
            </Badge>
          </div>

          <div className="flex-1 p-6 flex flex-col justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{name}</h3>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                    <MapPin size={14} />
                    <span>{address}</span>
                    {distance && <span className="ml-1">• {distance}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-1 bg-yellow-400/10 text-yellow-700 px-2 py-1 rounded-lg text-sm font-bold">
                  <Star size={14} className="fill-yellow-700" />
                  {rating}
                </div>
              </div>
              
              <div className="text-sm text-muted-foreground">
                {reviewCount} avis clients certifiés
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t">
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Prochaine dispo</span>
                <div className="flex items-center gap-1.5 text-primary font-bold">
                  <Clock size={16} />
                  {nextAvailability}
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" asChild className="rounded-xl">
                  <Link to={`/pro/${id}`}>Voir fiche</Link>
                </Button>
                <Button asChild className="rounded-xl px-6">
                  <Link to={`/pro/${id}`}>Prendre RDV</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
