'use client'                          // Runs only on client side
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export function useSession() {
    const [user, setUser] = useState<any>(null)    // User object or null
    const [loading, setLoading] = useState(true)    // Loading state
    const supabase = createClient()   // Supabase instance
    const router = useRouter()    // For navigation

    // Effect runs once on mount
    useEffect(() => {
        getUser()  // Get initial user

        // Listen for auth changes (login, logout, token refresh)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user || null)  // Update user state
            setLoading(false)                // Done loading
            router.refresh()                 // Refresh server components
        })

        return () => subscription.unsubscribe()  // Cleanup on unmount
    }, [])

    // Get current user on initial load
    const getUser = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
        setLoading(false)
    }

    // Sign out function
    const signOut = async () => {
        await supabase.auth.signOut()
        router.push('/login')  // Redirect to login page
    }

    return { user, loading, signOut }  // Return values for components to use
}