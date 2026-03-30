import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { adminAuth } from "$lib/firebase/admin.server";

const FIVE_DAYS_MS = 5 * 24 * 60 * 60 * 1000;

export const POST: RequestHandler = async ({ request, cookies }) => {
    const { idToken } = await request.json();

    if (!idToken) {
        return json({ error: 'Missing idToken' }, { status: 400 });
    }

    try {
        const decoded = await adminAuth.verifyIdToken(idToken)

        const sessionCookie = await adminAuth.createSessionCookie(idToken, {
            expiresIn: FIVE_DAYS_MS
        });

        cookies.set('session', sessionCookie, {
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            path: "/",
            maxAge: FIVE_DAYS_MS / 1000
        })

        return json({ ok: true, uid: decoded.uid })

    } catch (err) {
        return json({ error: 'Invalid token' }, { status: 401 });
    }

}

export const DELETE: RequestHandler = async ({ cookies }) => {
    cookies.delete('session', { path: '/' });
    return json({ ok: true });
}