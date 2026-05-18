'use client'

// Force dynamic rendering and disable static generation for this page
export const dynamic = 'force-dynamic'

import { Suspense, lazy } from 'react'
import { theme } from '@/lib/theme'

const colors = theme.colors

// Dynamically import the login form component with SSR disabled
// This ensures useSearchParams() never runs during server-side rendering
const LoginForm = lazy(() => import('./LoginForm'))

// Loading fallback component
function LoadingFallback() {
    return (
        <div className="min-h-screen flex items-center justify-center" style={{ background: colors.bg }}>
            <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 mb-4" style={{ borderColor: colors.accent }} />
                <p style={{ color: colors.textMuted }}>Loading...</p>
            </div>
        </div>
    )
}

export default function LoginPage() {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <LoginForm />
        </Suspense>
    )
}