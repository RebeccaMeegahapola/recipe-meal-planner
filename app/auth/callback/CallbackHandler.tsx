'use client'

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import { theme } from '@/lib/theme'

const colors = theme.colors

export default function CallbackHandler() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const supabase = createClient()

    useEffect(() => {
        const handleCallback = async () => {
            const next = searchParams.get('next')

            if (next === '/update-password') {
                router.replace('/update-password')
                return
            }

            // Just refresh the session - Supabase will handle the rest
            await supabase.auth.getSession()

            // Redirect to dashboard
            router.replace('/dashboard')
        }

        handleCallback()
    }, [supabase, router, searchParams])

    return (
        <div className="min-h-screen flex items-center justify-center" style={{ background: colors.bg }}>
            <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 mb-4" style={{ borderColor: colors.accent }} />
                <p className="text-sm" style={{ color: colors.textMuted }}>Verifying your email...</p>
            </div>
        </div>
    )
}