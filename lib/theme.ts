export const theme = {
    name: 'Avocado',
    colors: {
        // Background colors
        bg: '#F4F8EE',
        bgSecondary: '#FDFCF7',
        bgHover: '#E6EFD9',

        // Border colors
        border: '#C8DFB0',
        borderLight: '#E0E8D5',

        // Accent colors
        accent: '#5A8A3C',
        accentHover: '#7CB342',
        accentLight: '#9CBF6E',
        accentDark: '#3C5A2E',

        // Text colors
        text: '#3C5A2E',
        textMuted: '#7A9468',
        textLight: '#A8C888',
        textWhite: '#FDFCF7',

        // Status colors
        success: '#5A8A3C',
        error: '#E05A5A',
        warning: '#D4A843',
        info: '#7A9468',

        // Rating
        star: '#D4A843',

        // Logout button
        logout: '#E05A5A',
        logoutHover: '#C84848',
    },
    logo: '🥑',
    font: 'Poppins, sans-serif',
    fontHeading: 'Georgia, serif',
}

export type Theme = typeof theme