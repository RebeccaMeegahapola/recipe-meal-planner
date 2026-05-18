'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Lock, Eye, EyeOff, Sparkles, ArrowRight, CheckCircle } from 'lucide-react'
import { theme } from '@/lib/theme'

const colors = theme.colors

export default function UpdatePasswordPage() {
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [message, setMessage] = useState('')
    const [success, setSuccess] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    // Check if user came from valid reset link
    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) {
                setMessage('Invalid or expired reset link. Please request a new one.')
                setTimeout(() => router.push('/login'), 3000)
            }
        }
        checkSession()
    }, [supabase, router])

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault()  // Stop page refresh

        // Validation 1: Passwords match?
        if (password !== confirmPassword) {
            setMessage('Passwords do not match!')
            return
        }

        // Validation 2: Minimum length?
        if (password.length < 6) {
            setMessage('Password must be at least 6 characters')
            return
        }

        setLoading(true)  // Show spinner
        setMessage('')

        // Update password in Supabase
        const { error } = await supabase.auth.updateUser({
            password: password
        })

        if (error) {
            setMessage(error.message)  // Show error
        } else {
            setSuccess(true)  // Show success UI
            setMessage('Password updated successfully!')
            setTimeout(() => router.push('/login'), 2000)  // Redirect after 2 seconds
        }
        setLoading(false)
    }

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: colors.bg }}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center max-w-md mx-4 p-8 rounded-2xl"
                    style={{ background: colors.bgSecondary, border: `1px solid ${colors.border}` }}
                >
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: `${colors.success}15` }}>
                        <CheckCircle className="w-8 h-8" style={{ color: colors.success }} />
                    </div>
                    <h2 className="text-2xl font-bold mb-2" style={{ color: colors.text, fontFamily: theme.fontHeading }}>
                        Password Updated!
                    </h2>
                    <p className="text-sm mb-6" style={{ color: colors.textMuted }}>
                        Your password has been successfully changed.
                    </p>
                    <button
                        onClick={() => router.push('/login')}
                        className="px-6 py-2.5 rounded-xl font-semibold"
                        style={{ background: colors.accent, color: '#fff' }}
                    >
                        Go to Login
                    </button>
                </motion.div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center" style={{ background: colors.bg }}>
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full" style={{ background: `${colors.accent}08`, filter: 'blur(3rem)' }} />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full" style={{ background: `${colors.accent}05`, filter: 'blur(3rem)' }} />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative w-full max-w-md mx-4"
            >
                <div className="rounded-2xl shadow-xl overflow-hidden" style={{ background: colors.bgSecondary, border: `1px solid ${colors.border}` }}>
                    <div className="text-center pt-8 pb-4">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4" style={{ background: `${colors.accent}15` }}>
                            <Lock className="w-8 h-8" style={{ color: colors.accent }} />
                        </div>
                        <h1 className="text-3xl font-bold" style={{ fontFamily: theme.fontHeading, color: colors.text }}>
                            Create New Password
                        </h1>
                        <p className="text-sm mt-2" style={{ color: colors.textMuted }}>
                            Choose a strong password for your account
                        </p>
                    </div>

                    <div className="p-8 pt-4">
                        <form onSubmit={handleUpdatePassword} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                                    New Password
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

                            <div>
                                <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                                    Confirm New Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: colors.textMuted }} />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
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
                                <div className="p-3 rounded-lg text-sm" style={{
                                    background: message.includes('successfully') ? `${colors.success}15` : `${colors.warning}15`,
                                    color: message.includes('successfully') ? colors.success : colors.warning
                                }}>
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
                                        Updating...
                                    </>
                                ) : (
                                    <>
                                        Update Password
                                        <Sparkles className="w-4 h-4" />
                                    </>
                                )}
                            </motion.button>
                        </form>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}