import { MainNav } from '@/components/main-nav'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { getIndividualById } from '@/actions/individuals'
import { getUnits } from '@/actions/units'
import Link from 'next/link'
import { ArrowLeft, User, Home, Building2, Calendar, Mail, Phone } from 'lucide-react'
import { notFound } from 'next/navigation'
import { formatPhoneNumber } from '@/lib/utils'
import { AssignResidencyForm } from '@/components/individuals/assign-residency-form'
import { AssignOwnershipForm } from '@/components/individuals/assign-ownership-form'

interface IndividualDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function IndividualDetailPage({ params }: IndividualDetailPageProps) {
  const { id } = await params
  const individualId = parseInt(id, 10)
  
  if (isNaN(individualId)) {
    notFound()
  }

  const [individualResult, unitsResult] = await Promise.all([
    getIndividualById(individualId),
    getUnits()
  ])
  
  if (!individualResult.success || !individualResult.data) {
    notFound()
  }

  const individual = individualResult.data
  const units = unitsResult.success ? unitsResult.data : []
  
  const currentOwnedUnits = individual.ownedUnits.filter((o: { toDt: Date | null }) => o.toDt === null)
  const currentResidedUnits = individual.residedUnits.filter((r: { toDt: Date | null }) => r.toDt === null)

  return (
    <div className="min-h-screen bg-background">
      <MainNav />
      <main className="container py-6">
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <Link href="/individuals">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                <User className="h-8 w-8" />
                {individual.fName} {individual.mName ? `${individual.mName} ` : ''}{individual.sName}
              </h1>
              <div className="flex items-center gap-4 text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  {individual.eMail}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="h-4 w-4" />
                  {formatPhoneNumber(individual.mobile)}
                </span>
                <Badge variant="outline">
                  {individual.gender === 'M' ? 'Male' : 'Female'}
                </Badge>
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Current Ownership */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Owned Units
                  </CardTitle>
                  <CardDescription>
                    {currentOwnedUnits.length} unit(s) currently owned
                  </CardDescription>
                </div>
                <AssignOwnershipForm individualId={individual.id} units={units || []} />
              </CardHeader>
              <CardContent>
                {currentOwnedUnits.length > 0 ? (
                  <div className="space-y-3">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {currentOwnedUnits.map((ownership: any) => (
                      <div key={ownership.id} className="flex items-center justify-between p-3 rounded-lg border">
                        <div>
                          <Link href={`/units/${ownership.unit.id}`} className="font-medium hover:underline">
                            {ownership.unit.block.description} - {ownership.unit.description}
                          </Link>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Since {new Date(ownership.fromDt).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge>Current</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">Does not own any units</p>
                )}
              </CardContent>
            </Card>

            {/* Current Residence */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Home className="h-5 w-5" />
                    Residing In
                  </CardTitle>
                  <CardDescription>
                    {currentResidedUnits.length} unit(s) currently residing
                  </CardDescription>
                </div>
                <AssignResidencyForm individualId={individual.id} units={units || []} />
              </CardHeader>
              <CardContent>
                {currentResidedUnits.length > 0 ? (
                  <div className="space-y-3">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {currentResidedUnits.map((residency: any) => (
                      <div key={residency.id} className="flex items-center justify-between p-3 rounded-lg border">
                        <div>
                          <Link href={`/units/${residency.unit.id}`} className="font-medium hover:underline">
                            {residency.unit.block.description} - {residency.unit.description}
                          </Link>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Since {new Date(residency.fromDt).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge>Current</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">Not residing in any unit</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Ownership History */}
          <Card>
            <CardHeader>
              <CardTitle>Ownership History</CardTitle>
              <CardDescription>All ownership records for this individual</CardDescription>
            </CardHeader>
            <CardContent>
              {individual.ownedUnits.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Unit</TableHead>
                      <TableHead>Block</TableHead>
                      <TableHead>From</TableHead>
                      <TableHead>To</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {individual.ownedUnits.map((ownership: any) => (
                      <TableRow key={ownership.id}>
                        <TableCell>
                          <Link href={`/units/${ownership.unit.id}`} className="hover:underline">
                            {ownership.unit.description}
                          </Link>
                        </TableCell>
                        <TableCell>
                          <Link href={`/blocks/${ownership.unit.block.id}`} className="hover:underline">
                            {ownership.unit.block.description}
                          </Link>
                        </TableCell>
                        <TableCell>{new Date(ownership.fromDt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          {ownership.toDt ? new Date(ownership.toDt).toLocaleDateString() : '-'}
                        </TableCell>
                        <TableCell>
                          <Badge variant={ownership.toDt ? 'secondary' : 'default'}>
                            {ownership.toDt ? 'Past' : 'Current'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-muted-foreground">No ownership history.</p>
              )}
            </CardContent>
          </Card>

          {/* Residence History */}
          <Card>
            <CardHeader>
              <CardTitle>Residence History</CardTitle>
              <CardDescription>All residence records for this individual</CardDescription>
            </CardHeader>
            <CardContent>
              {individual.residedUnits.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Unit</TableHead>
                      <TableHead>Block</TableHead>
                      <TableHead>From</TableHead>
                      <TableHead>To</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {individual.residedUnits.map((residency: any) => (
                      <TableRow key={residency.id}>
                        <TableCell>
                          <Link href={`/units/${residency.unit.id}`} className="hover:underline">
                            {residency.unit.description}
                          </Link>
                        </TableCell>
                        <TableCell>
                          <Link href={`/blocks/${residency.unit.block.id}`} className="hover:underline">
                            {residency.unit.block.description}
                          </Link>
                        </TableCell>
                        <TableCell>{new Date(residency.fromDt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          {residency.toDt ? new Date(residency.toDt).toLocaleDateString() : '-'}
                        </TableCell>
                        <TableCell>
                          <Badge variant={residency.toDt ? 'secondary' : 'default'}>
                            {residency.toDt ? 'Past' : 'Current'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-muted-foreground">No residence history.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
