import { getPlanningById } from '@/api/PlanningAPI'
import { LoadingApp } from '@/components/LoadingApp'
import PlanningFooter from '@/components/planning/PlanningFooter'
import { PlanningFormHeader } from '@/components/planning/PlanningFormHeader'
import { PlanningNavigation } from '@/components/planning/PlanningNavigation'
import { PlanningSection1 } from '@/components/planning/PlanningSection1'
import { PlanningSection2 } from '@/components/planning/PlanningSection2'
import { PlanningSection3 } from '@/components/planning/PlanningSection3'
import { PlanningSection4 } from '@/components/planning/PlanningSection4'
import { PlanningSection5 } from '@/components/planning/PlanningSection5'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useParams } from 'react-router'

export default function CreatePlanningView() {
  const { planningId } = useParams()

  const { data: planning, isLoading } = useQuery({
    queryKey: ['planning', planningId],
    queryFn: () => getPlanningById(Number(planningId)),
    enabled: !!planningId,
  })

  const [currentSection, setCurrentSection] = useState(1)
  const [referencias, setReferencias] = useState([
    {
      id: 1,
      texto: '',
      unidades: Array(6).fill(false),
      tipos: { B: false, S: false, I: false, C: false },
    },
  ])
  const [herramientaPlagio, setHerramientaPlagio] = useState<string>('')

  const handleSave = () => {
    console.log('Guardando avance...')
    alert('Avance guardado exitosamente')
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

  const agregarReferencia = () => {
    const nuevaReferencia = {
      id: referencias.length + 1,
      texto: '',
      unidades: Array(6).fill(false),
      tipos: { B: false, S: false, I: false, C: false },
    }
    setReferencias([...referencias, nuevaReferencia])
  }

  const eliminarReferencia = (id: number) => {
    if (referencias.length > 1) {
      setReferencias(referencias.filter((ref) => ref.id !== id))
    }
  }

  return (
    <div className="min-h-screen bg-[#7C2855] flex flex-col rounded-4xl">
      <div className="flex-1 px-4 py-8">
        {/* Main Form Container */}
        <div className="mx-auto rounded-3xl bg-white p-8 shadow-2xl">
          <PlanningFormHeader />
          {/* Render current section */}
          {isLoading ? (
            <LoadingApp />
          ) : (
            currentSection === 1 && (
              <PlanningSection1 subject={planning?.subject ?? undefined} />
            )
          )}
          {currentSection === 2 && <PlanningSection2 />}
          {currentSection === 3 && <PlanningSection3 />}
          {currentSection === 4 && (
            <PlanningSection4
              referencias={referencias}
              onAgregar={agregarReferencia}
              onEliminar={eliminarReferencia}
            />
          )}
          {currentSection === 5 && (
            <PlanningSection5
              herramientaPlagio={herramientaPlagio}
              onChange={setHerramientaPlagio}
            />
          )}
          <PlanningFooter />
        </div>

        <PlanningNavigation
          currentSection={currentSection}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onSave={handleSave}
        />
      </div>
    </div>
  )
}
