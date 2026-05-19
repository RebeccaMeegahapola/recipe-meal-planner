'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
    Calendar,
    Search,
    TrendingUp,
    Clock,
    Utensils,
    ArrowRight,
    Sparkles,
    Bookmark,
    Leaf,
    Flame,
    Pizza,
    Salad,
    Fish,
    Beef,
} from 'lucide-react'
import { theme } from '@/lib/theme'
import RecipeCard from '@/components/RecipeCard'
import { format, startOfWeek } from "date-fns"
import icon from '@/public/images/logo.png'

interface Recipe {
    id: string
    title: string
    image?: string
    ready_in_minutes?: number
    saved_at: string
    servings?: number
    ingredients?: any[]
    instructions?: string[]
    nutrition?: {
        calories?: number
        carbs?: number
        protein?: number
        fat?: number
    }
}

// ✅ Define Meal type for type safety
interface Meal {
    id?: string
    title?: string
    [key: string]: any
}

const colors = theme.colors

export default function Dashboard() {
    const [user, setUser] = useState<any>(null)
    const [recentRecipes, setRecentRecipes] = useState<Recipe[]>([])
    const [stats, setStats] = useState({
        totalRecipes: 0,
        plannedMeals: 0,
        avgPrepTime: 0,
        weeklyCalories: 0
    })
    const [loading, setLoading] = useState(true)
    const [greeting, setGreeting] = useState('')
    const router = useRouter()
    const supabase = createClient()

    const updateGreeting = () => {
        const hour = new Date().getHours()
        if (hour < 12) setGreeting('Good Morning')
        else if (hour < 17) setGreeting('Good Afternoon')
        else setGreeting('Good Evening')
    }

    const checkUser = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) router.push('/login')
        else setUser(user)
    }

    const loadDashboardData = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        // 1. Get recent recipes for display
        const { data: recipes } = await supabase
            .from('recipes')
            .select('*')
            .eq('user_id', user.id)
            .order('saved_at', { ascending: false })
            .limit(8)

        // 2. Get current week's meal plan
        const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 })
        const weekStartStr = format(weekStart, 'yyyy-MM-dd')

        const { data: mealPlanData } = await supabase
            .from('meal_plans')
            .select('meals')
            .eq('user_id', user.id)
            .eq('week_start', weekStartStr)
            .maybeSingle()

        // 3. Get ALL recipes with nutrition data (for calorie lookup)
        const { data: allRecipes } = await supabase
            .from('recipes')
            .select('id, nutrition')
            .eq('user_id', user.id)

        // 4. Create a quick lookup map for nutrition
        const nutritionMap = new Map()
        allRecipes?.forEach(recipe => {
            if (recipe.nutrition?.calories) {
                nutritionMap.set(recipe.id, recipe.nutrition.calories)
            }
        })

        // 5. Calculate calories from meal plan (SAME AS NUTRITION PAGE)
        let weeklyCalories = 0
        let plannedMeals = 0

        if (mealPlanData?.meals) {
            Object.values(mealPlanData.meals).forEach((meal: any) => {
                if (meal && meal.id) {
                    plannedMeals++
                    const calories = nutritionMap.get(meal.id) || 0
                    weeklyCalories += calories
                }
            })
        }

        console.log('🔥 Weekly Calories:', weeklyCalories)
        console.log('📋 Planned Meals:', plannedMeals)

        // 6. Update state
        if (recipes) {
            const uniqueRecipes = Array.from(
                new Map(recipes.map((recipe: Recipe) => [recipe.id, recipe])).values()
            )
            setRecentRecipes(uniqueRecipes)

            const totalPrepTime = uniqueRecipes.reduce((sum: number, r: Recipe) => sum + (r.ready_in_minutes || 0), 0)

            setStats({
                totalRecipes: uniqueRecipes.length,
                plannedMeals: plannedMeals,
                avgPrepTime: uniqueRecipes.length > 0 ? Math.round(totalPrepTime / uniqueRecipes.length) : 0,
                weeklyCalories: Math.round(weeklyCalories)
            })
        }
        setLoading(false)
    }

    const handleDeleteRecipe = async (id: string) => {
        const { error } = await supabase
            .from('recipes')
            .delete()
            .eq('id', id)

        if (!error) {
            const newRecipes = recentRecipes.filter((r: Recipe) => r.id !== id)
            setRecentRecipes(newRecipes)

            // Reload dashboard data to refresh stats
            loadDashboardData()
        }
    }

    useEffect(() => {
        checkUser()
        loadDashboardData()
        updateGreeting()
    }, [])

    // Featured Cuisines with Lucide Icons
    const featuredCuisines = [
        { name: 'Italian', icon: Pizza, tint: '#FFF3E0', iconColor: '#C17A3A' },
        { name: 'Asian', icon: Fish, tint: '#E8F5E9', iconColor: '#5A8A3C' },
        { name: 'Mexican', icon: Beef, tint: '#FBE9E7', iconColor: '#E05A5A' },
        { name: 'Mediterranean', icon: Salad, tint: '#E3F2FD', iconColor: '#3A7C6E' },
    ]

    const quickStats = [
        {
            label: 'Recipes Saved',
            value: stats.totalRecipes,
            icon: Bookmark,
            suffix: '',
            tint: '#E8F5E3'
        },
        {
            label: 'Minutes Saved',
            value: Math.round(stats.avgPrepTime * stats.totalRecipes),
            icon: Clock,
            suffix: ' min',
            tint: '#FFF8E1'
        },
        {
            label: 'Planned Meals',
            value: stats.plannedMeals,
            icon: Calendar,
            suffix: ' meals',
            tint: '#E3F0FF'
        },
        {
            label: 'Weekly Calories',
            value: Math.round(stats.weeklyCalories),
            icon: Flame,
            suffix: ' cal',
            tint: '#FBE9E7'
        },
    ]

    // Clean loading state
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: colors.bg }}>
                <div className="text-center">
                    <div className="relative w-16 h-16 mx-auto">
                        <div className="absolute inset-0 rounded-full border-4 border-t-transparent animate-spin" style={{ borderColor: colors.accent, borderTopColor: 'transparent' }} />
                        <div className="absolute inset-0 rounded-full border-4 border-t-transparent animate-pulse opacity-20" style={{ borderColor: colors.accent, borderTopColor: 'transparent' }} />
                    </div>
                    <p className="mt-6 text-sm font-medium" style={{ color: colors.textMuted }}>Loading your kitchen...</p>
                </div>
            </div>
        )
    }

    const username = user?.email?.split('@')[0] ?? 'Chef'

    return (
        <div className="min-h-screen" style={{ background: colors.bg, fontFamily: theme.font }}>
            <div className="container mx-auto px-4 md:px-6 py-10 max-w-7xl">

                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-10 rounded-3xl overflow-hidden relative"
                    style={{ background: `linear-gradient(135deg, ${colors.accentDark} 0%, #4E7A32 100%)` }}
                >
                    <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full opacity-10" style={{ background: colors.accentLight }} />
                    <div className="absolute -bottom-20 -left-10 w-56 h-56 rounded-full opacity-10" style={{ background: colors.accentLight }} />

                    <div className="relative px-8 py-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                        <div>
                            <span
                                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-4"
                                style={{
                                    background: 'rgba(156,191,110,0.22)',
                                    color: colors.border,
                                    border: '1px solid rgba(156,191,110,0.3)'
                                }}
                            >
                                <Leaf className="w-3 h-3"/> {greeting}
                            </span>
                            <h1 style={{
                                fontFamily: theme.fontHeading,
                                fontWeight: 500,
                                fontSize: 'clamp(24px, 4vw, 42px)',
                                color: colors.textWhite,
                                lineHeight: 1.15,
                                margin: 0,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                flexWrap: 'wrap'
                            }}>
                                Welcome back, <em style={{color: colors.accentLight}}>{username}</em>
                                <Image
                                    src={icon}
                                    alt="Avocado"
                                    width={32}
                                    height={32}
                                    className="object-contain inline-block"
                                />
                            </h1>
                            <p className="mt-2 text-sm" style={{color: colors.textLight, maxWidth: 420}}>
                                Ready to cook something brilliant? Your collection is growing nicely.
                            </p>
                        </div>
                        <motion.button
                            whileHover={{scale: 1.04}}
                            whileTap={{scale: 0.97}}
                            onClick={() => router.push('/recipes')}
                            className="flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold text-sm flex-shrink-0"
                            style={{
                                background: colors.accentLight,
                                color: colors.accentDark,
                                boxShadow: '0 6px 20px rgba(0,0,0,0.18)' }}
                        >
                            <Search className="w-4 h-4" />
                            Explore Recipes
                            <Sparkles className="w-4 h-4" />
                        </motion.button>
                    </div>
                </motion.div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
                    {quickStats.map((stat, i) => {
                        const Icon = stat.icon
                        return (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.07 }}
                                className="rounded-2xl p-5 group hover:-translate-y-1 transition-transform"
                                style={{ background: colors.bgSecondary, border: `1px solid ${colors.border}` }}
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: stat.tint }}>
                                        <Icon className="w-4 h-4" style={{ color: colors.accent }} />
                                    </div>
                                    <TrendingUp className="w-3.5 h-3.5" style={{ color: colors.border }} />
                                </div>
                                <p className="text-2xl font-bold mb-0.5" style={{ color: colors.text, fontFamily: theme.fontHeading }}>
                                    {stat.value}{stat.suffix}
                                </p>
                                <p className="text-xs" style={{ color: colors.textMuted }}>{stat.label}</p>
                            </motion.div>
                        )
                    })}
                </div>

                {/* Featured Cuisines */}
                <div className="mb-10">
                    <div className="flex items-end justify-between mb-4">
                        <div>
                            <p className="text-xs uppercase tracking-widest font-semibold mb-0.5" style={{ color: colors.accent }}>Explore</p>
                            <h2 className="text-xl font-semibold" style={{ color: colors.text, fontFamily: theme.fontHeading }}>Featured Cuisines</h2>
                        </div>
                        <button className="text-xs font-semibold flex items-center gap-1 hover:opacity-70 transition" style={{ color: colors.accent }}>
                            View all <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {featuredCuisines.map((cuisine, i) => {
                            const Icon = cuisine.icon
                            return (
                                <motion.button
                                    key={cuisine.name}
                                    initial={{ opacity: 0, scale: 0.93 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.07 }}
                                    whileHover={{ y: -4 }}
                                    className="relative overflow-hidden rounded-2xl p-5 text-center group"
                                    style={{ background: cuisine.tint, border: `1px solid ${colors.border}` }}
                                    onClick={() => router.push(`/recipes?cuisine=${cuisine.name.toLowerCase()}`)}
                                >
                                    <Icon className="w-8 h-8 mx-auto mb-2" style={{ color: cuisine.iconColor }} />
                                    <p className="font-semibold text-sm" style={{ color: colors.text }}>{cuisine.name}</p>
                                    <p className="text-xs mt-0.5" style={{ color: colors.textMuted }}>Explore →</p>
                                </motion.button>
                            )
                        })}
                    </div>
                </div>

                {/* Saved Recipes Section */}
                <div className="mb-10">
                    <div className="flex items-end justify-between mb-4">
                        <div>
                            <p className="text-xs uppercase tracking-widest font-semibold mb-0.5" style={{ color: colors.accent }}>Collection</p>
                            <h2 className="text-xl font-semibold" style={{ color: colors.text, fontFamily: theme.fontHeading }}>
                                Your Saved Recipes
                                {recentRecipes.length > 0 && (
                                    <span className="ml-2 text-sm font-normal" style={{ color: colors.textMuted }}>({recentRecipes.length})</span>
                                )}
                            </h2>
                        </div>
                        <button
                            onClick={() => router.push('/recipes')}
                            className="text-xs font-semibold flex items-center gap-1 hover:opacity-70 transition"
                            style={{ color: colors.accent }}
                        >
                            View all <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                    </div>

                    {recentRecipes.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="rounded-3xl p-14 text-center"
                            style={{ background: colors.bgSecondary, border: `1px solid ${colors.border}` }}
                        >
                            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center" style={{ background: colors.bgHover }}>
                                <Utensils className="w-8 h-8" style={{ color: colors.accent }} />
                            </div>
                            <h3 className="text-xl font-semibold mb-2" style={{ color: colors.text, fontFamily: theme.fontHeading }}>
                                Your kitchen is waiting
                            </h3>
                            <p className="text-sm mb-7 max-w-xs mx-auto" style={{ color: colors.textMuted }}>
                                Browse 365,000+ recipes and save your first favourite to get started.
                            </p>
                            <button
                                onClick={() => router.push('/recipes')}
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold"
                                style={{ background: colors.accent, color: '#fff', boxShadow: `0 6px 20px ${colors.accent}30` }}
                            >
                                <Sparkles className="w-4 h-4" />
                                Discover First Recipe
                            </button>
                        </motion.div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {recentRecipes.map((recipe, i) => (
                                <motion.div
                                    key={recipe.id}
                                    initial={{ opacity: 0, y: 18 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                >
                                    <RecipeCard
                                        recipe={recipe}
                                        onDelete={handleDeleteRecipe}
                                        showDelete={true}
                                    />
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Weekly Challenge Banner - All Icons + Avocado Button */}
                <motion.div
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                    className="relative overflow-hidden rounded-3xl p-8 cursor-pointer group"
                    style={{ background: `linear-gradient(135deg, #EDF5E1 0%, #F7FBF0 100%)`, border: `1px solid ${colors.border}` }}
                    onClick={() => router.push('/recipes')}
                >
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-3xl" style={{ background: `linear-gradient(to bottom, ${colors.accent}, ${colors.accentLight})` }} />

                    <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pl-4">
                        <div>
                            <span
                                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-3"
                                style={{ background: `${colors.accent}18`, color: colors.accent, border: `1px solid ${colors.accent}30` }}
                            >
                                <Sparkles className="w-3 h-3" /> Weekly Challenge
                            </span>
                            <h3 className="text-xl font-semibold mb-1.5" style={{ color: colors.text, fontFamily: theme.fontHeading }}>
                                Cook Something New This Week
                            </h3>
                            <p className="text-sm mb-5" style={{ color: colors.textMuted, maxWidth: 400 }}>
                                Try a new cuisine and earn exclusive badges. Italian, Asian, Mexican, or Mediterranean?
                            </p>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    router.push('/recipes')
                                }}
                                className="px-5 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-all group-hover:shadow-lg flex items-center gap-2"
                                style={{ background: colors.accent, color: '#fff', boxShadow: `0 5px 16px ${colors.accent}28` }}
                            >
                                <Image
                                    src={icon}
                                    alt="Avocado"
                                    width={20}
                                    height={20}
                                    className="object-contain"
                                />
                                Explore Recipes
                            </button>
                        </div>
                        <div className="flex gap-3 flex-shrink-0">
                            {[
                                { Icon: Pizza, bg: '#FFF3E0', color: '#C17A3A', name: 'Italian', cuisine: 'italian' },
                                { Icon: Fish, bg: '#E8F5E9', color: '#5A8A3C', name: 'Asian', cuisine: 'asian' },
                                { Icon: Beef, bg: '#FBE9E7', color: '#E05A5A', name: 'Mexican', cuisine: 'mexican' },
                                { Icon: Salad, bg: '#E3F2FD', color: '#3A7C6E', name: 'Mediterranean', cuisine: 'mediterranean' },
                            ].map(({ Icon, bg, color, name, cuisine }, i) => (
                                <motion.div
                                    key={i}
                                    animate={{ y: [0, -6, 0] }}
                                    transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.4, ease: 'easeInOut' }}
                                    className="w-14 h-14 rounded-2xl flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
                                    style={{ background: bg, border: `1px solid ${colors.border}` }}
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        router.push(`/recipes?cuisine=${cuisine}`)
                                    }}
                                    title={`Explore ${name} recipes`}
                                >
                                    <Icon className="w-7 h-7" style={{ color: color }} />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}