'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { createContribution } from '@/actions/contributions'
import { toast } from 'sonner'
import { getCurrentMonth, getCurrentYear, getMonthName } from '@/lib/utils'

interface Unit {
  id: number
  description: string
  block: {
    id: number
    description: string
  }
}

interface ContributionFormProps {
  units: Unit[]
}

const months = Array.from({ length: 12 }, (_, i) => ({
  value: i + 1,
  label: getMonthName(i + 1)
}))

const years = Array.from({ length: 10 }, (_, i) => ({
  value: getCurrentYear() - 2 + i,
  label: String(getCurrentYear() - 2 + i)
}))

export function ContributionForm({ units }: ContributionFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    unitId: '',
    transactionId: '',
    transactionDateTime: new Date().toISOString().slice(0, 16),
    fromMonth: String(getCurrentMonth()),
    fromYear: String(getCurrentYear()),
    toMonth: String(getCurrentMonth()),
    toYear: String(getCurrentYear()),
    amt: '',
    depositedBy: '',
    depositorMobile: ''
  })

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await createContribution({
        unitId: Number(formData.unitId),
        transactionId: formData.transactionId,
        transactionDateTime: new Date(formData.transactionDateTime),
        fromMonth: Number(formData.fromMonth),
        fromYear: Number(formData.fromYear),
        toMonth: Number(formData.toMonth),
        toYear: Number(formData.toYear),
        amt: Number(formData.amt),
        depositedBy: formData.depositedBy,
        depositorMobile: Number(formData.depositorMobile)
      })

      if (result.success) {
        toast.success('Payment recorded successfully')
        router.push('/contributions')
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
  const groupedUnits = units.reduce((acc, unit) => {
    const blockName = unit.block.description
    if (!acc[blockName]) {
      acc[blockName] = []
    }
    acc[blockName].push(unit)
    return acc
  }, {} as Record<string, Unit[]>)

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Unit Selection */}
      <div className="space-y-2">
        <Label htmlFor="unitId">Unit *</Label>
        <Select
          value={formData.unitId}
          onValueChange={(value) => handleChange('unitId', value)}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a unit" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(groupedUnits).map(([blockName, blockUnits]) => (
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

      {/* Transaction Details */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="transactionId">Transaction ID *</Label>
          <Input
            id="transactionId"
            value={formData.transactionId}
            onChange={(e) => handleChange('transactionId', e.target.value)}
            placeholder="e.g., TXN123456"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="transactionDateTime">Transaction Date & Time *</Label>
          <Input
            id="transactionDateTime"
            type="datetime-local"
            value={formData.transactionDateTime}
            onChange={(e) => handleChange('transactionDateTime', e.target.value)}
            required
          />
        </div>
      </div>

      {/* Period From */}
      <div className="space-y-2">
        <Label>Contribution Period</Label>
        <div className="grid grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">From Month</Label>
            <Select
              value={formData.fromMonth}
              onValueChange={(value) => handleChange('fromMonth', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {months.map((month) => (
                  <SelectItem key={month.value} value={String(month.value)}>
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">From Year</Label>
            <Select
              value={formData.fromYear}
              onValueChange={(value) => handleChange('fromYear', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year.value} value={String(year.value)}>
                    {year.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">To Month</Label>
            <Select
              value={formData.toMonth}
              onValueChange={(value) => handleChange('toMonth', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {months.map((month) => (
                  <SelectItem key={month.value} value={String(month.value)}>
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">To Year</Label>
            <Select
              value={formData.toYear}
              onValueChange={(value) => handleChange('toYear', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year.value} value={String(year.value)}>
                    {year.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Amount */}
      <div className="space-y-2">
        <Label htmlFor="amt">Amount (INR) *</Label>
        <Input
          id="amt"
          type="number"
          step="0.01"
          min="0"
          value={formData.amt}
          onChange={(e) => handleChange('amt', e.target.value)}
          placeholder="e.g., 5000.00"
          required
        />
      </div>

      {/* Depositor Details */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="depositedBy">Deposited By *</Label>
          <Input
            id="depositedBy"
            value={formData.depositedBy}
            onChange={(e) => handleChange('depositedBy', e.target.value)}
            placeholder="Name of person depositing"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="depositorMobile">Depositor Mobile *</Label>
          <Input
            id="depositorMobile"
            type="tel"
            pattern="[0-9]{10}"
            value={formData.depositorMobile}
            onChange={(e) => handleChange('depositorMobile', e.target.value)}
            placeholder="10 digit mobile number"
            required
          />
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex gap-4 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading} className="flex-1">
          {isLoading ? 'Recording...' : 'Record Payment'}
        </Button>
      </div>
    </form>
  )
}
