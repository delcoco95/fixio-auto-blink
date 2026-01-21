import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { ArrowRight, ArrowLeft, Building2, MapPin, Wrench, Clock, Upload, CheckCircle2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/use-auth'
import toast from 'react-hot-toast'

const ACTIVITY_TYPES = [
  { value: 'garage', label: 'Garage automobile' },
  { value: 'mecanique', label: 'Mécanicien indépendant' },
  { value: 'carrosserie', label: 'Carrosserie' },
  { value: 'centre-auto', label: 'Centre auto' },
  { value: 'detailing', label: 'Detailing / Esthétique auto' },
  { value: 'pneus', label: 'Spécialiste pneus' },
  { value: 'diagnostic', label: 'Centre de diagnostic' },
  { value: 'electricite', label: 'Électricité automobile' },
  { value: 'vitrage', label: 'Vitrage automobile' },
  { value: 'autre', label: 'Autre' },
]

const registrationSchema = z.object({
  // Legal info
  siret: z.string().length(14, 'Le numéro SIRET doit contenir 14 chiffres').regex(/^\d+$/, 'Le SIRET ne doit contenir que des chiffres'),
  companyName: z.string().min(2, 'Nom de la société requis'),
  legalName: z.string().min(2, 'Raison sociale requise'),
  
  // Address
  streetNumber: z.string().min(1, 'Numéro requis'),
  streetName: z.string().min(3, 'Nom de rue requis'),
  postalCode: z.string().length(5, 'Code postal invalide'),
  city: z.string().min(2, 'Ville requise'),
  country: z.string().default('France'),
  
  // Contact
  phone: z.string().min(10, 'Numéro de téléphone invalide'),
  email: z.string().email('Email invalide'),
  website: z.string().url().optional().or(z.literal('')),
  
  // Business
  activityType: z.string().min(1, 'Type d\'activité requis'),
  description: z.string().min(20, 'Description minimale de 20 caractères'),
  capacity: z.number().min(1).max(50),
  
  // Terms
  acceptTerms: z.boolean().refine(val => val === true, 'Vous devez accepter les conditions'),
})

type RegistrationForm = z.infer<typeof registrationSchema>

const STEPS = [
  { id: 1, title: 'Informations légales', icon: Building2 },
  { id: 2, title: 'Adresse', icon: MapPin },
  { id: 3, title: 'Activité', icon: Wrench },
  { id: 4, title: 'Validation', icon: Clock },
]

export function ProRegistration() {
  const navigate = useNavigate()
  const { user, profile } = useAuth()
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  
  const { register, handleSubmit, formState: { errors }, setValue, watch, trigger } = useForm<RegistrationForm>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      country: 'France',
      capacity: 2,
      email: profile?.email || '',
    }
  })
  
  const validateStep = async () => {
    let fieldsToValidate: (keyof RegistrationForm)[] = []
    
    switch (step) {
      case 1:
        fieldsToValidate = ['siret', 'companyName', 'legalName', 'phone', 'email']
        break
      case 2:
        fieldsToValidate = ['streetNumber', 'streetName', 'postalCode', 'city']
        break
      case 3:
        fieldsToValidate = ['activityType', 'description', 'capacity']
        break
      case 4:
        fieldsToValidate = ['acceptTerms']
        break
    }
    
    const isValid = await trigger(fieldsToValidate)
    return isValid
  }
  
  const nextStep = async () => {
    const isValid = await validateStep()
    if (isValid && step < 4) {
      setStep(s => s + 1)
    }
  }
  
  const prevStep = () => {
    if (step > 1) setStep(s => s - 1)
  }
  
  const onSubmit = async (data: RegistrationForm) => {
    if (!user) {
      toast.error('Vous devez être connecté')
      return
    }
    
    setIsSubmitting(true)
    
    try {
      // Upload logo if present
      let logoUrl = ''
      if (logoFile) {
        const ext = logoFile.name.split('.').pop()
        const fileName = `${user.id}-${Date.now()}.${ext}`
        
        const { error: uploadError } = await supabase.storage
          .from('logos')
          .upload(fileName, logoFile)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('logos')
          .getPublicUrl(fileName)
          
        logoUrl = publicUrl
      }
      
      // Create professional profile
      const { error: proError } = await supabase.from('professionals').insert({
        user_id: user.id,
        siret: data.siret,
        name: data.companyName,
        address: `${data.streetNumber} ${data.streetName}, ${data.postalCode} ${data.city}`,
        city: data.city,
        phone: data.phone,
        description: data.description,
        logo_url: logoUrl || null,
        status: 'pending',
        is_verified: false,
      })

      if (proError) throw proError
      
      // Update user role
      const { error: roleError } = await supabase
        .from('profiles')
        .update({ role: 'pro' })
        .eq('id', user.id)

      if (roleError) throw roleError
      
      toast.success('Inscription envoyée ! Validation sous 24-48h.')
      navigate('/pro/dashboard')
    } catch (error: any) {
      console.error(error)
      toast.error('Erreur lors de l\'inscription')
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return (
    <div className="min-h-screen bg-secondary/30 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold tracking-tight">FIXIO</h1>
          <p className="text-muted-foreground mt-1">Espace Professionnel</p>
        </div>
        
        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8 px-4">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                step >= s.id 
                  ? 'bg-primary border-primary text-primary-foreground' 
                  : 'border-border text-muted-foreground'
              }`}>
                {step > s.id ? <CheckCircle2 size={20} /> : <s.icon size={18} />}
              </div>
              {i < STEPS.length - 1 && (
                <div className={`w-16 md:w-24 h-0.5 mx-2 transition-all ${
                  step > s.id ? 'bg-primary' : 'bg-border'
                }`} />
              )}
            </div>
          ))}
        </div>
        
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">{STEPS[step - 1].title}</CardTitle>
            <CardDescription>
              {step === 1 && 'Informations légales de votre entreprise'}
              {step === 2 && 'Adresse de votre établissement'}
              {step === 3 && 'Détails de votre activité'}
              {step === 4 && 'Dernières vérifications'}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Step 1: Legal Info */}
              {step === 1 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="siret">Numéro SIRET *</Label>
                    <Input
                      id="siret"
                      placeholder="14 chiffres (ex: 12345678901234)"
                      maxLength={14}
                      {...register('siret')}
                      className="h-11"
                    />
                    {errors.siret && <p className="text-sm text-destructive">{errors.siret.message}</p>}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Nom commercial *</Label>
                      <Input
                        id="companyName"
                        placeholder="Garage Central"
                        {...register('companyName')}
                        className="h-11"
                      />
                      {errors.companyName && <p className="text-sm text-destructive">{errors.companyName.message}</p>}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="legalName">Raison sociale *</Label>
                      <Input
                        id="legalName"
                        placeholder="SARL Garage Central"
                        {...register('legalName')}
                        className="h-11"
                      />
                      {errors.legalName && <p className="text-sm text-destructive">{errors.legalName.message}</p>}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Téléphone professionnel *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="01 23 45 67 89"
                        {...register('phone')}
                        className="h-11"
                      />
                      {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email professionnel *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="contact@garage.fr"
                        {...register('email')}
                        className="h-11"
                      />
                      {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="website">Site web (optionnel)</Label>
                    <Input
                      id="website"
                      type="url"
                      placeholder="https://www.mongarage.fr"
                      {...register('website')}
                      className="h-11"
                    />
                    {errors.website && <p className="text-sm text-destructive">{errors.website.message}</p>}
                  </div>
                </div>
              )}
              
              {/* Step 2: Address */}
              {step === 2 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="streetNumber">N° *</Label>
                      <Input
                        id="streetNumber"
                        placeholder="15"
                        {...register('streetNumber')}
                        className="h-11"
                      />
                      {errors.streetNumber && <p className="text-sm text-destructive">{errors.streetNumber.message}</p>}
                    </div>
                    
                    <div className="col-span-3 space-y-2">
                      <Label htmlFor="streetName">Nom de rue *</Label>
                      <Input
                        id="streetName"
                        placeholder="Rue de la République"
                        {...register('streetName')}
                        className="h-11"
                      />
                      {errors.streetName && <p className="text-sm text-destructive">{errors.streetName.message}</p>}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="postalCode">Code postal *</Label>
                      <Input
                        id="postalCode"
                        placeholder="75001"
                        maxLength={5}
                        {...register('postalCode')}
                        className="h-11"
                      />
                      {errors.postalCode && <p className="text-sm text-destructive">{errors.postalCode.message}</p>}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="city">Ville *</Label>
                      <Input
                        id="city"
                        placeholder="Paris"
                        {...register('city')}
                        className="h-11"
                      />
                      {errors.city && <p className="text-sm text-destructive">{errors.city.message}</p>}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="country">Pays</Label>
                    <Input
                      id="country"
                      defaultValue="France"
                      {...register('country')}
                      className="h-11"
                      disabled
                    />
                  </div>
                </div>
              )}
              
              {/* Step 3: Activity */}
              {step === 3 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Type d'activité *</Label>
                    <Select onValueChange={(v) => setValue('activityType', v)}>
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Sélectionnez votre activité" />
                      </SelectTrigger>
                      <SelectContent>
                        {ACTIVITY_TYPES.map(type => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.activityType && <p className="text-sm text-destructive">{errors.activityType.message}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description de votre établissement *</Label>
                    <Textarea
                      id="description"
                      placeholder="Décrivez votre garage, vos spécialités, vos équipements..."
                      rows={4}
                      {...register('description')}
                      className="resize-none"
                    />
                    {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="capacity">Capacité (véhicules simultanés) *</Label>
                    <Select 
                      defaultValue="2"
                      onValueChange={(v) => setValue('capacity', parseInt(v))}
                    >
                      <SelectTrigger className="h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                          <SelectItem key={n} value={n.toString()}>
                            {n} véhicule{n > 1 ? 's' : ''}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Logo (optionnel)</Label>
                    <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        id="logo-upload"
                        onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
                      />
                      <label htmlFor="logo-upload" className="cursor-pointer">
                        <Upload className="mx-auto mb-2 text-muted-foreground" size={24} />
                        <p className="text-sm text-muted-foreground">
                          {logoFile ? logoFile.name : 'Cliquez pour ajouter votre logo'}
                        </p>
                      </label>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Step 4: Confirmation */}
              {step === 4 && (
                <div className="space-y-6">
                  <div className="bg-secondary/50 rounded-lg p-6 space-y-4">
                    <h4 className="font-medium">Récapitulatif</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">SIRET</p>
                        <p className="font-medium">{watch('siret')}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Société</p>
                        <p className="font-medium">{watch('companyName')}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Adresse</p>
                        <p className="font-medium">{watch('streetNumber')} {watch('streetName')}</p>
                        <p className="font-medium">{watch('postalCode')} {watch('city')}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Contact</p>
                        <p className="font-medium">{watch('phone')}</p>
                        <p className="font-medium">{watch('email')}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                      Votre demande sera examinée sous 24 à 48 heures ouvrées. Vous recevrez un email de confirmation dès validation.
                    </p>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="terms"
                      onCheckedChange={(checked) => setValue('acceptTerms', checked === true)}
                    />
                    <label htmlFor="terms" className="text-sm text-muted-foreground leading-relaxed cursor-pointer">
                      J'accepte les <a href="#" className="text-primary underline">conditions générales d'utilisation</a> et la <a href="#" className="text-primary underline">politique de confidentialité</a> de FIXIO.
                    </label>
                  </div>
                  {errors.acceptTerms && <p className="text-sm text-destructive">{errors.acceptTerms.message}</p>}
                </div>
              )}
              
              {/* Navigation Buttons */}
              <div className="flex justify-between pt-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={prevStep}
                  disabled={step === 1}
                  className="gap-2"
                >
                  <ArrowLeft size={16} />
                  Retour
                </Button>
                
                {step < 4 ? (
                  <Button type="button" onClick={nextStep} className="gap-2">
                    Continuer
                    <ArrowRight size={16} />
                  </Button>
                ) : (
                  <Button type="submit" disabled={isSubmitting} className="gap-2">
                    {isSubmitting ? 'Envoi...' : 'Valider mon inscription'}
                    <CheckCircle2 size={16} />
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
        
        <p className="text-center text-sm text-muted-foreground mt-6">
          Besoin d'aide ? <a href="mailto:support@fixio.fr" className="text-primary underline">support@fixio.fr</a>
        </p>
      </div>
    </div>
  )
}