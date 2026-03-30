import type { PageServerLoad } from "./$types";
import { db } from "$lib/firebase/admin.server";
import { error } from "@sveltejs/kit";

type Artwork = {
    id: string,
    title: string,
    price: number,
    size: string,
    year: number,
    image: string,
    sold?: boolean
}

export const load: PageServerLoad = async ({params}) => {
    const doc = await db.collection('artworks').doc(params.id).get()

    if (!doc.exists) {
        throw error(404, 'Artwork not found')
    }

    const artwork: Artwork = {
        id: doc.id,
        ...(doc.data() as Omit<Artwork, 'id'>)
    }

    return {
        artwork
    }
}