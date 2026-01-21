import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Calendar, Users, Wrench, BarChart3, Clock, CheckCircle2, Settings, Image, Plus, ChevronRight, AlertCircle, CreditCard } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { Badge } from '@/components/ui/badge'
import { supabase } from '@/lib/supabase'
import { toast } from 'react-hot-toast'
import { cn } from '@/lib/utils'

export function ProDashboard() {
  const { profile } = useAuth()
  const [appointments, setAppointments] = useState<any[]>([])
  const [services, setServices] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  // Trial logic
  const metadata = profile?.metadata ? JSON.parse(profile.metadata) : {}
  const trialStartDate = metadata.trialStartDate ? new Date(metadata.trialStartDate) : new Date()
  const daysPassed = Math.floor((new Date().getTime() - trialStartDate.getTime()) / (1000 * 60 * 60 * 24))
  const daysRemaining = Math.max(0, 90 - daysPassed)
  const isTrialExpired = daysRemaining === 0

  useEffect(() => {
    if (profile?.id) {
      fetchProData()
    }
  }, [profile?.id])

  const fetchProData = async () => {
    setIsLoading(true)
    try {
      const { data: proRecord, error: proError } = await supabase
        .from('professionals')
        .select('*')
        .eq('user_id', profile?.id)
        .single()

      if (proError) throw proError

      if (proRecord) {
        const proId = proRecord.id
        const [apptsRes, svcsRes] = await Promise.all([
          supabase.from('appointments').select('*, service:services(*), client:profiles(*)').eq('professional_id', proId),
          supabase.from('services').select('*').eq('professional_id', proId)
        ])
        
        if (apptsRes.error) throw apptsRes.error
        if (svcsRes.error) throw svcsRes.error

        setAppointments(apptsRes.data)
        setServices(svcsRes.data)
      }
    } catch (error) {
      console.error('Error fetching pro data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Trial Banner */}
      <Card className={cn(
        "border-none shadow-md overflow-hidden",
        isTrialExpired ? "bg-destructive/10" : "bg-primary/5 border border-primary/10"
      )}>
        <CardContent className="p-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center",
              isTrialExpired ? "bg-destructive/20 text-destructive" : "bg-primary/20 text-primary"
            )}>
              {isTrialExpired ? <AlertCircle size={20} /> : <Clock size={20} />}
            </div>
            <div>
              <p className="font-bold">
                {isTrialExpired ? "Votre période d'essai a expiré" : "Période d'essai gratuit"}
              </p>
              <p className="text-sm text-muted-foreground">
                {isTrialExpired 
                  ? "Veuillez souscrire à un abonnement pour continuer à recevoir des réservations." 
                  : `${daysRemaining} jours restants sur vos 90 jours d'essai offerts.`}
              </p>
            </div>
          </div>
          {isTrialExpired && (
            <Button className="rounded-xl bg-primary text-white hover:bg-primary/90">
              <CreditCard className="mr-2 h-4 w-4" />
              S'abonner via Stripe
            </Button>
          )}
        </CardContent>
      </Card>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
          <p className="text-muted-foreground">
            Bienvenue, {profile?.full_name || 'Partenaire'}. Gerez votre garage et vos rendez-vous.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-xl">Bloquer un créneau</Button>
          <Button className="rounded-xl">
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un service
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'RDV aujourd\'hui', value: appointments.filter(appt => new Date(appt.startTime).toDateString() === new Date().toDateString()).length, icon: Calendar, color: 'text-primary' },
          { label: 'CA estimé (mois)', value: '12,450€', icon: BarChart3, color: 'text-green-600' },
          { label: 'Nouveaux clients', value: '24', icon: Users, color: 'text-blue-600' },
          { label: 'Taux de remplissage', value: '85%', icon: Clock, color: 'text-purple-600' },
        ].map((stat, i) => (
          <Card key={i} className="rounded-3xl border shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                  <p className="text-3xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-2xl bg-muted/50 flex items-center justify-center ${stat.color}`}>
                  <stat.icon size={24} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="planning" className="w-full">
        <TabsList className="bg-muted/30 p-1 rounded-2xl mb-8">
          <TabsTrigger value="planning" className="rounded-xl px-8 py-2.5 font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">Planning</TabsTrigger>
          <TabsTrigger value="services" className="rounded-xl px-8 py-2.5 font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">Services</TabsTrigger>
          <TabsTrigger value="avis" className="rounded-xl px-8 py-2.5 font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">Avis clients</TabsTrigger>
          <TabsTrigger value="settings" className="rounded-xl px-8 py-2.5 font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">Configuration</TabsTrigger>
        </TabsList>

        <TabsContent value="planning" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold">Prochains rendez-vous</h3>
            <Button variant="ghost" className="text-primary font-bold">Voir tout le calendrier</Button>
          </div>
          
          <div className="space-y-4">
            {appointments.length === 0 && !isLoading && (
              <Card className="rounded-3xl">
                <CardContent className="p-6 text-center text-muted-foreground">
                  Aucun rendez-vous prévu pour le moment.
                </CardContent>
              </Card>
            )}
            {appointments.map((appt, i) => (
              <Card key={i} className="rounded-3xl hover:border-primary/30 transition-all cursor-pointer">
                <CardContent className="p-6 flex items-center gap-6">
                  <div className="w-16 h-16 bg-muted rounded-2xl flex flex-col items-center justify-center font-bold">
                    <span className="text-xs opacity-60">{new Date(appt.startTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                    <span className="text-primary">{new Date(appt.startTime).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }).toUpperCase()}</span>
                  </div>
                  <div className="flex-1 space-y-1">
                    <h4 className="font-bold text-lg">{appt.service?.name || 'Service non spécifié'}</h4>
                    <p className="text-sm text-muted-foreground">Client: {appt.client?.name || 'Nom inconnu'} • {appt.client?.phone || 'Numéro inconnu'}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge className="bg-blue-100 text-blue-700 border-none">À venir</Badge>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <ChevronRight size={20} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="services" className="p-12 text-center bg-muted/10 rounded-[3rem] border-2 border-dashed">
           <Wrench size={48} className="mx-auto text-muted-foreground opacity-20 mb-4" />
           <h3 className="text-xl font-bold">Gérez vos prestations</h3>
           <p className="text-muted-foreground mt-2">Ajoutez ou modifiez vos services pour qu'ils soient réservables en ligne.</p>
           <Button className="mt-6 rounded-xl">Ajouter un service</Button>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", className)}>
      {children}
    </div>
  )
}

function ChevronRight({ size }: { size: number }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6"/>
    </svg>
  )
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ')
}