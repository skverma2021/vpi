import { MainNav } from '@/components/main-nav'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { getContributions } from '@/actions/contributions'
import { formatCurrency, formatDate, getMonthName, formatPhoneNumber } from '@/lib/utils'
import Link from 'next/link'
import { Plus, CreditCard } from 'lucide-react'

export default async function ContributionsPage() {
  const result = await getContributions()
  const contributions = result.success ? result.data : []

  return (
    <div className="min-h-screen bg-background">
      <MainNav />
      <main className="container py-6">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Contributions</h1>
              <p className="text-muted-foreground">
                Manage and track unit contributions
              </p>
            </div>
            <Link href="/contributions/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Record Payment
              </Button>
            </Link>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>All Contributions</CardTitle>
              <CardDescription>
                {contributions?.length || 0} total contributions recorded
              </CardDescription>
            </CardHeader>
            <CardContent>
              {contributions && contributions.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Unit</TableHead>
                      <TableHead>Block</TableHead>
                      <TableHead>Period</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Deposited By</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {contributions.map((contribution: any) => (
                      <TableRow key={contribution.id}>
                        <TableCell className="font-medium">
                          {contribution.unit.description}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {contribution.unit.block.description}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {getMonthName(contribution.fromMonth)} {contribution.fromYear}
                          {(contribution.fromMonth !== contribution.toMonth || contribution.fromYear !== contribution.toYear) && (
                            <> - {getMonthName(contribution.toMonth)} {contribution.toYear}</>
                          )}
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatCurrency(Number(contribution.amt))}
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {contribution.transactionId}
                        </TableCell>
                        <TableCell>
                          {formatDate(contribution.transactionDateTime)}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {contribution.depositedBy}
                            <div className="text-muted-foreground text-xs">
                              {formatPhoneNumber(contribution.depositorMobile)}
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8">
                  <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No contributions yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start by recording your first payment.
                  </p>
                  <Link href="/contributions/new">
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Record Payment
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
