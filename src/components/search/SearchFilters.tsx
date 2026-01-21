import { Button } from '@/components/ui/button'
import { Zap, Calendar, SlidersHorizontal, Map as MapIcon, List } from 'lucide-react'

interface SearchFiltersProps {
  viewMode: 'list' | 'map'
  setViewMode: (mode: 'list' | 'map') => void
}

export function SearchFilters({ viewMode, setViewMode }: SearchFiltersProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 py-4 sticky top-16 bg-background/95 backdrop-blur-sm z-40 border-b">
      <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
        <Button variant="outline" className="rounded-full gap-2 whitespace-nowrap">
          <Zap size={16} className="text-yellow-500" />
          Aujourd'hui
        </Button>
        <Button variant="outline" className="rounded-full gap-2 whitespace-nowrap">
          <Calendar size={16} className="text-primary" />
          Demain
        </Button>
        <Button variant="outline" className="rounded-full gap-2 whitespace-nowrap">
          Prix
        </Button>
        <Button variant="outline" className="rounded-full gap-2 whitespace-nowrap">
          Note
        </Button>
        <Button variant="outline" className="rounded-full gap-2 whitespace-nowrap">
          <SlidersHorizontal size={16} />
          Tous les filtres
        </Button>
      </div>

      <div className="flex items-center bg-muted p-1 rounded-xl">
        <Button
          variant={viewMode === 'list' ? 'secondary' : 'ghost'}
          size="sm"
          className="rounded-lg h-8 px-3 gap-2"
          onClick={() => setViewMode('list')}
        >
          <List size={16} />
          Liste
        </Button>
        <Button
          variant={viewMode === 'map' ? 'secondary' : 'ghost'}
          size="sm"
          className="rounded-lg h-8 px-3 gap-2"
          onClick={() => setViewMode('map')}
        >
          <MapIcon size={16} />
          Carte
        </Button>
      </div>
    </div>
  )
}
