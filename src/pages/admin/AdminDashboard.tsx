import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ShieldAlert, Users, Building2, CheckCircle2, XCircle, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

export function AdminDashboard() {
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
          { label: 'Utilisateurs', value: '1,284', icon: Users, color: 'text-blue-600' },
          { label: 'Professionnels', value: '156', icon: Building2, color: 'text-primary' },
          { label: 'En attente', value: '12', icon: ShieldAlert, color: 'text-orange-600' },
          { label: 'RDV Total', value: '4,560', icon: CheckCircle2, color: 'text-green-600' },
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
            <Input className="pl-10 rounded-xl" placeholder="Rechercher un garage..." />
          </div>
        </div>

        <Card className="rounded-[2rem] overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="font-bold">Établissement</TableHead>
                <TableHead className="font-bold">Contact</TableHead>
                <TableHead className="font-bold">Ville</TableHead>
                <TableHead className="font-bold">Date d'inscription</TableHead>
                <TableHead className="text-right font-bold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                { name: 'Auto Méca Plus', email: 'contact@automeca.fr', city: 'Lyon', date: '10/01/2026' },
                { name: 'Garage de la Paix', email: 'paix@garage.com', city: 'Marseille', date: '09/01/2026' },
                { name: 'Expert Carrosserie', email: 'info@expert-car.fr', city: 'Bordeaux', date: '08/01/2026' },
              ].map((pro, i) => (
                <TableRow key={i}>
                  <TableCell className="font-bold">{pro.name}</TableCell>
                  <TableCell className="text-muted-foreground">{pro.email}</TableCell>
                  <TableCell>{pro.city}</TableCell>
                  <TableCell>{pro.date}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" className="text-green-600 hover:bg-green-50 rounded-lg">
                        <CheckCircle2 size={18} />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10 rounded-lg">
                        <XCircle size={18} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  )
}
