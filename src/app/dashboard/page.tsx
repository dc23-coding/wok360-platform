'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/utils/supabase/client'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser()

      if (error || !user) {
        router.push('/login') // not logged in
      } else {
        setUser(user)
      }

      setLoading(false)
    }

    getUser()
  }, [router])

  if (loading) {
    return <div className="p-10 text-center">Loading...</div>
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6 sm:p-10">
      <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-gray-900">
        Welcome back, {user?.user_metadata?.firstName || 'Friend'} 👋
      </h1>

      <section className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl bg-white shadow-md p-6 hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold text-gray-800">Karma Points</h2>
          <p className="text-gray-600 mt-2 text-lg">💎 1,250</p>
        </div>

        <div className="rounded-2xl bg-white shadow-md p-6 hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold text-gray-800">Completed Tasks</h2>
          <p className="text-gray-600 mt-2 text-lg">✅ 48</p>
        </div>

        <div className="rounded-2xl bg-white shadow-md p-6 hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold text-gray-800">Next Goal</h2>
          <p className="text-gray-600 mt-2 text-lg">🌱 Plant 10 more trees</p>
        </div>
      </section>
    </main>
  )
}
