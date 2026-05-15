import api from '@/lib/axios'
import {
  PlanningListSchema,
  PlanningSubjectDetailsSchema,
  type CreatePlanningData,
  type SubjectCard,
} from '@/types'
import { isAxiosError } from 'axios'

type PlanningAPIProps = {
  subjectId: SubjectCard['id']
  period: CreatePlanningData['period']
}

export async function createPlanning({ subjectId, period }: PlanningAPIProps) {
  try {
    const { data } = await api.post<{
      message: string
      data: {
        id: number
        status: string
      }
    }>(
      `/plannings/create/${subjectId}`,
      period
    )
    return data
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error)
    }
  }
}

export async function getPlannings() {
  try {
    const { data } = await api.get('/plannings')
    const response = PlanningListSchema.safeParse(data)
    if (response.success) {
      return response.data
    }
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error)
    }
  }
}

export async function getPlanningById(planningId: number) {
  try {
    const { data } = await api.get(`/plannings/${planningId}`)
    const response = PlanningSubjectDetailsSchema.safeParse(data)
    if (response.success) {
      return response.data
    }
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error)
    }
  }
}

export async function deletePlanning({
  planningId,
  password,
}: {
  planningId: number
  password: string
}) {
  try {
    const { data } = await api.delete<{ message: string }>(`/plannings/${planningId}`, {
      data: { password },
    })
    return data.message
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error)
    }
  }
}

export async function submitPlanning(planningId: number) {
  try {
    const { data } = await api.put<{
      message: string
      status: string
      submissionDate: string
    }>(`/plannings/${planningId}/submit`)
    return data
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error)
    }
  }
}
