type PlanningFooterProps = {
  currentPage: number
  totalPages?: number
}

export default function PlanningFooter({
  currentPage,
  totalPages = 5,
}: PlanningFooterProps) {
  return (
    <div className="mt-5 space-y-4">
      {/* Header superior */}
      <div className="flex items-center gap-1">
        <div className="bg-[#7C2855] text-white px-6 py-2 text-sm font-semibold">
          DIRECCIÓN DE EDUCACIÓN SUPERIOR
        </div>
        <div className="bg-gray-500 w-16 h-9"></div>
        <div className="bg-[#7C2855] text-white px-6 py-2 text-sm font-semibold flex-1 text-right">
          PLANEACIÓN DIDÁCTICA
        </div>
      </div>

      {/* Footer inferior */}
      <div className="flex items-center justify-between text-gray-600 text-sm">
        <div className="font-semibold">FPD-PD-F01-24</div>
        <div className="font-semibold">
          Página {currentPage} de {totalPages}
        </div>
        <div className="font-semibold">Versión 02- Emitido 12/07/2024</div>
      </div>
    </div>
  )
}
