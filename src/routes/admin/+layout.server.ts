import {redirect} from "@sveltejs/kit"
import type { LayoutServerLoad } from './$types'
import { adminAuth } from "$lib/firebase/admin.server"



export const load: LayoutServerLoad = async ({cookies, url}) => {
    const session = cookies.get('session')

    if (url.pathname === '/admin/login') {
        return {}
    }

    if (!session) {
        throw redirect(302, `/admin/login?next=${encodeURIComponent(url.pathname)}`)
    }

    try {
        const decoded = await adminAuth.verifySessionCookie(session, true)
        return { uid: decoded.uid, email: decoded.email ?? null }
    } catch {
        cookies.delete('session', { path: '/' })
        throw redirect(302, '/admin/login')
    }
}
