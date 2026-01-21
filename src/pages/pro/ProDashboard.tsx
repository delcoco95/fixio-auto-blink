import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Calendar, Users, Wrench, BarChart3, Clock, CheckCircle2 } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'

export function ProDashboard() {
  const { profile } = useAuth()
  
  return (
    <div className="container mx-auto px-4 py-12 space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <Badge className="bg-primary/10 text-primary border-none mb-4">Espace Pro</Badge>
          <h1 className="text-4xl font-bold tracking-tight">Bonjour, {profile?.displayName || 'Garage'}</h1>
          <p className="text-muted-foreground text-lg">Votre activité pour aujourd'hui, {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-xl">Bloquer un créneau</Button>
          <Button className="rounded-xl">Ajouter un service</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'RDV aujourd\'hui', value: '8', icon: Calendar, color: 'text-primary' },
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
            {[1, 2, 3].map((i) => (
              <Card key={i} className="rounded-3xl hover:border-primary/30 transition-all cursor-pointer">
                <CardContent className="p-6 flex items-center gap-6">
                  <div className="w-16 h-16 bg-muted rounded-2xl flex flex-col items-center justify-center font-bold">
                    <span className="text-xs opacity-60">10:00</span>
                    <span className="text-primary">14 JAN</span>
                  </div>
                  <div className="flex-1 space-y-1">
                    <h4 className="font-bold text-lg">Vidange + Filtres - Peugeot 208</h4>
                    <p className="text-sm text-muted-foreground">Client: Jean Dupont • 06 12 34 56 78</p>
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
