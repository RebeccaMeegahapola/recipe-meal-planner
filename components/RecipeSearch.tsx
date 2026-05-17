'use client'
import { useState } from 'react'
import { Search, Loader2, X, BookmarkPlus, Clock, Users, Star, Heart, Eye } from 'lucide-react'
import toast from 'react-hot-toast'
import { theme } from '@/lib/theme'
import RecipeCard from "@/components/RecipeCard";
import SearchResultCard from "@/components/SearchResultCard";

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
    id: number                      // Unique recipe ID from Spoonacular
    title: string                   // Recipe name
    image: string                   // URL to recipe image
    readyInMinutes: number          // Total cooking time
    servings: number                // Number of portions
    extendedIngredients: Ingredient[]  // Full ingredient list
    analyzedInstructions: Instruction[] // Cooking steps
    nutrition?: Nutrition           // Optional nutrition data
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
    const [searchTerm, setSearchTerm] = useState<string>('')        // What user types in search box
    const [results, setResults] = useState<SearchResult[]>([])      // Recipes from API
    const [loading, setLoading] = useState<boolean>(false)          // Show spinner while searching
    const [selectedRecipe, setSelectedRecipe] = useState<FullRecipeDetails | null>(null)  // Recipe in modal
    const [loadingDetails, setLoadingDetails] = useState<boolean>(false)  // Show spinner while loading details

    const searchRecipes = async (): Promise<void> => {
        if (!searchTerm.trim()) return  // Don't search empty strings

        setLoading(true)  // Show spinner
        try {
            const response = await fetch(
                `https://api.spoonacular.com/recipes/complexSearch?query=${searchTerm}&apiKey=${process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY}&number=12&addRecipeInformation=true`
            )
            const data = await response.json()
            setResults(data.results || [])  // Store results
        } catch (error) {
            toast.error('Failed to fetch recipes')
        } finally {
            setLoading(false)  // Hide spinner
        }
    }

    const fetchFullRecipeDetails = async (recipeId: number): Promise<FullRecipeDetails | null> => {
        try {
            const response = await fetch(
                `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY}`
            )
            const data = await response.json()
            return data  // Return full recipe object
        } catch (error) {
            console.error('Fetch error:', error)
            return null  // Return null on error
        }
    }

    const handleCardClick = async (recipeId: number) => {
        console.log('Fetching full details for recipe:', recipeId)
        setLoadingDetails(true)

        const fullRecipe = await fetchFullRecipeDetails(recipeId) // Fetch details

        if (fullRecipe) {
            console.log('Full recipe loaded:', fullRecipe.title)
            console.log('Instructions count:', fullRecipe.analyzedInstructions?.[0]?.steps?.length || 0)
            console.log('Ingredients count:', fullRecipe.extendedIngredients?.length || 0)
            setSelectedRecipe(fullRecipe) // Open modal with full recipe
        } else {
            toast.error('Failed to load recipe details')
        }

        setLoadingDetails(false)
    }

    const saveRecipe = async (): Promise<void> => {
        if (!selectedRecipe) return

        console.log('Selected recipe nutrition:', selectedRecipe.nutrition)

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

        console.log('Recipe to save:', recipeToSave)
        onSaveRecipe(recipeToSave)
        setSelectedRecipe(null)
        toast.success('Recipe saved successfully!')
    }

    // Convert search result to RecipeCard format
    const convertToRecipeCardFormat = (recipe: SearchResult) => {
        return {
            id: String(recipe.id),
            title: recipe.title,
            image: recipe.image,
            ready_in_minutes: recipe.readyInMinutes,
            servings: recipe.servings,
            ingredients: recipe.extendedIngredients?.map((ing: Ingredient) => ing.original) || [],
            instructions: recipe.analyzedInstructions?.[0]?.steps?.map((s: Step) => s.step) || [],
        }
    }

    return (
        <div className="space-y-6">
            {/* Search Bar */}
            <div className="flex gap-3">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && searchRecipes()}
                    placeholder="Search for recipes (e.g., pasta, chicken, salad)..."
                    className="flex-1 px-5 py-3 rounded-xl focus:outline-none focus:ring-2 transition-all"
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
                <button
                    onClick={searchRecipes}
                    disabled={loading}
                    className="px-6 py-3 rounded-xl font-semibold transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ background: colors.accent, color: '#fff' }}
                >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                </button>
            </div>

            {results.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {results.map((recipe) => (
                        <SearchResultCard
                            key={recipe.id}
                            recipe={recipe}
                            onViewDetails={handleCardClick}
                        />
                    ))}
                </div>
            )}

            {/* Loading Modal */}
            {loadingDetails && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="rounded-2xl p-8 text-center" style={{ background: colors.bgSecondary, border: `1px solid ${colors.border}` }}>
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 mb-3" style={{ borderColor: colors.accent }}></div>
                        <p style={{ color: colors.textMuted }}>Loading recipe details...</p>
                    </div>
                </div>
            )}

            {/* Full Recipe Details Modal */}
            {selectedRecipe && !loadingDetails && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onClick={() => setSelectedRecipe(null)}>
                    <div
                        className="rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                        style={{ background: colors.bgSecondary, border: `1px solid ${colors.border}` }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div
                            className="sticky top-0 p-4 border-b flex justify-between items-center"
                            style={{ background: colors.bgSecondary, borderBottomColor: colors.border }}
                        >
                            <h2 className="text-xl font-semibold pr-4" style={{ color: colors.text, fontFamily: theme.fontHeading }}>
                                {selectedRecipe.title}
                            </h2>
                            <button
                                onClick={() => setSelectedRecipe(null)}
                                className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:opacity-70 flex-shrink-0"
                                style={{ background: colors.bgHover }}
                            >
                                <X className="w-4 h-4" style={{ color: colors.text }} />
                            </button>
                        </div>

                        <div className="p-6 space-y-5">
                            <img
                                src={selectedRecipe.image}
                                alt={selectedRecipe.title}
                                className="w-full h-64 object-cover rounded-xl"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=400&fit=crop'
                                }}
                            />

                            <div className="flex flex-wrap gap-4 text-sm">
                                {selectedRecipe.readyInMinutes && (
                                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ background: colors.bgHover }}>
                                        <Clock className="w-3.5 h-3.5" style={{ color: colors.accent }} />
                                        <span style={{ color: colors.textMuted }}>{selectedRecipe.readyInMinutes} minutes</span>
                                    </div>
                                )}
                                {selectedRecipe.servings && (
                                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ background: colors.bgHover }}>
                                        <Users className="w-3.5 h-3.5" style={{ color: colors.accent }} />
                                        <span style={{ color: colors.textMuted }}>{selectedRecipe.servings} servings</span>
                                    </div>
                                )}
                            </div>

                            {/* Ingredients */}
                            <div>
                                <h3 className="font-semibold mb-3 flex items-center gap-2" style={{ color: colors.text }}>
                                    <span className="text-lg">🛒</span> Ingredients
                                    {selectedRecipe.extendedIngredients && (
                                        <span className="text-xs font-normal" style={{ color: colors.textMuted }}>({selectedRecipe.extendedIngredients.length} items)</span>
                                    )}
                                </h3>
                                {selectedRecipe.extendedIngredients && selectedRecipe.extendedIngredients.length > 0 ? (
                                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                        {selectedRecipe.extendedIngredients.map((ing: Ingredient, i: number) => (
                                            <li key={i} className="flex items-center gap-2 text-sm px-2 py-1 rounded-lg" style={{ background: colors.bg, color: colors.textMuted }}>
                                                <span className="w-1.5 h-1.5 rounded-full" style={{ background: colors.accent }} />
                                                {ing.original}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-sm" style={{ color: colors.textMuted }}>No ingredients listed</p>
                                )}
                            </div>

                            {/* Instructions */}
                            <div>
                                <h3 className="font-semibold mb-3 flex items-center gap-2" style={{ color: colors.text }}>
                                    <span className="text-lg">📝</span> Instructions
                                    {selectedRecipe.analyzedInstructions?.[0]?.steps && (
                                        <span className="text-xs font-normal" style={{ color: colors.textMuted }}>({selectedRecipe.analyzedInstructions[0].steps.length} steps)</span>
                                    )}
                                </h3>
                                {selectedRecipe.analyzedInstructions &&
                                selectedRecipe.analyzedInstructions[0]?.steps &&
                                selectedRecipe.analyzedInstructions[0].steps.length > 0 ? (
                                    <ol className="space-y-3">
                                        {selectedRecipe.analyzedInstructions[0].steps.map((step: Step) => (
                                            <li key={step.number} className="flex gap-3 text-sm">
                                                <span className="font-semibold w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0" style={{ background: colors.accent, color: '#fff' }}>
                                                    {step.number}
                                                </span>
                                                <span style={{ color: colors.textMuted }}>{step.step}</span>
                                            </li>
                                        ))}
                                    </ol>
                                ) : (
                                    <p className="text-sm" style={{ color: colors.textMuted }}>No instructions available</p>
                                )}
                            </div>

                            <button
                                onClick={saveRecipe}
                                className="w-full py-3 rounded-xl font-semibold transition-all hover:opacity-90 flex items-center justify-center gap-2"
                                style={{ background: colors.accent, color: '#fff' }}
                            >
                                <BookmarkPlus className="w-5 h-5" />
                                Save to My Recipes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}