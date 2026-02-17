'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { assignResident } from '@/actions/unit-members'
import { toast } from 'sonner'
import { Plus, Home } from 'lucide-react'

interface Unit {
  id: number
  description: string
  block: {
    id: number
    description: string
  }
}

interface AssignResidencyFormProps {
  individualId: number
  units: Unit[]
}

export function AssignResidencyForm({ individualId, units }: AssignResidencyFormProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    unitId: '',
    fromDt: new Date().toISOString().split('T')[0]
  })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await assignResident({
        unitId: parseInt(formData.unitId, 10),
        indId: individualId,
        fromDt: new Date(formData.fromDt),
        toDt: null
      })

      if (result.success) {
        toast.success('Residency assigned successfully')
        setOpen(false)
        setFormData({
          unitId: '',
          fromDt: new Date().toISOString().split('T')[0]
        })
        router.refresh()
      } else {
        toast.error(result.error || 'Something went wrong')
      }
    } catch (error) {
      toast.error('An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  // Group units by block
  const unitsByBlock = units.reduce((acc, unit) => {
    const blockName = unit.block.description
    if (!acc[blockName]) {
      acc[blockName] = []
    }
    acc[blockName].push(unit)
    return acc
  }, {} as Record<string, Unit[]>)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Residency
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Home className="h-5 w-5" />
              Assign Residency
            </DialogTitle>
            <DialogDescription>
              Assign this individual as a resident of a unit.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="unitId" className="text-right">
                Unit
              </Label>
              <Select
                value={formData.unitId}
                onValueChange={(value) => setFormData(prev => ({ ...prev, unitId: value }))}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a unit" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(unitsByBlock).map(([blockName, blockUnits]) => (
                    <div key={blockName}>
                      <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
                        {blockName}
                      </div>
                      {blockUnits.map((unit) => (
                        <SelectItem key={unit.id} value={String(unit.id)}>
                          {unit.description}
                        </SelectItem>
                      ))}
                    </div>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fromDt" className="text-right">
                From Date
              </Label>
              <Input
                id="fromDt"
                type="date"
                value={formData.fromDt}
                onChange={(e) => setFormData(prev => ({ ...prev, fromDt: e.target.value }))}
                className="col-span-3"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !formData.unitId}>
              {isLoading ? 'Assigning...' : 'Assign Residency'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
