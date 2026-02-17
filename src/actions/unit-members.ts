'use server'

import prisma from '@/lib/prisma'
import { unitOwnerSchema, unitResidentSchema, UnitOwnerInput, UnitResidentInput } from '@/lib/schemas'
import { revalidatePath } from 'next/cache'

// Unit Owners
export async function getUnitOwners(unitId?: number) {
  try {
    const where = unitId ? { unitId } : {}
    
    const owners = await prisma.unitOwner.findMany({
      where,
      include: {
        unit: { include: { block: true } },
        individual: true
      },
      orderBy: [
        { unit: { description: 'asc' } },
        { fromDt: 'desc' }
      ]
    })
    return { success: true, data: owners }
  } catch (error) {
    console.error('Error fetching unit owners:', error)
    return { success: false, error: 'Failed to fetch unit owners' }
  }
}

export async function getCurrentOwner(unitId: number) {
  try {
    const owner = await prisma.unitOwner.findFirst({
      where: {
        unitId,
        toDt: null
      },
      include: {
        individual: true
      }
    })
    return { success: true, data: owner }
  } catch (error) {
    console.error('Error fetching current owner:', error)
    return { success: false, error: 'Failed to fetch current owner' }
  }
}

export async function assignOwner(input: UnitOwnerInput) {
  try {
    const validatedData = unitOwnerSchema.parse(input)
    
    // Close any existing ownership for this unit
    await prisma.unitOwner.updateMany({
      where: {
        unitId: validatedData.unitId,
        toDt: null
      },
      data: {
        toDt: validatedData.fromDt
      }
    })
    
    // Create new ownership record
    const owner = await prisma.unitOwner.create({
      data: {
        unitId: validatedData.unitId,
        indId: validatedData.indId,
        fromDt: validatedData.fromDt,
        toDt: validatedData.toDt
      }
    })
    
    revalidatePath('/units')
    revalidatePath('/individuals')
    return { success: true, data: owner }
  } catch (error) {
    console.error('Error assigning owner:', error)
    return { success: false, error: 'Failed to assign owner' }
  }
}

export async function endOwnership(id: number, endDate: Date) {
  try {
    const owner = await prisma.unitOwner.update({
      where: { id },
      data: { toDt: endDate }
    })
    
    revalidatePath('/units')
    revalidatePath('/individuals')
    return { success: true, data: owner }
  } catch (error) {
    console.error('Error ending ownership:', error)
    return { success: false, error: 'Failed to end ownership' }
  }
}

// Unit Residents
export async function getUnitResidents(unitId?: number) {
  try {
    const where = unitId ? { unitId } : {}
    
    const residents = await prisma.unitResident.findMany({
      where,
      include: {
        unit: { include: { block: true } },
        individual: true
      },
      orderBy: [
        { unit: { description: 'asc' } },
        { fromDt: 'desc' }
      ]
    })
    return { success: true, data: residents }
  } catch (error) {
    console.error('Error fetching unit residents:', error)
    return { success: false, error: 'Failed to fetch unit residents' }
  }
}

export async function getCurrentResident(unitId: number) {
  try {
    const resident = await prisma.unitResident.findFirst({
      where: {
        unitId,
        toDt: null
      },
      include: {
        individual: true
      }
    })
    return { success: true, data: resident }
  } catch (error) {
    console.error('Error fetching current resident:', error)
    return { success: false, error: 'Failed to fetch current resident' }
  }
}

export async function assignResident(input: UnitResidentInput) {
  try {
    const validatedData = unitResidentSchema.parse(input)
    
    // Close any existing residency for this unit
    await prisma.unitResident.updateMany({
      where: {
        unitId: validatedData.unitId,
        toDt: null
      },
      data: {
        toDt: validatedData.fromDt
      }
    })
    
    // Create new residency record
    const resident = await prisma.unitResident.create({
      data: {
        unitId: validatedData.unitId,
        indId: validatedData.indId,
        fromDt: validatedData.fromDt,
        toDt: validatedData.toDt
      }
    })
    
    revalidatePath('/units')
    revalidatePath('/individuals')
    return { success: true, data: resident }
  } catch (error) {
    console.error('Error assigning resident:', error)
    return { success: false, error: 'Failed to assign resident' }
  }
}

export async function endResidency(id: number, endDate: Date) {
  try {
    const resident = await prisma.unitResident.update({
      where: { id },
      data: { toDt: endDate }
    })
    
    revalidatePath('/units')
    revalidatePath('/individuals')
    return { success: true, data: resident }
  } catch (error) {
    console.error('Error ending residency:', error)
    return { success: false, error: 'Failed to end residency' }
  }
}
