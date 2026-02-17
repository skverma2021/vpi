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
import { createUnit, updateUnit } from '@/actions/units'
import { toast } from 'sonner'
import { Plus, Pencil } from 'lucide-react'

interface Block {
  id: number
  description: string
}

interface UnitFormProps {
  blocks: Block[]
  unit?: {
    id: number
    description: string
    blockId: number
    sqFt: number
  }
}

export function UnitForm({ blocks, unit }: UnitFormProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    description: unit?.description || '',
    blockId: unit?.blockId ? String(unit.blockId) : '',
    sqFt: unit?.sqFt ? String(unit.sqFt) : ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const isEditing = !!unit

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const data = {
        description: formData.description,
        blockId: Number(formData.blockId),
        sqFt: Number(formData.sqFt)
      }

      const result = isEditing
        ? await updateUnit(unit.id, data)
        : await createUnit(data)

      if (result.success) {
        toast.success(isEditing ? 'Unit updated successfully' : 'Unit created successfully')
        setOpen(false)
        setFormData({ description: '', blockId: '', sqFt: '' })
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {isEditing ? (
          <Button variant="ghost" size="icon">
            <Pencil className="h-4 w-4" />
          </Button>
        ) : (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Unit
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Unit' : 'Add New Unit'}</DialogTitle>
            <DialogDescription>
              {isEditing ? 'Update the unit details.' : 'Create a new unit.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Name
              </Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="e.g., A-101"
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="blockId" className="text-right">
                Block
              </Label>
              <Select
                value={formData.blockId}
                onValueChange={(value) => setFormData(prev => ({ ...prev, blockId: value }))}
                required
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a block" />
                </SelectTrigger>
                <SelectContent>
                  {blocks.map((block) => (
                    <SelectItem key={block.id} value={String(block.id)}>
                      {block.description}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="sqFt" className="text-right">
                Area (sq.ft)
              </Label>
              <Input
                id="sqFt"
                type="number"
                min="1"
                value={formData.sqFt}
                onChange={(e) => setFormData(prev => ({ ...prev, sqFt: e.target.value }))}
                placeholder="e.g., 1200"
                className="col-span-3"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : isEditing ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
