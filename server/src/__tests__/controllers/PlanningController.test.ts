import { Request, Response } from 'express'

jest.mock('@/config/db', () => ({
  db: {
    transaction: jest.fn(),
  },
}))

jest.mock('@/models/Planning', () => {
  const PlanningStatus = {
    DRAFT: 'Borrador',
    SENT: 'Enviada',
    APPROVED: 'Aprobada',
    REJECTED: 'Rechazada',
    LATE: 'Desfasado',
  }
  return {
    __esModule: true,
    default: {
      findOne: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
    },
    PlanningStatus,
  }
})

jest.mock('@/models/Subject', () => ({
  __esModule: true,
  default: {
    findByPk: jest.fn(),
  },
}))

jest.mock('@/models/GeneralData', () => ({
  __esModule: true,
  default: {
    create: jest.fn(),
  },
}))

import { PlanningController } from '@/controllers/PlanningController'
import Planning from '@/models/Planning'
import Subject from '@/models/Subject'
import GeneralData from '@/models/GeneralData'

const mockPlanning = Planning as jest.Mocked<typeof Planning>
const mockSubject = Subject as jest.Mocked<typeof Subject>
const mockGeneralData = GeneralData as jest.Mocked<typeof GeneralData>

describe('PlanningController', () => {
  let req: Partial<Request>
  let res: Partial<Response>

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      user: { id: 1, name: 'Docente Test' } as any,
      userSubject: { period: '2026-1' } as any,
    }
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    }
  })

  // ─── create ──────────────────────────────────────────────────

  describe('create', () => {
    it('debe retornar 400 si ya existe una planeación para esa materia', async () => {
      req.params = { subjectId: '5' }
      mockPlanning.findOne.mockResolvedValue({ id: 10 } as any)

      await PlanningController.create(req as Request, res as Response)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({
        error: 'Ya tienes una planeación para esta materia y período',
      })
    })

    it('debe retornar 404 si la materia no existe', async () => {
      req.params = { subjectId: '999' }
      mockPlanning.findOne.mockResolvedValue(null)
      mockSubject.findByPk.mockResolvedValue(null)

      await PlanningController.create(req as Request, res as Response)

      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({ error: 'Materia no encontrada' })
    })

    it('debe crear la planeación exitosamente', async () => {
      req.params = { subjectId: '5' }
      mockPlanning.findOne.mockResolvedValue(null)
      const fakeSubject = {
        id: 5,
        name: 'Materia X',
        academicUnit: 'ENMH',
        semester: '5',
        areaFormation: 'Profesional',
        modality: 'Escolarizada',
        type: ['Teórica'],
        creditsTepic: 4.5,
        weeksPerSemester: 18,
        hoursPerSemester: {
          theory: 3, practice: 2, total1: 5,
          classroom: 3, laboratory: 0, clinic: 2, other: 0, total2: 5,
        },
        studyPlans: [{ name: 'Plan 2020' }],
        studyPlanNames: [],
        academy: { name: 'Homeopatía' },
      }
      mockSubject.findByPk.mockResolvedValue(fakeSubject as any)
      mockPlanning.create.mockResolvedValue({ id: 10, status: 'Borrador' } as any)
      mockGeneralData.create.mockResolvedValue({} as any)

      await PlanningController.create(req as Request, res as Response)

      expect(mockPlanning.findOne).toHaveBeenCalledWith({
        where: { userId: 1, subjectId: '5', period: '2026-1' },
      })
      expect(mockPlanning.create).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 1,
          subjectId: '5',
          period: '2026-1',
          status: 'Borrador',
        })
      )
      expect(res.status).toHaveBeenCalledWith(201)
      expect(res.json).toHaveBeenCalledWith({
        message: 'Planeación creada correctamente',
        data: {
          id: 10,
          status: 'Borrador',
        },
      })
    })
  })

  // ─── getAll ──────────────────────────────────────────────────

  describe('getAll', () => {
    it('debe retornar todas las planeaciones del usuario', async () => {
      const fakePlannings = [
        { id: 1, status: 'Borrador' },
        { id: 2, status: 'Enviada' },
      ]
      mockPlanning.findAll.mockResolvedValue(fakePlannings as any)

      await PlanningController.getAll(req as Request, res as Response)

      expect(mockPlanning.findAll).toHaveBeenCalledWith(
        expect.objectContaining({ where: { userId: 1 } })
      )
      expect(res.json).toHaveBeenCalledWith(fakePlannings)
    })

    it('debe retornar 500 si ocurre un error', async () => {
      mockPlanning.findAll.mockRejectedValue(new Error('DB Error'))

      await PlanningController.getAll(req as Request, res as Response)

      expect(res.status).toHaveBeenCalledWith(500)
    })
  })

  // ─── getById ─────────────────────────────────────────────────

  describe('getById', () => {
    it('debe retornar la planeación si existe', async () => {
      req.params = { planningId: '10' }
      const fakePlanning = { id: 10, status: 'Borrador' }
      mockPlanning.findOne.mockResolvedValue(fakePlanning as any)

      await PlanningController.getById(req as Request, res as Response)

      expect(mockPlanning.findOne).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: '10', userId: 1 },
        })
      )
      expect(res.json).toHaveBeenCalledWith(fakePlanning)
    })

    it('debe retornar 404 si la planeación no existe', async () => {
      req.params = { planningId: '999' }
      mockPlanning.findOne.mockResolvedValue(null)

      await PlanningController.getById(req as Request, res as Response)

      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({
        error: 'Planeación no encontrada',
      })
    })
  })
})
