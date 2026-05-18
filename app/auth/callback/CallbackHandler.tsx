'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import { theme } from '@/lib/theme'

const colors = theme.colors

export default function CallbackHandler() {
    const [message, setMessage] = useState('Processing...')
    const [isPasswordReset, setIsPasswordReset] = useState(false)
    const router = useRouter()
    const searchParams = useSearchParams()
    const supabase = createClient()

    useEffect(() => {
        const handleCallback = async () => {
            // Check if this is a password reset callback
            const next = searchParams.get('next')

            if (next === '/update-password') {
                setIsPasswordReset(true)
                setMessage('Redirecting to password update...')
                setTimeout(() => {
                    router.push('/update-password')
                }, 1000)
                return
            }

            // Handle email confirmation
            const { error } = await supabase.auth.getSession()

            if (error) {
                setMessage('Error verifying email. Please try again.')
                setTimeout(() => router.push('/login'), 3000)
            } else {
                setMessage('Email verified successfully! Redirecting...')
                setTimeout(() => router.push('/dashboard'), 2000)
            }
        }

        handleCallback()
    }, [supabase, router, searchParams])

    return (
        <div className="min-h-screen flex items-center justify-center" style={{ background: colors.bg }}>
            <div className="text-center">
                {isPasswordReset ? (
                    <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: `${colors.accent}15` }}>
                        <svg className="w-6 h-6" style={{ color: colors.accent }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                        </svg>
                    </div>
                ) : (
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 mb-4" style={{ borderColor: colors.accent }} />
                )}
                <p className="text-sm" style={{ color: colors.textMuted }}>{message}</p>
            </div>
        </div>
    )
}