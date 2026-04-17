import { sanitizeCloudinaryPublicId, validateCloudinaryPublicId } from '$lib/cloudinary'
import { db } from '$lib/firebase/admin.server'
import { getPrintSizeByLabel } from '$lib/prints'
import { fail, redirect } from '@sveltejs/kit'
import type { Actions } from './$types'

type PrintInputValues = {
    title: string
    price: string
    imagePublicId: string
    sizeLabel: string
}

type PrintInputErrors = Partial<Record<keyof PrintInputValues | '_form', string>>

const MAX_TITLE_LENGTH = 120
const ALLOWED_FIELDS = new Set(['title', 'price', 'imagePublicId', 'sizeLabel'])
const SAFE_TEXT_PATTERN = /^[\p{L}\p{N}\s.,'"()\-/:&+xX]+$/u
const EMPTY_VALUES: PrintInputValues = {
    title: '',
    price: '',
    imagePublicId: '',
    sizeLabel: ''
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

function getInitialValues(formData?: FormData): PrintInputValues {
    if (!formData) {
        return EMPTY_VALUES
    }

    const titleField = getSingleFormValue(formData, 'title')
    const priceField = getSingleFormValue(formData, 'price')
    const imagePublicIdField = getSingleFormValue(formData, 'imagePublicId')
    const sizeLabelField = getSingleFormValue(formData, 'sizeLabel')

    return {
        title: sanitizeText(titleField.value),
        price: sanitizeText(priceField.value),
        imagePublicId: sanitizeCloudinaryPublicId(imagePublicIdField.value),
        sizeLabel: sanitizeText(sizeLabelField.value)
    }
}

function parsePrintInput(formData: FormData) {
    const errors: PrintInputErrors = {}

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
    const imagePublicIdField = getSingleFormValue(formData, 'imagePublicId')
    const sizeLabelField = getSingleFormValue(formData, 'sizeLabel')

    if (titleField.error || priceField.error || imagePublicIdField.error || sizeLabelField.error) {
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

    const imagePublicIdError = validateCloudinaryPublicId(values.imagePublicId, 'Print image')

    if (imagePublicIdError) {
        errors.imagePublicId = imagePublicIdError
    }

    if (!values.sizeLabel) {
        errors.sizeLabel = 'Size is required.'
    }

    const selectedSize = values.sizeLabel ? getPrintSizeByLabel(values.sizeLabel) : null

    if (values.sizeLabel && !selectedSize) {
        errors.sizeLabel = 'Choose a valid print size.'
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
            imagePublicId: values.imagePublicId,
            size: selectedSize
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

        const parsed = parsePrintInput(formData)

        if (!parsed.success) {
            return fail(400, parsed)
        }

        try {
            await db.collection('prints').add(parsed.data)
        } catch (err) {
            console.error('Failed to create print', {
                message: err instanceof Error ? err.message : 'Unknown error'
            })

            return fail(400, {
                errors: { _form: 'Unable to save changes right now. Please try again.' },
                values: parsed.values
            })
        }

        throw redirect(303, '/admin/prints')
    }
}
