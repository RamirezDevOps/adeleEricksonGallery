import type { CloudinaryUploadWidgetResults } from 'svelte-cloudinary'

export const CLOUDINARY_UPLOAD_PRESET = "adeleEricksonGallery"

const PUBLIC_ID_PATTERN = /^[a-zA-Z0-9/_.,-]+$/
const MAX_PUBLIC_ID_LENGTH = 255

export function sanitizeCloudinaryPublicId(input: unknown) {
    if (typeof input !== 'string') {
        return ''
    }

    return input.trim()
}

export function validateCloudinaryPublicId(value: string, label: string) {
    if (!value) {
        return `${label} is required.`
    }

    if (value.length > MAX_PUBLIC_ID_LENGTH) {
        return `${label} must be ${MAX_PUBLIC_ID_LENGTH} characters or fewer.`
    }

    if (!PUBLIC_ID_PATTERN.test(value)) {
        return `${label} is invalid.`
    }

    return null
}

export function extractCloudinaryPublicId(result: CloudinaryUploadWidgetResults | unknown) {
    if (!result || typeof result !== 'object' || !('info' in result)) {
        return ''
    }

    const info = result.info

    if (!info || typeof info !== 'object' || !('public_id' in info)) {
        return ''
    }

    return sanitizeCloudinaryPublicId(info.public_id)
}
