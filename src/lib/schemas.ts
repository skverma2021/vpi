import { z } from 'zod'

// Block schema
export const blockSchema = z.object({
  id: z.number().optional(),
  description: z.string().min(1).max(100),
})

export type BlockInput = z.infer<typeof blockSchema>

// Individual schema
export const individualSchema = z.object({
  id: z.number().optional(),
  fName: z.string().min(1).max(50),
  mName: z.string().max(50).optional().nullable(),
  sName: z.string().min(1).max(50),
  eMail: z.string().email().max(100),
  mobile: z.number().int().min(1000000000).max(9999999999),
  gender: z.enum(['M', 'F']),
  altMobile: z.number().int().min(1000000000).max(9999999999).optional().nullable(),
})

export type IndividualInput = z.infer<typeof individualSchema>

// Unit schema
export const unitSchema = z.object({
  id: z.number().optional(),
  description: z.string().min(1).max(100),
  blockId: z.number().int().positive(),
  sqFt: z.number().int().positive(),
})

export type UnitInput = z.infer<typeof unitSchema>

// Contribution schema
export const contributionSchema = z.object({
  id: z.number().optional(),
  unitId: z.number().int().positive(),
  transactionId: z.string().min(1).max(100),
  transactionDateTime: z.coerce.date(),
  fromMonth: z.number().int().min(1).max(12),
  fromYear: z.number().int().min(2000).max(2100),
  toMonth: z.number().int().min(1).max(12),
  toYear: z.number().int().min(2000).max(2100),
  amt: z.number().positive(),
  depositedBy: z.string().min(1).max(100),
  depositorMobile: z.number().int().min(1000000000).max(9999999999),
})

export type ContributionInput = z.infer<typeof contributionSchema>

// UnitOwner schema
export const unitOwnerSchema = z.object({
  id: z.number().optional(),
  unitId: z.number().int().positive(),
  indId: z.number().int().positive(),
  fromDt: z.coerce.date(),
  toDt: z.coerce.date().optional().nullable(),
})

export type UnitOwnerInput = z.infer<typeof unitOwnerSchema>

// UnitResident schema
export const unitResidentSchema = z.object({
  id: z.number().optional(),
  unitId: z.number().int().positive(),
  indId: z.number().int().positive(),
  fromDt: z.coerce.date(),
  toDt: z.coerce.date().optional().nullable(),
})

export type UnitResidentInput = z.infer<typeof unitResidentSchema>

// Query schemas for filtering
export const contributionQuerySchema = z.object({
  unitId: z.number().int().positive().optional(),
  blockId: z.number().int().positive().optional(),
  year: z.number().int().min(2000).max(2100).optional(),
  month: z.number().int().min(1).max(12).optional(),
})

export type ContributionQuery = z.infer<typeof contributionQuerySchema>
