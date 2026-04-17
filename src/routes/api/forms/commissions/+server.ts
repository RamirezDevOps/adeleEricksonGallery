import { db } from "$lib/firebase/admin.server"
import { Timestamp } from "firebase-admin/firestore"

function sanitize(input: unknown) {
    if (typeof input !== 'string') return ''
    return input.trim().replace(/<[^>]*>?/gm, '').replace(/[<>]/g, '')
}

export async function POST({request}) {
    const body = await request.json()

    const name = sanitize(body.name)
    const email = sanitize(body.email)
    const message = sanitize(body.message)

    if (!name || !email || !message) {
        return new Response("Invalid input", { status: 400 })
    }

    if (message.length > 2000) {
        return new Response("Message too long", { status: 400 })
    }

    await db.collection("inquiries").add({
        type: 'commission',
        name,
        email,
        message,

        relatedType: null,
        relatedId: null,
        relatedTitle: null,
        status: 'unread',
        createdAt: Timestamp.now()
    })

    return new Response(JSON.stringify({success: true}), {status: 200})
}