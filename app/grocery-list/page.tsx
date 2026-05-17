'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import GroceryList from '@/components/GroceryList'
import { startOfWeek, format } from 'date-fns'
import { AlertCircle, ShoppingBag, ChefHat } from 'lucide-react'
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

export default function GroceryListPage() {
    const [mealPlan, setMealPlan] = useState<MealPlan | null>(null)
    const [recipes, setRecipes] = useState<Recipe[]>([])
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 })
    const weekStartStr = format(weekStart, 'yyyy-MM-dd')

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                setLoading(false)
                return
            }

            const { data: plans, error: plansError } = await supabase
                .from('meal_plans')
                .select('*')
                .eq('user_id', user.id)
                .eq('week_start', weekStartStr)
                .maybeSingle()

            if (plansError) {
                console.error('Error loading meal plan:', plansError)
            } else if (plans) {
                setMealPlan(plans.meals)
            }

            const { data: recipesData, error: recipesError } = await supabase
                .from('recipes')
                .select('*')
                .eq('user_id', user.id)

            if (recipesError) {
                console.error('Error loading recipes:', recipesError)
            } else if (recipesData) {
                setRecipes(recipesData)
            }
        } catch (error) {
            console.error('Error loading data:', error)
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
                        <div className="absolute inset-0 rounded-full border-4 border-t-transparent animate-ping opacity-20" style={{ borderColor: colors.accent, borderTopColor: 'transparent' }} />
                    </div>
                    <p className="mt-6 text-sm font-medium" style={{ color: colors.textMuted }}>Loading your grocery list...</p>
                </div>
            </div>
        )
    }

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
                        <ShoppingBag className="w-4 h-4" style={{ color: colors.accent }} />
                        <span className="text-xs font-semibold" style={{ color: colors.accent }}>Shopping List</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-3" style={{ fontFamily: theme.fontHeading, color: colors.text }}>
                        Your Grocery List
                    </h1>
                    <p className="text-sm max-w-md mx-auto" style={{ color: colors.textMuted }}>
                        Based on your meal plan for {format(weekStart, 'MMMM d, yyyy')}
                    </p>
                </motion.div>

                {/* Content based on meal plan existence */}
                {!mealPlan || Object.keys(mealPlan).filter(key => mealPlan[key]).length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-2xl p-12 text-center"
                        style={{ background: colors.bgSecondary, border: `1px solid ${colors.border}` }}
                    >
                        <div className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ background: `${colors.warning}15` }}>
                            <AlertCircle className="w-10 h-10" style={{ color: colors.warning }} />
                        </div>
                        <h3 className="text-xl font-semibold mb-2" style={{ color: colors.text }}>No meal plan found</h3>
                        <p className="text-sm mb-6 max-w-md mx-auto" style={{ color: colors.textMuted }}>
                            Create a meal plan first to generate your grocery list.
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
                    <GroceryList
                        mealPlan={mealPlan}
                        recipes={recipes}
                    />
                )}
            </div>
        </div>
    )
}