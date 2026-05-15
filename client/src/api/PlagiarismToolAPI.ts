import api from '@/lib/axios'
import { PlagiarismToolSchema } from '@/types'
import { isAxiosError } from 'axios'

export async function getPlagiarismTool(planningId: string) {
  try {
    const { data } = await api(`/plannings/${planningId}/plagiarism-tool`)
    const response = PlagiarismToolSchema.safeParse(data)
    if (response.success) {
      return response.data
    }
    console.error('PlagiarismTool validation errors:', response.error.issues)
    return null
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      if (error.response.status === 404) return null
      throw new Error(error.response.data.error)
    }
    return null
  }
}

export async function createOrUpdatePlagiarismTool({
  planningId,
  selectedTool,
}: {
  planningId: string
  selectedTool: 'ithenticate' | 'turnitin' | 'ninguna'
}) {
  try {
    const { data } = await api.post<{ message: string }>(
      `/plannings/${planningId}/plagiarism-tool`,
      { selectedTool }
    )
    return data.message
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error)
    }
  }
}
