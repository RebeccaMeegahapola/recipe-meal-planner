'use client'
import { useState } from 'react'
import { Search, Loader2, X, BookmarkPlus, Clock, Users, Star, Heart, Eye } from 'lucide-react'
import toast from 'react-hot-toast'
import { theme } from '@/lib/theme'
import SearchResultCard from "@/components/SearchResultCard"

const colors = theme.colors

interface Ingredient {
    original: string
}

interface Step {
    number: number
    step: string
}

interface Instruction {
    steps: Step[]
}

interface Nutrient {
    name: string
    amount: number
}

interface Nutrition {
    nutrients: Nutrient[]
}

interface SearchResult {
    id: number
    title: string
    image: string
    readyInMinutes: number
    servings: number
    extendedIngredients: Ingredient[]
    analyzedInstructions: Instruction[]
    nutrition?: Nutrition
}

interface FullRecipeDetails {
    id: number
    title: string
    image: string
    readyInMinutes: number
    servings: number
    extendedIngredients: Ingredient[]
    analyzedInstructions: Instruction[]
    nutrition?: Nutrition
}

interface RecipeToSave {
    api_id: number
    title: string
    image: string
    ingredients: string[]
    instructions: string[]
    ready_in_minutes: number
    servings: number
    nutrition: {
        calories: number
        protein: number
        carbs: number
        fat: number
    }
}

interface RecipeSearchProps {
    onSaveRecipe: (recipe: RecipeToSave) => void
}

export default function RecipeSearch({ onSaveRecipe }: RecipeSearchProps) {
    const [searchTerm, setSearchTerm] = useState<string>('')
    const [results, setResults] = useState<SearchResult[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [selectedRecipe, setSelectedRecipe] = useState<FullRecipeDetails | null>(null)
    const [loadingDetails, setLoadingDetails] = useState<boolean>(false)

    const searchRecipes = async (): Promise<void> => {
        if (!searchTerm.trim()) return

        setLoading(true)
        try {
            const response = await fetch(
                `https://api.spoonacular.com/recipes/complexSearch?query=${searchTerm}&apiKey=${process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY}&number=12&addRecipeInformation=true`
            )
            const data = await response.json()
            setResults(data.results || [])
        } catch (error) {
            toast.error('Failed to fetch recipes')
        } finally {
            setLoading(false)
        }
    }

    const fetchFullRecipeDetails = async (recipeId: number): Promise<FullRecipeDetails | null> => {
        try {
            const response = await fetch(
                `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY}&includeNutrition=true`
            )
            const data = await response.json()
            return data
        } catch (error) {
            console.error('Fetch error:', error)
            return null
        }
    }

    const handleCardClick = async (recipeId: number) => {
        setLoadingDetails(true)
        const fullRecipe = await fetchFullRecipeDetails(recipeId)
        if (fullRecipe) {
            setSelectedRecipe(fullRecipe)
        } else {
            toast.error('Failed to load recipe details')
        }
        setLoadingDetails(false)
    }

    const saveRecipe = async (): Promise<void> => {
        if (!selectedRecipe) return

        const recipeToSave: RecipeToSave = {
            api_id: selectedRecipe.id,
            title: selectedRecipe.title,
            image: selectedRecipe.image,
            ingredients: selectedRecipe.extendedIngredients?.map((ing: Ingredient) => ing.original) || [],
            instructions: selectedRecipe.analyzedInstructions?.[0]?.steps?.map((s: Step) => s.step) || [],
            ready_in_minutes: selectedRecipe.readyInMinutes,
            servings: selectedRecipe.servings,
            nutrition: {
                calories: selectedRecipe.nutrition?.nutrients?.find((n: Nutrient) => n.name === 'Calories')?.amount || 0,
                protein: selectedRecipe.nutrition?.nutrients?.find((n: Nutrient) => n.name === 'Protein')?.amount || 0,
                carbs: selectedRecipe.nutrition?.nutrients?.find((n: Nutrient) => n.name === 'Carbohydrates')?.amount || 0,
                fat: selectedRecipe.nutrition?.nutrients?.find((n: Nutrient) => n.name === 'Fat')?.amount || 0,
            }
        }

        onSaveRecipe(recipeToSave)
        setSelectedRecipe(null)
        toast.success('Recipe saved successfully!')
    }

    return (
        <div className="space-y-6">
            {/* Responsive Search Bar */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && searchRecipes()}
                        placeholder="Search for recipes (e.g., pasta, chicken, salad)..."
                        className="w-full px-4 py-3 sm:px-5 sm:py-3 rounded-xl focus:outline-none focus:ring-2 transition-all text-sm sm:text-base"
                        style={{
                            background: colors.bgSecondary,
                            border: `1px solid ${colors.border}`,
                            color: colors.text,
                            outline: 'none',
                        }}
                        onFocus={(e) => {
                            e.currentTarget.style.borderColor = colors.accent
                            e.currentTarget.style.boxShadow = `0 0 0 2px ${colors.accent}20`
                        }}
                        onBlur={(e) => {
                            e.currentTarget.style.borderColor = colors.border
                            e.currentTarget.style.boxShadow = 'none'
                        }}
                    />
                    {/* Mobile search hint */}
                    <p className="text-[10px] sm:hidden mt-1 ml-1" style={{ color: colors.textMuted }}>
                        Press ↵ to search
                    </p>
                </div>
                <button
                    onClick={searchRecipes}
                    disabled={loading}
                    className="w-full sm:w-auto px-5 py-3 rounded-xl font-semibold transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    style={{ background: colors.accent, color: '#fff' }}
                >
                    {loading ? <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" /> : <Search className="w-4 h-4 sm:w-5 sm:h-5" />}
                    <span className="sm:hidden">Search</span>
                </button>
            </div>

            {/* Results count */}
            {results.length > 0 && (
                <div className="flex justify-between items-center flex-wrap gap-2">
                    <p className="text-xs sm:text-sm" style={{ color: colors.textMuted }}>
                        Found <span className="font-semibold" style={{ color: colors.accent }}>{results.length}</span> recipes
                    </p>
                    <p className="text-xs sm:text-sm" style={{ color: colors.textMuted }}>
                        Showing 1-{results.length} of {results.length}
                    </p>
                </div>
            )}

            {/* Search Results Grid - Responsive */}
            {results.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
                    {results.map((recipe) => (
                        <SearchResultCard
                            key={recipe.id}
                            recipe={recipe}
                            onSaveRecipe={onSaveRecipe}
                        />
                    ))}
                </div>
            )}

            {/* Loading Modal */}
            {loadingDetails && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="rounded-2xl p-6 sm:p-8 text-center" style={{ background: colors.bgSecondary, border: `1px solid ${colors.border}` }}>
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 mb-3" style={{ borderColor: colors.accent }}></div>
                        <p className="text-sm" style={{ color: colors.textMuted }}>Loading recipe details...</p>
                    </div>
                </div>
            )}
        </div>
    )
}