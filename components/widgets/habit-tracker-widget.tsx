"use client"

import React, { useState } from "react"
import type { Widget, Settings } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import Image from "next/image"
// Using PNG icons instead of SVG icons

interface HabitTrackerWidgetProps {
  widget: Widget
  updateWidgetData: (widgetId: string, newData: Record<string, unknown>) => void
  settings: Settings
}

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

export const HabitTrackerWidget = React.memo(({ widget, updateWidgetData }: HabitTrackerWidgetProps) => {
  const [quickAdd, setQuickAdd] = useState("")
  const [celebrateHabit, setCelebrateHabit] = useState<string | null>(null)

  const data: HabitData = widget.data || {
    habits: [],
    weeklyReflection: { lastWeek: null, reflection: "" }
  }

  const today = new Date().toISOString().split('T')[0]

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
    const updatedHabits = data.habits.map(habit => {
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

    updateWidgetData(widget.id, { ...data, habits: updatedHabits })
  }

  const handleQuickAdd = () => {
    if (!quickAdd.trim()) return

    console.log("Adding habit:", quickAdd)

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

    const updatedHabits = [...data.habits, habit]
    updateWidgetData(widget.id, { ...data, habits: updatedHabits })
    setQuickAdd("")
  }

  const handleDeleteHabit = (habitId: string) => {
    const updatedHabits = data.habits.filter(habit => habit.id !== habitId)
    updateWidgetData(widget.id, { ...data, habits: updatedHabits })
  }

  const getTotalCompletionsToday = () => {
    return data.habits.filter(habit => isCompletedToday(habit)).length
  }

  return (
    <div className="widget-content habit-tracker-content">
      <div className="widget-title-bar flex items-center justify-between">
        <span className="widget-title flex items-center">
          <Image src="/assets/icons/Circle_Blue.png" alt="Target" width={16} height={16} className="inline w-4 h-4 mr-2" />
          <span className="font-semibold">Habits</span>
          {getTotalCompletionsToday() > 0 && (
            <span className="ml-2 text-xs px-2 py-0.5" style={{
              background: 'linear-gradient(145deg, #90EE90 0%, #32CD32 100%)',
              border: '1px outset #90EE90',
              color: '#000000',
            }}>
              {getTotalCompletionsToday()}/{data.habits.length}
            </span>
          )}
        </span>
      </div>

      <div className="habit-tracker-main p-2 space-y-1.5 max-h-64 overflow-y-auto">
        {/* Quick Add Section */}
        <div className="space-y-1.5">
          <div className="flex gap-2">
            <Input
              placeholder="Quick add: 'drink water', 'exercise'..."
              value={quickAdd}
              onChange={(e) => {
                e.stopPropagation()
                setQuickAdd(e.target.value)
              }}
              onKeyDown={(e) => {
                e.stopPropagation()
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleQuickAdd()
                }
              }}
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
              onFocus={(e) => e.stopPropagation()}
              className="text-sm flex-1"
            />
            <Button
              onClick={(e) => {
                e.stopPropagation()
                handleQuickAdd()
              }}
              size="sm"
              disabled={!quickAdd.trim()}
              variant="ghost"
              className="px-3 btn-complete"
              style={{
                minWidth: '40px',
                height: '32px'
              }}
            >
              <Image src="/assets/icons/Plus_Blue.png" alt="Add" width={16} height={16} className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Habits List */}
        {data.habits.length === 0 ? (
          <div className="text-center py-8" style={{ color: '#808080' }}>
            <Image src="/assets/icons/Circle_Blue.png" alt="Target" width={48} height={48} className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm mb-1">
              No habits yet
            </p>
            <p className="text-xs">
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
                <Card key={habit.id} className={`relative habit-card ${completed ? 'completed' : ''
                  } ${isCelebrating ? 'animate-bounce' : ''}`}>

                  {/* Delete button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteHabit(habit.id)
                    }}
                    className="absolute top-1 right-1 h-6 w-6 p-0 text-gray-400 hover:text-red-500 z-10"
                  >
                    <Image src="/assets/icons/Letter X_Blue.png" alt="Delete" width={12} height={12} className="w-3 h-3" />
                  </Button>

                  <div className="p-2">
                    {/* Main Action Button */}
                    <div className="flex items-center gap-2 mb-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleCompleteHabit(habit.id)
                        }}
                        className={`h-8 w-8 p-0 text-sm font-medium btn-complete ${completed ? 'completed' : ''
                          }`}
                      >
                        {completed ? <Image src="/assets/icons/Circle_Blue.png" alt="Completed" width={20} height={20} className="w-5 h-5" /> : habit.emoji}
                      </Button>

                      <div className="flex-1">
                        <h3 className="text-sm leading-tight">
                          {habit.action}
                        </h3>
                        {habit.cue && (
                          <p className="text-xs mt-1 cue-text">
                            {habit.cue}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Stats Row */}
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <span className="text-sm">🔥</span>
                          <span className="stats-text">
                            {streak} day{streak !== 1 ? 's' : ''}
                          </span>
                        </div>

                        {isCelebrating && (
                          <div className="flex items-center gap-1">
                            <span className="text-sm animate-spin">✨</span>
                            <span className="stats-text">
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
          <div className="mt-3 p-2" style={{
            background: 'linear-gradient(145deg, #f0f0f0 0%, #e0e0e0 100%)',
            border: '2px inset #d4d4d4'
          }}>
            <div className="flex items-center justify-between text-xs">
              <span className="leading-tight font-bold text-black">
                Today&apos;s Progress
              </span>
              <span className="leading-tight font-bold text-black">
                {getTotalCompletionsToday()}/{data.habits.length}
              </span>
            </div>
            <div className="mt-2 w-full h-2 progress-bar">
              <div
                className="h-2 transition-all duration-300 progress-fill"
                style={{
                  width: `${data.habits.length > 0 ? (getTotalCompletionsToday() / data.habits.length) * 100 : 0}%`
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
})

HabitTrackerWidget.displayName = "HabitTrackerWidget" 