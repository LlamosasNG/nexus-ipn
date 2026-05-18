import api from '@/lib/axios'
import {
  DepartmentHeadDashboardSchema,
  DepartmentHeadPlanningDetailSchema,
  DepartmentHeadPlanningListResponseSchema,
  type DepartmentHeadPlanningReviewStatus,
} from '@/types'
import { isAxiosError } from 'axios'

export async function getDepartmentHeadDashboard() {
  try {
    const { data } = await api.get('/department-head/dashboard')
    const response = DepartmentHeadDashboardSchema.safeParse(data)

    if (response.success) {
      return response.data
    }
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error)
    }
  }
}

type DepartmentHeadPlanningListParams = {
  page?: number
  pageSize?: number
  search?: string
  teacherId?: string
  subjectId?: string
  academyId?: string
  period?: string
  status?: DepartmentHeadPlanningReviewStatus | ''
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

const cleanPlanningListParams = (params: DepartmentHeadPlanningListParams) =>
  Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== '')
  ) as DepartmentHeadPlanningListParams

export async function getDepartmentHeadPlannings(
  params: DepartmentHeadPlanningListParams
) {
  try {
    const { data } = await api.get('/department-head/plannings', {
      params: cleanPlanningListParams(params),
    })
    const response = DepartmentHeadPlanningListResponseSchema.safeParse(data)

    if (response.success) {
      return response.data
    }
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error)
    }
  }
}

export async function getDepartmentHeadPlanningById(planningId: number) {
  try {
    const { data } = await api.get(`/department-head/plannings/${planningId}`)
    const response = DepartmentHeadPlanningDetailSchema.safeParse(data)

    if (response.success) {
      return response.data
    }
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error)
    }
  }
}
