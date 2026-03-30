import { db } from "$lib/firebase/admin.server";
import { error } from "@sveltejs/kit";

export async function load({ params }) {

    const docRef = db.collection("inquiries").doc(params.id)

    const doc = await docRef.get()

    if (!doc.exists) {
        throw error(404, "Inquiry not found")
    }

    const data = doc.data()

    if (data?.status === "unread") {
        await docRef.update({ status: "read" })
    }

    return {
        inquiry: {
            id: doc.id,
            ...data,
            createdAt: data?.createdAt?.toMillis()
        }
    }
}