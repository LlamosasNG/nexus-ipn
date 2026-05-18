const ACADEMIC_PERIOD_PATTERN = /^\d{4}-[12]$/

export const getCurrentAcademicPeriod = (date = new Date()) => {
  const year = date.getFullYear()
  const month = date.getMonth()

  if (month < 6) {
    return `${year}-2`
  }

  return `${year + 1}-1`
}

export const isAcademicPeriod = (period: string) =>
  ACADEMIC_PERIOD_PATTERN.test(period)

export const normalizeAcademicPeriod = (period?: string | null) => {
  if (!period) return getCurrentAcademicPeriod()

  if (isAcademicPeriod(period)) {
    return period
  }

  if (/^\d{4}$/.test(period)) {
    return `${period}-2`
  }

  return period
}
