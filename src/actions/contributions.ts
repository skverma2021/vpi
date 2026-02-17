'use server'

import prisma from '@/lib/prisma'
import { contributionSchema, ContributionInput, ContributionQuery, contributionQuerySchema } from '@/lib/schemas'
import { revalidatePath } from 'next/cache'

export async function getContributions(query?: ContributionQuery) {
  try {
    const validatedQuery = query ? contributionQuerySchema.parse(query) : {}
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {}
    
    if (validatedQuery.unitId) {
      where.unitId = validatedQuery.unitId
    }
    
    if (validatedQuery.blockId) {
      where.unit = { blockId: validatedQuery.blockId }
    }
    
    if (validatedQuery.year && validatedQuery.month) {
      where.OR = [
        {
          AND: [
            { fromYear: { lte: validatedQuery.year } },
            { toYear: { gte: validatedQuery.year } },
            { fromMonth: { lte: validatedQuery.month } },
            { toMonth: { gte: validatedQuery.month } }
          ]
        }
      ]
    } else if (validatedQuery.year) {
      where.OR = [
        { fromYear: validatedQuery.year },
        { toYear: validatedQuery.year }
      ]
    }
    
    const contributions = await prisma.contribution.findMany({
      where,
      include: {
        unit: {
          include: {
            block: true
          }
        }
      },
      orderBy: [
        { transactionDateTime: 'desc' }
      ]
    })
    
    return { success: true, data: contributions }
  } catch (error) {
    console.error('Error fetching contributions:', error)
    return { success: false, error: 'Failed to fetch contributions' }
  }
}

export async function getContributionById(id: number) {
  try {
    const contribution = await prisma.contribution.findUnique({
      where: { id },
      include: {
        unit: {
          include: {
            block: true,
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
    return { success: true, data: contribution }
  } catch (error) {
    console.error('Error fetching contribution:', error)
    return { success: false, error: 'Failed to fetch contribution' }
  }
}

export async function createContribution(input: ContributionInput) {
  try {
    const validatedData = contributionSchema.parse(input)
    
    const contribution = await prisma.contribution.create({
      data: {
        unitId: validatedData.unitId,
        transactionId: validatedData.transactionId,
        transactionDateTime: validatedData.transactionDateTime,
        fromMonth: validatedData.fromMonth,
        fromYear: validatedData.fromYear,
        toMonth: validatedData.toMonth,
        toYear: validatedData.toYear,
        amt: validatedData.amt,
        depositedBy: validatedData.depositedBy,
        depositorMobile: BigInt(validatedData.depositorMobile)
      }
    })
    
    revalidatePath('/contributions')
    return { success: true, data: contribution }
  } catch (error) {
    console.error('Error creating contribution:', error)
    return { success: false, error: 'Failed to create contribution' }
  }
}

export async function updateContribution(id: number, input: ContributionInput) {
  try {
    const validatedData = contributionSchema.parse(input)
    
    const contribution = await prisma.contribution.update({
      where: { id },
      data: {
        unitId: validatedData.unitId,
        transactionId: validatedData.transactionId,
        transactionDateTime: validatedData.transactionDateTime,
        fromMonth: validatedData.fromMonth,
        fromYear: validatedData.fromYear,
        toMonth: validatedData.toMonth,
        toYear: validatedData.toYear,
        amt: validatedData.amt,
        depositedBy: validatedData.depositedBy,
        depositorMobile: BigInt(validatedData.depositorMobile)
      }
    })
    
    revalidatePath('/contributions')
    return { success: true, data: contribution }
  } catch (error) {
    console.error('Error updating contribution:', error)
    return { success: false, error: 'Failed to update contribution' }
  }
}

export async function deleteContribution(id: number) {
  try {
    await prisma.contribution.delete({
      where: { id }
    })
    revalidatePath('/contributions')
    return { success: true }
  } catch (error) {
    console.error('Error deleting contribution:', error)
    return { success: false, error: 'Failed to delete contribution' }
  }
}

// Get payment status for all units for a specific month/year
export async function getPaymentStatus(year: number, month: number) {
  try {
    const units = await prisma.unit.findMany({
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
        contributions: {
          where: {
            OR: [
              {
                AND: [
                  { fromYear: { lte: year } },
                  { toYear: { gte: year } },
                ]
              }
            ]
          }
        }
      },
      orderBy: [
        { block: { description: 'asc' } },
        { description: 'asc' }
      ]
    })
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const paymentStatus = units.map((unit: any) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const isPaid = unit.contributions.some((c: any) => {
        const fromDate = new Date(c.fromYear, c.fromMonth - 1)
        const toDate = new Date(c.toYear, c.toMonth - 1)
        const checkDate = new Date(year, month - 1)
        return checkDate >= fromDate && checkDate <= toDate
      })
      
      return {
        unitId: unit.id,
        unitDescription: unit.description,
        blockName: unit.block.description,
        owner: unit.owners[0]?.individual 
          ? `${unit.owners[0].individual.fName} ${unit.owners[0].individual.sName}`
          : 'N/A',
        resident: unit.residents[0]?.individual
          ? `${unit.residents[0].individual.fName} ${unit.residents[0].individual.sName}`
          : 'N/A',
        isPaid,
        sqFt: unit.sqFt
      }
    })
    
    return { success: true, data: paymentStatus }
  } catch (error) {
    console.error('Error fetching payment status:', error)
    return { success: false, error: 'Failed to fetch payment status' }
  }
}

// Get contribution summary by block for a specific month/year
export async function getContributionSummary(year: number, month: number) {
  try {
    const blocks = await prisma.block.findMany({
      include: {
        units: {
          include: {
            contributions: {
              where: {
                OR: [
                  {
                    AND: [
                      { fromYear: { lte: year } },
                      { toYear: { gte: year } },
                    ]
                  }
                ]
              }
            }
          }
        }
      }
    })
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const summary = blocks.map((block: any) => {
      const totalUnits = block.units.length
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const paidUnits = block.units.filter((unit: any) => 
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        unit.contributions.some((c: any) => {
          const fromDate = new Date(c.fromYear, c.fromMonth - 1)
          const toDate = new Date(c.toYear, c.toMonth - 1)
          const checkDate = new Date(year, month - 1)
          return checkDate >= fromDate && checkDate <= toDate
        })
      ).length
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const totalCollected = block.units.reduce((sum: number, unit: any) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const contribution = unit.contributions.find((c: any) => {
          const fromDate = new Date(c.fromYear, c.fromMonth - 1)
          const toDate = new Date(c.toYear, c.toMonth - 1)
          const checkDate = new Date(year, month - 1)
          return checkDate >= fromDate && checkDate <= toDate
        })
        return sum + (contribution ? Number(contribution.amt) : 0)
      }, 0)
      
      return {
        blockId: block.id,
        blockName: block.description,
        totalUnits,
        paidUnits,
        unpaidUnits: totalUnits - paidUnits,
        collectionRate: totalUnits > 0 ? ((paidUnits / totalUnits) * 100).toFixed(1) : '0',
        totalCollected
      }
    })
    
    return { success: true, data: summary }
  } catch (error) {
    console.error('Error fetching contribution summary:', error)
    return { success: false, error: 'Failed to fetch contribution summary' }
  }
}
