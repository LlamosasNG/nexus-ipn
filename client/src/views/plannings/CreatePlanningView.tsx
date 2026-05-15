import {
  createOrUpdatePlagiarismTool,
  getPlagiarismTool,
} from '@/api/PlagiarismToolAPI'
import { getReferences, syncReferences } from '@/api/ReferenceAPI'
import { getPlanningById, submitPlanning } from '@/api/PlanningAPI'
import { LoadingApp } from '@/components/LoadingApp'
import PlanningFooter from '@/components/planning/PlanningFooter'
import { PlanningFormHeader } from '@/components/planning/PlanningFormHeader'
import { PlanningNavigation } from '@/components/planning/PlanningNavigation'
import { PlanningSection1 } from '@/components/planning/PlanningSection1'
import { PlanningSection2 } from '@/components/planning/PlanningSection2'
import { PlanningSection3 } from '@/components/planning/PlanningSection3'
import { PlanningSection4 } from '@/components/planning/PlanningSection4'
import { PlanningSection5 } from '@/components/planning/PlanningSection5'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { toast } from 'sonner'

type PlanningReferenceRow = {
  id: string
  referenceId?: number
  texto: string
  unidades: boolean[]
  tipos: { S: boolean; I: boolean }
}

export default function CreatePlanningView() {
  const { planningId } = useParams()
  const queryClient = useQueryClient()

  const { data: planning, isLoading } = useQuery({
    queryKey: ['planning', planningId],
    queryFn: () => getPlanningById(Number(planningId)),
    enabled: !!planningId,
  })

  const { data: referencesData } = useQuery({
    queryKey: ['references', planningId],
    queryFn: () => getReferences(planningId!),
    enabled: !!planningId,
    retry: false,
  })

  const { data: plagiarismToolData } = useQuery({
    queryKey: ['plagiarism-tool', planningId],
    queryFn: () => getPlagiarismTool(planningId!),
    enabled: !!planningId,
    retry: false,
  })

  const [currentSection, setCurrentSection] = useState(1)
  const [referencias, setReferencias] = useState<PlanningReferenceRow[]>([
    {
      id: 'ref-1',
      referenceId: undefined,
      texto: '',
      unidades: Array(6).fill(false),
      tipos: { S: false, I: false },
    },
  ])
  const [herramientaPlagio, setHerramientaPlagio] = useState<string>('')
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false)
  const [isSubmittingPlanning, setIsSubmittingPlanning] = useState(false)

  const currentFormId =
    currentSection <= 3 ? `planning-section-form-${currentSection}` : undefined

  useEffect(() => {
    if (!referencesData) return

    if (referencesData.length === 0) {
      setReferencias([
        {
          id: 'ref-1',
          referenceId: undefined,
          texto: '',
          unidades: Array(6).fill(false),
          tipos: { S: false, I: false },
        },
      ])
      return
    }

    setReferencias(
      referencesData.map((reference) => ({
        id: `ref-${reference.id}`,
        referenceId: reference.id,
        texto: reference.text,
        unidades:
          reference.thematicUnits?.length === 6
            ? reference.thematicUnits
            : Array(6).fill(false),
        tipos: {
          S: reference.types.S,
          I: reference.types.I,
        },
      }))
    )
  }, [referencesData])

  useEffect(() => {
    if (plagiarismToolData) {
      setHerramientaPlagio(plagiarismToolData.selectedTool)
    }
  }, [plagiarismToolData])

  const handleSave = async () => {
    if (!planningId) return

    try {
      if (currentSection === 4) {
        const referencesToSync = referencias
          .filter((referencia) => referencia.texto.trim().length > 0)
          .map((referencia) => ({
            id: referencia.referenceId,
            text: referencia.texto.trim(),
            thematicUnits: referencia.unidades,
            types: {
              B: false,
              S: referencia.tipos.S,
              I: referencia.tipos.I,
              C: false,
            },
          }))

        const message = await syncReferences({
          planningId,
          references: referencesToSync,
        })
        toast.success(message || 'Referencias guardadas correctamente')
        return
      }

      if (currentSection === 5) {
        const message = await createOrUpdatePlagiarismTool({
          planningId,
          selectedTool: (herramientaPlagio || 'ninguna') as
            | 'ithenticate'
            | 'turnitin'
            | 'ninguna',
        })
        toast.success(message || 'Herramienta de plagio guardada correctamente')
        return
      }

      toast.info('El guardado externo está disponible en las secciones 1 a 3 por ahora.')
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      }
    }
  }

  const handleSubmitPlanning = async () => {
    if (!planningId) return

    try {
      setIsSubmittingPlanning(true)

      await createOrUpdatePlagiarismTool({
        planningId,
        selectedTool: (herramientaPlagio || 'ninguna') as
          | 'ithenticate'
          | 'turnitin'
          | 'ninguna',
      })

      const response = await submitPlanning(Number(planningId))

      await queryClient.invalidateQueries({
        queryKey: ['planning', planningId],
      })
      await queryClient.invalidateQueries({
        queryKey: ['plannings'],
      })

      setIsSubmitDialogOpen(false)
      toast.success(response?.message || 'Planeación enviada correctamente')
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      }
    } finally {
      setIsSubmittingPlanning(false)
    }
  }

  const handleNext = () => {
    if (currentSection < 5) {
      setCurrentSection(currentSection + 1)
    }
  }

  const handlePrevious = () => {
    if (currentSection > 1) {
      setCurrentSection(currentSection - 1)
    }
  }

  const handleGoToSection = (section: number) => {
    if (section >= 1 && section <= 5) {
      setCurrentSection(section)
    }
  }

  const agregarReferencia = () => {
    const nuevaReferencia = {
      id: `ref-${Date.now()}-${referencias.length + 1}`,
      referenceId: undefined,
      texto: '',
      unidades: Array(6).fill(false),
      tipos: { S: false, I: false },
    }
    setReferencias([...referencias, nuevaReferencia])
  }

  const eliminarReferencia = (id: string) => {
    if (referencias.length > 1) {
      setReferencias(referencias.filter((ref) => ref.id !== id))
    }
  }

  const actualizarTextoReferencia = (id: string, value: string) => {
    setReferencias((prev) =>
      prev.map((ref) => (ref.id === id ? { ...ref, texto: value } : ref))
    )
  }

  const toggleUnidadReferencia = (id: string, index: number) => {
    setReferencias((prev) =>
      prev.map((ref) =>
        ref.id === id
          ? {
              ...ref,
              unidades: ref.unidades.map((unidad, unidadIndex) =>
                unidadIndex === index ? !unidad : unidad
              ),
            }
          : ref
      )
    )
  }

  const toggleTipoReferencia = (id: string, tipo: 'S' | 'I') => {
    setReferencias((prev) =>
      prev.map((ref) =>
        ref.id === id
          ? {
              ...ref,
              tipos: {
                ...ref.tipos,
                [tipo]: !ref.tipos[tipo],
              },
            }
          : ref
      )
    )
  }

  return (
    <div className="rounded-[2rem] bg-[#7C2855] overflow-hidden">
      <div className="px-4 py-8">
        {/* Main Form Container */}
        <div className="mx-auto rounded-3xl bg-white p-8 shadow-2xl">
          <PlanningFormHeader />
          {/* Render current section */}
          {isLoading ? (
            <LoadingApp />
          ) : (
            currentSection === 1 && (
              <PlanningSection1
                subject={planning?.subject ?? undefined}
                formId={currentFormId}
                showSaveButton={false}
              />
            )
          )}
          {currentSection === 2 && (
            <PlanningSection2 formId={currentFormId} showSaveButton={false} />
          )}
          {currentSection === 3 && (
            <PlanningSection3 formId={currentFormId} showSaveButton={false} />
          )}
          {currentSection === 4 && (
            <PlanningSection4
              referencias={referencias}
              onAgregar={agregarReferencia}
              onEliminar={eliminarReferencia}
              onTextoChange={actualizarTextoReferencia}
              onUnidadToggle={toggleUnidadReferencia}
              onTipoToggle={toggleTipoReferencia}
            />
          )}
          {currentSection === 5 && (
            <PlanningSection5
              herramientaPlagio={herramientaPlagio}
              onChange={setHerramientaPlagio}
              canSubmitPlanning={planning?.status === 'Borrador'}
              isSubmitDialogOpen={isSubmitDialogOpen}
              isSubmittingPlanning={isSubmittingPlanning}
              onSubmitDialogChange={setIsSubmitDialogOpen}
              onConfirmSubmit={handleSubmitPlanning}
            />
          )}
          <PlanningFooter currentPage={currentSection} totalPages={5} />
        </div>

        <PlanningNavigation
          currentSection={currentSection}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onSave={handleSave}
          onGoToSection={handleGoToSection}
          saveFormId={currentFormId}
        />
      </div>
    </div>
  )
}
