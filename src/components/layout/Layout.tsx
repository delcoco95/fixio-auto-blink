import { Navbar } from './Navbar'

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 pt-16">
        {children}
      </main>
      <footer className="border-t py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 font-bold text-xl mb-4">
                <div className="w-6 h-6 bg-primary rounded flex items-center justify-center text-white text-xs">
                  FIX
                </div>
                <span>FIXIO</span>
              </div>
              <p className="text-sm text-muted-foreground">
                La plateforme de réservation d'entretien auto ultra-claire et rapide.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Plateforme</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Trouver un pro</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Nos services</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Avis clients</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Professionnels</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Devenir partenaire</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Dashboard Pro</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Tarifs</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Légal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">CGU</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Confidentialité</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Mentions légales</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} FIXIO. Tous droits réservés.
          </div>
        </div>
      </footer>
    </div>
  )
}
