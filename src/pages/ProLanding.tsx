import { Button } from '@/components/ui/button'
import { Wrench, TrendingUp, Calendar, Shield, ArrowRight, Zap, CheckCircle2 } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { motion } from 'framer-motion'

const BENEFITS = [
  {
    title: 'Visibilité accrue',
    description: 'Votre garage est visible par des milliers de conducteurs dans votre zone.',
    icon: TrendingUp
  },
  {
    title: 'Gestion simplifiée',
    description: 'Planning en temps réel, rappels de RDV automatiques et gestion des services.',
    icon: Calendar
  },
  {
    title: 'Confiance & Avis',
    description: 'Collectez des avis certifiés pour construire votre réputation en ligne.',
    icon: Shield
  }
]

export function ProLanding() {
  const { login } = useAuth()

  return (
    <div className="flex flex-col gap-24 pb-20">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent opacity-50" />
        
        <div className="container mx-auto px-4 z-10 relative grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <Badge className="bg-primary/20 text-primary border-none text-sm px-4 py-1.5 rounded-full font-bold">
              Espace Partenaires
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tighter leading-tight">
              Boostez l'activité de votre <span className="text-primary">garage</span>.
            </h1>
            <p className="text-xl text-slate-400 max-w-xl">
              FIXIO est l'outil tout-en-un pour les professionnels de l'auto : visibilité, planning et relation client simplifiée.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="h-16 px-10 rounded-2xl text-lg font-bold bg-primary hover:bg-primary/90" onClick={login}>
                Démarrer l'essai gratuit
              </Button>
              <Button size="lg" variant="outline" className="h-16 px-10 rounded-2xl text-lg font-bold border-white/10 text-white hover:bg-white/10">
                Consulter les tarifs
              </Button>
            </div>
            <div className="flex items-center gap-6 pt-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-950 bg-slate-800 flex items-center justify-center overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="Pro" />
                  </div>
                ))}
              </div>
              <p className="text-sm text-slate-500 font-medium">
                +500 garages nous font déjà confiance
              </p>
            </div>
          </div>
          
          <div className="relative group">
            <div className="absolute -inset-4 bg-primary/20 blur-3xl rounded-full group-hover:bg-primary/30 transition-all duration-700" />
            <div className="relative bg-slate-900 border border-white/10 p-4 rounded-[2.5rem] shadow-2xl">
               <img 
                 src="https://images.unsplash.com/photo-1517524204412-1a96975d040d?auto=format&fit=crop&q=80&w=1000" 
                 alt="Garage Dashboard" 
                 className="rounded-[1.5rem] opacity-80"
               />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          {BENEFITS.map((benefit, i) => (
            <div key={i} className="p-10 bg-white border rounded-[2.5rem] space-y-4 hover:shadow-xl transition-all border-slate-100">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                <benefit.icon size={28} />
              </div>
              <h3 className="text-2xl font-bold tracking-tight">{benefit.title}</h3>
              <p className="text-slate-500 leading-relaxed">{benefit.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-slate-50 py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mb-16 space-y-4">
            <h2 className="text-4xl font-bold tracking-tight">Plus qu'un simple annuaire.</h2>
            <p className="text-xl text-slate-500">Un logiciel complet de gestion de rendez-vous conçu spécifiquement pour l'automobile.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12">
            {[
              "Synchronisation planning multi-postes",
              "Envoi automatique de SMS de rappel",
              "Gestion de votre base de données clients",
              "Statistiques de performance détaillées",
              "Profil premium personnalisable",
              "Système de paiement sécurisé (optionnel)"
            ].map((f, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="mt-1 w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center shrink-0">
                  <CheckCircle2 size={16} />
                </div>
                <div className="text-lg font-semibold text-slate-700">{f}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="container mx-auto px-4">
        <div className="bg-primary rounded-[3rem] p-12 md:p-24 text-center space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
          <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tighter">Prêt à digitaliser votre garage ?</h2>
          <p className="text-primary-foreground/80 text-xl max-w-2xl mx-auto">
            L'inscription prend moins de 5 minutes. Commencez à recevoir des rendez-vous dès aujourd'hui.
          </p>
          <Button size="lg" className="bg-white text-primary hover:bg-slate-50 h-16 px-12 rounded-2xl text-xl font-bold shadow-xl shadow-black/10">
            Rejoindre FIXIO
          </Button>
        </div>
      </section>
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

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ')
}
