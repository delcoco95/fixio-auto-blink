import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ShieldAlert, Users, Building2, CheckCircle2, XCircle, Search, Trash2, Ban } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { blink } from '@/lib/blink'
import { toast } from 'react-hot-toast'

export function AdminDashboard() {
  const [stats, setStats] = useState({
    clients: 0,
    professionals: 0,
    pending: 0,
    appointments: 0
  })
  const [pendingPros, setPendingPros] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const [users, pros, appointments] = await Promise.all([
        blink.db.users.list(),
        blink.db.professionals.list(),
        blink.db.appointments.list()
      ])

      const clientsCount = users.filter((u: any) => u.role === 'client').length
      const prosCount = pros.filter((p: any) => p.status === 'active').length
      const pendingCount = pros.filter((p: any) => p.status === 'pending').length

      setStats({
        clients: clientsCount,
        professionals: prosCount,
        pending: pendingCount,
        appointments: appointments.length
      })

      setPendingPros(pros.filter((p: any) => p.status === 'pending'))
    } catch (error) {
      console.error('Error fetching admin data:', error)
      toast.error('Erreur lors de la récupération des données')
    } finally {
      setIsLoading(false)
    }
  }

  const handleApprove = async (proId: string) => {
    try {
      await blink.db.professionals.update(proId, {
        status: 'active',
        is_active: 1,
        is_verified: 1,
        verified_at: new Date().toISOString()
      })
      toast.success('Professionnel approuvé')
      fetchData()
    } catch (error) {
      toast.error('Erreur lors de l\'approbation')
    }
  }

  const handleReject = async (proId: string) => {
    try {
      await blink.db.professionals.update(proId, {
        status: 'rejected'
      })
      toast.success('Professionnel rejeté')
      fetchData()
    } catch (error) {
      toast.error('Erreur lors du rejet')
    }
  }

  const filteredPros = pendingPros.filter(pro => 
    pro.name.toLowerCase().includes(search.toLowerCase()) ||
    pro.city?.toLowerCase().includes(search.toLowerCase()) ||
    pro.siret?.includes(search)
  )

  return (
    <div className="container mx-auto px-4 py-12 space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <Badge className="bg-red-100 text-red-700 border-none mb-4">Administration FIXIO</Badge>
          <h1 className="text-4xl font-bold tracking-tight">Console de Contrôle</h1>
          <p className="text-muted-foreground text-lg">Gérez les utilisateurs, modérez les avis et validez les partenaires.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Utilisateurs', value: stats.clients.toLocaleString(), icon: Users, color: 'text-blue-600' },
          { label: 'Professionnels', value: stats.professionals.toLocaleString(), icon: Building2, color: 'text-primary' },
          { label: 'En attente', value: stats.pending.toLocaleString(), icon: ShieldAlert, color: 'text-orange-600' },
          { label: 'RDV Total', value: stats.appointments.toLocaleString(), icon: CheckCircle2, color: 'text-green-600' },
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

      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-2xl font-bold">Professionnels en attente de validation</h2>
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <Input 
              className="pl-10 rounded-xl" 
              placeholder="Rechercher par nom, ville ou SIRET..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <Card className="rounded-[2rem] overflow-hidden border-none shadow-lg">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="font-bold">Établissement</TableHead>
                <TableHead className="font-bold">SIRET</TableHead>
                <TableHead className="font-bold">Ville</TableHead>
                <TableHead className="font-bold">Date d'inscription</TableHead>
                <TableHead className="text-right font-bold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPros.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                    Aucun professionnel en attente de validation.
                  </TableCell>
                </TableRow>
              ) : (
                filteredPros.map((pro) => (
                  <TableRow key={pro.id}>
                    <TableCell>
                      <div className="font-bold">{pro.name}</div>
                      <div className="text-xs text-muted-foreground">{pro.email || pro.phone}</div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{pro.siret}</TableCell>
                    <TableCell>{pro.city || pro.address}</TableCell>
                    <TableCell>{new Date(pro.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-green-600 hover:bg-green-50 rounded-lg"
                          onClick={() => handleApprove(pro.id)}
                        >
                          <CheckCircle2 size={18} />
                          <span className="ml-2 hidden sm:inline">Approuver</span>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-destructive hover:bg-destructive/10 rounded-lg"
                          onClick={() => handleReject(pro.id)}
                        >
                          <XCircle size={18} />
                          <span className="ml-2 hidden sm:inline">Rejeter</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  )
}
