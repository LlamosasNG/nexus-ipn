import type { FieldErrors, FieldValues } from 'react-hook-form'
import { toast } from 'sonner'

type ValidationToastOptions = {
  title?: string
  fieldOrder?: string[]
  fieldLabels?: Record<string, string>
}

type ErrorItem = {
  path: string
  message: string
}

function collectErrorItems(
  value: unknown,
  currentPath = ''
): ErrorItem[] {
  if (!value || typeof value !== 'object') return []

  const candidate = value as {
    message?: unknown
    [key: string]: unknown
  }

  const items: ErrorItem[] = []

  if (typeof candidate.message === 'string' && currentPath) {
    items.push({
      path: currentPath,
      message: candidate.message,
    })
  }

  for (const [key, nestedValue] of Object.entries(candidate)) {
    if (key === 'message' || key === 'type' || key === 'ref') continue

    const nextPath = currentPath ? `${currentPath}.${key}` : key
    items.push(...collectErrorItems(nestedValue, nextPath))
  }

  return items
}

export function showOrderedValidationToast<TFieldValues extends FieldValues>(
  errors: FieldErrors<TFieldValues>,
  options: ValidationToastOptions = {}
) {
  const items = collectErrorItems(errors)

  if (items.length === 0) return

  const fieldOrder = options.fieldOrder ?? []
  const fieldLabels = options.fieldLabels ?? {}

  const sortedItems = [...items]
    .sort((a, b) => {
      const aIndex = fieldOrder.indexOf(a.path)
      const bIndex = fieldOrder.indexOf(b.path)
      const normalizedA = aIndex === -1 ? Number.MAX_SAFE_INTEGER : aIndex
      const normalizedB = bIndex === -1 ? Number.MAX_SAFE_INTEGER : bIndex

      if (normalizedA !== normalizedB) return normalizedA - normalizedB
      return a.path.localeCompare(b.path, 'es')
    })
    .filter(
      (item, index, array) =>
        index === array.findIndex((candidate) => candidate.path === item.path)
    )

  toast.error(options.title ?? 'Corrige los siguientes campos', {
    description: (
      <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm">
        {sortedItems.map((item) => (
          <li key={item.path}>
            <span className="font-medium text-foreground">
              {fieldLabels[item.path] ?? item.path}
            </span>
            : {item.message}
          </li>
        ))}
      </ol>
    ),
  })
}
