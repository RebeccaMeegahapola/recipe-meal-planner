export interface Recipe {
    id: string
    user_id: string
    api_id?: number
    title: string
    image: string
    ingredients: string[]
    instructions?: string[]
    readyInMinutes?: number
    servings?: number
    nutrition?: {
        calories: number
        protein: number
        carbs: number
        fat: number
    }
    source_url?: string
    saved_at: string
}

export interface MealPlan {
    id: string
    user_id: string
    week_start: string
    meals: {
        [key: string]: {  // "Monday-breakfast", "Monday-lunch", etc.
            recipe_id: string
            recipe_details?: Recipe
        }
    }
}

export interface GroceryList {
    id: string
    user_id: string
    week_start: string
    items: GroceryItem[]
    checked_items: string[]
}

export interface GroceryItem {
    id: string
    name: string
    amount?: string
    unit?: string
    category: string
}