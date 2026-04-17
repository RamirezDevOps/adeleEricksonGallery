import { db } from '$lib/firebase/admin.server'
import { normalizeStoredPrintSize, type PrintSize } from '$lib/prints'
import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

type Print = {
    id: string
    title: string
    price: number
    imagePublicId: string
    size: PrintSize | null
}

export const load: PageServerLoad = async ({ params }) => {
    const doc = await db.collection('prints').doc(params.id).get()

    if (!doc.exists) {
        throw error(404, 'Print not found')
    }

    const print: Print = {
        id: doc.id,
        ...(doc.data() as Omit<Print, 'id'>),
        size: normalizeStoredPrintSize(doc.data()?.size ?? null)
    }

    return { print }
}
