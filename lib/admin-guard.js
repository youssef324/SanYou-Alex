import { auth } from "@/lib/auth"

export async function adminGuard() {
    const session = await auth()
    if (!session?.user?.id || session.user.role !== 1) {
        return null
    }
    return session
}
