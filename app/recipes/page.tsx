'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'  // ✅ Fix: Import useRouter correctly
import RecipeSearch from '@/components/RecipeSearch'
import RecipeCard from '@/components/RecipeCard'
import { BookOpen, Search as SearchIcon, Heart, ChefHat, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { theme } from '@/lib/theme'

const colors = theme.colors

interface Recipe {
    id: string
    user_id: string
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
    api_id?: number
}

export default function RecipesPage() {
    const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([])
    const [activeTab, setActiveTab] = useState<'search' | 'saved'>('search')
    const [loading, setLoading] = useState(true)
    const supabase = createClient()
    const router = useRouter()  // ✅ Fixed: useRouter() hook

    const loadSavedRecipes = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                setLoading(false)
                return
            }

            const { data, error } = await supabase
                .from('recipes')
                .select('*')
                .eq('user_id', user.id)
                .order('saved_at', { ascending: false })

            if (error) {
                toast.error('Failed to load recipes')
            } else if (data) {
                const uniqueMap = new Map<string, Recipe>()
                data.forEach(recipe => {
                    if (!uniqueMap.has(recipe.id)) {
                        uniqueMap.set(recipe.id, recipe)
                    }
                })
                const uniqueRecipes = Array.from(uniqueMap.values())
                setSavedRecipes(uniqueRecipes)
            }
        } catch (error) {
            toast.error('Failed to load recipes')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadSavedRecipes()
    }, [])

    const saveRecipe = async (recipe: any) => {
        try {
            const { data: { user } } = await supabase.auth.getUser()

            // ✅ If not logged in, redirect to login page
            if (!user) {
                toast.error('Please login to save recipes', {
                    duration: 2000,
                    icon: '🔒',
                })
                // Redirect to login with return URL
                setTimeout(() => {
                    router.push('/login?redirect=/recipes')
                }, 1500)
                return
            }

            // Check if recipe already exists
            const { data: existing } = await supabase
                .from('recipes')
                .select('id, api_id')
                .eq('user_id', user.id)
                .eq('api_id', recipe.api_id)
                .maybeSingle()

            if (existing) {
                toast.error('Recipe already saved!')
                return
            }

            const { error } = await supabase
                .from('recipes')
                .insert([{ ...recipe, user_id: user.id }])

            if (error) {
                console.error('Save error:', error)
                toast.error('Failed to save recipe')
            } else {
                toast.success('Recipe saved to your collection! 🎉')
                await loadSavedRecipes()
                // If user was on search tab, stay there; if on saved tab, it will update
                if (activeTab === 'saved') {
                    // Already on saved tab, just refresh
                    await loadSavedRecipes()
                }
            }
        } catch (error) {
            console.error('Error:', error)
            toast.error('Failed to save recipe')
        }
    }

    const deleteRecipe = async (id: string) => {
        try {
            const { error } = await supabase
                .from('recipes')
                .delete()
                .eq('id', id)

            if (error) {
                toast.error('Failed to delete recipe')
            } else {
                toast.success('Recipe deleted')
                await loadSavedRecipes()
            }
        } catch (error) {
            toast.error('Failed to delete recipe')
        }
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
                        <ChefHat className="w-4 h-4" style={{ color: colors.accent }} />
                        <span className="text-xs font-semibold" style={{ color: colors.accent }}>Recipe Collection</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-3" style={{ fontFamily: theme.fontHeading, color: colors.text }}>
                        Recipe Library
                    </h1>
                    <p className="text-sm max-w-md mx-auto" style={{ color: colors.textMuted }}>
                        Discover new recipes from around the world and save your favorites
                    </p>
                </motion.div>

                {/* Custom Tabs */}
                <div className="w-full max-w-md mx-auto mb-10">
                    <div className="flex gap-2 p-1 rounded-xl" style={{ background: colors.bgHover }}>
                        <button
                            onClick={() => setActiveTab('search')}
                            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all ${
                                activeTab === 'search'
                                    ? 'bg-white shadow-sm'
                                    : 'hover:bg-white/50'
                            }`}
                            style={{
                                background: activeTab === 'search' ? colors.bgSecondary : 'transparent',
                                color: activeTab === 'search' ? colors.accent : colors.textMuted,
                            }}
                        >
                            <SearchIcon className="w-4 h-4" />
                            Search Recipes
                        </button>
                        <button
                            onClick={() => setActiveTab('saved')}
                            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all ${
                                activeTab === 'saved'
                                    ? 'bg-white shadow-sm'
                                    : 'hover:bg-white/50'
                            }`}
                            style={{
                                background: activeTab === 'saved' ? colors.bgSecondary : 'transparent',
                                color: activeTab === 'saved' ? colors.accent : colors.textMuted,
                            }}
                        >
                            <Heart className="w-4 h-4" />
                            Saved Recipes
                            {savedRecipes.length > 0 && (
                                <span className="ml-1 px-1.5 py-0.5 rounded-full text-xs" style={{ background: colors.accent, color: 'white' }}>
                                    {savedRecipes.length}
                                </span>
                            )}
                        </button>
                    </div>
                </div>

                {/* Search Tab Content */}
                {activeTab === 'search' && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <RecipeSearch onSaveRecipe={saveRecipe} />
                    </motion.div>
                )}

                {/* Saved Tab Content */}
                {activeTab === 'saved' && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {loading ? (
                            <div className="text-center py-16">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                                    className="inline-block w-10 h-10 rounded-full border-2 border-t-transparent"
                                    style={{ borderColor: colors.accent, borderTopColor: 'transparent' }}
                                />
                                <p className="mt-4 text-sm" style={{ color: colors.textMuted }}>Loading your recipes...</p>
                            </div>
                        ) : savedRecipes.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-16 px-4 rounded-3xl"
                                style={{ background: colors.bgSecondary, border: `1px solid ${colors.border}` }}
                            >
                                <div className="w-20 h-20 mx-auto mb-5 rounded-2xl flex items-center justify-center" style={{ background: colors.bgHover }}>
                                    <BookOpen className="w-10 h-10" style={{ color: colors.accent }} />
                                </div>
                                <h3 className="text-xl font-semibold mb-2" style={{ fontFamily: theme.fontHeading, color: colors.text }}>
                                    Your collection is empty
                                </h3>
                                <p className="text-sm mb-6 max-w-sm mx-auto" style={{ color: colors.textMuted }}>
                                    Start exploring recipes and save your favorites to see them here!
                                </p>
                                <button
                                    onClick={() => setActiveTab('search')}
                                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
                                    style={{ background: colors.accent, color: '#fff' }}
                                >
                                    <Sparkles className="w-4 h-4" />
                                    Discover Recipes
                                </button>
                            </motion.div>
                        ) : (
                            <div>
                                {/* Stats bar */}
                                <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
                                    <p className="text-sm" style={{ color: colors.textMuted }}>
                                        You have <span className="font-semibold" style={{ color: colors.accent }}>{savedRecipes.length}</span> saved {savedRecipes.length === 1 ? 'recipe' : 'recipes'}
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full" style={{ background: colors.accent }} />
                                        <span className="text-xs" style={{ color: colors.textMuted }}>Last updated: {new Date().toLocaleDateString()}</span>
                                    </div>
                                </div>

                                {/* Recipes Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                                    {savedRecipes.map((recipe) => (
                                        <RecipeCard
                                            key={recipe.id}
                                            recipe={recipe}
                                            onDelete={deleteRecipe}
                                            showDelete={true}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}

                {/* Footer */}
                <div className="mt-12 pt-6 text-center border-t" style={{ borderColor: colors.border }}>
                    <p className="text-xs" style={{ color: colors.textMuted }}>
                        🥑 Made with love for food enthusiasts • {new Date().getFullYear()} MealMind
                    </p>
                </div>
            </div>
        </div>
    )
}