import api from '@/lib/axios'
import {
  PlanningDidacticOrganizationSchema,
  type PlanningDidacticOrganizationFormValues,
} from '@/types'
import { isAxiosError } from 'axios'

type CreateOrUpdateDidacticOrganization = {
  planningId: string
  formData: PlanningDidacticOrganizationFormValues
}

export async function getDidacticOrganization(planningId: string) {
  try {
    const { data } = await api(`/plannings/${planningId}/didactic-organization`)
    const response = PlanningDidacticOrganizationSchema.safeParse(data)
    if (response.success) {
      return response.data
    }
    console.error('DidacticOrganization validation errors:', response.error.issues)
    return null
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      if (error.response.status === 404) return null
      throw new Error(error.response.data.error)
    }
    return null
  }
}

export async function createOrUpdateDidacticOrganization({
  planningId,
  formData,
}: CreateOrUpdateDidacticOrganization) {
  try {
    const { data } = await api.post<{ message: string }>(
      `/plannings/${planningId}/didactic-organization`,
      formData
    )
    return data.message
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error)
    }
  }
}
