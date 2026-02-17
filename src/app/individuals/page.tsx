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
import { getIndividuals } from '@/actions/individuals'
import { formatPhoneNumber } from '@/lib/utils'
import Link from 'next/link'
import { Users } from 'lucide-react'
import { IndividualForm } from '@/components/individuals/individual-form'

export default async function IndividualsPage() {
  const result = await getIndividuals()
  const individuals = result.success ? result.data : []

  return (
    <div className="min-h-screen bg-background">
      <MainNav />
      <main className="container py-6">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Individuals</h1>
              <p className="text-muted-foreground">
                Manage owners and residents
              </p>
            </div>
            <IndividualForm />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>All Individuals</CardTitle>
              <CardDescription>
                {individuals?.length || 0} total individuals
              </CardDescription>
            </CardHeader>
            <CardContent>
              {individuals && individuals.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Mobile</TableHead>
                      <TableHead>Gender</TableHead>
                      <TableHead>Owned Units</TableHead>
                      <TableHead>Resided Units</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {individuals.map((individual: any) => (
                      <TableRow key={individual.id}>
                        <TableCell className="font-medium">
                          <Link href={`/individuals/${individual.id}`} className="hover:underline">
                            {individual.fName} {individual.mName ? `${individual.mName} ` : ''}{individual.sName}
                          </Link>
                        </TableCell>
                        <TableCell>{individual.eMail}</TableCell>
                        <TableCell>{formatPhoneNumber(individual.mobile)}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {individual.gender === 'M' ? 'Male' : 'Female'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {individual.ownedUnits.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {individual.ownedUnits.map((ownership: { unit: { id: number, description: string, block: { description: string } } }) => (
                                <Badge key={ownership.unit.id} variant="secondary" className="text-xs">
                                  {ownership.unit.block.description} - {ownership.unit.description}
                                </Badge>
                              ))}
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-sm">None</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {individual.residedUnits.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {individual.residedUnits.map((residency: { unit: { id: number, description: string, block: { description: string } } }) => (
                                <Badge key={residency.unit.id} variant="outline" className="text-xs">
                                  {residency.unit.block.description} - {residency.unit.description}
                                </Badge>
                              ))}
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-sm">None</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No individuals yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Add your first individual to get started.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
