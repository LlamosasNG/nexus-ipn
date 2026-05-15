import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { SendHorizontal } from 'lucide-react'

type Props = {
  herramientaPlagio: string
  onChange: (value: string) => void
  canSubmitPlanning: boolean
  isSubmitDialogOpen: boolean
  isSubmittingPlanning: boolean
  onSubmitDialogChange: (open: boolean) => void
  onConfirmSubmit: () => void
}

export function PlanningSection5({
  herramientaPlagio,
  onChange,
  canSubmitPlanning,
  isSubmitDialogOpen,
  isSubmittingPlanning,
  onSubmitDialogChange,
  onConfirmSubmit,
}: Props) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      {/* Section Title */}
      <div className="mb-6">
        <h3 className="text-base font-semibold text-gray-700">
          5. Herramientas para detectar el plagio:
        </h3>
      </div>

      {/* Tabla de Herramientas */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-dashed border-gray-400">
          <thead>
            <tr>
              <th className="border border-dashed border-gray-400 bg-gray-300 px-6 py-3 text-sm font-bold text-black">
                Ithenticate
              </th>
              <th className="border border-dashed border-gray-400 bg-gray-300 px-6 py-3 text-sm font-bold text-black">
                Turnitin
              </th>
              <th className="border border-dashed border-gray-400 px-6 py-3 text-sm font-bold text-black">
                Ninguna
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-dashed border-gray-400 px-6 py-4 text-center">
                <input
                  type="radio"
                  name="herramienta-plagio"
                  value="ithenticate"
                  checked={herramientaPlagio === 'ithenticate'}
                  onChange={(e) => onChange(e.target.value)}
                  className="w-5 h-5"
                />
              </td>
              <td className="border border-dashed border-gray-400 px-6 py-4 text-center">
                <input
                  type="radio"
                  name="herramienta-plagio"
                  value="turnitin"
                  checked={herramientaPlagio === 'turnitin'}
                  onChange={(e) => onChange(e.target.value)}
                  className="w-5 h-5"
                />
              </td>
              <td className="border border-dashed border-gray-400 px-6 py-4 text-center">
                <input
                  type="radio"
                  name="herramienta-plagio"
                  value="ninguna"
                  checked={herramientaPlagio === 'ninguna'}
                  onChange={(e) => onChange(e.target.value)}
                  className="w-5 h-5"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="flex justify-end">
        <Button
          type="button"
          onClick={() => onSubmitDialogChange(true)}
          disabled={!canSubmitPlanning || isSubmittingPlanning}
          className="rounded-none bg-[#7C2855] px-6 py-6 font-semibold text-white shadow-lg transition-all duration-300 hover:bg-[#682147] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <SendHorizontal className="mr-2 h-5 w-5" />
          Enviar planeación
        </Button>
      </div>

      <Dialog open={isSubmitDialogOpen} onOpenChange={onSubmitDialogChange}>
        <DialogContent className="max-w-md rounded-2xl border-0 p-0 shadow-2xl data-[state=open]:zoom-in-95 data-[state=open]:slide-in-from-top-2 data-[state=open]:duration-300">
          <DialogHeader className="border-b border-gray-200 px-6 py-5">
            <DialogTitle className="text-xl font-bold text-gray-900">
              Confirmar envío
            </DialogTitle>
            <DialogDescription className="mt-2 text-sm text-gray-600">
              La planeación dejará de estar en borrador y su estado cambiará a{' '}
              <strong>Enviada</strong>.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 px-6 py-5">
            <div className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
              Antes de enviarla, asegúrate de haber revisado la información de
              todas las secciones.
            </div>
          </div>

          <DialogFooter className="border-t border-gray-200 px-6 py-4 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onSubmitDialogChange(false)}
              disabled={isSubmittingPlanning}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={onConfirmSubmit}
              disabled={isSubmittingPlanning}
              className="bg-[#7C2855] text-white hover:bg-[#682147]"
            >
              {isSubmittingPlanning ? 'Enviando...' : 'Confirmar envío'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
