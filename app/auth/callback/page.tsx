'use client'

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { theme } from '@/lib/theme'

const colors = theme.colors

export default function AuthCallback() {
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        const handleCallback = async () => {
            const { data: { user } } = await supabase.auth.getUser()

            if (user) {
                router.replace('/dashboard')
            } else {
                router.replace('/login')
            }
        }

        handleCallback()
    }, [supabase, router])

    return (
        <div className="min-h-screen flex items-center justify-center" style={{ background: colors.bg }}>
            <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 mb-4" style={{ borderColor: colors.accent }} />
                <p className="text-sm" style={{ color: colors.textMuted }}>Verifying your email...</p>
            </div>
        </div>
    )
}