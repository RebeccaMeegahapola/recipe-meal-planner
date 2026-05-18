'use client'

// Force dynamic rendering - this page uses useSearchParams() which reads URL parameters
// Without this, Next.js would try to statically prerender and fail at build time
export const dynamic = 'force-dynamic'

import { useState, Suspense } from 'react'  // Added Suspense for useSearchParams
import { createClient } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ChefHat, Mail, Lock, Leaf, Sparkles, Eye, EyeOff, ArrowLeft, Key, Send } from 'lucide-react'
import { theme } from '@/lib/theme'

const colors = theme.colors

// Component that uses useSearchParams - must be wrapped in Suspense
function LoginForm() {
    const [email, setEmail] = useState('')              // Email input
    const [password, setPassword] = useState('')        // Password input
    const [loading, setLoading] = useState(false)       // Show spinner during actions
    const [showPassword, setShowPassword] = useState(false)  // Toggle password visibility
    const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login')  // Current mode
    const [resetSent, setResetSent] = useState(false)   // Track if reset email was sent
    const [message, setMessage] = useState('')   // Error/success messages
    const router = useRouter()    // For navigation
    const searchParams = useSearchParams()      // Read URL parameters (for redirect)
    const supabase = createClient()  // Supabase connection

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setMessage('')

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            if (error.message === 'Email not confirmed') {
                setMessage('Please confirm your email address. Check your inbox!')
            } else {
                setMessage(error.message)
            }
        } else {
            // Redirect to dashboard or the page user came from
            const redirectTo = searchParams.get('redirect') || '/dashboard'
            router.push(redirectTo)
        }
        setLoading(false)
    }

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setMessage('')

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${window.location.origin}/auth/callback`,
            }
        })

        if (error) {
            setMessage(error.message)
            setLoading(false)
        } else {
            // Check if user needs email confirmation
            if (data.user?.identities?.length === 0) {
                setMessage('User already exists. Please login instead.')
                setTimeout(() => setMode('login'), 2000)
            } else {
                // Success message - stays visible
                setMessage('✨ Check your email for confirmation link! Please verify your email to login.')
                // Clear form
                setEmail('')
                setPassword('')
                // Don't auto-switch - let user read the message
                // They can manually click "Back to Login" or wait
            }
            setLoading(false)
        }
    }

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setMessage('')

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/auth/callback?next=/update-password`,
        })

        if (error) {
            setMessage(error.message)
        } else {
            setResetSent(true)
            setMessage('📧 Password reset link sent to your email! Check your inbox.')
        }
        setLoading(false)
    }

    const handleResendConfirmation = async () => {
        setLoading(true)
        const { error } = await supabase.auth.resend({
            type: 'signup',
            email: email,
            options: {
                emailRedirectTo: `${window.location.origin}/auth/callback`,
            }
        })

        if (error) {
            setMessage(error.message)
        } else {
            setMessage('✨ Confirmation email resent! Check your inbox.')
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

                    {/* Header */}
                    <div className="text-center pt-8 pb-4">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4" style={{ background: `${colors.accent}15` }}>
                            {mode === 'forgot' ? (
                                <Key className="w-8 h-8" style={{ color: colors.accent }} />
                            ) : (
                                <ChefHat className="w-8 h-8" style={{ color: colors.accent }} />
                            )}
                        </div>
                        <h1 className="text-3xl font-bold" style={{ fontFamily: theme.fontHeading, color: colors.text }}>
                            {mode === 'login' && 'Welcome Back'}
                            {mode === 'signup' && 'Create Account'}
                            {mode === 'forgot' && 'Reset Password'}
                        </h1>
                        <p className="text-sm mt-2" style={{ color: colors.textMuted }}>
                            {mode === 'login' && 'Sign in to continue to your kitchen'}
                            {mode === 'signup' && 'Start your culinary journey'}
                            {mode === 'forgot' && 'We\'ll send you a reset link'}
                        </p>
                    </div>

                    {/* Back button for forgot mode */}
                    {mode === 'forgot' && (
                        <button
                            onClick={() => {
                                setMode('login')
                                setResetSent(false)
                                setMessage('')
                            }}
                            className="absolute top-4 left-4 p-2 rounded-lg transition-all hover:opacity-70"
                            style={{ color: colors.textMuted }}
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                    )}

                    {/* Forms */}
                    <div className="p-8 pt-4">
                        <AnimatePresence mode="wait">
                            {/* Login Form */}
                            {mode === 'login' && (
                                <motion.form
                                    key="login"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    onSubmit={handleLogin}
                                    className="space-y-5"
                                >
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
                                                type={showPassword ? 'text' : 'password'}
                                                placeholder="••••••••"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="w-full pl-10 pr-12 py-2.5 rounded-xl transition-all focus:outline-none"
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
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2"
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="w-4 h-4" style={{ color: colors.textMuted }} />
                                                ) : (
                                                    <Eye className="w-4 h-4" style={{ color: colors.textMuted }} />
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex justify-end">
                                        <button
                                            type="button"
                                            onClick={() => setMode('forgot')}
                                            className="text-xs hover:underline transition"
                                            style={{ color: colors.accent }}
                                        >
                                            Forgot password?
                                        </button>
                                    </div>

                                    {message && (
                                        <div className="p-3 rounded-lg text-sm" style={{ background: `${colors.warning}15`, color: colors.warning }}>
                                            {message}
                                        </div>
                                    )}

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
                                                Signing in...
                                            </>
                                        ) : (
                                            <>
                                                Sign In
                                                <Sparkles className="w-4 h-4" />
                                            </>
                                        )}
                                    </motion.button>
                                </motion.form>
                            )}

                            {/* Sign Up Form */}
                            {mode === 'signup' && (
                                <motion.form
                                    key="signup"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    onSubmit={handleSignUp}
                                    className="space-y-5"
                                >
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
                                                type={showPassword ? 'text' : 'password'}
                                                placeholder="Create a password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="w-full pl-10 pr-12 py-2.5 rounded-xl transition-all focus:outline-none"
                                                style={{
                                                    background: colors.bg,
                                                    border: `1px solid ${colors.border}`,
                                                    color: colors.text,
                                                }}
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2"
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="w-4 h-4" style={{ color: colors.textMuted }} />
                                                ) : (
                                                    <Eye className="w-4 h-4" style={{ color: colors.textMuted }} />
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    {message && (
                                        <div className="p-3 rounded-lg text-sm" style={{ background: `${colors.success}15`, color: colors.success }}>
                                            {message}
                                        </div>
                                    )}

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
                                                Creating account...
                                            </>
                                        ) : (
                                            <>
                                                Create Account
                                                <Sparkles className="w-4 h-4" />
                                            </>
                                        )}
                                    </motion.button>
                                </motion.form>
                            )}

                            {/* Forgot Password Form */}
                            {mode === 'forgot' && (
                                <motion.form
                                    key="forgot"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    onSubmit={handleForgotPassword}
                                    className="space-y-5"
                                >
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
                                                required
                                            />
                                        </div>
                                    </div>

                                    {message && (
                                        <div className="p-3 rounded-lg text-sm" style={{ background: resetSent ? `${colors.success}15` : `${colors.warning}15`, color: resetSent ? colors.success : colors.warning }}>
                                            {message}
                                        </div>
                                    )}

                                    {!resetSent ? (
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
                                                    Sending...
                                                </>
                                            ) : (
                                                <>
                                                    Send Reset Link
                                                    <Send className="w-4 h-4" />
                                                </>
                                            )}
                                        </motion.button>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setMode('login')
                                                setResetSent(false)
                                                setMessage('')
                                            }}
                                            className="w-full py-2.5 rounded-xl font-semibold transition-all"
                                            style={{ background: colors.accent, color: '#fff' }}
                                        >
                                            Back to Login
                                        </button>
                                    )}
                                </motion.form>
                            )}
                        </AnimatePresence>

                        {/* Switch between login/signup */}
                        {mode !== 'forgot' && (
                            <>
                                <div className="relative my-6">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t" style={{ borderColor: colors.border }} />
                                    </div>
                                    <div className="relative flex justify-center text-xs">
                                        <span className="px-3" style={{ background: colors.bgSecondary, color: colors.textMuted }}>
                                            {mode === 'login' ? 'New to MealMind?' : 'Already have an account?'}
                                        </span>
                                    </div>
                                </div>

                                <div className="text-center">
                                    <button
                                        onClick={() => {
                                            setMode(mode === 'login' ? 'signup' : 'login')
                                            setMessage('')
                                        }}
                                        className="text-sm font-medium transition-all hover:opacity-70"
                                        style={{ color: colors.accent }}
                                    >
                                        {mode === 'login' ? 'Create an account' : 'Sign in to existing account'}
                                    </button>
                                </div>
                            </>
                        )}

                        {/* Resend confirmation link */}
                        {mode === 'login' && message?.includes('confirm') && (
                            <div className="mt-4 text-center">
                                <button
                                    onClick={handleResendConfirmation}
                                    disabled={loading}
                                    className="text-xs hover:underline transition"
                                    style={{ color: colors.accent }}
                                >
                                    Resend confirmation email
                                </button>
                            </div>
                        )}

                        <div className="flex justify-center mt-6">
                            <Leaf className="w-4 h-4" style={{ color: colors.textMuted }} />
                        </div>
                    </div>
                </div>

                <p className="text-center text-xs mt-6" style={{ color: colors.textMuted }}>
                    🥑 Made with love for food enthusiasts
                </p>
            </motion.div>
        </div>
    )
}

// Main export with Suspense boundary - required for useSearchParams
export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center" style={{ background: colors.bg }}>
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 mb-4" style={{ borderColor: colors.accent }} />
                    <p style={{ color: colors.textMuted }}>Loading...</p>
                </div>
            </div>
        }>
            <LoginForm />
        </Suspense>
    )
}