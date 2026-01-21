import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ProCard } from '@/components/professional/ProCard'
import { SearchFilters } from '@/components/search/SearchFilters'
import { blink } from '@/lib/blink'
import { Skeleton } from '@/components/ui/skeleton'

interface Professional {
  id: string
  name: string
  address: string
  rating: number
  reviewCount: number
  nextAvailability: string
  logoUrl?: string
  distance?: string
}

const MOCK_PROS: Professional[] = [
  {
    id: 'pro_1',
    name: 'Garage Central Paris',
    address: '15 Rue de Rivoli, 75001 Paris',
    rating: 4.8,
    reviewCount: 124,
    nextAvailability: 'Aujourd\'hui à 14:30',
    logoUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=200&h=200',
    distance: '1.2 km'
  },
  {
    id: 'pro_2',
    name: 'Auto Service Expertise',
    address: '42 Avenue de la République, 75011 Paris',
    rating: 4.9,
    reviewCount: 89,
    nextAvailability: 'Demain à 09:00',
    logoUrl: 'https://images.unsplash.com/photo-1517524204412-1a96975d040d?auto=format&fit=crop&q=80&w=200&h=200',
    distance: '3.5 km'
  },
  {
    id: 'pro_3',
    name: 'Mécano Rapid\'',
    address: '8 bis Rue Oberkampf, 75011 Paris',
    rating: 4.5,
    reviewCount: 256,
    nextAvailability: 'Aujourd\'hui à 16:45',
    logoUrl: 'https://images.unsplash.com/photo-1530046339160-ce3e5b097ea2?auto=format&fit=crop&q=80&w=200&h=200',
    distance: '2.1 km'
  },
  {
    id: 'pro_4',
    name: 'Pneus & Co',
    address: '124 Boulevard Voltaire, 75011 Paris',
    rating: 4.7,
    reviewCount: 412,
    nextAvailability: 'Lundi à 10:00',
    logoUrl: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=200&h=200',
    distance: '4.8 km'
  }
]

export function SearchResults() {
  const [searchParams] = useSearchParams()
  const [pros, setPros] = useState<Professional[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list')
  
  const query = searchParams.get('q') || ''
  const location = searchParams.get('l') || ''

  useEffect(() => {
    // Simulate API fetch
    const timer = setTimeout(() => {
      setPros(MOCK_PROS)
      setIsLoading(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [query, location])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          {query ? `Professionnels pour "${query}"` : 'Tous les professionnels'}
          {location && ` à ${location}`}
        </h1>
        <p className="text-muted-foreground">
          {pros.length} professionnels trouvés correspondant à votre recherche.
        </p>
      </div>

      <SearchFilters viewMode={viewMode} setViewMode={setViewMode} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
        {/* Results List */}
        <div className={`space-y-6 ${viewMode === 'list' ? 'lg:col-span-12' : 'lg:col-span-7'}`}>
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white border rounded-3xl p-6 h-48 flex gap-6">
                <Skeleton className="w-48 h-full rounded-2xl" />
                <div className="flex-1 space-y-4">
                  <div className="flex justify-between">
                    <Skeleton className="h-6 w-1/3" />
                    <Skeleton className="h-6 w-12" />
                  </div>
                  <Skeleton className="h-4 w-1/2" />
                  <div className="pt-8 flex justify-between">
                    <Skeleton className="h-10 w-32" />
                    <div className="flex gap-2">
                      <Skeleton className="h-10 w-24" />
                      <Skeleton className="h-10 w-24" />
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : pros.length > 0 ? (
            pros.map((pro) => (
              <ProCard key={pro.id} {...pro} />
            ))
          ) : (
            <div className="text-center py-20 bg-muted/30 rounded-[2rem] border border-dashed">
              <p className="text-xl font-medium">Aucun résultat trouvé</p>
              <p className="text-muted-foreground mt-2">Essayez de modifier vos filtres ou votre recherche.</p>
            </div>
          )}
        </div>

        {/* Map View Placeholder */}
        {viewMode === 'map' && (
          <div className="lg:col-span-5 sticky top-40 h-[calc(100vh-12rem)] bg-muted rounded-3xl overflow-hidden border shadow-inner flex flex-col items-center justify-center gap-4 text-muted-foreground">
            <div className="w-16 h-16 bg-muted-foreground/10 rounded-full flex items-center justify-center">
              <span className="text-2xl">📍</span>
            </div>
            <p className="font-medium">Carte interactive bientôt disponible</p>
          </div>
        )}
      </div>
    </div>
  )
}
