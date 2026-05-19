'use client'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { theme } from '@/lib/theme'

const colors = theme.colors

interface NutritionData {
    calories: number
    protein: number
    carbs: number
    fat: number
    day: string
}

interface Totals {
    calories: number
    protein: number
    carbs: number
    fat: number
}

interface Recipe {
    id: string
    title: string
    nutrition?: {
        calories?: number
        protein?: number
        carbs?: number
        fat?: number
    }
    ready_in_minutes?: number
    servings?: number
    image?: string
}

interface MealPlan {
    [key: string]: Recipe | undefined
}

interface NutritionTrackerProps {
    mealPlan: MealPlan | null
    recipes: Recipe[]
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="rounded-lg p-3 shadow-lg border" style={{ background: colors.bgSecondary, borderColor: colors.border }}>
                <p className="font-semibold mb-2" style={{ color: colors.text }}>{label}</p>
                {payload.map((item: any, index: number) => (
                    <p key={index} style={{ color: item.color }} className="text-sm">
                        {item.name}: {Math.round(item.value)} cal
                    </p>
                ))}
            </div>
        )
    }
    return null
}

export default function NutritionTracker({ mealPlan, recipes }: NutritionTrackerProps) {

    const calculateDailyNutrition = (): NutritionData[] => {
        const dailyData: { [key: string]: NutritionData } = {}
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

        days.forEach(day => {
            dailyData[day] = { calories: 0, protein: 0, carbs: 0, fat: 0, day }
        })

        if (!mealPlan) {
            return Object.values(dailyData)
        }

        Object.entries(mealPlan).forEach(([key, recipe]) => {
            if (!recipe || !recipe.id) return

            const [day] = key.split('-')
            const recipeDetails = recipes.find(r => r.id === recipe.id)

            if (recipeDetails?.nutrition && dailyData[day]) {
                dailyData[day].calories += recipeDetails.nutrition.calories || 0
                dailyData[day].protein += recipeDetails.nutrition.protein || 0
                dailyData[day].carbs += recipeDetails.nutrition.carbs || 0
                dailyData[day].fat += recipeDetails.nutrition.fat || 0
            }
        })

        return Object.values(dailyData)
    }

    const calculateTotals = (): Totals => {
        const dailyData = calculateDailyNutrition()
        const totals: Totals = {
            calories: 0,
            protein: 0,
            carbs: 0,
            fat: 0
        }

        dailyData.forEach(day => {
            totals.calories += day.calories
            totals.protein += day.protein
            totals.carbs += day.carbs
            totals.fat += day.fat
        })

        return totals
    }

    const nutritionData = calculateDailyNutrition()
    const totals = calculateTotals()

    const hasData = nutritionData.some(day => day.calories > 0)

    if (!hasData) {
        return (
            <div className="rounded-2xl p-12 text-center" style={{ background: colors.bgSecondary, border: `1px solid ${colors.border}` }}>
                <div className="text-6xl mb-4">📊</div>
                <h3 className="text-xl font-semibold mb-2" style={{ color: colors.text }}>No Nutrition Data Available</h3>
                <p className="text-sm max-w-md mx-auto" style={{ color: colors.textMuted }}>
                    The recipes in your meal plan don't have nutrition information.
                    Try saving recipes from search results - they include calories, protein, carbs, and fat data!
                </p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Summary Cards - Only Calories */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-xl p-4" style={{ background: colors.bgSecondary, border: `1px solid ${colors.border}` }}>
                    <p className="text-sm opacity-70" style={{ color: colors.textMuted }}>Total Weekly Calories</p>
                    <p className="text-3xl font-bold" style={{ color: colors.text }}>{Math.round(totals.calories)}</p>
                    <p className="text-xs" style={{ color: colors.textMuted }}>This week</p>
                </div>
                <div className="rounded-xl p-4" style={{ background: colors.bgSecondary, border: `1px solid ${colors.border}` }}>
                    <p className="text-sm opacity-70" style={{ color: colors.textMuted }}>Average Daily Calories</p>
                    <p className="text-3xl font-bold" style={{ color: colors.text }}>{Math.round(totals.calories / 7)}</p>
                    <p className="text-xs" style={{ color: colors.textMuted }}>Per day</p>
                </div>
            </div>

            {/* Daily Calories Chart */}
            <div className="rounded-xl p-6" style={{ background: colors.bgSecondary, border: `1px solid ${colors.border}` }}>
                <h3 className="text-lg font-semibold mb-4" style={{ color: colors.text }}>Daily Calorie Intake</h3>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={nutritionData}>
                            <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
                            <XAxis dataKey="day" stroke={colors.textMuted} />
                            <YAxis stroke={colors.textMuted} />
                            <Tooltip
                                content={<CustomTooltip />}
                                cursor={false}
                            />
                            <Bar dataKey="calories" fill={colors.accent} name="Calories" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    )
}