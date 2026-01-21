import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, Car, Trash2, Edit2, ChevronRight } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/use-auth'
import { toast } from 'react-hot-toast'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'

interface Vehicle {
  id: string
  make: string
  model: string
  plateNumber: string
  year: number
}

export function DashboardVehicles() {
  const { profile } = useAuth()
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  
  const [newVehicle, setNewVehicle] = useState({
    make: '',
    model: '',
    plateNumber: '',
    year: new Date().getFullYear(),
  })

  const fetchVehicles = async () => {
    if (!profile) return
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .eq('user_id', profile.id)

      if (error) throw error
      setVehicles(data as Vehicle[])
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchVehicles()
  }, [profile])

  const handleAddVehicle = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile) return
    
    try {
      const { error } = await supabase.from('vehicles').insert({
        ...newVehicle,
        user_id: profile.id
      })

      if (error) throw error
      toast.success('Véhicule ajouté !')
      setNewVehicle({ make: '', model: '', plateNumber: '', year: new Date().getFullYear() })
      setIsAdding(false)
      fetchVehicles()
    } catch (error) {
      toast.error('Erreur lors de l\'ajout')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce véhicule ?')) return
    try {
      const { error } = await supabase
        .from('vehicles')
        .delete()
        .eq('id', id)

      if (error) throw error
      toast.success('Véhicule supprimé')
      fetchVehicles()
    } catch (error) {
      toast.error('Erreur lors de la suppression')
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Mes véhicules</h2>
          <p className="text-muted-foreground">Gérez votre garage personnel pour des réservations plus rapides.</p>
        </div>
        
        <Dialog open={isAdding} onOpenChange={setIsAdding}>
          <DialogTrigger asChild>
            <Button className="rounded-xl gap-2">
              <Plus size={18} />
              Ajouter un véhicule
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-[2rem] sm:max-w-[425px]">
            <form onSubmit={handleAddVehicle}>
              <DialogHeader>
                <DialogTitle>Nouveau véhicule</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="make">Marque</Label>
                  <Input 
                    id="make" 
                    placeholder="ex: Peugeot, BMW..." 
                    value={newVehicle.make} 
                    onChange={e => setNewVehicle(v => ({ ...v, make: e.target.value }))}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="model">Modèle</Label>
                  <Input 
                    id="model" 
                    placeholder="ex: 208, Série 3..." 
                    value={newVehicle.model} 
                    onChange={e => setNewVehicle(v => ({ ...v, model: e.target.value }))}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="year">Année</Label>
                    <Input 
                      id="year" 
                      type="number" 
                      value={newVehicle.year} 
                      onChange={e => setNewVehicle(v => ({ ...v, year: parseInt(e.target.value) }))}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="plate">Plaque (optionnel)</Label>
                    <Input 
                      id="plate" 
                      placeholder="AA-123-BB" 
                      value={newVehicle.plateNumber} 
                      onChange={e => setNewVehicle(v => ({ ...v, plateNumber: e.target.value }))}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" className="w-full">Enregistrer le véhicule</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {isLoading ? (
          Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="h-32 bg-muted/30 rounded-[2rem] animate-pulse" />
          ))
        ) : vehicles.length > 0 ? (
          vehicles.map((vehicle) => (
            <Card key={vehicle.id} className="rounded-[2rem] group hover:border-primary/50 transition-all">
              <CardContent className="p-6 flex items-center gap-6">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <Car size={32} />
                </div>
                <div className="flex-1 space-y-1">
                  <h4 className="font-bold text-lg">{vehicle.make} {vehicle.model}</h4>
                  <p className="text-sm text-muted-foreground">{vehicle.year} • {vehicle.plateNumber || 'Plaque non renseignée'}</p>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary rounded-lg">
                    <Edit2 size={16} />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-muted-foreground hover:text-destructive rounded-lg"
                    onClick={() => handleDelete(vehicle.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-2 py-20 bg-muted/10 border-2 border-dashed rounded-[3rem] flex flex-col items-center justify-center gap-4 text-muted-foreground">
            <Car size={48} className="opacity-20" />
            <p className="font-medium">Aucun véhicule enregistré</p>
            <Button variant="outline" onClick={() => setIsAdding(true)}>Ajouter mon premier véhicule</Button>
          </div>
        )}
      </div>
    </div>
  )
}
