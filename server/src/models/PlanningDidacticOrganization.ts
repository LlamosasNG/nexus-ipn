import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript'
import Planning from './Planning'

@Table({
  tableName: 'planning_didactic_organization',
  timestamps: true,
})
export default class PlanningDidacticOrganization extends Model {
  @AllowNull(false)
  @ForeignKey(() => Planning)
  @Column({
    type: DataType.INTEGER,
  })
  declare planningId: number

  @BelongsTo(() => Planning)
  declare planning: Planning

  // 3.1 Unidad de aprendizaje (auto-fill from subject)
  @Column({
    type: DataType.STRING,
  })
  declare learningUnit: string

  // 3.2 Propósito u objetivo general (auto-fill from subject)
  @Column({
    type: DataType.TEXT,
  })
  declare generalPurpose: string

  // 3.3 Estrategia de aprendizaje
  @Column({
    type: DataType.TEXT,
  })
  declare learningStrategy: string

  // 3.4 Métodos de enseñanza
  @Column({
    type: DataType.TEXT,
  })
  declare teachingMethods: string
}