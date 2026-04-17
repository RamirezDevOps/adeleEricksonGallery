import { db } from '$lib/firebase/admin.server'
import { Timestamp } from 'firebase-admin/firestore'

function sanitize(input: unknown) {
    if (typeof input !== 'string') return ''
    return input.trim().replace(/<[^>]*>?/gm, '').replace(/[<>]/g, '')
}

export async function POST({ request }) {
    const body = await request.json()

    const name = sanitize(body.name)
    const email = sanitize(body.email)
    const message = sanitize(body.message)
    const relatedType = sanitize(body.relatedType)
    const relatedId = sanitize(body.relatedId)
    const relatedTitle = sanitize(body.relatedTitle)

    if (!name || !email || !message || !relatedType || !relatedId || !relatedTitle) {
        return new Response('Invalid input', { status: 400 })
    }

    if (!['artwork', 'print'].includes(relatedType)) {
        return new Response('Invalid input', { status: 400 })
    }

    if (message.length > 2000) {
        return new Response('Message too long', { status: 400 })
    }

    await db.collection('inquiries').add({
        type: 'purchase',
        name,
        email,
        message,
        relatedType,
        relatedId,
        relatedTitle,
        status: 'unread',
        createdAt: Timestamp.now()
    })

    return new Response(JSON.stringify({ success: true }), { status: 200 })
}
