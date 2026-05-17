'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ChefHat, Mail, Lock, Leaf, Sparkles } from 'lucide-react'
import { theme } from '@/lib/theme'

const colors = theme.colors

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [isSignUp, setIsSignUp] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        if (isSignUp) {
            const { error } = await supabase.auth.signUp({
                email,
                password,
            })
            if (error) {
                alert(error.message)
            } else {
                alert('Check your email for confirmation! 🥑')
                setIsSignUp(false)
            }
        } else {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })
            if (error) {
                alert(error.message)
            } else {
                router.push('/dashboard')
            }
        }
        setLoading(false)
    }

    return (
        <div className="min-h-screen flex items-center justify-center" style={{ background: colors.bg }}>
            {/* Decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full" style={{ background: `${colors.accent}08`, filter: 'blur(3rem)' }} />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full" style={{ background: `${colors.accent}05`, filter: 'blur(3rem)' }} />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative w-full max-w-md mx-4"
            >
                <div className="rounded-2xl shadow-xl overflow-hidden" style={{ background: colors.bgSecondary, border: `1px solid ${colors.border}` }}>
                    {/* Header with logo */}
                    <div className="text-center pt-8 pb-4">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4" style={{ background: `${colors.accent}15` }}>
                            <ChefHat className="w-8 h-8" style={{ color: colors.accent }} />
                        </div>
                        <h1 className="text-3xl font-bold" style={{ fontFamily: theme.fontHeading, color: colors.text }}>
                            MealMind
                        </h1>
                        <p className="text-sm mt-2" style={{ color: colors.textMuted }}>
                            {isSignUp ? 'Start your culinary journey' : 'Welcome back to your kitchen'}
                        </p>
                    </div>

                    {/* Form */}
                    <div className="p-8 pt-4">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: colors.textMuted }} />
                                    <input
                                        type="email"
                                        placeholder="you@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 rounded-xl transition-all focus:outline-none"
                                        style={{
                                            background: colors.bg,
                                            border: `1px solid ${colors.border}`,
                                            color: colors.text,
                                        }}
                                        onFocus={(e) => {
                                            e.currentTarget.style.borderColor = colors.accent
                                            e.currentTarget.style.boxShadow = `0 0 0 2px ${colors.accent}20`
                                        }}
                                        onBlur={(e) => {
                                            e.currentTarget.style.borderColor = colors.border
                                            e.currentTarget.style.boxShadow = 'none'
                                        }}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: colors.textMuted }} />
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 rounded-xl transition-all focus:outline-none"
                                        style={{
                                            background: colors.bg,
                                            border: `1px solid ${colors.border}`,
                                            color: colors.text,
                                        }}
                                        onFocus={(e) => {
                                            e.currentTarget.style.borderColor = colors.accent
                                            e.currentTarget.style.boxShadow = `0 0 0 2px ${colors.accent}20`
                                        }}
                                        onBlur={(e) => {
                                            e.currentTarget.style.borderColor = colors.border
                                            e.currentTarget.style.boxShadow = 'none'
                                        }}
                                        required
                                    />
                                </div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={loading}
                                className="w-full py-2.5 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                                style={{ background: colors.accent, color: '#fff' }}
                            >
                                {loading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Loading...
                                    </>
                                ) : (
                                    <>
                                        {isSignUp ? 'Create Account' : 'Sign In'}
                                        <Sparkles className="w-4 h-4" />
                                    </>
                                )}
                            </motion.button>
                        </form>

                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t" style={{ borderColor: colors.border }} />
                            </div>
                            <div className="relative flex justify-center text-xs">
                                <span className="px-3" style={{ background: colors.bgSecondary, color: colors.textMuted }}>
                                    {isSignUp ? 'Join the community' : 'Welcome back'}
                                </span>
                            </div>
                        </div>

                        <div className="text-center">
                            <button
                                onClick={() => setIsSignUp(!isSignUp)}
                                className="text-sm font-medium transition-all hover:opacity-70"
                                style={{ color: colors.accent }}
                            >
                                {isSignUp ? (
                                    <>Already have an account? <span className="font-semibold">Sign In</span></>
                                ) : (
                                    <>Don't have an account? <span className="font-semibold">Create Account</span></>
                                )}
                            </button>
                        </div>

                        {/* Decorative leaf */}
                        <div className="flex justify-center mt-6">
                            <Leaf className="w-4 h-4" style={{ color: colors.textMuted }} />
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-xs mt-6" style={{ color: colors.textMuted }}>
                    🥑 Made with love for food enthusiasts
                </p>
            </motion.div>
        </div>
    )
}