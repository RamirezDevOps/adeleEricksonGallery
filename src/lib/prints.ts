export type PrintSizeCategory = 'small' | 'medium' | 'large' | 'extra_large'

export type PrintSize = {
    label: string
    width: number
    height: number
    category: PrintSizeCategory
}

type MaybeLegacyPrintSize =
    | PrintSize
    | { label?: unknown; width?: unknown; height?: unknown; category?: unknown }
    | string
    | null
    | undefined

const DIMENSION_PATTERN = /(\d+(?:\.\d+)?)\s*[x×]\s*(\d+(?:\.\d+)?)/i

export const PRINT_SIZES: PrintSize[] = [
    { label: '8x10', width: 8, height: 10, category: 'small' },
    { label: '9x12', width: 9, height: 12, category: 'small' },
    { label: '11x14', width: 11, height: 14, category: 'small' },
    { label: '12x18', width: 12, height: 18, category: 'medium' },
    { label: '16x20', width: 16, height: 20, category: 'medium' },
    { label: '18x24', width: 18, height: 24, category: 'medium' },
    { label: '20x30', width: 20, height: 30, category: 'large' },
    { label: '24x36', width: 24, height: 36, category: 'large' },
    { label: '30x40', width: 30, height: 40, category: 'extra_large' }
]

function normalizeLabel(value: string) {
    return value.trim().toLowerCase().replace(/\s+/g, '').replace('×', 'x')
}

function toPositiveNumber(value: unknown) {
    const number = typeof value === 'number' ? value : Number(value)

    return Number.isFinite(number) && number > 0 ? number : null
}

function getExactPrintSizeByDimensions(width: number, height: number) {
    return PRINT_SIZES.find((size) => size.width === width && size.height === height) ?? null
}

function getClosestPrintSizeByDimensions(width: number, height: number) {
    return PRINT_SIZES.reduce<{ size: PrintSize; distance: number } | null>((closest, size) => {
        const distance = Math.abs(size.width - width) + Math.abs(size.height - height)

        if (!closest || distance < closest.distance) {
            return { size, distance }
        }

        return closest
    }, null)?.size ?? null
}

function extractDimensions(value: MaybeLegacyPrintSize[] | MaybeLegacyPrintSize): { width: number; height: number } | null {
    if (Array.isArray(value)) {
        const preferred =
            value.find((entry) => typeof entry === 'object' && entry && 'label' in entry && normalizeLabel(String(entry.label ?? '')) === 'full') ??
            value[0] ??
            null

        return extractDimensions(preferred)
    }

    if (!value) {
        return null
    }

    if (typeof value === 'string') {
        const match = value.match(DIMENSION_PATTERN)

        if (!match) {
            return null
        }

        const width = toPositiveNumber(match[1])
        const height = toPositiveNumber(match[2])

        return width && height ? { width, height } : null
    }

    const width = toPositiveNumber(value.width)
    const height = toPositiveNumber(value.height)

    return width && height ? { width, height } : null
}

export function getPrintSizeByLabel(label: string) {
    const normalized = normalizeLabel(label)

    return PRINT_SIZES.find((size) => size.label === normalized) ?? null
}

export function normalizeStoredPrintSize(value: unknown): PrintSize | null {
    if (!value) {
        return null
    }

    if (typeof value === 'object' && !Array.isArray(value) && 'label' in (value as Record<string, unknown>)) {
        const labeled = getPrintSizeByLabel(String((value as Record<string, unknown>).label ?? ''))

        if (labeled) {
            return labeled
        }
    }

    if (typeof value === 'string') {
        const labeled = getPrintSizeByLabel(value)

        if (labeled) {
            return labeled
        }
    }

    const dimensions = extractDimensions(value as MaybeLegacyPrintSize[] | MaybeLegacyPrintSize)

    if (!dimensions) {
        return null
    }

    return getExactPrintSizeByDimensions(dimensions.width, dimensions.height)
        ?? getClosestPrintSizeByDimensions(dimensions.width, dimensions.height)
}

export function formatPrintSize(size: PrintSize) {
    return `${size.width} × ${size.height}`
}

export function formatPrintCategory(category: PrintSizeCategory) {
    return category === 'extra_large'
        ? 'Extra Large'
        : category.charAt(0).toUpperCase() + category.slice(1)
}

export function formatPrintSizeOption(size: PrintSize) {
    return `${formatPrintSize(size)} (${formatPrintCategory(size.category)})`
}
