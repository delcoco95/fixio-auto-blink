import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Star, MapPin, Phone, Info, Clock, CheckCircle2, ChevronRight, Calendar as CalendarIcon } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { format, addDays, startOfToday, isSameDay } from 'date-fns'
import { fr } from 'date-fns/locale'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/use-auth'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'

interface Service {
  id: string
  name: string
  duration: number
  price_min: number
  description: string
}

const TIME_SLOTS = ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00']

export function ProProfile() {
  const { id } = useParams()
  const { profile: currentUserProfile, user } = useAuth()
  const navigate = useNavigate()
  const [pro, setPro] = useState<any>(null)
  const [services, setServices] = useState<Service[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date>(startOfToday())
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)

  useEffect(() => {
    fetchPro()
  }, [id])

  const fetchPro = async () => {
    setIsLoading(true)
    try {
      const { data: proData, error: proError } = await supabase
        .from('professionals')
        .select('*')
        .eq('id', id)
        .single()

      if (proError) throw proError
      setPro(proData)

      const { data: servicesData, error: servicesError } = await supabase
        .from('services')
        .select('*')
        .eq('professional_id', id)
        .eq('is_active', true)

      if (servicesError) throw servicesError
      setServices(servicesData as any[])
    } catch (error) {
      console.error('Error fetching pro:', error)
      toast.error('Échec du chargement du profil')
    } finally {
      setIsLoading(false)
    }
  }

  const handleBooking = async () => {
    if (!user) {
      toast.error('Veuillez vous connecter pour réserver')
      navigate('/auth?mode=login')
      return
    }

    if (selectedService && selectedDate && selectedSlot) {
      try {
        const [hours, minutes] = selectedSlot.split(':').map(Number)
        const startTime = new Date(selectedDate)
        startTime.setHours(hours, minutes, 0, 0)
        
        const endTime = new Date(startTime)
        endTime.setMinutes(endTime.getMinutes() + (selectedService.duration || 60))

        const { error } = await supabase.from('appointments').insert({
          user_id: user.id,
          professional_id: id,
          service_id: selectedService.id,
          start_time: startTime.toISOString(),
          end_time: endTime.toISOString(),
          status: 'pending'
        })

        if (error) throw error

        toast.success('Demande de réservation envoyée !')
        navigate('/dashboard/bookings')
      } catch (error: any) {
        toast.error(error.message || 'Erreur lors de la réservation')
      }
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-8">
        <div className="flex flex-col md:flex-row gap-8">
          <Skeleton className="w-full md:w-1/3 aspect-video rounded-3xl" />
          <div className="flex-1 space-y-4">
            <Skeleton className="h-10 w-1/2" />
            <Skeleton className="h-4 w-1/4" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-24" />
            </div>
          </div>
        </div>
        <Skeleton className="h-96 w-full rounded-3xl" />
      </div>
    )
  }

  const next7Days = Array.from({ length: 7 }).map((_, i) => addDays(startOfToday(), i))

  return (
    <div className="container mx-auto px-4 py-8 pb-20">
      {/* Header */}
      <div className="flex flex-col lg:flex-row gap-8 mb-12">
        <div className="w-full lg:w-1/3">
          <div className="aspect-[4/3] rounded-[2rem] overflow-hidden border shadow-lg">
            <img 
              src={pro?.logo_url || "https://images.unsplash.com/photo-1530046339160-ce3e5b097ea2?auto=format&fit=crop&q=80&w=600"} 
              alt={pro?.name} 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        
        <div className="flex-1 flex flex-col justify-center gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-4xl font-bold tracking-tight">{pro?.name}</h1>
              {pro?.is_verified && <Badge className="bg-primary/10 text-primary border-none">Vérifié</Badge>}
            </div>
            <div className="flex items-center gap-4 text-muted-foreground">
              <div className="flex items-center gap-1 text-yellow-600 font-bold">
                <Star size={18} className="fill-yellow-600" />
                {pro?.rating || 0} ({pro?.review_count || 0} avis)
              </div>
              <div className="flex items-center gap-1">
                <MapPin size={18} />
                {pro?.city}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button variant="outline" className="rounded-xl gap-2">
              <Phone size={18} />
              {pro?.phone}
            </Button>
            <Button variant="outline" className="rounded-xl gap-2">
              <Info size={18} />
              Itinéraire
            </Button>
          </div>

          <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl">
            {pro?.description || "Professionnel spécialisé dans l'entretien et la réparation multi-marques."}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Services & Info */}
        <div className="lg:col-span-7 space-y-12">
          <Tabs defaultValue="services" className="w-full">
            <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent mb-8">
              <TabsTrigger 
                value="services" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-8 py-3 font-bold"
              >
                Services
              </TabsTrigger>
              <TabsTrigger 
                value="avis" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-8 py-3 font-bold"
              >
                Avis
              </TabsTrigger>
              <TabsTrigger 
                value="photos" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-8 py-3 font-bold"
              >
                Photos
              </TabsTrigger>
            </TabsList>

            <TabsContent value="services" className="space-y-4 m-0">
              <div className="grid gap-4">
                {services.map((service) => (
                  <Card 
                    key={service.id} 
                    className={`cursor-pointer transition-all rounded-2xl hover:border-primary/50 ${selectedService?.id === service.id ? 'border-primary ring-1 ring-primary/20' : ''}`}
                    onClick={() => setSelectedService(service)}
                  >
                    <CardContent className="p-6 flex items-center justify-between gap-4">
                      <div className="space-y-1 flex-1">
                        <h4 className="font-bold text-lg">{service.name}</h4>
                        <p className="text-sm text-muted-foreground">{service.description}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="flex items-center gap-1 text-sm font-medium">
                            <Clock size={14} className="text-muted-foreground" />
                            {service.duration} min
                          </span>
                          <span className="text-sm font-bold text-primary">{service.price_min}€</span>
                        </div>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${selectedService?.id === service.id ? 'border-primary bg-primary text-white' : 'border-muted'}`}>
                        {selectedService?.id === service.id && <CheckCircle2 size={16} />}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="avis" className="py-8 text-center text-muted-foreground">
              Les avis des clients s'afficheront ici.
            </TabsContent>
            
            <TabsContent value="photos" className="py-8 text-center text-muted-foreground">
              La galerie photo s'affichera ici.
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Column: Booking Widget */}
        <div className="lg:col-span-5">
          <div className="sticky top-28 space-y-6">
            <Card className="rounded-[2rem] border-2 shadow-xl shadow-primary/5 overflow-hidden">
              <CardContent className="p-0">
                <div className="bg-primary p-6 text-white">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <CalendarIcon size={20} />
                    Réservation immédiate
                  </h3>
                  <p className="text-primary-foreground/80 text-sm mt-1">Sélectionnez une date et un horaire.</p>
                </div>
                
                <div className="p-8 space-y-8">
                  {/* Date Selector */}
                  <div className="space-y-4">
                    <h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">1. Choisissez le jour</h4>
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                      {next7Days.map((date) => (
                        <button
                          key={date.toISOString()}
                          onClick={() => setSelectedDate(date)}
                          className={`flex flex-col items-center justify-center min-w-[70px] py-4 rounded-2xl border transition-all ${isSameDay(selectedDate, date) ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'bg-white hover:border-primary/30'}`}
                        >
                          <span className="text-xs uppercase font-bold opacity-60">
                            {format(date, 'EEE', { locale: fr })}
                          </span>
                          <span className="text-xl font-bold">
                            {format(date, 'd')}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Slot Selector */}
                  <div className="space-y-4">
                    <h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">2. Choisissez l'horaire</h4>
                    <div className="grid grid-cols-4 gap-2">
                      {TIME_SLOTS.map((slot) => (
                        <button
                          key={slot}
                          onClick={() => setSelectedSlot(slot)}
                          className={`py-3 rounded-xl border font-bold text-sm transition-all ${selectedSlot === slot ? 'bg-primary text-white border-primary' : 'bg-muted/30 hover:bg-muted'}`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Summary */}
                  {selectedService && selectedSlot && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-6 bg-secondary rounded-2xl space-y-4"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm text-muted-foreground">Récapitulatif</p>
                          <p className="font-bold">{selectedService.name}</p>
                        </div>
                        <p className="font-bold text-lg text-primary">{selectedService.price_min}€</p>
                      </div>
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <CalendarIcon size={14} />
                        {format(selectedDate, 'd MMMM yyyy', { locale: fr })} à {selectedSlot}
                      </div>
                    </motion.div>
                  )}

                  <Button 
                    disabled={!selectedService || !selectedSlot} 
                    onClick={handleBooking}
                    className="w-full h-14 rounded-2xl text-lg font-bold group"
                  >
                    Confirmer la réservation
                    <ChevronRight size={20} className="ml-2 transition-transform group-hover:translate-x-1" />
                  </Button>
                  
                  <p className="text-center text-xs text-muted-foreground">
                    Confirmation immédiate. Aucun paiement en ligne requis.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex items-center gap-4 p-6 bg-yellow-50 rounded-2xl border border-yellow-200 text-yellow-800">
              <Star className="fill-yellow-600 text-yellow-600 shrink-0" size={24} />
              <p className="text-sm font-medium">
                Ce professionnel a été noté <strong>4.8/5</strong> sur ses 50 dernières interventions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
