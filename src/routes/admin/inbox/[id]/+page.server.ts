import { db } from '$lib/firebase/admin.server'
import { error, fail, redirect } from '@sveltejs/kit'
import type { Actions } from './$types'

async function getInquiryOrThrow(id: string) {
    const docRef = db.collection('inquiries').doc(id)
    const doc = await docRef.get()

    if (!doc.exists) {
        throw error(404, 'Inquiry not found')
    }

    return { docRef, doc }
}

export async function load({ params }) {
    const { docRef, doc } = await getInquiryOrThrow(params.id)
    const data = doc.data()

    if (data?.status === 'unread') {
        await docRef.update({ status: 'read' })
    }

    return {
        inquiry: {
            id: doc.id,
            ...data,
            status: data?.status === 'unread' ? 'read' : data?.status,
            createdAt: data?.createdAt?.toDate?.()?.getTime?.()
        }
    }
}

export const actions: Actions = {
    markUnread: async ({ params }) => {
        const { docRef } = await getInquiryOrThrow(params.id)

        try {
            await docRef.update({ status: 'unread' })
        } catch (err) {
            console.error('Failed to mark inquiry as unread', {
                inquiryId: params.id,
                message: err instanceof Error ? err.message : 'Unknown error'
            })

            return fail(400, { error: 'Unable to update inquiry right now.' })
        }

        throw redirect(303, '/admin/inbox')
    },
    delete: async ({ params }) => {
        const { docRef } = await getInquiryOrThrow(params.id)

        try {
            await docRef.delete()
        } catch (err) {
            console.error('Failed to delete inquiry', {
                inquiryId: params.id,
                message: err instanceof Error ? err.message : 'Unknown error'
            })

            return fail(400, { error: 'Unable to delete inquiry right now.' })
        }

        throw redirect(303, '/admin/inbox')
    }
}
