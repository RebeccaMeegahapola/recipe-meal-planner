'use client'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
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

const CHART_COLORS = ['#5A8A3C', '#9CBF6E', '#7A9468', '#C8DFB0']

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="rounded-lg p-3 shadow-lg border" style={{ background: colors.bgSecondary, borderColor: colors.border }}>
                <p className="font-semibold mb-2" style={{ color: colors.text }}>{label}</p>
                {payload.map((item: any, index: number) => (
                    <p key={index} style={{ color: item.color }} className="text-sm">
                        {item.name}: {Math.round(item.value)} {item.name === 'Calories' ? 'cal' : 'g'}
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

    const pieData = [
        { name: 'Protein', value: totals.protein },
        { name: 'Carbs', value: totals.carbs },
        { name: 'Fat', value: totals.fat }
    ].filter(item => item.value > 0)

    const hasData = nutritionData.some(day => day.calories > 0 || day.protein > 0 || day.carbs > 0 || day.fat > 0)

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
            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="rounded-xl p-4" style={{ background: colors.bgSecondary, border: `1px solid ${colors.border}` }}>
                    <p className="text-sm opacity-70" style={{ color: colors.textMuted }}>Total Calories</p>
                    <p className="text-2xl font-bold" style={{ color: colors.text }}>{Math.round(totals.calories)}</p>
                    <p className="text-xs" style={{ color: colors.textMuted }}>This week</p>
                </div>
                <div className="rounded-xl p-4" style={{ background: colors.bgSecondary, border: `1px solid ${colors.border}` }}>
                    <p className="text-sm opacity-70" style={{ color: colors.textMuted }}>Protein</p>
                    <p className="text-2xl font-bold" style={{ color: colors.text }}>{Math.round(totals.protein)}g</p>
                    <p className="text-xs" style={{ color: colors.textMuted }}>{Math.round(totals.protein / 7)}g/day avg</p>
                </div>
                <div className="rounded-xl p-4" style={{ background: colors.bgSecondary, border: `1px solid ${colors.border}` }}>
                    <p className="text-sm opacity-70" style={{ color: colors.textMuted }}>Carbs</p>
                    <p className="text-2xl font-bold" style={{ color: colors.text }}>{Math.round(totals.carbs)}g</p>
                    <p className="text-xs" style={{ color: colors.textMuted }}>{Math.round(totals.carbs / 7)}g/day avg</p>
                </div>
                <div className="rounded-xl p-4" style={{ background: colors.bgSecondary, border: `1px solid ${colors.border}` }}>
                    <p className="text-sm opacity-70" style={{ color: colors.textMuted }}>Fat</p>
                    <p className="text-2xl font-bold" style={{ color: colors.text }}>{Math.round(totals.fat)}g</p>
                    <p className="text-xs" style={{ color: colors.textMuted }}>{Math.round(totals.fat / 7)}g/day avg</p>
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
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="calories" fill={colors.accent} name="Calories" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Macro Distribution */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="rounded-xl p-6" style={{ background: colors.bgSecondary, border: `1px solid ${colors.border}` }}>
                    <h3 className="text-lg font-semibold mb-4" style={{ color: colors.text }}>Macro Distribution</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={false}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex justify-center gap-6 mt-4 flex-wrap">
                        {pieData.map((item, index) => {
                            const total = totals.protein + totals.carbs + totals.fat
                            const percentage = total > 0 ? Math.round((item.value / total) * 100) : 0
                            return (
                                <div key={item.name} className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }} />
                                    <span className="text-sm" style={{ color: colors.textMuted }}>{item.name}</span>
                                    <span className="text-sm font-semibold" style={{ color: colors.text }}>{Math.round(item.value)}g</span>
                                    <span className="text-xs" style={{ color: colors.textMuted }}>({percentage}%)</span>
                                </div>
                            )
                        })}
                    </div>
                </div>

                <div className="rounded-xl p-6" style={{ background: colors.bgSecondary, border: `1px solid ${colors.border}` }}>
                    <h3 className="text-lg font-semibold mb-4" style={{ color: colors.text }}>Weekly Macro Trends</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={nutritionData}>
                                <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
                                <XAxis dataKey="day" stroke={colors.textMuted} />
                                <YAxis stroke={colors.textMuted} />
                                <Tooltip content={<CustomTooltip />} />
                                <Line type="monotone" dataKey="protein" stroke={CHART_COLORS[0]} name="Protein" strokeWidth={2} />
                                <Line type="monotone" dataKey="carbs" stroke={CHART_COLORS[1]} name="Carbs" strokeWidth={2} />
                                <Line type="monotone" dataKey="fat" stroke={CHART_COLORS[2]} name="Fat" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    )
}