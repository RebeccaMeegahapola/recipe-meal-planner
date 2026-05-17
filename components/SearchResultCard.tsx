'use client'
import { Clock, Users, Star, Heart, Eye } from 'lucide-react'
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
    onViewDetails: (id: number) => void
}

export default function SearchResultCard({ recipe, onViewDetails }: SearchResultCardProps) {
    return (
        <div
            onClick={() => onViewDetails(recipe.id)}
            className="group rounded-2xl overflow-hidden cursor-pointer transition-all hover:-translate-y-1 hover:shadow-lg"
            style={{ background: colors.bgSecondary, border: `1px solid ${colors.border}` }}
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
                        onViewDetails(recipe.id)
                    }}
                    className="w-full mt-4 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:opacity-80 flex items-center justify-center gap-2"
                    style={{ background: colors.accent, color: '#fff' }}
                >
                    <Eye className="w-4 h-4" />
                    View Details
                </button>
            </div>
        </div>
    )
}