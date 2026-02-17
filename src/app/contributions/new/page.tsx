import { MainNav } from '@/components/main-nav'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getUnits } from '@/actions/units'
import { ContributionForm } from '@/components/contributions/contribution-form'

export default async function NewContributionPage() {
  const result = await getUnits()
  const units = result.success ? result.data : []

  return (
    <div className="min-h-screen bg-background">
      <MainNav />
      <main className="container py-6 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Record Payment</CardTitle>
            <CardDescription>
              Record a new contribution payment for a unit
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ContributionForm units={units || []} />
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
