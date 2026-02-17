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
import { getUnits } from '@/actions/units'
import { getBlocks } from '@/actions/blocks'
import Link from 'next/link'
import { Plus, Home } from 'lucide-react'
import { UnitForm } from '@/components/units/unit-form'

export default async function UnitsPage() {
  const [unitsResult, blocksResult] = await Promise.all([
    getUnits(),
    getBlocks()
  ])

  const units = unitsResult.success ? unitsResult.data : []
  const blocks = blocksResult.success ? blocksResult.data : []

  return (
    <div className="min-h-screen bg-background">
      <MainNav />
      <main className="container py-6">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Units</h1>
              <p className="text-muted-foreground">
                Manage units across all blocks
              </p>
            </div>
            <UnitForm blocks={blocks || []} />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>All Units</CardTitle>
              <CardDescription>
                {units?.length || 0} total units
              </CardDescription>
            </CardHeader>
            <CardContent>
              {units && units.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Unit</TableHead>
                      <TableHead>Block</TableHead>
                      <TableHead>Area (sq.ft)</TableHead>
                      <TableHead>Current Owner</TableHead>
                      <TableHead>Current Resident</TableHead>
                      <TableHead>Contributions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {units.map((unit: any) => {
                      const currentOwner = unit.owners.find((o: { toDt: Date | null }) => o.toDt === null)
                      const currentResident = unit.residents.find((r: { toDt: Date | null }) => r.toDt === null)

                      return (
                        <TableRow key={unit.id}>
                          <TableCell className="font-medium">
                            <Link href={`/units/${unit.id}`} className="hover:underline">
                              {unit.description}
                            </Link>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {unit.block.description}
                            </Badge>
                          </TableCell>
                          <TableCell>{unit.sqFt}</TableCell>
                          <TableCell>
                            {currentOwner?.individual ? (
                              <span>
                                {currentOwner.individual.fName} {currentOwner.individual.sName}
                              </span>
                            ) : (
                              <span className="text-muted-foreground">Not assigned</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {currentResident?.individual ? (
                              <span>
                                {currentResident.individual.fName} {currentResident.individual.sName}
                              </span>
                            ) : (
                              <span className="text-muted-foreground">Not assigned</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge variant={unit._count.contributions > 0 ? 'default' : 'secondary'}>
                              {unit._count.contributions}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8">
                  <Home className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No units yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Create your first unit to get started.
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
