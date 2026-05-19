'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { motion } from 'framer-motion'
import { theme } from '@/lib/theme'
import Hero from '@/components/Hero'
import {
    Search,
    Calendar,
    ShoppingCart,
    Flame,
} from 'lucide-react'

const C = theme.colors

const features = [
    {
        icon: Search,
        title: 'Discover Recipes',
        desc: 'Search 365,000+ recipes from cuisines around the world and save your favourites.',
        tint: '#E8F5E9',
        iconColor: '#5A8A3C',
    },
    {
        icon: Calendar,
        title: 'Plan Your Week',
        desc: "Drag-and-drop meal planning. Know exactly what you're cooking every day.",
        tint: '#E3F0FF',
        iconColor: '#3A7C6E',
    },
    {
        icon: ShoppingCart,
        title: 'Smart Grocery Lists',
        desc: 'Auto-generated shopping lists from your meal plan. Never forget an ingredient.',
        tint: '#FFF8E1',
        iconColor: '#C17A3A',
    },
    {
        icon: Flame,
        title: 'Track Calories',
        desc: 'Track your daily calorie intake with easy-to-read charts. Stay on top of your nutrition goals.',
        tint: '#FBE9E7',
        iconColor: '#E05A5A',
    },
]

const stats = [
    { value: '365K+', label: 'Recipes' },
    { value: '50K+',  label: 'Happy Cooks' },
    { value: '4.8★',  label: 'Rating' },
    { value: 'Free',  label: 'Forever' },
]

const steps = [
    { step: '01', icon: Search, title: 'Search Recipes', desc: 'Browse 365,000+ recipes by cuisine, diet, ingredients, or prep time.', iconColor: '#5A8A3C' },
    { step: '02', icon: Calendar, title: 'Plan Your Week', desc: 'Drag recipes onto your weekly calendar. Balance meals effortlessly.', iconColor: '#3A7C6E' },
    { step: '03', icon: ShoppingCart, title: 'Shop & Cook', desc: 'Get your auto-generated grocery list and cook with confidence.', iconColor: '#C17A3A' },
]

export default function Home() {
    const [user, setUser] = useState<any>(null)
    const supabase = createClient()

    useEffect(() => {
        getUser()
    }, [])

    const getUser = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
    }

    return (
        <div className="min-h-screen overflow-x-hidden" style={{ background: C.bg, fontFamily: theme.font }}>

            {/* Hero Section */}
            <Hero user={user} />

            {/* Stats Section */}
            <section style={{ background: C.bg }}>
                <div className="container mx-auto px-4 sm:px-6 lg:px-10 max-w-7xl mt-10 pb-12 sm:pb-16">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                        {stats.map((stat, i) => {
                            return (
                                <motion.div
                                    key={stat.label}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.08 }}
                                    className="rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center transition-all hover:-translate-y-1"
                                    style={{ background: C.bgSecondary, border: `1px solid ${C.border}` }}
                                >
                                    <p className="text-xl sm:text-3xl font-bold mb-0.5 sm:mb-1" style={{ color: C.text, fontFamily: theme.fontHeading }}>
                                        {stat.value}
                                    </p>
                                    <p className="text-[10px] sm:text-xs" style={{ color: C.textMuted }}>{stat.label}</p>
                                </motion.div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="pb-16 sm:pb-24" style={{ background: C.bg }}>
                <div className="container mx-auto px-4 sm:px-6 lg:px-10 max-w-7xl">
                    <div className="text-center mb-8 sm:mb-12">
                        <p className="text-[10px] sm:text-xs uppercase tracking-widest font-semibold mb-2" style={{ color: C.accent }}>
                            Everything you need
                        </p>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl" style={{ fontFamily: theme.fontHeading, fontWeight: 400, color: C.text }}>
                            Your kitchen, <em>supercharged</em>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                        {features.map((feat, i) => {
                            const Icon = feat.icon
                            return (
                                <motion.div
                                    key={feat.title}
                                    initial={{ opacity: 0, y: 24 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="group rounded-2xl sm:rounded-3xl p-5 sm:p-7 flex gap-4 sm:gap-5 hover:-translate-y-1 transition-transform"
                                    style={{ background: C.bgSecondary, border: `1px solid ${C.border}` }}
                                >
                                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform"
                                         style={{ background: feat.tint }}>
                                        <Icon className="w-6 h-6 sm:w-7 sm:h-7" style={{ color: feat.iconColor }} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-1 text-base sm:text-lg" style={{ color: C.text, fontFamily: theme.fontHeading }}>
                                            {feat.title}
                                        </h3>
                                        <p className="text-xs sm:text-sm leading-relaxed" style={{ color: C.textMuted }}>
                                            {feat.desc}
                                        </p>
                                    </div>
                                </motion.div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section
                className="py-16 sm:py-24"
                style={{ background: C.bgSecondary, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}
            >
                <div className="container mx-auto px-4 sm:px-6 lg:px-10 max-w-7xl">
                    <div className="text-center mb-8 sm:mb-12">
                        <p className="text-[10px] sm:text-xs uppercase tracking-widest font-semibold mb-2" style={{ color: C.accent }}>How it works</p>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl" style={{ fontFamily: theme.fontHeading, fontWeight: 400, color: C.text }}>
                            Simple as <em>1, 2, 3</em>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 relative">
                        <div className="hidden md:block absolute top-8 left-[28%] right-[28%] h-px"
                             style={{ background: `linear-gradient(to right, transparent, ${C.border}, transparent)` }} />

                        {steps.map((step, i) => {
                            const Icon = step.icon
                            return (
                                <motion.div
                                    key={step.step}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.12 }}
                                    className="text-center relative"
                                >
                                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 relative z-10"
                                         style={{ background: C.bgHover, border: `1px solid ${C.border}` }}>
                                        <Icon className="w-7 h-7 sm:w-8 sm:h-8" style={{ color: step.iconColor }} />
                                    </div>
                                    <span className="text-[10px] sm:text-xs font-bold tracking-widest mb-1 sm:mb-2 block" style={{ color: C.accent }}>
                                        STEP {step.step}
                                    </span>
                                    <h3 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base" style={{ color: C.text, fontFamily: theme.fontHeading }}>
                                        {step.title}
                                    </h3>
                                    <p className="text-xs sm:text-sm leading-relaxed max-w-xs mx-auto" style={{ color: C.textMuted }}>
                                        {step.desc}
                                    </p>
                                </motion.div>
                            )
                        })}
                    </div>
                </div>
            </section>
        </div>
    )
}