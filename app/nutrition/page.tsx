'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import NutritionTracker from '@/components/NutritionTracker'
import { startOfWeek, format } from 'date-fns'
import { Activity, AlertCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { theme } from '@/lib/theme'

const colors = theme.colors

// Define proper types
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
}

interface MealPlan {
    [key: string]: Recipe | undefined
}

export default function NutritionPage() {
    const [mealPlan, setMealPlan] = useState<MealPlan | null>(null)
    const [recipes, setRecipes] = useState<Recipe[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)  // Fixed: string | null instead of null
    const supabase = createClient()

    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 })
    const weekStartStr = format(weekStart, 'yyyy-MM-dd')

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        try {
            setError(null)
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                setLoading(false)
                return
            }

            // Load meal plan
            const { data: plans, error: plansError } = await supabase
                .from('meal_plans')
                .select('*')
                .eq('user_id', user.id)
                .eq('week_start', weekStartStr)
                .maybeSingle()

            if (plansError) {
                console.error('Error loading meal plan:', plansError)
                setError('Failed to load meal plan')
            } else if (plans) {
                console.log('Meal plan loaded:', plans.meals)
                const meals = plans.meals || {}
                setMealPlan(meals)
            } else {
                setMealPlan(null)
            }

            // Load all recipes
            const { data: recipesData, error: recipesError } = await supabase
                .from('recipes')
                .select('*')
                .eq('user_id', user.id)

            if (recipesError) {
                console.error('Error loading recipes:', recipesError)
                setError('Failed to load recipes')
            } else if (recipesData) {
                console.log('Recipes loaded:', recipesData.length)
                setRecipes(recipesData as Recipe[])  // Fixed: Type assertion
            }
        } catch (err) {
            console.error('Unexpected error:', err)
            setError('An unexpected error occurred')
        } finally {
            setLoading(false)
        }
    }

    // Clean loading state
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: colors.bg }}>
                <div className="text-center">
                    <div className="relative w-16 h-16 mx-auto">
                        <div className="absolute inset-0 rounded-full border-4 border-t-transparent animate-spin" style={{ borderColor: colors.accent, borderTopColor: 'transparent' }} />
                        <div className="absolute inset-0 rounded-full border-4 border-t-transparent animate-pulse opacity-20" style={{ borderColor: colors.accent, borderTopColor: 'transparent' }} />
                    </div>
                    <p className="mt-6 text-sm font-medium" style={{ color: colors.textMuted }}>Loading nutrition data...</p>
                </div>
            </div>
        )
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: colors.bg }}>
                <div className="text-center max-w-md mx-auto p-8 rounded-2xl" style={{ background: colors.bgSecondary, border: `1px solid ${colors.border}` }}>
                    <div className="text-5xl mb-4">⚠️</div>
                    <h3 className="text-xl font-semibold mb-2" style={{ color: colors.text }}>Something went wrong</h3>
                    <p className="text-sm mb-6" style={{ color: colors.textMuted }}>{error}</p>
                    <button
                        onClick={() => loadData()}
                        className="px-6 py-2.5 rounded-xl font-semibold transition-all hover:opacity-90"
                        style={{ background: colors.accent, color: '#fff' }}
                    >
                        Try Again
                    </button>
                </div>
            </div>
        )
    }

    // Check if mealPlan has any actual meals
    const hasValidMealPlan = mealPlan && Object.keys(mealPlan).length > 0 &&
        Object.values(mealPlan).some(meal => meal !== null && meal !== undefined)

    return (
        <div className="min-h-screen" style={{ background: colors.bg }}>
            <div className="container mx-auto px-4 md:px-6 py-10 max-w-7xl">

                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-10"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4" style={{ background: `${colors.accent}15` }}>
                        <Activity className="w-4 h-4" style={{ color: colors.accent }} />
                        <span className="text-xs font-semibold" style={{ color: colors.accent }}>Health Tracking</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-3" style={{ fontFamily: theme.fontHeading, color: colors.text }}>
                        Nutrition Tracker
                    </h1>
                    <p className="text-sm max-w-md mx-auto flex items-center justify-center gap-2" style={{ color: colors.textMuted }}>
                        <Activity className="w-4 h-4" />
                        Week of {format(weekStart, 'MMMM d, yyyy')}
                    </p>
                </motion.div>

                {/* Content based on meal plan existence */}
                {!hasValidMealPlan ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-2xl p-12 text-center"
                        style={{ background: colors.bgSecondary, border: `1px solid ${colors.border}` }}
                    >
                        <div className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ background: `${colors.warning}15` }}>
                            <AlertCircle className="w-10 h-10" style={{ color: colors.warning }} />
                        </div>
                        <h3 className="text-xl font-semibold mb-2" style={{ color: colors.text }}>No Meal Plan Found</h3>
                        <p className="text-sm mb-6 max-w-md mx-auto" style={{ color: colors.textMuted }}>
                            Create a meal plan first to see your nutrition breakdown, calories, and macros.
                        </p>
                        <button
                            onClick={() => window.location.href = '/planner'}
                            className="px-6 py-2.5 rounded-xl font-semibold transition-all hover:opacity-90"
                            style={{ background: colors.accent, color: '#fff' }}
                        >
                            Go to Meal Planner
                        </button>
                    </motion.div>
                ) : (
                    <NutritionTracker mealPlan={mealPlan} recipes={recipes} />
                )}
            </div>
        </div>
    )
}