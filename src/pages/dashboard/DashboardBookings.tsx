import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, MapPin, AlertCircle, Trash2, ChevronRight } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { supabase } from '@/lib/supabase'
import { toast } from 'react-hot-toast'
import { cn } from '@/lib/utils'

export function DashboardBookings() {
  const { profile } = useAuth()
  const [bookings, setBookings] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (profile?.id) {
      fetchBookings()
    }
  }, [profile?.id])

  const fetchBookings = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          service:services(*),
          professional:professionals(*)
        `)
        .eq('user_id', profile?.id)

      if (error) throw error
      setBookings(data || [])
    } catch (error) {
      console.error('Error fetching bookings:', error)
      toast.error('Erreur lors du chargement de vos réservations')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = async (bookingId: string, startTime: string) => {
    const appointmentDate = new Date(startTime)
    const now = new Date()
    const diffInHours = (appointmentDate.getTime() - now.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      toast.error('L\'annulation doit être faite plus de 24h à l\'avance.')
      return
    }

    if (!confirm('Êtes-vous sûr de vouloir annuler ce rendez-vous ?')) return

    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: 'cancelled' })
        .eq('id', bookingId)

      if (error) throw error
      toast.success('Rendez-vous annulé')
      fetchBookings()
    } catch (error) {
      toast.error('Erreur lors de l\'annulation')
    }
  }

  const sortedBookings = [...bookings].sort((a, b) => 
    new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
  )

  const upcoming = sortedBookings.filter(b => b.status === 'pending' || b.status === 'confirmed')
  const past = sortedBookings.filter(b => b.status === 'completed' || b.status === 'cancelled')

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Mes réservations</h1>
        <p className="text-muted-foreground">Suivez vos interventions et gérez vos rendez-vous.</p>
      </div>

      <div className="space-y-12">
        {/* À venir */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Calendar className="text-primary" size={20} />
            Prochains rendez-vous
          </h2>
          <div className="space-y-4">
            {upcoming.length === 0 ? (
              <Card className="rounded-3xl border-dashed">
                <CardContent className="p-12 text-center text-muted-foreground">
                  Aucun rendez-vous prévu pour le moment.
                </CardContent>
              </Card>
            ) : (
              upcoming.map((booking) => (
                <BookingCard key={booking.id} booking={booking} onCancel={handleCancel} isUpcoming />
              ))
            )}
          </div>
        </section>

        {/* Historique */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Clock className="text-muted-foreground" size={20} />
            Historique des interventions
          </h2>
          <div className="space-y-4">
            {past.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">Aucun historique disponible.</p>
            ) : (
              past.map((booking) => (
                <BookingCard key={booking.id} booking={booking} isUpcoming={false} />
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  )
}

function BookingCard({ booking, onCancel, isUpcoming }: { booking: any, onCancel?: any, isUpcoming: boolean }) {
  const statusColors: any = {
    pending: 'bg-orange-100 text-orange-700',
    confirmed: 'bg-green-100 text-green-700',
    completed: 'bg-blue-100 text-blue-700',
    cancelled: 'bg-red-100 text-red-700',
  }

  const statusLabels: any = {
    pending: 'En attente',
    confirmed: 'Confirmé',
    completed: 'Terminé',
    cancelled: 'Annulé',
  }

  return (
    <Card className="rounded-3xl hover:shadow-md transition-all border-none shadow-sm bg-white overflow-hidden group">
      <CardContent className="p-6 flex flex-col md:flex-row items-center gap-6">
        <div className="w-20 h-20 bg-muted/50 rounded-2xl flex flex-col items-center justify-center font-bold text-center">
          <span className="text-xs opacity-60 font-medium">
            {new Date(booking.startTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
          </span>
          <span className="text-lg text-primary leading-tight">
            {new Date(booking.startTime).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }).toUpperCase()}
          </span>
        </div>

        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2 mb-1">
            <Badge className={cn("border-none", statusColors[booking.status])}>
              {statusLabels[booking.status]}
            </Badge>
          </div>
          <h4 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">
            {booking.service?.name || 'Entretien périodique'}
          </h4>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            <MapPin size={14} />
            {booking.professional?.name || 'Garage partenaire'}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Véhicule : {booking.vehicleMake || 'Véhicule'} {booking.vehicleModel || ''}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2">
          {isUpcoming && booking.status !== 'cancelled' && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-destructive hover:bg-destructive/10 rounded-xl px-4"
              onClick={() => onCancel(booking.id, booking.startTime)}
            >
              <Trash2 size={16} className="mr-2" />
              Annuler
            </Button>
          )}
          <Button variant="outline" size="sm" className="rounded-xl px-4 group-hover:bg-primary group-hover:text-white transition-all">
            Détails
            <ChevronRight size={16} className="ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
