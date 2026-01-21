import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, MapPin, Wrench, Star } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'

export function DashboardOverview() {
  const { profile } = useAuth()
  const [appointments, setAppointments] = useState<any[]>([])

  useEffect(() => {
    // Mock appointments for now
    setAppointments([
      {
        id: '1',
        serviceName: 'Vidange & Révision',
        proName: 'Garage Central Paris',
        date: '15 Janv. 2026',
        time: '14:30',
        status: 'confirmed'
      }
    ])
  }, [])

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold">Bonjour, {profile?.full_name || 'Client'}</h2>
        <p className="text-muted-foreground">Voici un aperçu de votre activité FIXIO.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                <Calendar size={24} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Prochain RDV</p>
                <p className="font-bold">{appointments[0]?.date || 'Aucun'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                <Wrench size={24} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Véhicules</p>
                <p className="font-bold">2 enregistrés</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                <Star size={24} className="text-yellow-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avis laissés</p>
                <p className="font-bold">12 avis</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h3 className="font-bold text-lg">Prochain rendez-vous</h3>
        {appointments.length > 0 ? (
          <Card className="rounded-2xl border-2 border-primary/20 overflow-hidden">
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row">
                <div className="bg-primary p-6 text-white flex flex-col justify-center items-center md:w-40 gap-1 text-center">
                  <span className="text-sm font-medium opacity-80 uppercase tracking-widest">Janvier</span>
                  <span className="text-4xl font-bold">15</span>
                  <span className="text-sm font-medium">14:30</span>
                </div>
                <div className="flex-1 p-6 flex flex-col md:flex-row justify-between items-center gap-6">
                  <div className="space-y-2 text-center md:text-left">
                    <h4 className="text-xl font-bold">{appointments[0].serviceName}</h4>
                    <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-muted-foreground font-medium">
                      <div className="flex items-center gap-1.5">
                        <MapPin size={16} />
                        {appointments[0].proName}
                      </div>
                      <Badge className="bg-green-100 text-green-700 border-none">Confirmé</Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="rounded-xl">Itinéraire</Button>
                    <Button variant="outline" className="rounded-xl text-destructive hover:text-destructive hover:bg-destructive/10">Annuler</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="p-12 text-center bg-muted/30 rounded-[2rem] border border-dashed">
            <p className="text-muted-foreground">Vous n'avez pas de rendez-vous à venir.</p>
            <Button className="mt-4" variant="outline">Prendre rendez-vous</Button>
          </div>
        )}
      </div>
    </div>
  )
}
