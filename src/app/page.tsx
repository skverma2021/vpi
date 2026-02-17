import { MainNav } from '@/components/main-nav'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getContributionSummary, getPaymentStatus } from '@/actions/contributions'
import { getBlocks } from '@/actions/blocks'
import { getCurrentMonth, getCurrentYear, formatCurrency, getMonthName } from '@/lib/utils'
import Link from 'next/link'
import { Building2, Users, CreditCard, Home } from 'lucide-react'

export default async function Dashboard() {
  const currentMonth = getCurrentMonth()
  const currentYear = getCurrentYear()
  
  const [summaryResult, blocksResult, paymentStatusResult] = await Promise.all([
    getContributionSummary(currentYear, currentMonth),
    getBlocks(),
    getPaymentStatus(currentYear, currentMonth)
  ])

  const summary = summaryResult.success ? summaryResult.data : []
  const blocks = blocksResult.success ? blocksResult.data : []
  const paymentStatus = paymentStatusResult.success ? paymentStatusResult.data : []

  const totalUnits = summary?.reduce((acc, b) => acc + b.totalUnits, 0) || 0
  const totalPaid = summary?.reduce((acc, b) => acc + b.paidUnits, 0) || 0
  const totalCollected = summary?.reduce((acc, b) => acc + b.totalCollected, 0) || 0
  const overallRate = totalUnits > 0 ? ((totalPaid / totalUnits) * 100).toFixed(1) : '0'

  return (
    <div className="min-h-screen bg-background">
      <MainNav />
      <main className="container py-6">
        <div className="flex flex-col gap-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              VPI Society Management - {getMonthName(currentMonth)} {currentYear}
            </p>
          </div>

          {/* Overview Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Blocks</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{blocks?.length || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Mist, Breeze, Dew
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Units</CardTitle>
                <Home className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalUnits}</div>
                <p className="text-xs text-muted-foreground">
                  Across all blocks
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Collection Rate</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{overallRate}%</div>
                <p className="text-xs text-muted-foreground">
                  {totalPaid} of {totalUnits} units paid
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Collected</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(totalCollected)}</div>
                <p className="text-xs text-muted-foreground">
                  This month
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Block-wise Summary */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {summary && summary.length > 0 ? (
              summary.map((block) => (
                <Card key={block.blockId}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {block.blockName}
                      <Badge variant={Number(block.collectionRate) >= 80 ? 'default' : Number(block.collectionRate) >= 50 ? 'secondary' : 'destructive'}>
                        {block.collectionRate}%
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      {block.paidUnits} of {block.totalUnits} units paid
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Collected:</span>
                        <span className="font-medium">{formatCurrency(block.totalCollected)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Unpaid Units:</span>
                        <span className="font-medium text-destructive">{block.unpaidUnits}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="col-span-full">
                <CardHeader>
                  <CardTitle>No Data Available</CardTitle>
                  <CardDescription>
                    Start by adding blocks and units to see the contribution summary.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4">
                    <Link href="/blocks" className="text-primary hover:underline">
                      Add Blocks
                    </Link>
                    <Link href="/units" className="text-primary hover:underline">
                      Add Units
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and navigation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Link
                  href="/contributions/new"
                  className="flex items-center gap-2 rounded-lg border p-4 hover:bg-accent transition-colors"
                >
                  <CreditCard className="h-5 w-5" />
                  <div>
                    <div className="font-medium">Record Payment</div>
                    <div className="text-xs text-muted-foreground">Add new contribution</div>
                  </div>
                </Link>
                <Link
                  href="/contributions"
                  className="flex items-center gap-2 rounded-lg border p-4 hover:bg-accent transition-colors"
                >
                  <CreditCard className="h-5 w-5" />
                  <div>
                    <div className="font-medium">View All Payments</div>
                    <div className="text-xs text-muted-foreground">Contribution history</div>
                  </div>
                </Link>
                <Link
                  href="/units"
                  className="flex items-center gap-2 rounded-lg border p-4 hover:bg-accent transition-colors"
                >
                  <Home className="h-5 w-5" />
                  <div>
                    <div className="font-medium">Manage Units</div>
                    <div className="text-xs text-muted-foreground">View and edit units</div>
                  </div>
                </Link>
                <Link
                  href="/individuals"
                  className="flex items-center gap-2 rounded-lg border p-4 hover:bg-accent transition-colors"
                >
                  <Users className="h-5 w-5" />
                  <div>
                    <div className="font-medium">Manage Individuals</div>
                    <div className="text-xs text-muted-foreground">Owners & residents</div>
                  </div>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
