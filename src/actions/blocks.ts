'use server'

import prisma from '@/lib/prisma'
import { blockSchema, BlockInput } from '@/lib/schemas'
import { revalidatePath } from 'next/cache'

export async function getBlocks() {
  try {
    const blocks = await prisma.block.findMany({
      include: {
        _count: {
          select: { units: true }
        }
      },
      orderBy: { description: 'asc' }
    })
    return { success: true, data: blocks }
  } catch (error) {
    console.error('Error fetching blocks:', error)
    return { success: false, error: 'Failed to fetch blocks' }
  }
}

export async function getBlockById(id: number) {
  try {
    const block = await prisma.block.findUnique({
      where: { id },
      include: {
        units: {
          include: {
            owners: {
              where: { toDt: null },
              include: { individual: true }
            },
            residents: {
              where: { toDt: null },
              include: { individual: true }
            }
          }
        }
      }
    })
    return { success: true, data: block }
  } catch (error) {
    console.error('Error fetching block:', error)
    return { success: false, error: 'Failed to fetch block' }
  }
}

export async function createBlock(input: BlockInput) {
  try {
    const validatedData = blockSchema.parse(input)
    const block = await prisma.block.create({
      data: {
        description: validatedData.description
      }
    })
    revalidatePath('/blocks')
    return { success: true, data: block }
  } catch (error) {
    console.error('Error creating block:', error)
    return { success: false, error: 'Failed to create block' }
  }
}

export async function updateBlock(id: number, input: BlockInput) {
  try {
    const validatedData = blockSchema.parse(input)
    const block = await prisma.block.update({
      where: { id },
      data: {
        description: validatedData.description
      }
    })
    revalidatePath('/blocks')
    return { success: true, data: block }
  } catch (error) {
    console.error('Error updating block:', error)
    return { success: false, error: 'Failed to update block' }
  }
}

export async function deleteBlock(id: number) {
  try {
    await prisma.block.delete({
      where: { id }
    })
    revalidatePath('/blocks')
    return { success: true }
  } catch (error) {
    console.error('Error deleting block:', error)
    return { success: false, error: 'Failed to delete block' }
  }
}
