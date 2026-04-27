import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript'
import Planning from './Planning'
import SessionActivity from './SessionActivity'

@Table({
  tableName: 'thematic_units',
  timestamps: true,
})
export default class ThematicUnit extends Model {
  @AllowNull(false)
  @ForeignKey(() => Planning)
  @Column({
    type: DataType.INTEGER,
  })
  declare planningId: number

  @BelongsTo(() => Planning)
  declare planning: Planning

  // Order for sorting units
  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  declare order: number

  // 3.5 Nombre de la unidad temática
  @AllowNull(false)
  @Column({
    type: DataType.STRING,
  })
  declare name: string

  // 3.6 Unidad de competencia u objetivo
  @Column({
    type: DataType.TEXT,
  })
  declare competenceObjective: string

  // 3.7 Periodo de desarrollo de la unidad temática
  @Column({
    type: DataType.STRING,
  })
  declare developmentPeriod: string

  // 3.8 Horas a la semana en cada espacio de mediación docente
  @Column({
    type: DataType.JSONB,
  })
  declare weeklyHours: {
    classroom: number
    laboratory: number
    workshop: number
    clinic: number
    other: number
    total: number
  }

  // 3.9 No. de sesiones totales de la unidad temática (calculated)
  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  declare totalSessions: number

  // 3.10 Periodo de registro de evaluación ordinaria
  @Column({
    type: DataType.STRING,
  })
  declare evaluationPeriod: string

  // 3.11 Aprendizajes esperados
  @Column({
    type: DataType.JSONB,
  })
  declare expectedLearnings: string[]

  // 3.19 Precisiones de la unidad temática
  @Column({
    type: DataType.TEXT,
  })
  declare precisions: string

  // Relación con sesiones
  @HasMany(() => SessionActivity)
  declare sessions: SessionActivity[]
}
