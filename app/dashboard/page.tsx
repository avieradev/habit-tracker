'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { HabitList } from '@/components/HabitList'

interface Habit {
  id: string
  name: string
  description: string | null
  color: string
  emoji: string
  completions: { date: Date }[]
}

interface User {
  id: string
  username: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [habits, setHabits] = useState<Habit[]>([])
  const [user, setUser] = useState<User | null>(null)
  const [isReady, setIsReady] = useState(false)
  const fetchedRef = useRef(false)

  useEffect(() => {
    if (fetchedRef.current) return
    fetchedRef.current = true

    const token = localStorage.getItem('habit_tracker_token')
    const userStr = localStorage.getItem('habit_tracker_user')

    if (!token) {
      router.push('/')
      return
    }

    if (userStr) {
      setUser(JSON.parse(userStr))
    }

    fetch('/api/habits', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => {
        if (!res.ok) {
          localStorage.removeItem('habit_tracker_token')
          localStorage.removeItem('habit_tracker_user')
          router.push('/')
          return
        }
        return res.json()
      })
      .then(data => {
        if (data) {
          setHabits(data)
        }
        setIsReady(true)
      })
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('habit_tracker_token')
    localStorage.removeItem('habit_tracker_user')
    router.push('/')
  }

  if (!isReady) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-2xl font-bold">Cargando...</div>
      </main>
    )
  }

  return (
    <main className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto">
        <header className="glass-card p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-black">🔥 Tus Hábitos</h1>
              <p className="text-gray-700 mt-1">¡Hola, {user?.username || 'usuario'}!</p>
            </div>
            <button 
              onClick={handleLogout}
              className="text-sm font-bold text-gray-600 hover:text-gray-900"
            >
              Salir
            </button>
          </div>
        </header>

        <HabitList habits={habits} userId={user?.id || ''} />
      </div>
    </main>
  )
}
