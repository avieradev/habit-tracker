'use client'

import { useState, useEffect } from 'react'

interface Habit {
  id: string
  name: string
  description: string | null
  color: string
  emoji: string
  completions: { date: Date }[]
}

interface HabitListProps {
  habits: Habit[]
  userId: string
}

function calculateStreak(completions: { date: Date }[]): number {
  if (completions.length === 0) return 0
  
  const dates = completions.map(c => new Date(c.date).toISOString().split('T')[0])
  const uniqueDates = [...new Set(dates)].sort().reverse()
  
  let streak = 0
  const today = new Date().toISOString().split('T')[0]
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
  
  if (uniqueDates[0] === today || uniqueDates[0] === yesterday) {
    streak = 1
    for (let i = 1; i < uniqueDates.length; i++) {
      const prevDate = new Date(uniqueDates[i - 1])
      const currDate = new Date(uniqueDates[i])
      const diffDays = (prevDate.getTime() - currDate.getTime()) / (1000 * 60 * 60 * 24)
      
      if (diffDays === 1) {
        streak++
      } else {
        break
      }
    }
  }
  
  return streak
}

function getMotivationalMessage(streak: number, totalThisWeek: number): string {
  if (streak >= 7) return `¡🔥 Racha de ${streak} días! ¡Eres imparable!`
  if (streak >= 3) return `¡🔥 Llevas ${streak} días seguidos! ¡Sigue así!`
  if (streak === 1) return `¡Empezando fuerte! ¡Mañana día 2!`
  if (totalThisWeek >= 2) return `¡Ya van ${totalThisWeek} días esta semana! 💪`
  return '¡Hoy es el día perfecto para empezar! 🚀'
}

function getDaysThisWeek(completions: { date: Date }[]): number {
  const now = new Date()
  const weekStart = new Date(now.setDate(now.getDate() - now.getDay()))
  weekStart.setHours(0, 0, 0, 0)
  
  return completions.filter(c => new Date(c.date) >= weekStart).length
}

export function HabitList({ habits, userId }: HabitListProps) {
  const [completedToday, setCompletedToday] = useState<Set<string>>(new Set())
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    setToken(localStorage.getItem('habit_tracker_token'))
  }, [])

  const handleComplete = async (habitId: string) => {
    if (completedToday.has(habitId) || !token) return

    const res = await fetch(`/api/habits/${habitId}/complete`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (res.ok) {
      setCompletedToday(prev => new Set(prev).add(habitId))
      // Successfully marked - UI will update via local state
    }
  }

  if (habits.length === 0) {
    return (
      <div className="glass-card p-12 text-center">
        <p className="text-6xl mb-4">🎯</p>
        <p className="text-xl font-bold text-gray-700">No hay hábitos aún</p>
        <p className="text-gray-600 mt-2">Pide a Claws que cree el primero</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {habits.map((habit) => {
        const streak = calculateStreak(habit.completions)
        const daysThisWeek = getDaysThisWeek(habit.completions)
        const message = getMotivationalMessage(streak, daysThisWeek)
        const isCompleted = completedToday.has(habit.id)
        
        return (
          <div 
            key={habit.id} 
            className="glass-card p-6"
            style={{ borderColor: habit.color }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <span 
                  className="text-4xl p-3 rounded-xl border-2 border-black"
                  style={{ backgroundColor: habit.color }}
                >
                  {habit.emoji}
                </span>
                <div>
                  <h3 className="text-2xl font-black">{habit.name}</h3>
                  {habit.description && (
                    <p className="text-gray-700 font-medium">{habit.description}</p>
                  )}
                </div>
              </div>
              
              <div className="text-right">
                <div className="streak-fire text-4xl font-black text-orange-600">
                  {streak}
                </div>
                <div className="text-xs font-bold uppercase tracking-wide text-gray-600">
                  días 🔥
                </div>
              </div>
            </div>

            <p className="text-sm font-bold text-gray-700 mb-4 bg-white/50 inline-block px-3 py-1 rounded-full">
              {message}
            </p>

            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-gray-600">
                Esta semana: {daysThisWeek} días • Total: {habit.completions.length} días
              </div>
              <button
                onClick={() => handleComplete(habit.id)}
                disabled={isCompleted}
                className={isCompleted 
                  ? 'neo-button-completed px-6 py-3 font-black'
                  : 'neo-button px-6 py-3 font-black'
                }
              >
                {isCompleted ? '✅ ¡HECHO!' : 'MARCAR HECHO'}
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
