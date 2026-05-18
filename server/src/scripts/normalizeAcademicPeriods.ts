import { db } from '@/config/db'
import Planning from '@/models/Planning'
import UserSubject from '@/models/UserSubject'
import { isAcademicPeriod, normalizeAcademicPeriod } from '@/utils/academicPeriod'
import colors from 'colors'

async function normalizeUserSubjectPeriods() {
  const userSubjects = await UserSubject.findAll({
    attributes: ['userId', 'subjectId', 'period'],
  })

  let updatedCount = 0

  for (const userSubject of userSubjects) {
    if (isAcademicPeriod(userSubject.period)) continue

    await UserSubject.update(
      { period: normalizeAcademicPeriod(userSubject.period) },
      {
        where: {
          userId: userSubject.userId,
          subjectId: userSubject.subjectId,
        },
      }
    )
    updatedCount++
  }

  console.log(colors.green(`user_subjects: ${updatedCount} registros actualizados`))
}

async function normalizePlanningPeriods() {
  const plannings = await Planning.findAll({
    attributes: ['id', 'period'],
  })

  let updatedCount = 0

  for (const planning of plannings) {
    if (isAcademicPeriod(planning.period)) continue

    await planning.update({ period: normalizeAcademicPeriod(planning.period) })
    updatedCount++
  }

  console.log(colors.green(`plannings: ${updatedCount} registros actualizados`))
}

async function normalizeAcademicPeriods() {
  try {
    await db.authenticate()

    await normalizeUserSubjectPeriods()
    await normalizePlanningPeriods()

    await db.close()
  } catch (error) {
    console.error(colors.red('Error normalizando períodos académicos:'), error)
    await db.close()
    process.exit(1)
  }
}

normalizeAcademicPeriods()
