import type {
  ContentSection,
  CreditsSection,
  DigitalResourceType,
  EvaluationSection,
  HelpSection,
  IdentificationSection,
  LearningActivitiesSection,
  MethodologySection,
  PedagogicalSection,
} from '@/interfaces/DigitalResourceInterfaces'
import Subject from '@/models/Subject'
import User from '@/models/User'
import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
  Unique,
} from 'sequelize-typescript'

@Table({
  tableName: 'digital_didactic_resources',
  timestamps: true,
})
export default class DigitalDidacticResource extends Model {
  @Unique('digital_resource_subject_user_type_unique')
  @AllowNull(false)
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
  })
  declare userId: number

  @BelongsTo(() => User)
  declare user: User

  @Unique('digital_resource_subject_user_type_unique')
  @AllowNull(false)
  @ForeignKey(() => Subject)
  @Column({
    type: DataType.INTEGER,
  })
  declare subjectId: number

  @BelongsTo(() => Subject)
  declare subject: Subject

  @Unique('digital_resource_subject_user_type_unique')
  @AllowNull(false)
  @Column({
    type: DataType.STRING,
  })
  declare resourceType: DigitalResourceType

  @Column({
    type: DataType.JSONB,
  })
  declare identification: IdentificationSection | null

  @Column({
    type: DataType.JSONB,
  })
  declare pedagogical: PedagogicalSection | null

  @Column({
    type: DataType.JSONB,
  })
  declare methodology: MethodologySection | null

  @Column({
    type: DataType.JSONB,
  })
  declare content: ContentSection | null

  @Column({
    type: DataType.JSONB,
  })
  declare learningActivities: LearningActivitiesSection | null

  @Column({
    type: DataType.JSONB,
  })
  declare evaluation: EvaluationSection | null

  @Column({
    type: DataType.JSONB,
  })
  declare help: HelpSection | null

  @Column({
    type: DataType.JSONB,
  })
  declare credits: CreditsSection | null
}
