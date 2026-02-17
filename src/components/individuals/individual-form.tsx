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
import { createIndividual, updateIndividual } from '@/actions/individuals'
import { toast } from 'sonner'
import { Plus, Pencil } from 'lucide-react'

interface IndividualFormProps {
  individual?: {
    id: number
    fName: string
    mName: string | null
    sName: string
    eMail: string
    mobile: bigint
    gender: string
    altMobile: bigint | null
  }
}

export function IndividualForm({ individual }: IndividualFormProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    fName: individual?.fName || '',
    mName: individual?.mName || '',
    sName: individual?.sName || '',
    eMail: individual?.eMail || '',
    mobile: individual?.mobile ? String(individual.mobile) : '',
    gender: individual?.gender || '',
    altMobile: individual?.altMobile ? String(individual.altMobile) : ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const isEditing = !!individual

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const data = {
        fName: formData.fName,
        mName: formData.mName || null,
        sName: formData.sName,
        eMail: formData.eMail,
        mobile: Number(formData.mobile),
        gender: formData.gender as 'M' | 'F',
        altMobile: formData.altMobile ? Number(formData.altMobile) : null
      }

      const result = isEditing
        ? await updateIndividual(individual.id, data)
        : await createIndividual(data)

      if (result.success) {
        toast.success(isEditing ? 'Individual updated successfully' : 'Individual created successfully')
        setOpen(false)
        setFormData({
          fName: '', mName: '', sName: '', eMail: '', mobile: '', gender: '', altMobile: ''
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
            Add Individual
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Individual' : 'Add New Individual'}</DialogTitle>
            <DialogDescription>
              {isEditing ? 'Update the individual details.' : 'Create a new individual (owner/resident).'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fName" className="text-right">
                First Name
              </Label>
              <Input
                id="fName"
                value={formData.fName}
                onChange={(e) => setFormData(prev => ({ ...prev, fName: e.target.value }))}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="mName" className="text-right">
                Middle Name
              </Label>
              <Input
                id="mName"
                value={formData.mName}
                onChange={(e) => setFormData(prev => ({ ...prev, mName: e.target.value }))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="sName" className="text-right">
                Surname
              </Label>
              <Input
                id="sName"
                value={formData.sName}
                onChange={(e) => setFormData(prev => ({ ...prev, sName: e.target.value }))}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="eMail" className="text-right">
                Email
              </Label>
              <Input
                id="eMail"
                type="email"
                value={formData.eMail}
                onChange={(e) => setFormData(prev => ({ ...prev, eMail: e.target.value }))}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="mobile" className="text-right">
                Mobile
              </Label>
              <Input
                id="mobile"
                type="tel"
                pattern="[0-9]{10}"
                value={formData.mobile}
                onChange={(e) => setFormData(prev => ({ ...prev, mobile: e.target.value }))}
                placeholder="10 digit number"
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="gender" className="text-right">
                Gender
              </Label>
              <Select
                value={formData.gender}
                onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}
                required
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="M">Male</SelectItem>
                  <SelectItem value="F">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="altMobile" className="text-right">
                Alt. Mobile
              </Label>
              <Input
                id="altMobile"
                type="tel"
                pattern="[0-9]{10}"
                value={formData.altMobile}
                onChange={(e) => setFormData(prev => ({ ...prev, altMobile: e.target.value }))}
                placeholder="Optional"
                className="col-span-3"
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
