'use client'
import Image from 'next/image'
import { theme } from '@/lib/theme'
import icon from '@/public/images/logo.png'

const colors = theme.colors

export default function Footer() {
    return (
        <footer className="py-6 sm:py-8 text-center"
                style={{background: colors.bg, borderTop: `1px solid ${colors.border}`}}>
            <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg flex items-center justify-center"
                     style={{background: `linear-gradient(135deg, ${colors.accent}, ${colors.accentDark})`}}>
                    <Image
                        src={icon}
                        alt="Avocado"
                        width={14}
                        height={14}
                        className="object-contain"
                    />
                </div>
                <span className="text-xs sm:text-sm"
                      style={{color: colors.text, fontWeight: 700, fontFamily: theme.fontHeading}}>
                    MealMind
                </span>
            </div>
            <p className="text-[10px] sm:text-xs" style={{color: colors.textMuted}}>
                © {new Date().getFullYear()} MealMind · Made with love for food lovers everywhere
            </p>
        </footer>
    )
}