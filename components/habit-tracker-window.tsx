"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import Image from "next/image"

interface Habit {
  id: string
  identity: string
  action: string
  cue: string
  emoji: string
  streak: number
  lastCompleted: string | null
  completions: string[]
}

interface HabitData {
  habits: Habit[]
  weeklyReflection: {
    lastWeek: string | null
    reflection: string
  }
}

const DEFAULT_HABITS: Habit[] = [
  {
    id: "exercise",
    identity: "I am someone who exercises daily",
    action: "Do 10 pushups",
    cue: "After morning coffee",
    emoji: "💪",
    streak: 0,
    lastCompleted: null,
    completions: []
  },
  {
    id: "water",
    identity: "I am someone who stays hydrated",
    action: "Drink a glass of water",
    cue: "",
    emoji: "💧",
    streak: 0,
    lastCompleted: null,
    completions: []
  }
]

interface HabitTrackerWindowProps {
  onCompletionChange?: (completed: number, total: number) => void
}

export const HabitTrackerWindow: React.FC<HabitTrackerWindowProps> = ({ onCompletionChange }) => {
  const [data, setData] = useState<HabitData>({
    habits: [],
    weeklyReflection: { lastWeek: null, reflection: "" }
  })
  const [showAddForm, setShowAddForm] = useState(false)
  const [quickAdd, setQuickAdd] = useState("")
  const [celebrateHabit, setCelebrateHabit] = useState<string | null>(null)

  const today = new Date().toISOString().split('T')[0]

  useEffect(() => {
    const savedData = localStorage.getItem("habits")
    if (savedData) {
      setData(JSON.parse(savedData))
    } else {
      // Set default habits if no data exists
      setData(prevData => ({
        ...prevData,
        habits: DEFAULT_HABITS
      }))
    }
  }, [])

  useEffect(() => {
    const completed = data.habits.filter(habit =>
      habit.lastCompleted === new Date().toISOString().split('T')[0]
    ).length
    onCompletionChange?.(completed, data.habits.length)
  }, [data.habits, onCompletionChange])

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('habitTrackerData', JSON.stringify(data))
  }, [data])

  const isCompletedToday = (habit: Habit): boolean => {
    return habit.completions.includes(today)
  }

  const getStreakCount = (habit: Habit): number => {
    if (habit.completions.length === 0) return 0

    const sortedDates = [...habit.completions].sort().reverse()
    let streak = 0
    let checkDate = new Date()

    for (const completion of sortedDates) {
      const completionDate = new Date(completion)
      const daysDiff = Math.floor((checkDate.getTime() - completionDate.getTime()) / (1000 * 60 * 60 * 24))

      if (daysDiff === streak) {
        streak++
        checkDate = new Date(completionDate)
      } else {
        break
      }
    }

    return streak
  }

  const handleCompleteHabit = (habitId: string) => {
    setData(prevData => {
      const updatedHabits = prevData.habits.map(habit => {
        if (habit.id === habitId) {
          const isAlreadyCompleted = isCompletedToday(habit)
          let newCompletions: string[]

          if (isAlreadyCompleted) {
            newCompletions = habit.completions.filter(date => date !== today)
          } else {
            newCompletions = [...habit.completions, today]
            setCelebrateHabit(habitId)
            setTimeout(() => setCelebrateHabit(null), 2000)
          }

          return {
            ...habit,
            completions: newCompletions,
            lastCompleted: isAlreadyCompleted ? habit.lastCompleted : today,
            streak: getStreakCount({ ...habit, completions: newCompletions })
          }
        }
        return habit
      })

      return { ...prevData, habits: updatedHabits }
    })
  }

  const handleQuickAdd = () => {
    if (!quickAdd.trim()) return

    const habit: Habit = {
      id: Date.now().toString(),
      identity: `I am someone who ${quickAdd.toLowerCase()}`,
      action: quickAdd,
      cue: "",
      emoji: "✨",
      streak: 0,
      lastCompleted: null,
      completions: []
    }

    setData(prevData => ({
      ...prevData,
      habits: [...prevData.habits, habit]
    }))
    setQuickAdd("")
  }

  const handleDeleteHabit = (habitId: string) => {
    setData(prevData => ({
      ...prevData,
      habits: prevData.habits.filter(habit => habit.id !== habitId)
    }))
  }

  const getTotalCompletionsToday = () => {
    return data.habits.filter(habit => isCompletedToday(habit)).length
  }

  return (
    <div className="widget-content habit-tracker-content h-full" style={{
      background: 'linear-gradient(to bottom, #673ab7, #4a148c)',
      color: '#ffffff'
    }}>
      <div className="habit-tracker-main p-2 space-y-1.5 overflow-y-auto h-full">
        {/* Quick Add Section */}
        <div className="space-y-1.5">
          <div className="flex gap-2">
            <Input
              placeholder="Quick add: 'drink water', 'exercise'..."
              value={quickAdd}
              onChange={(e) => setQuickAdd(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleQuickAdd()
                }
              }}
              className="text-base text-md flex-1 bg-white/10 text-white placeholder:text-white/50"
              style={{ border: '1px solid rgba(255, 255, 255, 0.2)' }}
            />
            <Button
              onClick={handleQuickAdd}
              size="sm"
              disabled={!quickAdd.trim()}
              variant="ghost"
              className="p-4 btn-complete text-white hover:bg-white/10"
              style={{
                minWidth: '40px',
                height: '32px',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
            >
              <img src="/assets/icons/Plus_Blue.png" alt="Add" className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Habits List */}
        {data.habits.length === 0 ? (
          <div className="text-center py-8 text-white/70">
            <img
              src="/assets/icons/Circle_Blue.png"
              alt="Target"
              className="w-12 h-12 mx-auto mb-3 opacity-50"

            />
            <p className="text-base mb-1">
              No habits yet
            </p>
            <p className="text-sm">
              Add your first habit above
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {data.habits.map((habit) => {
              const completed = isCompletedToday(habit)
              const streak = getStreakCount(habit)
              const isCelebrating = celebrateHabit === habit.id

              return (
                <Card key={habit.id} className={`relative habit-card bg-white/10 border-white/20 ${completed ? 'completed' : ''
                  } ${isCelebrating ? 'animate-bounce' : ''}`}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteHabit(habit.id)}
                    className="absolute top-1 right-1 h-6 w-6 p-0 text-white/70 hover:text-red-400 z-10"
                  >
                    <img
                      src="/assets/icons/Letter X_Blue.png"
                      alt="Delete"
                      className="w-3 h-3"
                    />
                  </Button>

                  <div className="p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCompleteHabit(habit.id)}
                        className={`h-10 w-10 p-0 text-lg font-medium btn-complete hover:bg-white/10 ${completed ? 'completed' : ''
                          }`}
                        style={{ border: '1px solid rgba(255, 255, 255, 0.2)' }}
                      >
                        {completed ? (
                          <img
                            src="/assets/icons/Circle_Blue.png"
                            alt="Completed"
                            className="w-5 h-5"
                          />
                        ) : habit.emoji}
                      </Button>

                      <div className="flex-1 text-white">
                        <h3 className="text-base leading-tight font-medium">
                          {habit.action}
                        </h3>
                        {habit.cue && (
                          <p className="text-sm mt-1 text-white/70">
                            {habit.cue}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <span className="text-base">🔥</span>
                          <span className="text-white/70 font-bold">
                            {streak} day{streak !== 1 ? 's' : ''}
                          </span>
                        </div>

                        {isCelebrating && (
                          <div className="flex items-center gap-1">
                            <span className="text-base animate-spin">✨</span>
                            <span className="text-white/70 font-bold">
                              Great job!
                            </span>
                          </div>
                        )}
                      </div>

                      {completed && (
                        <span className="leading-tight font-bold text-green-300">
                          ✓ Done
                        </span>
                      )}
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        )}

        {/* Progress Summary */}
        {data.habits.length > 0 && (
          <div className="mt-3 p-3 bg-blue-400 font-bold" style={{
            background: 'linear-gradient(145deg,rgb(19, 229, 19) 0%,rgb(0, 48, 11) 100%)',
            border: '2px inset #d4d4d4'
          }}>
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/70">
                Today's Progress
              </span>
              <span className="text-white/70">
                {getTotalCompletionsToday()}/{data.habits.length}
              </span>
            </div>
            <div className="mt-2 w-full h-2.5 bg-white/10 rounded overflow-hidden">
              <div
                className="h-full transition-all duration-300"
                style={{
                  width: `${data.habits.length > 0 ? (getTotalCompletionsToday() / data.habits.length) * 100 : 0}%`,
                  background: '#32CD32'
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

HabitTrackerWindow.displayName = "HabitTrackerWindow" 