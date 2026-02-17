'use server'

import prisma from '@/lib/prisma'
import { individualSchema, IndividualInput } from '@/lib/schemas'
import { revalidatePath } from 'next/cache'

export async function getIndividuals() {
  try {
    const individuals = await prisma.individual.findMany({
      include: {
        ownedUnits: {
          where: { toDt: null },
          include: { unit: { include: { block: true } } }
        },
        residedUnits: {
          where: { toDt: null },
          include: { unit: { include: { block: true } } }
        }
      },
      orderBy: [
        { sName: 'asc' },
        { fName: 'asc' }
      ]
    })
    return { success: true, data: individuals }
  } catch (error) {
    console.error('Error fetching individuals:', error)
    return { success: false, error: 'Failed to fetch individuals' }
  }
}

export async function getIndividualById(id: number) {
  try {
    const individual = await prisma.individual.findUnique({
      where: { id },
      include: {
        ownedUnits: {
          include: { unit: { include: { block: true } } },
          orderBy: { fromDt: 'desc' }
        },
        residedUnits: {
          include: { unit: { include: { block: true } } },
          orderBy: { fromDt: 'desc' }
        }
      }
    })
    return { success: true, data: individual }
  } catch (error) {
    console.error('Error fetching individual:', error)
    return { success: false, error: 'Failed to fetch individual' }
  }
}

export async function createIndividual(input: IndividualInput) {
  try {
    const validatedData = individualSchema.parse(input)
    const individual = await prisma.individual.create({
      data: {
        fName: validatedData.fName,
        mName: validatedData.mName,
        sName: validatedData.sName,
        eMail: validatedData.eMail,
        mobile: BigInt(validatedData.mobile),
        gender: validatedData.gender,
        altMobile: validatedData.altMobile ? BigInt(validatedData.altMobile) : null
      }
    })
    revalidatePath('/individuals')
    return { success: true, data: individual }
  } catch (error) {
    console.error('Error creating individual:', error)
    return { success: false, error: 'Failed to create individual' }
  }
}

export async function updateIndividual(id: number, input: IndividualInput) {
  try {
    const validatedData = individualSchema.parse(input)
    const individual = await prisma.individual.update({
      where: { id },
      data: {
        fName: validatedData.fName,
        mName: validatedData.mName,
        sName: validatedData.sName,
        eMail: validatedData.eMail,
        mobile: BigInt(validatedData.mobile),
        gender: validatedData.gender,
        altMobile: validatedData.altMobile ? BigInt(validatedData.altMobile) : null
      }
    })
    revalidatePath('/individuals')
    return { success: true, data: individual }
  } catch (error) {
    console.error('Error updating individual:', error)
    return { success: false, error: 'Failed to update individual' }
  }
}

export async function deleteIndividual(id: number) {
  try {
    await prisma.individual.delete({
      where: { id }
    })
    revalidatePath('/individuals')
    return { success: true }
  } catch (error) {
    console.error('Error deleting individual:', error)
    return { success: false, error: 'Failed to delete individual' }
  }
}

export async function searchIndividuals(query: string) {
  try {
    const individuals = await prisma.individual.findMany({
      where: {
        OR: [
          { fName: { contains: query, mode: 'insensitive' } },
          { sName: { contains: query, mode: 'insensitive' } },
          { eMail: { contains: query, mode: 'insensitive' } }
        ]
      },
      take: 10,
      orderBy: [
        { sName: 'asc' },
        { fName: 'asc' }
      ]
    })
    return { success: true, data: individuals }
  } catch (error) {
    console.error('Error searching individuals:', error)
    return { success: false, error: 'Failed to search individuals' }
  }
}
