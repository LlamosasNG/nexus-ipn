import { db } from '@/config/db'
import GeneralData from '@/models/GeneralData'
import Planning, { PlanningStatus } from '@/models/Planning'
import PlanningDidacticOrganization from '@/models/PlanningDidacticOrganization'
import PlagiarismTool from '@/models/PlagiarismTool'
import Reference from '@/models/Reference'
import Subject from '@/models/Subject'
import ThematicUnit from '@/models/ThematicUnit'
import TransversalAxis from '@/models/TransversalAxis'
import User from '@/models/User'
import UserSubject from '@/models/UserSubject'
import { getCurrentAcademicPeriod } from '@/utils/academicPeriod'
import colors from 'colors'
import { Transaction } from 'sequelize'

const MAX_PLANNINGS_PER_TEACHER = 3

const statusSequence = [
  PlanningStatus.DRAFT,
  PlanningStatus.SENT,
  PlanningStatus.APPROVED,
  PlanningStatus.REJECTED,
]

type AssignedSubject = Subject & {
  UserSubject?: UserSubject
}

const getSubmissionDate = (status: PlanningStatus) =>
  status === PlanningStatus.DRAFT ? null : new Date()

const getFeedback = (status: PlanningStatus) => {
  if (status === PlanningStatus.APPROVED) {
    return 'Planeación validada para fines de demostración.'
  }

  if (status === PlanningStatus.REJECTED) {
    return 'Revisar congruencia entre actividades, evidencias e instrumentos de evaluación.'
  }

  return null
}

const buildSessionsPerSemester = () => ({
  classroom: 18,
  laboratory: 0,
  clinic: 0,
  other: 0,
  total: 18,
})

const normalizeModality = (modality: string) => {
  const trimmedModality = modality.trim()

  if (
    trimmedModality === 'Escolarizada' ||
    trimmedModality === 'No escolarizada' ||
    trimmedModality === 'Mixta'
  ) {
    return trimmedModality
  }

  return 'Escolarizada'
}

const createPlanningChildren = async ({
  planning,
  subject,
  teacher,
  transaction,
}: {
  planning: Planning
  subject: Subject
  teacher: User
  transaction: Transaction
}) => {
  await GeneralData.findOrCreate({
    where: { planningId: planning.id },
    defaults: {
      planningId: planning.id,
      academicUnit: subject.academicUnit,
      program: subject.studyPlanNames?.join(', ') || 'Programa académico',
      learningUnit: subject.name,
      semester: subject.semester,
      areaFormation: subject.areaFormation,
      modality: normalizeModality(subject.modality),
      unitType: subject.type || [],
      creditsTepic: subject.creditsTepic,
      creditsSatca: 0,
      academy: subject.academy?.name || 'Academia',
      weeksPerSemester: subject.weeksPerSemester,
      sessionsPerSemester: buildSessionsPerSemester(),
      hoursPerSemester: subject.hoursPerSemester,
      schoolPeriod: planning.period,
      groups: ['1HM1'],
      teacherName: teacher.name,
    },
    transaction,
  })

  await TransversalAxis.findOrCreate({
    where: { planningId: planning.id },
    defaults: {
      planningId: planning.id,
      antecedentes:
        'Se consideran conocimientos previos relacionados con la unidad de aprendizaje.',
      laterales:
        'Se vincula con unidades de aprendizaje del mismo periodo escolar.',
      subsecuentes:
        'Aporta bases para el desarrollo de competencias en periodos posteriores.',
      socialCommitment:
        'Integra criterios de responsabilidad social y sustentabilidad en el análisis de casos.',
      genderPerspective:
        'Promueve un ambiente de aprendizaje incluyente y libre de violencia.',
      internationalization:
        'Incorpora referencias y criterios académicos de alcance internacional.',
    },
    transaction,
  })

  await PlanningDidacticOrganization.findOrCreate({
    where: { planningId: planning.id },
    defaults: {
      planningId: planning.id,
      learningUnit: subject.name,
      generalPurpose: subject.generalObjective || `Analizar los contenidos de ${subject.name}.`,
      learningStrategy:
        'Aprendizaje basado en problemas, revisión guiada de recursos y resolución de casos.',
      teachingMethods:
        'Exposición dialogada, discusión dirigida, trabajo colaborativo y retroalimentación.',
    },
    transaction,
  })

  const subjectUnits = subject.units?.length
    ? subject.units.slice(0, 2)
    : [
        {
          name: `Fundamentos de ${subject.name}`,
          competency: `Reconoce los fundamentos de ${subject.name}.`,
        },
        {
          name: `Aplicaciones de ${subject.name}`,
          competency: `Aplica los contenidos de ${subject.name} en casos académicos.`,
        },
      ]

  for (const [index, unit] of subjectUnits.entries()) {
    await ThematicUnit.findOrCreate({
      where: {
        planningId: planning.id,
        order: index,
      },
      defaults: {
        planningId: planning.id,
        order: index,
        name: unit.name,
        competenceObjective: unit.competency,
        developmentPeriod: `${planning.period} - Unidad ${index + 1}`,
        weeklyHours: {
          classroom: 3,
          laboratory: 0,
          workshop: 0,
          clinic: 0,
          other: 1,
          total: 4,
        },
        totalSessions: 4,
        evaluationPeriod: planning.period,
        expectedLearnings: [
          'Identifica conceptos clave de la unidad temática.',
          'Relaciona los contenidos con situaciones académicas contextualizadas.',
        ],
        precisions:
          'Planeación generada automáticamente para poblar datos de demostración.',
      },
      transaction,
    })
  }

  await Reference.findOrCreate({
    where: {
      planningId: planning.id,
      text: `${subject.name}. (2026). Material académico de apoyo. Instituto Politécnico Nacional.`,
    },
    defaults: {
      planningId: planning.id,
      text: `${subject.name}. (2026). Material académico de apoyo. Instituto Politécnico Nacional.`,
      thematicUnits: [true, true, false, false, false, false],
      types: {
        B: true,
        S: false,
        I: false,
        C: false,
      },
    },
    transaction,
  })

  await PlagiarismTool.findOrCreate({
    where: { planningId: planning.id },
    defaults: {
      planningId: planning.id,
      selectedTool: 'ninguna',
    },
    transaction,
  })
}

