import type { PageServerLoad } from './$types'
import { db } from '$lib/firebase/admin.server'

type Print = {
    id: string,
    title: string,
    price: number,
    image: string,
}

export const load: PageServerLoad = async () => {

    const snapshot = await db.collection('prints').get()

    const prints = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Print, 'id'>)
    }))

    return {
        prints
    }
}
