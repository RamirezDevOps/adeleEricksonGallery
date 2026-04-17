import { initializeApp, cert, getApps } from "firebase-admin/app"
import { getAuth } from "firebase-admin/auth"
import { getFirestore } from "firebase-admin/firestore"
import { env } from '$env/dynamic/private'

function getPrivateKey() {
    const key = env.FIREBASE_PRIVATE_KEY
    if (!key) return undefined
    return key.replace(/\\n/g, '\n')
}

if (!getApps().length) {
    initializeApp({
        credential: cert({
            projectId: "adeleericksongallery",
            clientEmail: env.FIREBASE_CLIENT_EMAIL,
            privateKey: getPrivateKey()
        })
    })
}

export const adminAuth = getAuth()
export const db = getFirestore()