import api from '@/lib/axios'
import { ReferenceSchema } from '@/types'
import { isAxiosError } from 'axios'

type SyncReferencePayload = {
  id?: number
  text: string
  thematicUnits: boolean[]
  types: {
    B: boolean
    S: boolean
    I: boolean
    C: boolean
  }
}

export async function getReferences(planningId: string) {
  try {
    const { data } = await api(`/plannings/${planningId}/references`)
    const response = ReferenceSchema.array().safeParse(data)
    if (response.success) {
      return response.data
    }
    console.error('References validation errors:', response.error.issues)
    return []
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      if (error.response.status === 404) return []
      throw new Error(error.response.data.error)
    }
    return []
  }
}

export async function syncReferences({
  planningId,
  references,
}: {
  planningId: string
  references: SyncReferencePayload[]
}) {
  try {
    const { data } = await api.put<{ message: string }>(
      `/plannings/${planningId}/references/sync`,
      { references }
    )
    return data.message
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error)
    }
  }
}
