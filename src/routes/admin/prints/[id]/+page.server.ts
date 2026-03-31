import type { PageServerLoad } from "./$types";
import { db } from "$lib/firebase/admin.server";
import { error } from "@sveltejs/kit";

type Print = {
    id: string,
    title: string,
    price: number,
    image: string,
    sizes: string[]
}

export const load: PageServerLoad = async ({params}) => {

    const doc = await db.collection('prints').doc(params.id).get()

    if (!doc.exists) {
        throw error(404, 'Print not found')
    }

    const print: Print = {
        id: doc.id,
        ...(doc.data() as Omit<Print, "id">) 
    }

    return {
        print
    }
}