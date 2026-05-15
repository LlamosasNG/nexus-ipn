import api from '@/lib/axios'
import type { DigitalBookPayload, DigitalBookResource } from '@/types'
import { isAxiosError } from 'axios'

type DigitalResourceParams = {
  subjectId: number
  resourceType: 'digital-book'
}

type SaveDigitalBookSectionParams = DigitalResourceParams & {
  formData: DigitalBookPayload
}

type SaveDigitalBookSectionResponse = {
  message: string
  data: DigitalBookResource
}

export async function getDigitalResource({
  subjectId,
  resourceType,
}: DigitalResourceParams) {
  try {
    const { data } = await api.get<DigitalBookResource>(
      `/digital-resources/${subjectId}/${resourceType}`
    )
    return data
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      if (error.response.status === 404) return null
      throw new Error(error.response.data.error)
    }
    return null
  }
}

export async function getMyDigitalResources() {
  try {
    const { data } = await api.get<DigitalBookResource[]>('/digital-resources')
    return data
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error)
    }
    return []
  }
}

export async function saveDigitalBookSection({
  subjectId,
  resourceType,
  formData,
}: SaveDigitalBookSectionParams) {
  try {
    const { data } = await api.post<SaveDigitalBookSectionResponse>(
      `/digital-resources/${subjectId}/${resourceType}`,
      formData
    )
    return data
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error)
    }
  }
}

export async function deleteDigitalResource({
  subjectId,
  resourceType,
  password,
}: DigitalResourceParams & { password: string }) {
  try {
    const { data } = await api.delete<{ message: string }>(
      `/digital-resources/${subjectId}/${resourceType}`,
      {
        data: { password },
      }
    )
    return data.message
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error)
    }
  }
}
