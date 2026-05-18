import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  HasMany,
  HasOne,
  Model,
  Table,
} from 'sequelize-typescript'
import GeneralData from './GeneralData'
import PlanningDidacticOrganization from './PlanningDidacticOrganization'
import PlagiarismTool from './PlagiarismTool'
import Reference from './Reference'
import Subject from './Subject'
import ThematicUnit from './ThematicUnit'
import TransversalAxis from './TransversalAxis'
import User from './User'
import { normalizeAcademicPeriod } from '@/utils/academicPeriod'

export enum PlanningStatus {
  DRAFT = 'Borrador',
  SENT = 'Enviada',
  APPROVED = 'Aprobada',
  REJECTED = 'Rechazada',
  LATE = 'Desfasado',
}

@Table({
  tableName: 'plannings',
  timestamps: true,
})
export default class Planning extends Model {
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
  })
  declare userId: number

  @BelongsTo(() => User)
  declare user: User

  @ForeignKey(() => Subject)
  @Column({
    type: DataType.INTEGER,
  })
  declare subjectId: number

  @BelongsTo(() => Subject)
  declare subject: Subject

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
    set(value: string) {
      this.setDataValue('period', normalizeAcademicPeriod(value))
    },
  })
  declare period: string

  @Default(PlanningStatus.DRAFT)
  @Column({
    type: DataType.ENUM(...Object.values(PlanningStatus)),
  })
  declare status: PlanningStatus

  @Column({
    type: DataType.DATE,
  })
  declare submissionDate: Date

  @Column({
    type: DataType.TEXT,
  })
  declare feedback: string

  // --- Relaciones con los modelos hijos (secciones) ---
  @HasOne(() => GeneralData)
  declare generalData: GeneralData

  @HasOne(() => TransversalAxis)
  declare transversalAxis: TransversalAxis

  @HasOne(() => PlanningDidacticOrganization)
  declare didacticOrganization: PlanningDidacticOrganization

  @HasMany(() => ThematicUnit)
  declare thematicUnits: ThematicUnit[]

  @HasMany(() => Reference)
  declare references: Reference[]

  @HasOne(() => PlagiarismTool)
  declare plagiarismTool: PlagiarismTool
}
