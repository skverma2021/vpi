import { MainNav } from '@/components/main-nav'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getBlocks } from '@/actions/blocks'
import Link from 'next/link'
import { Plus, Building2 } from 'lucide-react'
import { BlockForm } from '@/components/blocks/block-form'

export default async function BlocksPage() {
  const result = await getBlocks()
  const blocks = result.success ? result.data : []

  return (
    <div className="min-h-screen bg-background">
      <MainNav />
      <main className="container py-6">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Blocks</h1>
              <p className="text-muted-foreground">
                Manage society blocks - Mist, Breeze, Dew
              </p>
            </div>
            <BlockForm />
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {blocks && blocks.length > 0 ? (
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              blocks.map((block: any) => (
                <Card key={block.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-5 w-5" />
                      {block.description}
                    </CardTitle>
                    <CardDescription>
                      {block._count.units} units
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link href={`/blocks/${block.id}`}>
                      <Button variant="outline" className="w-full">
                        View Details
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="col-span-full">
                <CardHeader>
                  <CardTitle>No Blocks Found</CardTitle>
                  <CardDescription>
                    Create your first block to get started.
                  </CardDescription>
                </CardHeader>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
