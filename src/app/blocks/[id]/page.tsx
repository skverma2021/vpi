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
import { getBlockById } from '@/actions/blocks'
import Link from 'next/link'
import { ArrowLeft, Building2, Home } from 'lucide-react'
import { notFound } from 'next/navigation'

interface BlockDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function BlockDetailPage({ params }: BlockDetailPageProps) {
  const { id } = await params
  const blockId = parseInt(id, 10)
  
  if (isNaN(blockId)) {
    notFound()
  }

  const result = await getBlockById(blockId)
  
  if (!result.success || !result.data) {
    notFound()
  }

  const block = result.data

  return (
    <div className="min-h-screen bg-background">
      <MainNav />
      <main className="container py-6">
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <Link href="/blocks">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                <Building2 className="h-8 w-8" />
                {block.description}
              </h1>
              <p className="text-muted-foreground">
                {block.units.length} units in this block
              </p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Units in {block.description}</CardTitle>
              <CardDescription>
                All units and their current occupants
              </CardDescription>
            </CardHeader>
            <CardContent>
              {block.units.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Unit</TableHead>
                      <TableHead>Area (sq.ft)</TableHead>
                      <TableHead>Current Owner</TableHead>
                      <TableHead>Current Resident</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {block.units.map((unit: any) => {
                      const currentOwner = unit.owners.find((o: { toDt: Date | null }) => o.toDt === null)
                      const currentResident = unit.residents.find((r: { toDt: Date | null }) => r.toDt === null)

                      return (
                        <TableRow key={unit.id}>
                          <TableCell className="font-medium">
                            <Link href={`/units/${unit.id}`} className="hover:underline flex items-center gap-2">
                              <Home className="h-4 w-4" />
                              {unit.description}
                            </Link>
                          </TableCell>
                          <TableCell>{unit.sqFt}</TableCell>
                          <TableCell>
                            {currentOwner?.individual ? (
                              <Link href={`/individuals/${currentOwner.individual.id}`} className="hover:underline">
                                {currentOwner.individual.fName} {currentOwner.individual.sName}
                              </Link>
                            ) : (
                              <span className="text-muted-foreground">Not assigned</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {currentResident?.individual ? (
                              <Link href={`/individuals/${currentResident.individual.id}`} className="hover:underline">
                                {currentResident.individual.fName} {currentResident.individual.sName}
                              </Link>
                            ) : (
                              <span className="text-muted-foreground">Not assigned</span>
                            )}
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-muted-foreground">No units in this block yet.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
