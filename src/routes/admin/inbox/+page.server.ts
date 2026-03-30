import { db } from "$lib/firebase/admin.server";

export async function load() {
    const snapshot = await db.collection("inquiries").orderBy("createdAt", "desc").get()

    const inquiries = snapshot.docs.map(doc => {
        const data = doc.data()

        return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toMillis()
        }
    })

    return {inquiries}
}