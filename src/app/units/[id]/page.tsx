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
import { Separator } from '@/components/ui/separator'
import { getUnitById } from '@/actions/units'
import Link from 'next/link'
import { ArrowLeft, Home, User, Users, Calendar, IndianRupee } from 'lucide-react'
import { notFound } from 'next/navigation'
import { formatPhoneNumber } from '@/lib/utils'

interface UnitDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function UnitDetailPage({ params }: UnitDetailPageProps) {
  const { id } = await params
  const unitId = parseInt(id, 10)
  
  if (isNaN(unitId)) {
    notFound()
  }

  const result = await getUnitById(unitId)
  
  if (!result.success || !result.data) {
    notFound()
  }

  const unit = result.data
  const currentOwner = unit.owners.find((o: { toDt: Date | null }) => o.toDt === null)
  const currentResident = unit.residents.find((r: { toDt: Date | null }) => r.toDt === null)

  return (
    <div className="min-h-screen bg-background">
      <MainNav />
      <main className="container py-6">
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <Link href="/units">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                <Home className="h-8 w-8" />
                {unit.description}
              </h1>
              <p className="text-muted-foreground">
                <Link href={`/blocks/${unit.block.id}`} className="hover:underline">
                  {unit.block.description}
                </Link>
                {' '}&bull; {unit.sqFt} sq.ft
              </p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Current Owner Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Current Owner
                </CardTitle>
              </CardHeader>
              <CardContent>
                {currentOwner?.individual ? (
                  <div className="space-y-2">
                    <Link href={`/individuals/${currentOwner.individual.id}`} className="text-lg font-medium hover:underline">
                      {currentOwner.individual.fName} {currentOwner.individual.mName ? `${currentOwner.individual.mName} ` : ''}{currentOwner.individual.sName}
                    </Link>
                    <p className="text-sm text-muted-foreground">
                      {currentOwner.individual.eMail}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatPhoneNumber(currentOwner.individual.mobile)}
                    </p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Since {new Date(currentOwner.fromDt).toLocaleDateString()}
                    </p>
                  </div>
                ) : (
                  <p className="text-muted-foreground">No owner assigned</p>
                )}
              </CardContent>
            </Card>

            {/* Current Resident Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Current Resident
                </CardTitle>
              </CardHeader>
              <CardContent>
                {currentResident?.individual ? (
                  <div className="space-y-2">
                    <Link href={`/individuals/${currentResident.individual.id}`} className="text-lg font-medium hover:underline">
                      {currentResident.individual.fName} {currentResident.individual.mName ? `${currentResident.individual.mName} ` : ''}{currentResident.individual.sName}
                    </Link>
                    <p className="text-sm text-muted-foreground">
                      {currentResident.individual.eMail}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatPhoneNumber(currentResident.individual.mobile)}
                    </p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Since {new Date(currentResident.fromDt).toLocaleDateString()}
                    </p>
                  </div>
                ) : (
                  <p className="text-muted-foreground">No resident assigned</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Ownership History */}
          <Card>
            <CardHeader>
              <CardTitle>Ownership History</CardTitle>
              <CardDescription>Past and present owners of this unit</CardDescription>
            </CardHeader>
            <CardContent>
              {unit.owners.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Owner</TableHead>
                      <TableHead>From</TableHead>
                      <TableHead>To</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {unit.owners.map((owner: any) => (
                      <TableRow key={owner.id}>
                        <TableCell>
                          <Link href={`/individuals/${owner.individual.id}`} className="hover:underline">
                            {owner.individual.fName} {owner.individual.sName}
                          </Link>
                        </TableCell>
                        <TableCell>{new Date(owner.fromDt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          {owner.toDt ? new Date(owner.toDt).toLocaleDateString() : '-'}
                        </TableCell>
                        <TableCell>
                          <Badge variant={owner.toDt ? 'secondary' : 'default'}>
                            {owner.toDt ? 'Past' : 'Current'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-muted-foreground">No ownership records.</p>
              )}
            </CardContent>
          </Card>

          {/* Residence History */}
          <Card>
            <CardHeader>
              <CardTitle>Residence History</CardTitle>
              <CardDescription>Past and present residents of this unit</CardDescription>
            </CardHeader>
            <CardContent>
              {unit.residents.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Resident</TableHead>
                      <TableHead>From</TableHead>
                      <TableHead>To</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {unit.residents.map((resident: any) => (
                      <TableRow key={resident.id}>
                        <TableCell>
                          <Link href={`/individuals/${resident.individual.id}`} className="hover:underline">
                            {resident.individual.fName} {resident.individual.sName}
                          </Link>
                        </TableCell>
                        <TableCell>{new Date(resident.fromDt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          {resident.toDt ? new Date(resident.toDt).toLocaleDateString() : '-'}
                        </TableCell>
                        <TableCell>
                          <Badge variant={resident.toDt ? 'secondary' : 'default'}>
                            {resident.toDt ? 'Past' : 'Current'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-muted-foreground">No residence records.</p>
              )}
            </CardContent>
          </Card>

          {/* Contribution History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IndianRupee className="h-5 w-5" />
                Contribution History
              </CardTitle>
              <CardDescription>Payment records for this unit</CardDescription>
            </CardHeader>
            <CardContent>
              {unit.contributions.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Period</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Deposited By</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {unit.contributions.map((contribution: any) => (
                      <TableRow key={contribution.id}>
                        <TableCell className="font-mono text-sm">{contribution.transactionId}</TableCell>
                        <TableCell>{new Date(contribution.transactionDateTime).toLocaleDateString()}</TableCell>
                        <TableCell>
                          {contribution.fromMonth}/{contribution.fromYear} - {contribution.toMonth}/{contribution.toYear}
                        </TableCell>
                        <TableCell>₹{Number(contribution.amt).toLocaleString()}</TableCell>
                        <TableCell>{contribution.depositedBy}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-muted-foreground">No contribution records.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
