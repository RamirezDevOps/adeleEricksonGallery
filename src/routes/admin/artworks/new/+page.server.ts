import { sanitizeCloudinaryPublicId, validateCloudinaryPublicId } from '$lib/cloudinary'
import { db } from '$lib/firebase/admin.server'
import { fail, redirect } from '@sveltejs/kit'
import type { Actions } from './$types'

type ArtworkInputValues = {
    title: string
    price: string
    size: string
    year: string
    imagePublicId: string
    sold: boolean
}

type ArtworkInputErrors = Partial<Record<keyof ArtworkInputValues | '_form', string>>

const MAX_TITLE_LENGTH = 120
const MAX_SIZE_LENGTH = 60
const MIN_YEAR = 1000
const CURRENT_YEAR = new Date().getFullYear()
const ALLOWED_FIELDS = new Set(['title', 'price', 'size', 'year', 'imagePublicId', 'sold'])
const SAFE_TEXT_PATTERN = /^[\p{L}\p{N}\s.,'"()\-/:&+xX]+$/u
const EMPTY_VALUES: ArtworkInputValues = {
    title: '',
    price: '',
    size: '',
    year: '',
    imagePublicId: '',
    sold: false
}

function sanitizeText(input: unknown) {
    if (typeof input !== 'string') {
        return ''
    }

    return input.trim().replace(/<[^>]*>?/gm, '').replace(/[<>]/g, '')
}

function getSingleFormValue(formData: FormData, key: string) {
    const values = formData.getAll(key)

    if (values.length > 1) {
        return { value: null, error: 'Malformed form submission.' }
    }

    return { value: values[0] ?? null, error: null }
}

function getInitialValues(formData?: FormData): ArtworkInputValues {
    if (!formData) {
        return EMPTY_VALUES
    }

    const titleField = getSingleFormValue(formData, 'title')
    const priceField = getSingleFormValue(formData, 'price')
    const sizeField = getSingleFormValue(formData, 'size')
    const yearField = getSingleFormValue(formData, 'year')
    const imagePublicIdField = getSingleFormValue(formData, 'imagePublicId')
    const soldValues = formData.getAll('sold')

    return {
        title: sanitizeText(titleField.value),
        price: sanitizeText(priceField.value),
        size: sanitizeText(sizeField.value),
        year: sanitizeText(yearField.value),
        imagePublicId: sanitizeCloudinaryPublicId(imagePublicIdField.value),
        sold: soldValues.length === 1 && soldValues[0] === 'true'
    }
}

function parseArtworkInput(formData: FormData) {
    const errors: ArtworkInputErrors = {}

    for (const key of formData.keys()) {
        if (!ALLOWED_FIELDS.has(key)) {
            return {
                success: false as const,
                errors: { _form: 'Invalid form submission.' },
                values: EMPTY_VALUES
            }
        }
    }

    const values = getInitialValues(formData)
    const titleField = getSingleFormValue(formData, 'title')
    const priceField = getSingleFormValue(formData, 'price')
    const sizeField = getSingleFormValue(formData, 'size')
    const yearField = getSingleFormValue(formData, 'year')
    const imagePublicIdField = getSingleFormValue(formData, 'imagePublicId')
    const soldValues = formData.getAll('sold')

    if (
        titleField.error ||
        priceField.error ||
        sizeField.error ||
        yearField.error ||
        imagePublicIdField.error ||
        soldValues.length > 1
    ) {
        return {
            success: false as const,
            errors: { _form: 'Malformed form submission.' },
            values
        }
    }

    if (!values.title) {
        errors.title = 'Title is required.'
    } else if (values.title.length > MAX_TITLE_LENGTH) {
        errors.title = `Title must be ${MAX_TITLE_LENGTH} characters or fewer.`
    } else if (!SAFE_TEXT_PATTERN.test(values.title)) {
        errors.title = 'Title contains unsupported characters.'
    }

    if (!values.size) {
        errors.size = 'Size is required.'
    } else if (values.size.length > MAX_SIZE_LENGTH) {
        errors.size = `Size must be ${MAX_SIZE_LENGTH} characters or fewer.`
    } else if (!SAFE_TEXT_PATTERN.test(values.size)) {
        errors.size = 'Size contains unsupported characters.'
    }

    if (!values.price) {
        errors.price = 'Price is required.'
    }

    const parsedPrice = Number(values.price)

    if (values.price) {
        if (!Number.isFinite(parsedPrice)) {
            errors.price = 'Price must be a valid number.'
        } else if (parsedPrice < 0) {
            errors.price = 'Price must be 0 or greater.'
        }
    }

    if (!values.year) {
        errors.year = 'Year is required.'
    }

    const parsedYear = Number(values.year)

    if (values.year) {
        if (!Number.isInteger(parsedYear)) {
            errors.year = 'Year must be a whole number.'
        } else if (parsedYear < MIN_YEAR || parsedYear > CURRENT_YEAR) {
            errors.year = `Year must be between ${MIN_YEAR} and ${CURRENT_YEAR}.`
        }
    }

    const imagePublicIdError = validateCloudinaryPublicId(values.imagePublicId, 'Artwork image')

    if (imagePublicIdError) {
        errors.imagePublicId = imagePublicIdError
    }

    if (Object.keys(errors).length > 0) {
        return {
            success: false as const,
            errors,
            values
        }
    }

    return {
        success: true as const,
        values,
        data: {
            title: values.title,
            price: parsedPrice,
            size: values.size,
            year: parsedYear,
            imagePublicId: values.imagePublicId,
            sold: values.sold
        }
    }
}

export const actions: Actions = {
    default: async ({ request }) => {
        let formData: FormData

        try {
            formData = await request.formData()
        } catch {
            return fail(400, {
                errors: { _form: 'Invalid form submission.' },
                values: EMPTY_VALUES
            })
        }

        const parsed = parseArtworkInput(formData)

        if (!parsed.success) {
            return fail(400, parsed)
        }

        try {
            await db.collection('artworks').add(parsed.data)
        } catch (err) {
            console.error('Failed to create artwork', {
                message: err instanceof Error ? err.message : 'Unknown error'
            })

            return fail(400, {
                errors: { _form: 'Unable to save changes right now. Please try again.' },
                values: parsed.values
            })
        }

        throw redirect(303, '/admin/artworks')
    }
}
