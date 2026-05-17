'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import MealPlanner from '@/components/MealPlanner'
import { startOfWeek, format } from 'date-fns'
import toast from 'react-hot-toast'
import { Calendar, ChefHat } from 'lucide-react'
import { motion } from 'framer-motion'
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
}

interface MealPlan {
    [key: string]: Recipe | undefined
}

export default function PlannerPage() {
    const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([])  // User's saved recipes
    const [mealPlan, setMealPlan] = useState<MealPlan | null>(null) // Current weekly plan
    const [loading, setLoading] = useState(true)                    // Loading state
    const supabase = createClient() // Database client

    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 })
    const weekStartStr = format(weekStart, 'yyyy-MM-dd')

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        try {
            // 1. Get current user
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                setLoading(false)
                return
            }

            // 2. Load saved recipes
            const { data: recipes, error: recipesError } = await supabase
                .from('recipes')
                .select('*')
                .eq('user_id', user.id)

            if (recipesError) {
                console.error('Error loading recipes:', recipesError)
            } else if (recipes) {
                setSavedRecipes(recipes)
            }

            // 3. Load existing meal plan for this week
            const { data: plans, error: plansError } = await supabase
                .from('meal_plans')
                .select('*')
                .eq('user_id', user.id)
                .eq('week_start', weekStartStr)
                .maybeSingle()  // Returns null if not found (no error)

            if (plansError) {
                console.error('Error loading meal plan:', plansError)
            } else if (plans) {
                setMealPlan(plans.meals)  // Load existing plan
            }
        } catch (error) {
            console.error('Error loading data:', error)
            toast.error('Failed to load data')
        } finally {
            setLoading(false)
        }
    }

    const saveMealPlan = async (meals: MealPlan) => {
        try {
            // 1. Get current user
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                toast.error('Please login to save meal plan')
                return
            }

            // 2. Check if a plan already exists for this week
            const { data: existingPlan } = await supabase
                .from('meal_plans')
                .select('id')
                .eq('user_id', user.id)
                .eq('week_start', weekStartStr)
                .maybeSingle()

            let result

            // 3. Update existing OR Insert new
            if (existingPlan) {
                // UPDATE: Plan exists → update it
                result = await supabase
                    .from('meal_plans')
                    .update({
                        meals: meals,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', existingPlan.id)
            } else {
                // INSERT: No plan exists → create new
                result = await supabase
                    .from('meal_plans')
                    .insert({
                        user_id: user.id,
                        week_start: weekStartStr,
                        meals: meals,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    })
            }

            // 4. Handle result
            if (result.error) {
                console.error('Save error details:', result.error)
                toast.error(`Failed to save meal plan: ${result.error.message}`)
            } else {
                toast.success('Meal plan saved successfully!')
                setMealPlan(meals)  // Update local state
            }
        } catch (error) {
            console.error('Unexpected error:', error)
            toast.error('An unexpected error occurred')
        }
    }

    // Clean loading state - no spinning heading
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: colors.bg }}>
                <div className="text-center">
                    <div className="relative w-16 h-16 mx-auto">
                        <div className="absolute inset-0 rounded-full border-4 border-t-transparent animate-spin" style={{ borderColor: colors.accent, borderTopColor: 'transparent' }} />
                        <div className="absolute inset-0 rounded-full border-4 border-t-transparent animate-ping opacity-20" style={{ borderColor: colors.accent, borderTopColor: 'transparent' }} />
                    </div>
                    <p className="mt-6 text-sm font-medium" style={{ color: colors.textMuted }}>Loading your meal planner...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen" style={{ background: colors.bg }}>
            <div className="container mx-auto px-4 md:px-6 py-10 max-w-7xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-10"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4" style={{ background: `${colors.accent}15` }}>
                        <ChefHat className="w-4 h-4" style={{ color: colors.accent }} />
                        <span className="text-xs font-semibold" style={{ color: colors.accent }}>Weekly Planning</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-3" style={{ fontFamily: theme.fontHeading, color: colors.text }}>
                        Meal Planner
                    </h1>
                    <p className="text-sm max-w-md mx-auto flex items-center justify-center gap-2" style={{ color: colors.textMuted }}>
                        <Calendar className="w-4 h-4" />
                        Week of {format(weekStart, 'MMMM d, yyyy')}
                    </p>
                </motion.div>

                {savedRecipes.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-xl p-12 text-center"
                        style={{ background: colors.bgSecondary, border: `1px solid ${colors.border}` }}
                    >
                        <div className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ background: `${colors.warning}15` }}>
                            <ChefHat className="w-10 h-10" style={{ color: colors.warning }} />
                        </div>
                        <h3 className="text-xl font-semibold mb-2" style={{ color: colors.text }}>No saved recipes found</h3>
                        <p className="text-sm mb-6" style={{ color: colors.textMuted }}>
                            Go to the Recipes page to search and save some recipes first!
                        </p>
                        <button
                            onClick={() => window.location.href = '/recipes'}
                            className="px-6 py-2.5 rounded-xl font-semibold transition-all hover:opacity-90"
                            style={{ background: colors.accent, color: '#fff' }}
                        >
                            Browse Recipes
                        </button>
                    </motion.div>
                ) : (
                    <MealPlanner
                        savedRecipes={savedRecipes}
                        onSavePlan={saveMealPlan}
                        initialPlan={mealPlan}
                    />
                )}
            </div>
        </div>
    )
}