import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ProCard } from '@/components/professional/ProCard'
import { SearchFilters } from '@/components/search/SearchFilters'
import { supabase } from '@/lib/supabase'
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

export function SearchResults() {
  const [searchParams] = useSearchParams()
  const [pros, setPros] = useState<Professional[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list')
  
  const query = searchParams.get('q') || ''
  const location = searchParams.get('l') || ''

  useEffect(() => {
    fetchPros()
  }, [query, location])

  const fetchPros = async () => {
    setIsLoading(true)
    try {
      let supabaseQuery = supabase
        .from('professionals')
        .select('*')
        .eq('status', 'active')

      if (query) {
        supabaseQuery = supabaseQuery.ilike('name', `%${query}%`)
      }

      if (location) {
        supabaseQuery = supabaseQuery.ilike('city', `%${location}%`)
      }

      const { data, error } = await supabaseQuery

      if (error) throw error

      const formattedPros: Professional[] = (data || []).map(pro => ({
        id: pro.id,
        name: pro.name,
        address: pro.address || '',
        rating: pro.rating || 0,
        reviewCount: pro.review_count || 0,
        nextAvailability: 'Prochainement', // This would require complex logic
        logoUrl: pro.logo_url || 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=200&h=200',
        distance: 'Local'
      }))

      setPros(formattedPros)
    } catch (error) {
      console.error('Error fetching pros:', error)
    } finally {
      setIsLoading(false)
    }
  }

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
