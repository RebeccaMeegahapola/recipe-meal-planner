'use client'
import { useState } from 'react'
import { Clock, Users, Star, Heart, Eye, X, Loader2, BookmarkPlus } from 'lucide-react'
import { theme } from '@/lib/theme'

const colors = theme.colors

interface SearchResultCardProps {
    recipe: {
        id: number
        title: string
        image: string
        readyInMinutes: number
        servings: number
    }
    onSaveRecipe?: (recipe: any) => void
}

export default function SearchResultCard({ recipe, onSaveRecipe }: SearchResultCardProps) {
    const [showModal, setShowModal] = useState(false)
    const [fullRecipe, setFullRecipe] = useState<any>(null)
    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)

    const fetchFullDetails = async () => {
        setLoading(true)
        try {
            const response = await fetch(
                `https://api.spoonacular.com/recipes/${recipe.id}/information?apiKey=${process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY}&includeNutrition=true`
            )
            const data = await response.json()
            setFullRecipe(data)
            setShowModal(true)
        } catch (error) {
            console.error('Error fetching details:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async () => {
        if (!fullRecipe || !onSaveRecipe) return

        setSaving(true)
        const recipeToSave = {
            api_id: fullRecipe.id,
            title: fullRecipe.title,
            image: fullRecipe.image,
            ingredients: fullRecipe.extendedIngredients?.map((ing: any) => ing.original) || [],
            instructions: fullRecipe.analyzedInstructions?.[0]?.steps?.map((step: any) => step.step) || [],
            ready_in_minutes: fullRecipe.readyInMinutes,
            servings: fullRecipe.servings,
            nutrition: {
                calories: fullRecipe.nutrition?.nutrients?.find((n: any) => n.name === 'Calories')?.amount || 0,
                protein: fullRecipe.nutrition?.nutrients?.find((n: any) => n.name === 'Protein')?.amount || 0,
                carbs: fullRecipe.nutrition?.nutrients?.find((n: any) => n.name === 'Carbohydrates')?.amount || 0,
                fat: fullRecipe.nutrition?.nutrients?.find((n: any) => n.name === 'Fat')?.amount || 0,
            }
        }
        await onSaveRecipe(recipeToSave)
        setSaving(false)
        setShowModal(false)
    }

    const displayRecipe = fullRecipe || recipe
    const instructions = fullRecipe?.analyzedInstructions?.[0]?.steps?.map((step: any) => step.step) || []
    const ingredients = fullRecipe?.extendedIngredients?.map((ing: any) => ing.original) || []
    const nutrition = fullRecipe?.nutrition

    return (
        <>
            {/* Card */}
            <div
                className="group rounded-2xl overflow-hidden cursor-pointer transition-all hover:-translate-y-1 hover:shadow-lg"
                style={{ background: colors.bgSecondary, border: `1px solid ${colors.border}` }}
                onClick={fetchFullDetails}
            >
                <div className="relative h-48 overflow-hidden">
                    <img
                        src={recipe.image}
                        alt={recipe.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop'
                        }}
                    />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 55%)' }} />

                    <div className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(6px)' }}>
                        <Heart className="w-4 h-4" style={{ color: colors.error }} />
                    </div>

                    {recipe.readyInMinutes && (
                        <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium" style={{ background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(6px)', color: colors.text }}>
                            <Clock className="w-3 h-3" style={{ color: colors.accent }} />
                            {recipe.readyInMinutes} min
                        </div>
                    )}

                    {recipe.servings && (
                        <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium" style={{ background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(6px)', color: colors.text }}>
                            <Users className="w-3 h-3" style={{ color: colors.accent }} />
                            {recipe.servings}
                        </div>
                    )}
                </div>

                <div className="p-4">
                    <h3 className="font-semibold text-base mb-2 line-clamp-1" style={{ color: colors.text }}>
                        {recipe.title}
                    </h3>
                    <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-current" style={{ color: colors.star }} />
                        <span className="text-xs font-medium" style={{ color: colors.textMuted }}>4.8</span>
                    </div>
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            fetchFullDetails()
                        }}
                        className="w-full mt-4 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:opacity-80 flex items-center justify-center gap-2"
                        style={{ background: colors.accent, color: '#fff' }}
                    >
                        <Eye className="w-4 h-4" />
                        View Details
                    </button>
                </div>
            </div>

            {/* Modal with Nutrition */}
            {showModal && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
                    onClick={() => setShowModal(false)}
                >
                    <div
                        className="rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                        style={{ background: colors.bgSecondary, border: `1px solid ${colors.border}` }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {loading ? (
                            <div className="p-12 text-center">
                                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" style={{ color: colors.accent }} />
                                <p style={{ color: colors.textMuted }}>Loading recipe details...</p>
                            </div>
                        ) : (
                            <>
                                <div
                                    className="sticky top-0 p-4 border-b flex justify-between items-center"
                                    style={{ background: colors.bgSecondary, borderBottomColor: colors.border }}
                                >
                                    <h2 className="text-xl font-semibold pr-4" style={{ color: colors.text, fontFamily: theme.fontHeading }}>
                                        {displayRecipe.title}
                                    </h2>
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:opacity-70 flex-shrink-0"
                                        style={{ background: colors.bgHover }}
                                    >
                                        <X className="w-4 h-4" style={{ color: colors.text }} />
                                    </button>
                                </div>

                                <div className="p-6 space-y-5">
                                    <img
                                        src={displayRecipe.image}
                                        alt={displayRecipe.title}
                                        className="w-full h-64 object-cover rounded-xl"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=400&fit=crop'
                                        }}
                                    />

                                    <div className="flex flex-wrap gap-4 text-sm">
                                        {displayRecipe.readyInMinutes && (
                                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ background: colors.bgHover }}>
                                                <Clock className="w-3.5 h-3.5" style={{ color: colors.accent }} />
                                                <span style={{ color: colors.textMuted }}>{displayRecipe.readyInMinutes} minutes</span>
                                            </div>
                                        )}
                                        {displayRecipe.servings && (
                                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ background: colors.bgHover }}>
                                                <Users className="w-3.5 h-3.5" style={{ color: colors.accent }} />
                                                <span style={{ color: colors.textMuted }}>{displayRecipe.servings} servings</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Ingredients */}
                                    {ingredients.length > 0 && (
                                        <div>
                                            <h3 className="font-semibold mb-3 flex items-center gap-2" style={{ color: colors.text }}>
                                                <span className="text-lg">🛒</span> Ingredients
                                            </h3>
                                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                {ingredients.map((ing: string, i: number) => (
                                                    <li key={i} className="flex items-center gap-2 text-sm px-2 py-1 rounded-lg" style={{ background: colors.bg, color: colors.textMuted }}>
                                                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: colors.accent }} />
                                                        {ing}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* Instructions */}
                                    {instructions.length > 0 && (
                                        <div>
                                            <h3 className="font-semibold mb-3 flex items-center gap-2" style={{ color: colors.text }}>
                                                <span className="text-lg">📝</span> Instructions
                                            </h3>
                                            <ol className="space-y-3">
                                                {instructions.map((step: string, i: number) => (
                                                    <li key={i} className="flex gap-3 text-sm">
                                                        <span className="font-semibold w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0" style={{ background: colors.accent, color: '#fff' }}>
                                                            {i + 1}
                                                        </span>
                                                        <span style={{ color: colors.textMuted }}>{step}</span>
                                                    </li>
                                                ))}
                                            </ol>
                                        </div>
                                    )}

                                    {/* Nutrition Section */}
                                    {nutrition && (
                                        <div>
                                            <h3 className="font-semibold mb-3 flex items-center gap-2" style={{ color: colors.text }}>
                                                <span className="text-lg">📊</span> Nutrition Facts
                                            </h3>
                                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                                <div className="text-center p-3 rounded-lg" style={{ background: colors.bg }}>
                                                    <div className="text-xl font-bold" style={{ color: colors.accent }}>
                                                        {Math.round(nutrition.nutrients?.find((n: any) => n.name === 'Calories')?.amount || 0)}
                                                    </div>
                                                    <div className="text-xs" style={{ color: colors.textMuted }}>Calories</div>
                                                </div>
                                                <div className="text-center p-3 rounded-lg" style={{ background: colors.bg }}>
                                                    <div className="text-xl font-bold" style={{ color: colors.accent }}>
                                                        {Math.round(nutrition.nutrients?.find((n: any) => n.name === 'Protein')?.amount || 0)}g
                                                    </div>
                                                    <div className="text-xs" style={{ color: colors.textMuted }}>Protein</div>
                                                </div>
                                                <div className="text-center p-3 rounded-lg" style={{ background: colors.bg }}>
                                                    <div className="text-xl font-bold" style={{ color: colors.accent }}>
                                                        {Math.round(nutrition.nutrients?.find((n: any) => n.name === 'Carbohydrates')?.amount || 0)}g
                                                    </div>
                                                    <div className="text-xs" style={{ color: colors.textMuted }}>Carbs</div>
                                                </div>
                                                <div className="text-center p-3 rounded-lg" style={{ background: colors.bg }}>
                                                    <div className="text-xl font-bold" style={{ color: colors.accent }}>
                                                        {Math.round(nutrition.nutrients?.find((n: any) => n.name === 'Fat')?.amount || 0)}g
                                                    </div>
                                                    <div className="text-xs" style={{ color: colors.textMuted }}>Fat</div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Save Button */}
                                    {onSaveRecipe && (
                                        <button
                                            onClick={handleSave}
                                            disabled={saving}
                                            className="w-full py-3 rounded-xl font-semibold transition-all hover:opacity-90 flex items-center justify-center gap-2"
                                            style={{ background: colors.accent, color: '#fff' }}
                                        >
                                            {saving ? (
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                            ) : (
                                                <>
                                                    <BookmarkPlus className="w-5 h-5" />
                                                    Save to My Recipes
                                                </>
                                            )}
                                        </button>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    )
}