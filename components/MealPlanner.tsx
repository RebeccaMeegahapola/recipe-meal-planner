'use client'
import { useState, useEffect } from 'react'
import { Plus, X, Save, Clock } from 'lucide-react'
import { format, startOfWeek, addDays } from 'date-fns'
import { theme } from '@/lib/theme'

const colors = theme.colors

interface Recipe {
    id: string
    title: string
    image?: string
    ingredients?: string[] | { name: string }[]
    instructions?: string[]
    ready_in_minutes?: number
    servings?: number
    nutrition?: {
        calories: number
        protein: number
        carbs: number
        fat: number
    }
    saved_at?: string
}

interface MealPlan {
    [key: string]: Recipe | undefined  // Key format: "Monday-breakfast"
}

interface RecipePickerState {
    day: string        // Which day (Monday, Tuesday, etc.)
    mealType: string   // Which meal (breakfast, lunch, dinner)
}

interface MealPlannerProps {
    savedRecipes: Recipe[]        // User's saved recipes to pick from
    onSavePlan: (mealPlan: MealPlan) => void  // Save callback
    initialPlan: MealPlan | null  // Existing plan to load
}

const days: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const mealTypes: string[] = ['breakfast', 'lunch', 'dinner']

const mealIcons: { [key: string]: string } = {
    breakfast: '🍳',
    lunch: '🥗',
    dinner: '🍝'
}

