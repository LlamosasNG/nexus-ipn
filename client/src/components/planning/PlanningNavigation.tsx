import { Button } from '@/components/ui/button'
import { ArrowRight, Save } from 'lucide-react'

type Props = {
  currentSection: number
  onPrevious: () => void
  onNext: () => void
  onSave: () => void
  onGoToSection: (section: number) => void
  saveFormId?: string
}

export function PlanningNavigation({
  currentSection,
  onPrevious,
  onNext,
  onSave,
  onGoToSection,
  saveFormId,
}: Props) {
  const sections = [
    { id: 1, label: 'Datos' },
    { id: 2, label: 'Ejes' },
    { id: 3, label: 'Organización' },
    { id: 4, label: 'Referencias' },
    { id: 5, label: 'Plagio' },
  ]

  return (
    <div className="mx-auto mt-6 max-w-6xl rounded-3xl bg-white/12 p-4 shadow-2xl backdrop-blur-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <Button
          type="button"
          onClick={onPrevious}
          disabled={currentSection === 1}
          className="flex items-center gap-2 rounded-2xl bg-white/90 px-5 py-6 font-semibold text-[#7C2855] shadow-lg transition-all duration-300 hover:bg-white disabled:opacity-50"
        >
          <ArrowRight className="h-5 w-5 rotate-180" />
          Sección anterior
        </Button>

        <div className="grid grid-cols-5 gap-2 sm:gap-3">
          {sections.map((section) => (
            <button
              key={section.id}
              type="button"
              onClick={() => onGoToSection(section.id)}
              className={`rounded-2xl border px-3 py-3 text-center transition-all duration-300 ${
                currentSection === section.id
                  ? 'border-white bg-white text-[#7C2855] shadow-lg'
                  : 'border-white/25 bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <div className="text-lg font-bold leading-none">{section.id}</div>
              <div className="mt-1 text-[11px] font-medium leading-tight">
                {section.label}
              </div>
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            type={saveFormId ? 'submit' : 'button'}
            form={saveFormId}
            onClick={saveFormId ? undefined : onSave}
            className="flex items-center gap-2 rounded-2xl bg-[#D4AF37] px-5 py-6 font-semibold text-[#7C2855] shadow-lg transition-all duration-300 hover:bg-[#e8c96f]"
          >
            <Save className="h-5 w-5" />
            Guardar sección
          </Button>

          <Button
            type="button"
            onClick={onNext}
            disabled={currentSection === 5}
            className="flex items-center gap-2 rounded-2xl bg-cyan-400 px-5 py-6 font-semibold text-black shadow-lg transition-all duration-300 hover:bg-cyan-300 disabled:opacity-50"
          >
            Siguiente sección
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