async function seedSamplePlannings() {
  const transaction = await db.transaction()

  try {
    await db.authenticate()

    const currentPeriod = getCurrentAcademicPeriod()
    const teachers = await User.findAll({
      where: { role: 'Docente' },
      include: [
        {
          model: Subject,
          through: {
            attributes: ['period', 'active'],
          },
          include: ['academy'],
        },
      ],
      order: [['id', 'ASC']],
      transaction,
    })

    let createdCount = 0
    let skippedCount = 0

    for (const [teacherIndex, teacher] of teachers.entries()) {
      const activeSubjects = (teacher.subjects as AssignedSubject[])
        .filter((subject) => {
          const assignment = subject.UserSubject
          return assignment?.active !== false
        })
        .slice(0, MAX_PLANNINGS_PER_TEACHER)

      for (const [subjectIndex, subject] of activeSubjects.entries()) {
        const assignment = subject.UserSubject
        const period = assignment?.period || currentPeriod

        const existingPlanning = await Planning.findOne({
          where: {
            userId: teacher.id,
            subjectId: subject.id,
            period,
          },
          transaction,
        })

        if (existingPlanning) {
          skippedCount++
          continue
        }

        const status =
          statusSequence[(teacherIndex + subjectIndex) % statusSequence.length]

        const planning = await Planning.create(
          {
            userId: teacher.id,
            subjectId: subject.id,
            period,
            status,
            submissionDate: getSubmissionDate(status),
            feedback: getFeedback(status),
          },
          { transaction }
        )

        await createPlanningChildren({
          planning,
          subject,
          teacher,
          transaction,
        })

        createdCount++
      }
    }

    await transaction.commit()

    console.log(colors.green(`Planeaciones creadas: ${createdCount}`))
    console.log(colors.yellow(`Planeaciones omitidas por duplicado: ${skippedCount}`))
    await db.close()
  } catch (error) {
    await transaction.rollback()
    console.error(colors.red('Error generando planeaciones de ejemplo:'), error)
    await db.close()
    process.exit(1)
  }
}

seedSamplePlannings()
