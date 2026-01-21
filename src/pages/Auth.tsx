import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Checkbox } from '@/components/ui/checkbox'
import { User, Briefcase, Mail, Lock, Building2, MapPin, Phone, CheckCircle2 } from 'lucide-react'
import { toast } from 'react-hot-toast'

export function Auth() {
  const [searchParams] = useSearchParams()
  const defaultTab = searchParams.get('mode') === 'signup' ? 'signup' : 'login'
  const [mode, setMode] = useState<'login' | 'signup'>(defaultTab as any)
  const [role, setRole] = useState<'client' | 'pro'>('client')
  const [isLoading, setIsLoading] = useState(false)
  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()

  // Form states
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [phone, setPhone] = useState('')
  const [garageName, setGarageName] = useState('')
  const [address, setAddress] = useState('')
  const [siret, setSiret] = useState('')
  const [acceptTrial, setAcceptTrial] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (mode === 'login') {
        await signIn(email, password)
        navigate('/')
      } else {
        if (role === 'pro' && !acceptTrial) {
          toast.error('Vous devez accepter les conditions d\'essai gratuit.')
          setIsLoading(false)
          return
        }

        const signUpParams: any = {
          email,
          password,
          displayName: role === 'pro' ? garageName : displayName,
          metadata: {
            role,
            ...(role === 'pro' && {
              garageName,
              address,
              siret,
              phone,
              trialAccepted: acceptTrial,
              trialStartDate: new Date().toISOString(),
            })
          }
        }

        await signUp(signUpParams)

        // After signup, we need to create the profile in our DB if role is pro
        // But wait, the hook handles profile creation. 
        // We need to make sure the hook knows the role from metadata.
        
        navigate('/verify-email')
      }
    } catch (error) {
      // toast handled in hook
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 bg-secondary/30">
      <Card className="w-full max-w-md shadow-xl border-none">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">
            {mode === 'login' ? 'Connexion à FIXIO' : 'Rejoindre FIXIO'}
          </CardTitle>
          <CardDescription>
            {mode === 'login' 
              ? 'Entrez vos identifiants pour accéder à votre compte' 
              : 'Choisissez votre type de compte pour commencer'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={mode} onValueChange={(v) => setMode(v as any)} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Connexion</TabsTrigger>
              <TabsTrigger value="signup">Inscription</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="nom@exemple.com" 
                      className="pl-10"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Mot de passe</Label>
                    <Link to="/forgot-password" variant="link" className="text-xs text-primary hover:underline">
                      Mot de passe oublié ?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="password" 
                      type="password" 
                      className="pl-10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required 
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full h-11" disabled={isLoading}>
                  {isLoading ? 'Connexion en cours...' : 'Se connecter'}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="space-y-4">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <Button
                  type="button"
                  variant={role === 'client' ? 'default' : 'outline'}
                  className="h-20 flex flex-col gap-2"
                  onClick={() => setRole('client')}
                >
                  <User className="h-5 w-5" />
                  <span className="text-xs">Particulier</span>
                </Button>
                <Button
                  type="button"
                  variant={role === 'pro' ? 'default' : 'outline'}
                  className="h-20 flex flex-col gap-2"
                  onClick={() => setRole('pro')}
                >
                  <Briefcase className="h-5 w-5" />
                  <span className="text-xs">Professionnel</span>
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="signup-email" 
                      type="email" 
                      placeholder="nom@exemple.com" 
                      className="pl-10"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Mot de passe</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="signup-password" 
                      type="password" 
                      className="pl-10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required 
                    />
                  </div>
                </div>

                {role === 'client' ? (
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom complet</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="name" 
                        placeholder="Jean Dupont" 
                        className="pl-10"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        required 
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="garageName">Nom du garage</Label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="garageName" 
                          placeholder="Garage de l'Avenir" 
                          className="pl-10"
                          value={garageName}
                          onChange={(e) => setGarageName(e.target.value)}
                          required 
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="siret">SIRET</Label>
                      <Input 
                        id="siret" 
                        placeholder="123 456 789 00012" 
                        value={siret}
                        onChange={(e) => setSiret(e.target.value)}
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Adresse</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="address" 
                          placeholder="123 rue de Paris, 75001 Paris" 
                          className="pl-10"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          required 
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Téléphone</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="phone" 
                          placeholder="01 23 45 67 89" 
                          className="pl-10"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          required 
                        />
                      </div>
                    </div>
                    <div className="flex items-start space-x-2 pt-2">
                      <Checkbox 
                        id="trial" 
                        checked={acceptTrial} 
                        onCheckedChange={(checked) => setAcceptTrial(checked as boolean)}
                        required
                      />
                      <Label htmlFor="trial" className="text-xs leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        J'accepte les 3 mois d'essai gratuit avant l'abonnement
                      </Label>
                    </div>
                  </>
                )}

                <Button type="submit" className="w-full h-11" disabled={isLoading}>
                  {isLoading ? 'Inscription en cours...' : 'Créer mon compte'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <div className="text-sm text-center text-muted-foreground w-full">
            {mode === 'login' ? (
              <>
                Pas encore de compte ?{' '}
                <button onClick={() => setMode('signup')} className="text-primary hover:underline font-medium">
                  Inscrivez-vous
                </button>
              </>
            ) : (
              <>
                Déjà un compte ?{' '}
                <button onClick={() => setMode('login')} className="text-primary hover:underline font-medium">
                  Connectez-vous
                </button>
              </>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
