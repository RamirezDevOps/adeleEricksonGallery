import type { PageServerLoad } from './$types'
import { db } from '$lib/firebase/admin.server'

type Artwork = {
    id: string,
    title: string,
    price: number,
    size: string,
    year: number,
    imagePublicId: string,
    sold?: boolean
}

export const load: PageServerLoad = async () => {

    const snapshot = await db.collection('artworks').orderBy('year', 'desc').get()

    const artworks = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Artwork, 'id'>)
    }))

    return {
        artworks
    }
}
