import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Mail, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

export function VerifyEmail() {
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 bg-secondary/30">
      <Card className="w-full max-w-md shadow-xl border-none text-center">
        <CardHeader className="space-y-4">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Mail className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Vérifiez votre boîte mail</CardTitle>
          <CardDescription className="text-base">
            Un lien de confirmation a été envoyé à votre adresse email. Veuillez cliquer sur ce lien pour activer votre compte.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Vous n'avez rien reçu ? Vérifiez vos courriers indésirables ou réessayez plus tard.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button variant="outline" className="w-full" asChild>
            <Link to="/auth?mode=login">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour à la connexion
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