export default function MealPlanner({ savedRecipes, onSavePlan, initialPlan }: MealPlannerProps) {
    const [mealPlan, setMealPlan] = useState<MealPlan>(initialPlan || {})
    const [showRecipePicker, setShowRecipePicker] = useState<RecipePickerState | null>(null)

    useEffect(() => {
        if (initialPlan) {
            setMealPlan(initialPlan)  // Load saved plan from parent
        }
    }, [initialPlan])

    const addMeal = (day: string, mealType: string, recipe: Recipe) => {
        const key = `${day}-${mealType}`           // Example: "Monday-breakfast"
        setMealPlan({
            ...mealPlan,                           // Keep existing meals
            [key]: recipe                          // Add/overwrite this slot
        })
        setShowRecipePicker(null)                  // Close modal
    }

    const removeMeal = (day: string, mealType: string) => {
        const key = `${day}-${mealType}`
        const newPlan = { ...mealPlan }    // Create copy
        delete newPlan[key]                // Remove the slot
        setMealPlan(newPlan)               // Update state
    }

    const savePlan = () => {
        onSavePlan(mealPlan)  // Send meal plan to parent component
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold" style={{ color: colors.text, fontFamily: theme.fontHeading }}>
                        Weekly Meal Plan
                    </h2>
                    <p className="text-sm" style={{ color: colors.textMuted }}>Plan your meals for the week ahead</p>
                </div>
                <button
                    onClick={savePlan}
                    className="px-5 py-2.5 rounded-xl font-semibold transition-all hover:opacity-90 flex items-center gap-2 shadow-sm"
                    style={{ background: colors.accent, color: '#fff' }}
                >
                    <Save className="w-4 h-4" />
                    Save Plan
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
                {days.map((day, index) => {
                    const date = addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), index)

                    return (
                        <div key={day} className="rounded-xl overflow-hidden shadow-sm" style={{ background: colors.bgSecondary, border: `1px solid ${colors.border}` }}>
                            <div className="p-3 text-center" style={{ background: colors.accent }}>
                                <div className="font-semibold text-sm" style={{ color: '#fff' }}>{day}</div>
                                <div className="text-xs opacity-90" style={{ color: colors.textWhite }}>{format(date, 'MMM d')}</div>
                            </div>

                            <div className="p-3 space-y-3">
                                {mealTypes.map((mealType) => {
                                    const key = `${day}-${mealType}`
                                    const recipe = mealPlan[key]

                                    return (
                                        <div key={mealType} className="relative">
                                            {recipe ? (
                                                <div className="rounded-lg p-2 relative group transition-all hover:shadow-sm" style={{ background: colors.bg, border: `1px solid ${colors.border}` }}>
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1">
                                                            <div className="text-xs mb-1" style={{ color: colors.accent }}>
                                                                {mealIcons[mealType]} {mealType}
                                                            </div>
                                                            <p className="text-sm font-medium line-clamp-2" style={{ color: colors.text }}>
                                                                {recipe.title}
                                                            </p>
                                                            {recipe.ready_in_minutes && (
                                                                <p className="text-xs mt-1 flex items-center gap-1" style={{ color: colors.textMuted }}>
                                                                    <Clock className="w-3 h-3" />
                                                                    {recipe.ready_in_minutes} min
                                                                </p>
                                                            )}
                                                        </div>
                                                        <button
                                                            onClick={() => removeMeal(day, mealType)}
                                                            className="opacity-0 group-hover:opacity-100 transition p-1 rounded hover:opacity-80"
                                                        >
                                                            <X className="w-3 h-3" style={{ color: colors.error }} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => setShowRecipePicker({ day, mealType })}
                                                    className="w-full border-2 border-dashed rounded-lg p-2 text-center transition-all hover:shadow-sm"
                                                    style={{ borderColor: colors.border, background: colors.bg }}
                                                >
                                                    <Plus className="w-4 h-4 mx-auto" style={{ color: colors.textMuted }} />
                                                    <span className="text-xs" style={{ color: colors.textMuted }}>Add {mealType}</span>
                                                </button>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Recipe Picker Modal */}
            {showRecipePicker && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onClick={() => setShowRecipePicker(null)}>
                    <div
                        className="rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
                        style={{ background: colors.bgSecondary, border: `1px solid ${colors.border}` }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div
                            className="sticky top-0 p-4 border-b flex justify-between items-center"
                            style={{ background: colors.bgSecondary, borderBottomColor: colors.border }}
                        >
                            <h3 className="text-lg font-semibold" style={{ color: colors.text, fontFamily: theme.fontHeading }}>
                                Select {showRecipePicker.mealType} for {showRecipePicker.day}
                            </h3>
                            <button
                                onClick={() => setShowRecipePicker(null)}
                                className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:opacity-70"
                                style={{ background: colors.bgHover }}
                            >
                                <X className="w-4 h-4" style={{ color: colors.text }} />
                            </button>
                        </div>

                        <div className="p-4 space-y-3">
                            {savedRecipes.length > 0 ? (
                                savedRecipes.map((recipe) => (
                                    <button
                                        key={recipe.id}
                                        onClick={() => addMeal(showRecipePicker.day, showRecipePicker.mealType, recipe)}
                                        className="w-full text-left p-3 rounded-lg transition-all hover:shadow-sm flex gap-3"
                                        style={{ background: colors.bg, border: `1px solid ${colors.border}` }}
                                    >
                                        <img
                                            src={recipe.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=60&h=60&fit=crop'}
                                            alt={recipe.title}
                                            className="w-12 h-12 object-cover rounded-lg"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=60&h=60&fit=crop'
                                            }}
                                        />
                                        <div className="flex-1">
                                            <p className="font-medium text-sm" style={{ color: colors.text }}>{recipe.title}</p>
                                            {recipe.ready_in_minutes && (
                                                <p className="text-xs flex items-center gap-1 mt-1" style={{ color: colors.textMuted }}>
                                                    <Clock className="w-3 h-3" />
                                                    {recipe.ready_in_minutes} min
                                                </p>
                                            )}
                                        </div>
                                    </button>
                                ))
                            ) : (
                                <div className="text-center py-8">
                                    <p style={{ color: colors.textMuted }}>No saved recipes yet.</p>
                                    <p className="text-sm mt-1" style={{ color: colors.textMuted }}>Go to Recipes page to save some!</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}