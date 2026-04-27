import api from '@/lib/axios'
import {
  ThematicUnitSchema,
  type ThematicUnitFormValues,
} from '@/types'
import { isAxiosError } from 'axios'

export async function getThematicUnits(planningId: string) {
  try {
    const { data } = await api(`/plannings/${planningId}/thematic-units`)
    const response = ThematicUnitSchema.array().safeParse(data)
    if (response.success) {
      return response.data
    }
    console.error('ThematicUnits validation errors:', response.error.issues)
    return []
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      if (error.response.status === 404) return []
      throw new Error(error.response.data.error)
    }
    return []
  }
}

export async function createThematicUnit({
  planningId,
  formData,
}: {
  planningId: string
  formData: ThematicUnitFormValues
}) {
  try {
    const { data } = await api.post<{ message: string }>(
      `/plannings/${planningId}/thematic-units`,
      formData
    )
    return data.message
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error)
    }
  }
}

export async function updateThematicUnit({
  planningId,
  unitId,
  formData,
}: {
  planningId: string
  unitId: number
  formData: Partial<ThematicUnitFormValues>
}) {
  try {
    const { data } = await api.put<{ message: string }>(
      `/plannings/${planningId}/thematic-units/${unitId}`,
      formData
    )
    return data.message
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error)
    }
  }
}

export async function deleteThematicUnit(planningId: string, unitId: number) {
  try {
    await api.delete(`/plannings/${planningId}/thematic-units/${unitId}`)
    return true
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error)
    }
    return false
  }
}

export async function reorderThematicUnits(planningId: string, orderedIds: number[]) {
  try {
    await api.put(`/plannings/${planningId}/thematic-units/reorder`, { orderedIds })
    return true
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error)
    }
    return false
  }
}
