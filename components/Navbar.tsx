'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession } from '@/hooks/useSession'
import { Home, BookOpen, Calendar, ShoppingBag, Activity, LogOut, Menu, X, LogIn, UserPlus } from 'lucide-react'
import { theme } from '@/lib/theme'
import { useState } from 'react'
import Image from "next/image";
import logo from '@/public/images/logo.png'

const colors = theme.colors

// Navigation items for logged-in users
const navItems = [
    { href: '/dashboard',    label: 'Dashboard',    icon: Home },
    { href: '/recipes',      label: 'Recipes',      icon: BookOpen },
    { href: '/planner',      label: 'Meal Planner', icon: Calendar },
    { href: '/grocery-list', label: 'Grocery',      icon: ShoppingBag },
    { href: '/nutrition',    label: 'Nutrition',    icon: Activity },
]

// Navigation items for unauthenticated users
const publicNavItems = [
    { href: '/',             label: 'Home',         icon: Home },
    { href: '/recipes',      label: 'Recipes',      icon: BookOpen },
]

export default function Navbar() {
    const pathname = usePathname()
    const { user, signOut } = useSession()
    const username = user?.email?.split('@')[0] ?? ''
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    const handleLinkClick = () => {
        setMobileMenuOpen(false)
    }

    // Navigation items based on auth state
    const items = user ? navItems : publicNavItems

    return (
        <nav style={{
            background: colors.bgSecondary,
            borderBottom: `1px solid ${colors.border}`,
            position: 'sticky',
            top: 0,
            zIndex: 50,
        }}>
            <div className="container mx-auto px-4 md:px-6 max-w-7xl">
                <div className="flex justify-between items-center h-16">

                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group" onClick={handleLinkClick}>
                        <div
                            className="relative w-10 h-10 rounded-xl overflow-hidden transition-transform group-hover:scale-105 flex items-center justify-center"
                            style={{ background: `linear-gradient(135deg, ${colors.accent}, ${colors.accentDark})` }}
                        >
                            <Image
                                src={logo}
                                alt="MealMind Logo"
                                width={24}
                                height={24}
                                className="object-contain"
                            />
                        </div>
                        <span style={{
                            color: colors.text,
                            fontSize: 16,
                            fontWeight: 700,
                            letterSpacing: '0.02em',
                            fontFamily: theme.fontHeading,
                        }}>
                            MealMind
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center gap-2">
                        {items.map((item) => {
                            const Icon = item.icon
                            const isActive = pathname === item.href
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all"
                                    style={{
                                        color: isActive ? colors.accent : colors.textMuted,
                                        background: isActive ? `${colors.accent}15` : 'transparent',
                                        fontSize: 14,
                                        fontWeight: isActive ? 600 : 400,
                                    }}
                                    onMouseEnter={e => {
                                        if (!isActive) {
                                            (e.currentTarget as HTMLAnchorElement).style.color = colors.text
                                            ;(e.currentTarget as HTMLAnchorElement).style.background = colors.bgHover
                                        }
                                    }}
                                    onMouseLeave={e => {
                                        if (!isActive) {
                                            (e.currentTarget as HTMLAnchorElement).style.color = colors.textMuted
                                            ;(e.currentTarget as HTMLAnchorElement).style.background = 'transparent'
                                        }
                                    }}
                                >
                                    <Icon className="w-3.5 h-3.5" />
                                    {item.label}
                                </Link>
                            )
                        })}

                        {/* Auth buttons for unauthenticated users */}
                        {!user && (
                            <div className="flex items-center gap-2 ml-2">
                                <Link
                                    href="/login"
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
                                    style={{ color: colors.textMuted }}
                                    onMouseEnter={e => {
                                        (e.currentTarget as HTMLAnchorElement).style.color = colors.accent
                                        ;(e.currentTarget as HTMLAnchorElement).style.background = `${colors.accent}10`
                                    }}
                                    onMouseLeave={e => {
                                        (e.currentTarget as HTMLAnchorElement).style.color = colors.textMuted
                                        ;(e.currentTarget as HTMLAnchorElement).style.background = 'transparent'
                                    }}
                                >
                                    <LogIn className="w-3.5 h-3.5" />
                                    Sign In
                                </Link>
                                <Link
                                    href="/login?mode=signup"
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
                                    style={{ background: colors.accent, color: '#fff' }}
                                    onMouseEnter={e => {
                                        (e.currentTarget as HTMLAnchorElement).style.opacity = '0.9'
                                    }}
                                    onMouseLeave={e => {
                                        (e.currentTarget as HTMLAnchorElement).style.opacity = '1'
                                    }}
                                >
                                    <UserPlus className="w-3.5 h-3.5" />
                                    Sign Up
                                </Link>
                            </div>
                        )}

                        {/* User section for authenticated users */}
                        {user && (
                            <>
                                <div className="mx-2" style={{ width: 1, height: 20, background: colors.border }} />

                                <div className="flex items-center gap-2">
                                    <div
                                        className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                                        style={{
                                            background: colors.bgHover,
                                            color: colors.accent,
                                            border: `1.5px solid ${colors.border}`,
                                        }}
                                    >
                                        {username[0]?.toUpperCase()}
                                    </div>

                                    <button
                                        onClick={() => signOut()}
                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                                        style={{ color: colors.error }}
                                        onMouseEnter={e => {
                                            (e.currentTarget as HTMLButtonElement).style.color = colors.logoutHover
                                            ;(e.currentTarget as HTMLButtonElement).style.background = `${colors.error}10`
                                        }}
                                        onMouseLeave={e => {
                                            (e.currentTarget as HTMLButtonElement).style.color = colors.error
                                            ;(e.currentTarget as HTMLButtonElement).style.background = 'transparent'
                                        }}
                                    >
                                        <LogOut className="w-3.5 h-3.5" />
                                        Logout
                                    </button>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="lg:hidden flex items-center justify-center w-8 h-8 rounded-lg transition-all"
                        style={{ color: colors.text }}
                    >
                        {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>

                {/* Mobile Navigation Menu */}
                {mobileMenuOpen && (
                    <div className="lg:hidden py-4 border-t mt-2" style={{ borderColor: colors.border }}>
                        <div className="flex flex-col gap-1">
                            {items.map((item) => {
                                const Icon = item.icon
                                const isActive = pathname === item.href
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={handleLinkClick}
                                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all"
                                        style={{
                                            color: isActive ? colors.accent : colors.text,
                                            background: isActive ? `${colors.accent}15` : 'transparent',
                                            fontSize: 14,
                                            fontWeight: isActive ? 600 : 400,
                                        }}
                                    >
                                        <Icon className="w-4 h-4" />
                                        {item.label}
                                    </Link>
                                )
                            })}

                            {/* Auth section in mobile menu for unauthenticated users */}
                            {!user && (
                                <>
                                    <div className="my-2" style={{ height: 1, background: colors.border }} />
                                    <Link
                                        href="/login"
                                        onClick={handleLinkClick}
                                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all"
                                        style={{ color: colors.textMuted }}
                                    >
                                        <LogIn className="w-4 h-4" />
                                        Sign In
                                    </Link>
                                    <Link
                                        href="/login?mode=signup"
                                        onClick={handleLinkClick}
                                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all"
                                        style={{ background: colors.accent, color: '#fff' }}
                                    >
                                        <UserPlus className="w-4 h-4" />
                                        Sign Up
                                    </Link>
                                </>
                            )}

                            {/* User section in mobile for authenticated users */}
                            {user && (
                                <>
                                    <div className="my-2" style={{ height: 1, background: colors.border }} />
                                    <div className="flex items-center justify-between px-3 py-2">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                                                style={{
                                                    background: colors.bgHover,
                                                    color: colors.accent,
                                                    border: `1.5px solid ${colors.border}`,
                                                }}
                                            >
                                                {username[0]?.toUpperCase()}
                                            </div>
                                            <span className="text-sm" style={{ color: colors.text }}>
                                                {username}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => signOut()}
                                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all"
                                            style={{ color: colors.error }}
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Logout
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    )
}