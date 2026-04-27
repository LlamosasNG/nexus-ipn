import api from '@/lib/axios'
import {
  TransversalAxisSchema,
  type TransversalAxisFormValues,
} from '@/types'
import { isAxiosError } from 'axios'

type CreateOrUpdateTransversalAxes = {
  planningId: string
  formData: TransversalAxisFormValues
}

export async function getTransversalAxes(planningId: string) {
  try {
    const { data } = await api(`/plannings/${planningId}/transversal-axes`)
    const response = TransversalAxisSchema.safeParse(data)
    if (response.success) {
      return response.data
    }
    console.error('TransversalAxis validation errors:', response.error.issues)
    return null
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error)
    }
    return null
  }
}

export async function createOrUpdateTransversalAxes({
  planningId,
  formData,
}: CreateOrUpdateTransversalAxes) {
  try {
    const { data } = await api.post<{ message: string }>(
      `/plannings/${planningId}/transversal-axes`,
      formData
    )
    return data.message
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error)
    }
  }
}