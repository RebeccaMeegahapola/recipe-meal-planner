'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { ArrowRight, ChevronRight, Clock, Flame } from 'lucide-react'
import { theme } from '@/lib/theme'

const C = theme.colors

const featured = [
    {
        name: 'Avocado Toast',
        tag: 'Breakfast',
        time: '10 min',
        cal: 320,
        img: 'https://images.pexels.com/photos/1351238/pexels-photo-1351238.jpeg?auto=compress&cs=tinysrgb&w=1280&h=720&fit=crop',
    },
    {
        name: 'Green Smoothie Bowl',
        tag: 'Healthy',
        time: '8 min',
        cal: 280,
        img: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1280&h=720&fit=crop',
    },
    {
        name: 'Salmon & Greens',
        tag: 'Dinner',
        time: '25 min',
        cal: 480,
        img: 'https://images.pexels.com/photos/3655916/pexels-photo-3655916.jpeg?auto=compress&cs=tinysrgb&w=1280&h=720&fit=crop',
    },
]

interface HeroProps {
    user: any
}

export default function Hero({ user }: HeroProps) {
    const [active, setActive] = useState(0)
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
    const { scrollY } = useScroll()
    const yText = useTransform(scrollY, [0, 400], [0, -40])
    const yImg = useTransform(scrollY, [0, 400], [0, 60])

    const startCycle = () => {
        if (intervalRef.current) clearInterval(intervalRef.current)
        intervalRef.current = setInterval(() => {
            setActive(prev => (prev + 1) % featured.length)
        }, 3500)
    }

    useEffect(() => {
        startCycle()
        return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
    }, [])

    const handleDotClick = (i: number) => {
        setActive(i)
        startCycle()
    }

    const recipe = featured[active]

    return (
        <section className="relative flex flex-col overflow-hidden bg-[#F7F3EE]">

            {/* ── Top thin banner ─────────────────────────────── */}
            <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative z-20 flex items-center justify-center gap-2 py-2.5 text-[11px] font-medium tracking-wide"
                style={{ background: C.accentDark, color: '#E8F5D8' }}
            >
                <span className="w-1 h-1 rounded-full bg-[#9FCC6B] inline-block" />
                50,000+ cooks already planning smarter — it's free
                <span className="w-1 h-1 rounded-full bg-[#9FCC6B] inline-block" />
            </motion.div>

            {/* ══════════════════════════════════════════════════
                MOBILE LAYOUT  (< lg) — two stacked rows
            ══════════════════════════════════════════════════ */}
            <div className="lg:hidden flex flex-col">

                {/* ROW 1 — Heading + copy + CTAs */}
                <motion.div
                    style={{ y: yText }}
                    className="px-5 pt-10 pb-8"
                >
                    <motion.p
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-xs font-semibold tracking-[0.18em] uppercase mb-5"
                        style={{ color: C.accent }}
                    >
                        Meal Planning · Nutrition · Recipes
                    </motion.p>

                    <motion.h1
                        initial={{ opacity: 0, y: 28 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.65, delay: 0.18 }}
                        className="text-[2.4rem] sm:text-5xl leading-[1.06] tracking-tight"
                        style={{ fontFamily: theme.fontHeading, color: C.accentDark }}
                    >
                        Good food
                        <br />
                        <span className="italic font-light" style={{ color: C.accent }}>
                            starts here.
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.45 }}
                        className="text-sm sm:text-base leading-relaxed mt-4"
                        style={{ color: C.textMuted, fontWeight: 400 }}
                    >
                        Discover recipes you'll actually make, build your weekly plan,
                        and let the grocery list write itself.
                    </motion.p>

                    {/* CTAs */}
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.56 }}
                        className="flex flex-wrap items-center gap-3 mt-7"
                    >
                        {user ? (
                            <Link href="/dashboard">
                                <button
                                    className="group flex items-center gap-2.5 px-6 py-3 rounded-full text-sm font-semibold transition-all hover:opacity-90 active:scale-[0.98]"
                                    style={{
                                        background: C.accentDark,
                                        color: '#F4F8EE',
                                        boxShadow: `0 6px 24px ${C.accentDark}30`,
                                    }}
                                >
                                    Open Dashboard
                                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                                </button>
                            </Link>
                        ) : (
                            <>
                                <Link href="/login">
                                    <button
                                        className="group flex items-center gap-2.5 px-6 py-3 rounded-full text-sm font-semibold transition-all hover:opacity-90 active:scale-[0.98]"
                                        style={{
                                            background: C.accentDark,
                                            color: '#F4F8EE',
                                            boxShadow: `0 6px 24px ${C.accentDark}30`,
                                        }}
                                    >
                                        Start for free
                                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                                    </button>
                                </Link>
                                <Link href="/recipes">
                                    <button
                                        className="flex items-center gap-1.5 px-5 py-3 rounded-full text-sm font-medium transition-all hover:bg-black/5 active:scale-[0.98]"
                                        style={{ color: C.accentDark, border: `1.5px solid ${C.accentDark}30` }}
                                    >
                                        Browse recipes
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </Link>
                            </>
                        )}
                    </motion.div>

                    {/* Stats row */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 }}
                        className="flex items-center gap-7 mt-8"
                    >
                        {[
                            { value: '365K+', label: 'Recipes' },
                            { value: '50K+', label: 'Active cooks' },
                            { value: '4.9', label: 'Rating' },
                        ].map(stat => (
                            <div key={stat.label}>
                                <div className="text-lg font-bold" style={{ color: C.accentDark, fontFamily: theme.fontHeading }}>
                                    {stat.value}
                                </div>
                                <div className="text-xs mt-0.5" style={{ color: C.textMuted }}>
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </motion.div>

                {/* ROW 2 — Image slider */}
                <motion.div
                    style={{ y: yImg, height: '320px' }}
                    className="relative mx-4 mb-8 rounded-3xl overflow-hidden"
                >
                    {/* Slides */}
                    <AnimatePresence mode="wait">
                        {featured.map((item, i) => (
                            <motion.img
                                key={item.img}
                                src={item.img}
                                alt={item.name}
                                initial={{ opacity: 0, filter: 'blur(12px)' }}
                                animate={{
                                    opacity: i === active ? 1 : 0,
                                    filter: i === active ? 'blur(0px)' : 'blur(12px)',
                                }}
                                exit={{ opacity: 0, filter: 'blur(12px)' }}
                                transition={{ duration: 0.8, ease: 'easeInOut' }}
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                        ))}
                    </AnimatePresence>

                    {/* Bottom gradient */}
                    <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            background: 'linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 50%)',
                        }}
                    />

                    {/* Recipe info card — bottom-left */}
                    <div className="absolute bottom-4 left-4 right-14">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={recipe.name}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                transition={{ duration: 0.4 }}
                                className="rounded-2xl px-4 py-3 inline-block"
                                style={{
                                    background: 'rgba(255,255,255,0.92)',
                                    backdropFilter: 'blur(14px)',
                                    border: '1px solid rgba(255,255,255,0.95)',
                                    boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                                }}
                            >
                                <span
                                    className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold mb-1.5"
                                    style={{ background: `${C.accent}18`, color: C.accent }}
                                >
                                    {recipe.tag}
                                </span>
                                <p className="font-semibold text-sm" style={{ color: C.accentDark, fontFamily: theme.fontHeading }}>
                                    {recipe.name}
                                </p>
                                <div className="flex items-center gap-3 mt-1.5">
                                    <span className="flex items-center gap-1 text-xs" style={{ color: C.textMuted }}>
                                        <Clock className="w-3 h-3" />
                                        {recipe.time}
                                    </span>
                                    <span className="flex items-center gap-1 text-xs" style={{ color: C.textMuted }}>
                                        <Flame className="w-3 h-3" />
                                        {recipe.cal} kcal
                                    </span>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Dot nav — bottom-right */}
                    <div className="absolute bottom-5 right-4 flex flex-col gap-2.5">
                        {featured.map((_, i) => (
                            <motion.button
                                key={i}
                                onClick={() => handleDotClick(i)}
                                aria-label={`Show ${featured[i].name}`}
                                className="rounded-full transition-all duration-300 focus:outline-none"
                                animate={{
                                    width: i === active ? 8 : 6,
                                    height: i === active ? 22 : 6,
                                }}
                                style={{
                                    background: i === active ? '#fff' : 'rgba(255,255,255,0.5)',
                                    boxShadow: i === active ? '0 4px 16px rgba(0,0,0,0.2)' : 'none',
                                }}
                            />
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* ══════════════════════════════════════════════════
                DESKTOP LAYOUT  (>= lg) — original side-by-side
            ══════════════════════════════════════════════════ */}
            <div className="hidden lg:flex flex-1 relative min-h-screen w-full">

                {/* LEFT COLUMN — Typography */}
                <motion.div
                    style={{ y: yText }}
                    className="flex flex-col justify-center container mx-auto px-4 md:px-6 max-w-7xl w-full py-16 lg:py-0"
                >
                    <motion.p
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-xs font-semibold tracking-[0.18em] uppercase mb-6"
                        style={{ color: C.accent }}
                    >
                        Meal Planning · Nutrition · Recipes
                    </motion.p>

                    <motion.h1
                        initial={{ opacity: 0, y: 28 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.65, delay: 0.18 }}
                        className="text-[2.6rem] sm:text-6xl lg:text-[4.5rem] xl:text-[5.2rem] leading-[1.06] tracking-tight"
                        style={{ fontFamily: theme.fontHeading, color: C.accentDark }}
                    >
                        Good food
                        <br />
                        <span className="italic font-light" style={{ color: C.accent }}>
                            starts here.
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.45 }}
                        className="text-base sm:text-lg leading-relaxed max-w-sm mt-5"
                        style={{ color: C.textMuted, fontWeight: 400 }}
                    >
                        Discover recipes you'll actually make, build your weekly plan,
                        and let the grocery list write itself.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.56 }}
                        className="flex flex-wrap items-center gap-3 mt-10"
                    >
                        {user ? (
                            <Link href="/dashboard">
                                <button
                                    className="group flex items-center gap-2.5 px-7 py-3.5 rounded-full text-sm font-semibold transition-all hover:opacity-90 active:scale-[0.98]"
                                    style={{
                                        background: C.accentDark,
                                        color: '#F4F8EE',
                                        boxShadow: `0 6px 24px ${C.accentDark}30`,
                                    }}
                                >
                                    Open Dashboard
                                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                                </button>
                            </Link>
                        ) : (
                            <>
                                <Link href="/login">
                                    <button
                                        className="group flex items-center gap-2.5 px-7 py-3.5 rounded-full text-sm font-semibold transition-all hover:opacity-90 active:scale-[0.98]"
                                        style={{
                                            background: C.accentDark,
                                            color: '#F4F8EE',
                                            boxShadow: `0 6px 24px ${C.accentDark}30`,
                                        }}
                                    >
                                        Start for free
                                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                                    </button>
                                </Link>
                                <Link href="/recipes">
                                    <button
                                        className="flex items-center gap-1.5 px-6 py-3.5 rounded-full text-sm font-medium transition-all hover:bg-black/5 active:scale-[0.98]"
                                        style={{ color: C.accentDark, border: `1.5px solid ${C.accentDark}30` }}
                                    >
                                        Browse recipes
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </Link>
                            </>
                        )}
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 }}
                        className="flex items-center gap-8 mt-12"
                    >
                        {[
                            { value: '365K+', label: 'Recipes' },
                            { value: '50K+', label: 'Active cooks' },
                            { value: '4.9', label: 'Rating' },
                        ].map(stat => (
                            <div key={stat.label}>
                                <div className="text-xl font-bold" style={{ color: C.accentDark, fontFamily: theme.fontHeading }}>
                                    {stat.value}
                                </div>
                                <div className="text-xs mt-0.5" style={{ color: C.textMuted }}>
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </motion.div>

                {/* RIGHT COLUMN — Full-bleed photo */}
                <motion.div
                    style={{ y: yImg }}
                    className="absolute right-0 top-0 bottom-0 w-[55%] overflow-hidden"
                >
                    <div className="relative w-full h-full">
                        <AnimatePresence mode="wait">
                            {featured.map((item, i) => (
                                <motion.img
                                    key={item.img}
                                    src={item.img}
                                    alt={item.name}
                                    initial={{ opacity: 0, filter: 'blur(12px)' }}
                                    animate={{
                                        opacity: i === active ? 1 : 0,
                                        filter: i === active ? 'blur(0px)' : 'blur(12px)',
                                    }}
                                    exit={{ opacity: 0, filter: 'blur(12px)' }}
                                    transition={{ duration: 0.8, ease: 'easeInOut' }}
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                            ))}
                        </AnimatePresence>

                        <div
                            className="absolute inset-0 pointer-events-none"
                            style={{
                                background: 'linear-gradient(to right, #F7F3EE 0%, transparent 25%), linear-gradient(to top, rgba(0,0,0,0.32) 0%, transparent 45%)',
                            }}
                        />

                        <div className="absolute bottom-8 left-8">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={recipe.name}
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -12 }}
                                    transition={{ duration: 0.5 }}
                                    className="rounded-2xl px-5 py-4 min-w-[240px]"
                                    style={{
                                        background: 'rgba(255,255,255,0.92)',
                                        backdropFilter: 'blur(18px)',
                                        border: '1px solid rgba(255,255,255,0.98)',
                                        boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
                                    }}
                                >
                                    <span
                                        className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold mb-2"
                                        style={{ background: `${C.accent}15`, color: C.accent }}
                                    >
                                        {recipe.tag}
                                    </span>
                                    <p className="font-semibold text-base" style={{ color: C.accentDark, fontFamily: theme.fontHeading }}>
                                        {recipe.name}
                                    </p>
                                    <div className="flex items-center gap-4 mt-2">
                                        <span className="flex items-center gap-1.5 text-xs" style={{ color: C.textMuted }}>
                                            <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                                            {recipe.time}
                                        </span>
                                        <span className="flex items-center gap-1.5 text-xs" style={{ color: C.textMuted }}>
                                            <Flame className="w-3.5 h-3.5 flex-shrink-0" />
                                            {recipe.cal} kcal
                                        </span>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        <div className="absolute bottom-12 right-8 flex flex-col gap-3">
                            {featured.map((_, i) => (
                                <motion.button
                                    key={i}
                                    onClick={() => handleDotClick(i)}
                                    aria-label={`Show ${featured[i].name}`}
                                    className="rounded-full transition-all duration-300 focus:outline-none hover:scale-110"
                                    animate={{
                                        width: i === active ? 8 : 6,
                                        height: i === active ? 24 : 6,
                                    }}
                                    style={{
                                        background: i === active ? '#fff' : 'rgba(255,255,255,0.5)',
                                        boxShadow: i === active ? '0 4px 16px rgba(0,0,0,0.2)' : 'none',
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* ── Scrolling ticker ────────────────────────────── */}
            <div
                className="relative z-20 overflow-hidden py-3 border-t"
                style={{ borderColor: `${C.accentDark}18`, background: '#F0EBE3' }}
            >
                <motion.div
                    animate={{ x: ['0%', '-50%'] }}
                    transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
                    className="flex items-center gap-8 whitespace-nowrap"
                >
                    {[
                        'Meal Planning', 'Weekly Menus', 'Smart Grocery Lists',
                        'Nutrition Tracking', '365K+ Recipes', 'Personalized for You',
                        'Meal Planning', 'Weekly Menus', 'Smart Grocery Lists',
                        'Nutrition Tracking', '365K+ Recipes', 'Personalized for You',
                    ].map((text, i) => (
                        <span key={i} className="flex items-center gap-3">
                            <span className="text-xs font-medium tracking-widest uppercase" style={{ color: C.textMuted }}>
                                {text}
                            </span>
                            <span className="w-1 h-1 rounded-full inline-block opacity-40" style={{ background: C.accent }} />
                        </span>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}