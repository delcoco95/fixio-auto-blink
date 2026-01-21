import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { User, Phone, Mail, Lock, Shield, Bell } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { supabase } from '@/lib/supabase'
import { toast } from 'react-hot-toast'

export function DashboardSettings() {
  const { profile, user } = useAuth()
  const [displayName, setDisplayName] = useState(profile?.full_name || '')
  const [phone, setPhone] = useState(profile?.phone || '')
  const [isLoading, setIsLoading] = useState(false)

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: displayName,
          phone
        })
        .eq('id', profile?.id)

      if (error) throw error
      toast.success('Profil mis à jour')
    } catch (error) {
      toast.error('Erreur lors de la mise à jour')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Paramètres</h1>
        <p className="text-muted-foreground">Gérez vos informations personnelles et vos préférences.</p>
      </div>

      <div className="space-y-6">
        <Card className="rounded-[2rem] border-none shadow-sm overflow-hidden">
          <CardHeader className="bg-muted/30 pb-6">
            <CardTitle className="flex items-center gap-2">
              <User size={20} className="text-primary" />
              Informations personnelles
            </CardTitle>
            <CardDescription>Mettez à jour vos coordonnées pour faciliter vos réservations.</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="displayName">Nom complet</Label>
                  <Input 
                    id="displayName" 
                    value={displayName} 
                    onChange={(e) => setDisplayName(e.target.value)} 
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    value={user?.email || ''} 
                    disabled 
                    className="rounded-xl bg-muted/50 cursor-not-allowed"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" size={16} />
                  <Input 
                    id="phone" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)} 
                    className="pl-10 rounded-xl"
                    placeholder="06 12 34 56 78"
                  />
                </div>
              </div>
              <div className="pt-4 flex justify-end">
                <Button type="submit" className="rounded-xl px-8" disabled={isLoading}>
                  {isLoading ? 'Enregistrement...' : 'Enregistrer les modifications'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] border-none shadow-sm overflow-hidden">
          <CardHeader className="bg-muted/30 pb-6">
            <CardTitle className="flex items-center gap-2">
              <Lock size={20} className="text-primary" />
              Sécurité
            </CardTitle>
            <CardDescription>Changez votre mot de passe ou activez la double authentification.</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <Button variant="outline" className="rounded-xl">
              Changer mon mot de passe
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
