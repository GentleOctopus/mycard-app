// src/lib/supabaseServerClient.js
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          // Bu kısım, Next.js'in çerez okuma işlemini doğru bir şekilde ele almasını sağlar.
          return cookieStore.get(name)?.value
        },
        set(name, value, options) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // Sunucu eyleminden çağrıldığında bu hata görmezden gelinebilir.
          }
        },
        remove(name, options) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // Sunucu eyleminden çağrıldığında bu hata görmezden gelinebilir.
          }
        },
      },
    }
  )
}