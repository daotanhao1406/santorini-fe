import { cookies } from 'next/headers'
import { v4 as uuidv4 } from 'uuid'

export async function getOrCreateCartSession() {
  const cookieStore = await cookies()
  let sessionId = cookieStore.get('cart_session')?.value

  if (!sessionId) {
    sessionId = uuidv4()
    cookieStore.set('cart_session', sessionId, { maxAge: 60 * 60 * 24 * 7 })
  }

  return sessionId
}
