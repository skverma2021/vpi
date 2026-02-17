'use server'

import prisma from '@/lib/prisma'
import { unitSchema, UnitInput } from '@/lib/schemas'
import { revalidatePath } from 'next/cache'

export async function getUnits(blockId?: number) {
  try {
    const where = blockId ? { blockId } : {}
    
    const units = await prisma.unit.findMany({
      where,
      include: {
        block: true,
        owners: {
          where: { toDt: null },
          include: { individual: true }
        },
        residents: {
          where: { toDt: null },
          include: { individual: true }
        },
        _count: {
          select: { contributions: true }
        }
      },
      orderBy: [
        { block: { description: 'asc' } },
        { description: 'asc' }
      ]
    })
    return { success: true, data: units }
  } catch (error) {
    console.error('Error fetching units:', error)
    return { success: false, error: 'Failed to fetch units' }
  }
}

export async function getUnitById(id: number) {
  try {
    const unit = await prisma.unit.findUnique({
      where: { id },
      include: {
        block: true,
        owners: {
          include: { individual: true },
          orderBy: { fromDt: 'desc' }
        },
        residents: {
          include: { individual: true },
          orderBy: { fromDt: 'desc' }
        },
        contributions: {
          orderBy: { transactionDateTime: 'desc' }
        }
      }
    })
    return { success: true, data: unit }
  } catch (error) {
    console.error('Error fetching unit:', error)
    return { success: false, error: 'Failed to fetch unit' }
  }
}

export async function createUnit(input: UnitInput) {
  try {
    const validatedData = unitSchema.parse(input)
    const unit = await prisma.unit.create({
      data: {
        description: validatedData.description,
        blockId: validatedData.blockId,
        sqFt: validatedData.sqFt
      }
    })
    revalidatePath('/units')
    return { success: true, data: unit }
  } catch (error) {
    console.error('Error creating unit:', error)
    return { success: false, error: 'Failed to create unit' }
  }
}

export async function updateUnit(id: number, input: UnitInput) {
  try {
    const validatedData = unitSchema.parse(input)
    const unit = await prisma.unit.update({
      where: { id },
      data: {
        description: validatedData.description,
        blockId: validatedData.blockId,
        sqFt: validatedData.sqFt
      }
    })
    revalidatePath('/units')
    return { success: true, data: unit }
  } catch (error) {
    console.error('Error updating unit:', error)
    return { success: false, error: 'Failed to update unit' }
  }
}

export async function deleteUnit(id: number) {
  try {
    await prisma.unit.delete({
      where: { id }
    })
    revalidatePath('/units')
    return { success: true }
  } catch (error) {
    console.error('Error deleting unit:', error)
    return { success: false, error: 'Failed to delete unit' }
  }
}
