'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Leaf, Star, Check, Sparkles, ChevronRight } from 'lucide-react'
import { theme } from '@/lib/theme'

const C = theme.colors

// Mock recipes for the animated card
const mockRecipes = [
    {
        name: 'Avocado Toast',
        time: '10 min',
        cal: 320,
        img: 'https://images.pexels.com/photos/1351238/pexels-photo-1351238.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
        name: 'Green Smoothie Bowl',
        time: '8 min',
        cal: 280,
        img: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
        name: 'Salmon & Greens',
        time: '25 min',
        cal: 480,
        img: 'https://images.pexels.com/photos/3655916/pexels-photo-3655916.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
]

// Floating emojis
const floatingEmojis = [
    { emoji: '🥑', top: '5%', right: '2%', size: 40, delay: 0, dur: 3.5 },
    { emoji: '🍋', top: '15%', right: '15%', size: 28, delay: 0.7, dur: 4.0 },
    { emoji: '🫙', bottom: '15%', right: '5%', size: 32, delay: 1.4, dur: 3.8 },
    { emoji: '🌿', bottom: '25%', right: '20%', size: 24, delay: 0.3, dur: 4.2 },
    { emoji: '🍃', top: '30%', right: '2%', size: 22, delay: 1.0, dur: 3.6 },
    { emoji: '🍅', top: '50%', right: '18%', size: 26, delay: 0.5, dur: 4.5 },
]

interface HeroProps {
    user: any
}

export default function Hero({ user }: HeroProps) {
    const [activeRecipe, setActiveRecipe] = useState(0)
    const { scrollY } = useScroll()
    const opacity = useTransform(scrollY, [0, 300], [1, 0.95])

    useEffect(() => {
        const timer = setInterval(() => {
            setActiveRecipe(prev => (prev + 1) % mockRecipes.length)
        }, 2800)
        return () => clearInterval(timer)
    }, [])

    return (
        <motion.section
            style={{ opacity }}
            className="relative min-h-screen flex items-center overflow-hidden"
        >
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#D6EAC0] via-[#C8E0B0] to-[#BDD9A8]" />

            {/* Soft radial glow spots */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-20 -left-20 w-64 md:w-96 h-64 md:h-96 rounded-full opacity-40 bg-[#EAF5D8] blur-3xl" />
                <div className="absolute top-1/3 -right-10 w-48 md:w-80 h-48 md:h-80 rounded-full opacity-30 bg-[#C8E0B0] blur-3xl" />
                <div className="absolute -bottom-10 left-1/3 w-48 md:w-72 h-48 md:h-72 rounded-full opacity-35 bg-[#D8ECC4] blur-3xl" />
                <div className="absolute inset-0 opacity-[0.03]"
                     style={{
                         backgroundImage: `radial-gradient(circle, ${C.accentDark} 1.5px, transparent 1.5px)`,
                         backgroundSize: '32px 32px',
                     }} />
            </div>

            {/* Floating emojis */}
            {floatingEmojis.map((item, i) => (
                <motion.div
                    key={i}
                    className="absolute hidden lg:flex items-center justify-center select-none pointer-events-none z-20"
                    style={{
                        top: item.top ?? 'auto',
                        bottom: item.bottom ?? 'auto',
                        right: item.right,
                        fontSize: `${item.size}px`,
                        filter: 'drop-shadow(0 4px 12px rgba(60,90,46,0.15))',
                    }}
                    animate={{ y: [0, -10, 0] }}
                    transition={{
                        duration: item.dur,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: item.delay,
                    }}
                >
                    {item.emoji}
                </motion.div>
            ))}

            <div className="container mx-auto px-4 sm:px-6 lg:px-10 max-w-7xl relative z-10 py-16 sm:py-20 lg:py-28">
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">

                    {/* LEFT: Copy */}
                    <div>
                        {/* Eyebrow pill */}
                        <motion.div
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.45 }}
                        >
              <span className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-semibold mb-4 sm:mb-6"
                    style={{
                        background: 'rgba(90,138,60,0.12)',
                        color: C.accent,
                        border: `1px solid ${C.accent}30`,
                    }}
              >
                <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span className="hidden sm:inline">Your personal kitchen companion</span>
                <span className="sm:hidden">Kitchen companion</span>
                <span className="inline-flex items-center gap-1 ml-1 px-1.5 sm:px-2 py-0.5 rounded-full text-[8px] sm:text-[10px] font-bold"
                      style={{ background: C.accent, color: '#fff' }}
                >
                  FREE
                </span>
              </span>
                        </motion.div>

                        {/* Headline */}
                        <motion.h1
                            initial={{ opacity: 0, y: 22 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.55, delay: 0.08 }}
                            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl"
                            style={{
                                fontFamily: theme.fontHeading,
                                fontWeight: 400,
                                lineHeight: 1.1,
                                color: C.accentDark,
                            }}
                        >
                            Cook smarter,<br />
                            <em style={{ color: C.accent }}>eat better,</em><br />
                            every day.
                        </motion.h1>

                        {/* Subheading */}
                        <motion.p
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.18 }}
                            className="mt-4 sm:mt-5 text-sm sm:text-base leading-relaxed max-w-md"
                            style={{ color: C.textMuted }}
                        >
                            Discover 365,000+ recipes, plan your weekly meals, auto-generate grocery lists,
                            and track your nutrition — all in one beautiful place.
                        </motion.p>

                        {/* CTA buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.32 }}
                            className="flex flex-wrap items-center gap-3 mt-6 sm:mt-8"
                        >
                            {user ? (
                                <Link href="/dashboard">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="flex items-center gap-2 px-5 sm:px-7 py-2.5 sm:py-3.5 rounded-xl sm:rounded-2xl font-semibold text-xs sm:text-sm"
                                        style={{
                                            background: C.accentDark,
                                            color: '#F4F8EE',
                                            boxShadow: `0 8px 28px ${C.accentDark}30`,
                                        }}
                                    >
                                        Go to Dashboard
                                        <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                    </motion.button>
                                </Link>
                            ) : (
                                <>
                                    <Link href="/login">
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="flex items-center gap-2 px-5 sm:px-7 py-2.5 sm:py-3.5 rounded-xl sm:rounded-2xl font-semibold text-xs sm:text-sm"
                                            style={{
                                                background: C.accentDark,
                                                color: '#F4F8EE',
                                                boxShadow: `0 8px 28px ${C.accentDark}30`,
                                            }}
                                        >
                                            Get Started Free
                                            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                        </motion.button>
                                    </Link>
                                    <Link href="/recipes">
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="px-5 sm:px-6 py-2.5 sm:py-3.5 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-medium transition-all hover:opacity-80"
                                            style={{
                                                color: C.accent,
                                                border: `1.5px solid ${C.accent}50`,
                                                background: 'rgba(255,255,255,0.5)',
                                            }}
                                        >
                                            Browse Recipes
                                            <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 inline ml-1" />
                                        </motion.button>
                                    </Link>
                                </>
                            )}
                        </motion.div>

                        {/* Social proof */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="flex items-center gap-3 mt-6 sm:mt-8"
                        >
                            <div className="flex -space-x-2">
                                {['👩‍🍳','🧑‍🍳','👨‍🍳','🧑‍🍳'].map((e, i) => (
                                    <div
                                        key={i}
                                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm border-2 shadow-sm"
                                        style={{ borderColor: '#fff', background: 'rgba(90,138,60,0.15)' }}
                                    >
                                        {e}
                                    </div>
                                ))}
                            </div>
                            <div>
                                <div className="flex items-center gap-0.5 mb-0.5">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-current" style={{ color: '#F59E0B' }} />
                                    ))}
                                </div>
                                <p className="text-[10px] sm:text-xs" style={{ color: C.textMuted }}>
                                    <strong style={{ color: C.accentDark }}>50,000+</strong> cooks already planning smarter
                                </p>
                            </div>
                        </motion.div>
                    </div>

                    {/* RIGHT: Animated Mockup Card - Now visible on mobile! */}
                    <motion.div
                        initial={{ opacity: 0, x: 40, y: 20 }}
                        animate={{ opacity: 1, x: 0, y: 0 }}
                        transition={{ duration: 0.75, delay: 0.3 }}
                        className="relative mt-8 lg:mt-0"
                    >
                        {/* Glow effect */}
                        <div className="absolute inset-0 rounded-[32px] sm:rounded-[40px] opacity-30 blur-2xl"
                             style={{ background: `radial-gradient(ellipse, ${C.accent}60 0%, transparent 70%)` }} />

                        {/* Glass Card - Responsive width */}
                        <div className="relative w-full max-w-[320px] sm:max-w-sm mx-auto rounded-[28px] sm:rounded-[32px] overflow-hidden"
                             style={{
                                 background: 'rgba(255,255,255,0.85)',
                                 backdropFilter: 'blur(20px)',
                                 border: '1px solid rgba(255,255,255,0.9)',
                                 boxShadow: '0 20px 40px rgba(45,80,22,0.15)',
                             }}
                        >
                            {/* App header */}
                            <div className="px-4 sm:px-6 pt-5 sm:pt-6 pb-3 sm:pb-4" style={{ borderBottom: `1px solid ${C.border}` }}>
                                <div className="flex items-center justify-between mb-3 sm:mb-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center text-base sm:text-lg"
                                             style={{ background: `linear-gradient(135deg, ${C.accent}, ${C.accentDark})` }}>
                                            🥑
                                        </div>
                                        <span className="font-bold text-xs sm:text-sm" style={{ color: C.text, fontFamily: theme.fontHeading }}>
                      MealMind
                    </span>
                                    </div>
                                    <div className="flex gap-1.5">
                                        <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-red-400" />
                                        <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-yellow-400" />
                                        <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-green-400" />
                                    </div>
                                </div>
                                <p className="text-[10px] sm:text-xs font-medium" style={{ color: C.textMuted }}>Today's picks for you</p>
                            </div>

                            {/* Recipe list - Smaller on mobile */}
                            <div className="p-3 sm:p-4 space-y-2">
                                {mockRecipes.map((recipe, i) => (
                                    <motion.div
                                        key={recipe.name}
                                        animate={{
                                            opacity: i === activeRecipe ? 1 : 0.4,
                                            scale: i === activeRecipe ? 1 : 0.96,
                                            y: i === activeRecipe ? 0 : 2,
                                        }}
                                        transition={{ duration: 0.4 }}
                                        className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-xl sm:rounded-2xl cursor-pointer"
                                        style={{
                                            background: i === activeRecipe ? 'rgba(90,138,60,0.08)' : 'transparent',
                                            border: `1px solid ${i === activeRecipe ? 'rgba(90,138,60,0.2)' : 'transparent'}`,
                                        }}
                                    >
                                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl overflow-hidden flex-shrink-0">
                                            <img src={recipe.img} alt={recipe.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-xs sm:text-sm truncate" style={{ color: C.text }}>
                                                {recipe.name}
                                            </p>
                                            <div className="flex items-center gap-1.5 sm:gap-2 mt-0.5 sm:mt-1">
                                                <span className="text-[9px] sm:text-xs" style={{ color: C.textMuted }}>⏱ {recipe.time}</span>
                                                <span className="text-[9px] sm:text-xs" style={{ color: C.textMuted }}>🔥 {recipe.cal} kcal</span>
                                            </div>
                                        </div>
                                        {i === activeRecipe && (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center flex-shrink-0"
                                                style={{ background: `linear-gradient(135deg, ${C.accent}, ${C.accentDark})` }}
                                            >
                                                <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                                            </motion.div>
                                        )}
                                    </motion.div>
                                ))}
                            </div>

                            {/* Nutrition strip */}
                            <div className="px-3 sm:px-4 pb-4 sm:pb-6">
                                <div className="rounded-xl sm:rounded-2xl p-3 sm:p-4" style={{ background: `linear-gradient(135deg, ${C.bgSecondary}, ${C.bgHover})` }}>
                                    <div className="flex items-center justify-between mb-2 sm:mb-3">
                                        <span className="text-[10px] sm:text-xs font-semibold" style={{ color: C.text }}>Today's Nutrition</span>
                                        <span className="text-[9px] sm:text-xs font-medium" style={{ color: C.accent }}>1,420 / 2,000 kcal</span>
                                    </div>
                                    <div className="h-1 sm:h-1.5 rounded-full overflow-hidden" style={{ background: C.border }}>
                                        <motion.div
                                            className="h-full rounded-full"
                                            style={{ background: `linear-gradient(90deg, ${C.accent}, ${C.accentDark})` }}
                                            initial={{ width: 0 }}
                                            animate={{ width: '71%' }}
                                            transition={{ duration: 1.2, delay: 0.9 }}
                                        />
                                    </div>
                                    <div className="flex justify-between mt-2 sm:mt-3">
                                        {['Protein', 'Carbs', 'Fat'].map((label, idx) => {
                                            const vals = ['68g', '142g', '48g']
                                            return (
                                                <div key={label} className="text-center">
                                                    <div className="text-[10px] sm:text-xs font-bold" style={{ color: C.text }}>{vals[idx]}</div>
                                                    <div className="text-[8px] sm:text-[10px]" style={{ color: C.textMuted }}>{label}</div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Floating badges - Hidden on mobile */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.9, duration: 0.5 }}
                            className="absolute -top-4 -left-4 rounded-xl px-2 py-1.5 shadow-lg hidden sm:block"
                            style={{
                                background: 'rgba(255,255,255,0.95)',
                                backdropFilter: 'blur(12px)',
                                border: `1px solid ${C.border}`,
                            }}
                        >
                            <div className="flex items-center gap-1.5">
                                <span className="text-lg">🍽️</span>
                                <div>
                                    <div className="text-[11px] font-bold" style={{ color: C.text }}>365K+ Recipes</div>
                                    <div className="text-[8px]" style={{ color: C.textMuted }}>always growing</div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 1.1, duration: 0.5 }}
                            className="absolute -bottom-3 -right-3 rounded-xl px-2 py-1.5 shadow-lg hidden sm:block"
                            style={{
                                background: `linear-gradient(135deg, ${C.accent}, ${C.accentDark})`,
                                border: '1px solid rgba(255,255,255,0.2)',
                            }}
                        >
                            <div className="flex items-center gap-1.5">
                                <span className="text-lg">✅</span>
                                <div>
                                    <div className="text-[11px] font-bold text-white">Meal Plan Ready</div>
                                    <div className="text-[8px] text-white/70">this week's menu set</div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            {/* Wave divider */}
            <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
                <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg"
                     preserveAspectRatio="none" style={{ width: '100%', height: '40px', display: 'block' }}>
                    <path
                        d="M0 80L48 69.3C96 59 192 37 288 32C384 27 480 37 576 48C672 59 768 69 864 64C960 59 1056 37 1152 27C1248 16 1344 16 1392 16L1440 16V80H0Z"
                        fill="#F4F8EE"
                    />
                </svg>
            </div>
        </motion.section>
    )
}