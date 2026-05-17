'use client'
import { useState } from 'react'
import { Trash2, Clock, Users, Eye, Heart, Star, X } from 'lucide-react'
import { theme } from '@/lib/theme'

const colors = theme.colors

interface RecipeCardProps {
    recipe: any
    onDelete?: (id: string) => void
    showDelete?: boolean
}

export default function RecipeCard({ recipe, onDelete, showDelete = false }: RecipeCardProps) {
    const [showDetails, setShowDetails] = useState(false) // Modal visibility

    const openModal = (e: React.MouseEvent) => {
        e.preventDefault()      // Prevent any default behavior
        e.stopPropagation()     // Stop event from bubbling up
        setShowDetails(true)    // Open modal
    }

    const handleDelete = (e: React.MouseEvent, id: string) => {
        e.preventDefault()
        e.stopPropagation()
        if (onDelete) {
            onDelete(id)  // Call parent's delete function
        }
    }

    return (
        <>
            <div
                className="group rounded-2xl overflow-hidden cursor-pointer transition-all hover:-translate-y-1 hover:shadow-lg"
                style={{ background: colors.bgSecondary, border: `1px solid ${colors.border}` }}
                onClick={openModal}
            >
                <div className="relative h-48 overflow-hidden">
                    <img
                        src={recipe.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop'}
                        alt={recipe.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop'
                        }}
                    />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 55%)' }} />

                    {showDelete && onDelete && (
                        <button
                            onClick={(e) => handleDelete(e, recipe.id)}
                            className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition shadow-md z-10 hover:scale-110"
                            style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(6px)' }}
                        >
                            <Trash2 className="w-4 h-4" style={{ color: colors.error }} />
                        </button>
                    )}

                    {!showDelete && (
                        <div className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(6px)' }}>
                            <Heart className="w-4 h-4" style={{ color: colors.error, fill: colors.error }} />
                        </div>
                    )}

                    {recipe.ready_in_minutes && (
                        <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium" style={{ background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(6px)', color: colors.text }}>
                            <Clock className="w-3 h-3" style={{ color: colors.accent }} />
                            {recipe.ready_in_minutes} min
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

                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-current" style={{ color: colors.star }} />
                            <span className="text-xs font-medium" style={{ color: colors.textMuted }}>4.8</span>
                        </div>

                        {recipe.ingredients && Array.isArray(recipe.ingredients) && (
                            <div className="flex items-center gap-1">
                                <span className="text-xs" style={{ color: colors.textMuted }}>
                                    {recipe.ingredients.length} ingredients
                                </span>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={openModal}
                        className="w-full mt-2 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:opacity-80"
                        style={{ background: colors.accent, color: '#fff' }}
                    >
                        <Eye className="w-4 h-4 inline mr-1" />
                        View Details
                    </button>
                </div>
            </div>

            {/* Details Modal */}
            {showDetails && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
                    onClick={() => setShowDetails(false)}
                >
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
                                {recipe.title}
                            </h2>
                            <button
                                onClick={() => setShowDetails(false)}
                                className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:opacity-70 flex-shrink-0"
                                style={{ background: colors.bgHover }}
                            >
                                <X className="w-4 h-4" style={{ color: colors.text }} />
                            </button>
                        </div>

                        <div className="p-6 space-y-5">
                            <img
                                src={recipe.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=400&fit=crop'}
                                alt={recipe.title}
                                className="w-full h-64 object-cover rounded-xl"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=400&fit=crop'
                                }}
                            />

                            <div className="flex flex-wrap gap-4 text-sm">
                                {recipe.ready_in_minutes && (
                                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ background: colors.bgHover }}>
                                        <Clock className="w-3.5 h-3.5" style={{ color: colors.accent }} />
                                        <span style={{ color: colors.textMuted }}>{recipe.ready_in_minutes} minutes</span>
                                    </div>
                                )}
                                {recipe.servings && (
                                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ background: colors.bgHover }}>
                                        <Users className="w-3.5 h-3.5" style={{ color: colors.accent }} />
                                        <span style={{ color: colors.textMuted }}>{recipe.servings} servings</span>
                                    </div>
                                )}
                            </div>

                            {recipe.ingredients && recipe.ingredients.length > 0 && (
                                <div>
                                    <h3 className="font-semibold mb-3 flex items-center gap-2" style={{ color: colors.text }}>
                                        <span className="text-lg">🛒</span> Ingredients
                                    </h3>
                                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                        {recipe.ingredients.map((ing: any, i: number) => (
                                            <li key={i} className="flex items-center gap-2 text-sm px-2 py-1 rounded-lg" style={{ background: colors.bg, color: colors.textMuted }}>
                                                <span className="w-1.5 h-1.5 rounded-full" style={{ background: colors.accent }} />
                                                {typeof ing === 'string' ? ing : ing.name}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {recipe.instructions && recipe.instructions.length > 0 && (
                                <div>
                                    <h3 className="font-semibold mb-3 flex items-center gap-2" style={{ color: colors.text }}>
                                        <span className="text-lg">📝</span> Instructions
                                    </h3>
                                    <ol className="space-y-3">
                                        {recipe.instructions.map((step: string, i: number) => (
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
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}