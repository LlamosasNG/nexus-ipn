import api from '@/lib/axios'
import {
  SessionActivitySchema,
  type SessionActivityFormValues,
} from '@/types'
import { isAxiosError } from 'axios'

export async function getSessionsByUnit(planningId: string, unitId: number) {
  try {
    const { data } = await api(
      `/plannings/${planningId}/thematic-units/${unitId}/sessions`
    )
    const response = SessionActivitySchema.array().safeParse(data)
    if (response.success) {
      return response.data
    }
    console.error('Sessions validation errors:', response.error.issues)
    return []
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error)
    }
    return []
  }
}

export async function createSession({
  planningId,
  unitId,
  formData,
}: {
  planningId: string
  unitId: number
  formData: SessionActivityFormValues
}) {
  try {
    const { data } = await api.post<{ message: string }>(
      `/plannings/${planningId}/thematic-units/${unitId}/sessions`,
      formData
    )
    return data.message
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error)
    }
  }
}

export async function updateSession({
  planningId,
  unitId,
  sessionId,
  formData,
}: {
  planningId: string
  unitId: number
  sessionId: number
  formData: Partial<SessionActivityFormValues>
}) {
  try {
    const { data } = await api.put<{ message: string }>(
      `/plannings/${planningId}/thematic-units/${unitId}/sessions/${sessionId}`,
      formData
    )
    return data.message
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error)
    }
  }
}

export async function deleteSession(
  planningId: string,
  unitId: number,
  sessionId: number
) {
  try {
    await api.delete(
      `/plannings/${planningId}/thematic-units/${unitId}/sessions/${sessionId}`
    )
    return true
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error)
    }
    return false
  }
}
