'use client'
import { useState, useEffect } from 'react'
import { Check, ShoppingBag, Printer, RefreshCw, Clock, ChefHat, Apple, Carrot, Beef, Milk, Package, Leaf, Wine, Utensils, Egg, Fish, Coffee } from 'lucide-react'
import { theme } from '@/lib/theme'

const colors = theme.colors

interface GroceryItem {
    id: string
    name: string
    category: string
    amount?: string
}

interface GroceryItemsByCategory {
    [category: string]: GroceryItem[]
}

interface MealPlan {
    [key: string]: any
}

interface Recipe {
    id: string
    title: string
    ingredients?: string[] | { name: string }[]
    image?: string
    ready_in_minutes?: number
    servings?: number
}

interface GroceryListProps {
    mealPlan: MealPlan | null
    recipes: Recipe[]
    onSave?: (items: GroceryItemsByCategory) => void
}

// ✅ Clean category icons mapping (no emojis in keys)
const categoryIcons: { [key: string]: React.ReactNode } = {
    'Produce': <Apple className="w-4 h-4" />,
    'Meat & Seafood': <Beef className="w-4 h-4" />,
    'Dairy & Eggs': <Milk className="w-4 h-4" />,
    'Pantry': <Package className="w-4 h-4" />,
    'Canned & Jarred': <Package className="w-4 h-4" />,
    'Spices': <Leaf className="w-4 h-4" />,
    'Condiments': <Wine className="w-4 h-4" />,
    'Fruits': <Apple className="w-4 h-4" />,
    'Other': <Utensils className="w-4 h-4" />
}

export default function GroceryList({ mealPlan, recipes }: GroceryListProps) {
    const [groceryItems, setGroceryItems] = useState<GroceryItemsByCategory>({})
    const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({})
    const [usedRecipes, setUsedRecipes] = useState<Recipe[]>([])

    useEffect(() => {
        if (mealPlan && recipes.length > 0) {
            generateGroceryList()
        }
    }, [mealPlan, recipes])

    // ✅ Updated categorizer - returns clean category names (no emojis)
    const categorizeIngredient = (name: string): string => {
        const categories: { [key: string]: string[] } = {
            'Produce': ['tomato', 'onion', 'garlic', 'lettuce', 'spinach', 'carrot', 'potato', 'broccoli', 'cauliflower', 'zucchini', 'cucumber', 'pepper', 'mushroom', 'avocado', 'lemon', 'lime', 'herbs', 'basil', 'cilantro', 'parsley'],
            'Meat & Seafood': ['chicken', 'beef', 'pork', 'bacon', 'sausage', 'fish', 'salmon', 'shrimp', 'turkey', 'lamb', 'steak', 'ground beef', 'chicken breast', 'thigh'],
            'Dairy & Eggs': ['milk', 'cheese', 'butter', 'yogurt', 'cream', 'egg', 'eggs', 'sour cream', 'parmesan', 'mozzarella', 'cheddar'],
            'Pantry': ['rice', 'pasta', 'bread', 'flour', 'sugar', 'oil', 'olive oil', 'salt', 'pepper', 'spaghetti', 'noodles', 'quinoa', 'oats', 'cereal'],
            'Canned & Jarred': ['bean', 'tomato sauce', 'coconut milk', 'broth', 'sauce', 'can', 'jars', 'pickles', 'olives'],
            'Spices': ['cumin', 'paprika', 'oregano', 'basil', 'thyme', 'rosemary', 'garlic powder', 'onion powder', 'cinnamon', 'nutmeg'],
            'Condiments': ['soy sauce', 'vinegar', 'mustard', 'ketchup', 'mayonnaise', 'hot sauce', 'worcestershire', 'fish sauce'],
            'Fruits': ['apple', 'banana', 'orange', 'strawberry', 'blueberry', 'raspberry', 'grape', 'watermelon', 'pineapple', 'mango']
        }

        const lowerName = name.toLowerCase()
        for (const [category, keywords] of Object.entries(categories)) {
            if (keywords.some(keyword => lowerName.includes(keyword))) {
                return category
            }
        }
        return 'Other'
    }

    const parseIngredientAmount = (ingredient: string): { name: string; amount: string } => {
        const amountMatch = ingredient.match(/^[\d\/\s\.]+|[\d]+\/\d+|\d+(\.\d+)?/)
        if (amountMatch) {
            const amount = amountMatch[0].trim()
            const name = ingredient.replace(amount, '').trim()
            return { name, amount }
        }
        return { name: ingredient, amount: '' }
    }

    const generateGroceryList = () => {
        if (!mealPlan) return

        const ingredientsMap: { [key: string]: GroceryItem } = {}
        const recipesUsedMap = new Map<string, Recipe>()

        Object.values(mealPlan).forEach((recipe) => {
            if (recipe && recipe.id && recipe.ingredients) {
                if (!recipesUsedMap.has(recipe.id)) {
                    recipesUsedMap.set(recipe.id, recipe)
                }

                recipe.ingredients.forEach((ingredient: string | { name: string }) => {
                    let ingredientText: string
                    if (typeof ingredient === 'string') {
                        ingredientText = ingredient
                    } else if (ingredient && typeof ingredient === 'object' && 'name' in ingredient) {
                        ingredientText = ingredient.name
                    } else {
                        return
                    }

                    const { name, amount } = parseIngredientAmount(ingredientText)
                    const key = name.toLowerCase().trim()

                    if (!ingredientsMap[key]) {
                        ingredientsMap[key] = {
                            id: key,
                            name: name,
                            category: categorizeIngredient(name),
                            amount: amount
                        }
                    }
                })
            }
        })

        const uniqueUsedRecipes = Array.from(recipesUsedMap.values())
        setUsedRecipes(uniqueUsedRecipes)

        const grouped: GroceryItemsByCategory = {}
        Object.values(ingredientsMap).forEach((item) => {
            if (!grouped[item.category]) {
                grouped[item.category] = []
            }
            grouped[item.category].push(item)
        })

        Object.keys(grouped).forEach((category) => {
            grouped[category].sort((a, b) => a.name.localeCompare(b.name))
        })

        setGroceryItems(grouped)

        try {
            const savedChecked = localStorage.getItem('grocery_checked')
            if (savedChecked) {
                setCheckedItems(JSON.parse(savedChecked))
            }
        } catch (error) {
            console.error('Failed to load checked items:', error)
        }
    }

    const toggleItem = (itemId: string) => {
        setCheckedItems(prev => {
            const newChecked = { ...prev, [itemId]: !prev[itemId] }
            try {
                localStorage.setItem('grocery_checked', JSON.stringify(newChecked))
            } catch (error) {
                console.error('Failed to save checked items:', error)
            }
            return newChecked
        })
    }

    const resetChecked = () => {
        setCheckedItems({})
        try {
            localStorage.removeItem('grocery_checked')
        } catch (error) {
            console.error('Failed to remove checked items:', error)
        }
    }

    const printList = () => {
        window.print()
    }

    const totalItems = Object.values(groceryItems).reduce((sum, items) => sum + items.length, 0)
    const checkedCount = Object.values(checkedItems).filter(v => v === true).length

    // Get icon for category
    const getCategoryIcon = (category: string) => {
        return categoryIcons[category] || <Utensils className="w-4 h-4" />
    }

    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-xl p-4" style={{ background: colors.bgSecondary, border: `1px solid ${colors.border}` }}>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: `${colors.accent}15` }}>
                            <ShoppingBag className="w-5 h-5" style={{ color: colors.accent }} />
                        </div>
                        <div>
                            <p className="text-2xl font-bold" style={{ color: colors.text }}>{totalItems}</p>
                            <p className="text-xs" style={{ color: colors.textMuted }}>Total Items</p>
                        </div>
                    </div>
                </div>
                <div className="rounded-xl p-4" style={{ background: colors.bgSecondary, border: `1px solid ${colors.border}` }}>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: `${colors.success}15` }}>
                            <Check className="w-5 h-5" style={{ color: colors.success }} />
                        </div>
                        <div>
                            <p className="text-2xl font-bold" style={{ color: colors.text }}>{checkedCount}</p>
                            <p className="text-xs" style={{ color: colors.textMuted }}>Checked Off</p>
                        </div>
                    </div>
                </div>
                <div className="rounded-xl p-4" style={{ background: colors.bgSecondary, border: `1px solid ${colors.border}` }}>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: `${colors.accent}15` }}>
                            <ChefHat className="w-5 h-5" style={{ color: colors.accent }} />
                        </div>
                        <div>
                            <p className="text-2xl font-bold" style={{ color: colors.text }}>{usedRecipes.length}</p>
                            <p className="text-xs" style={{ color: colors.textMuted }}>Recipes Used</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Grocery List */}
            <div className="rounded-2xl overflow-hidden" style={{ background: colors.bgSecondary, border: `1px solid ${colors.border}` }}>
                <div className="p-5" style={{ background: colors.accent }}>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h2 className="text-xl font-bold flex items-center gap-2" style={{ color: '#fff' }}>
                                <ShoppingBag className="w-5 h-5" />
                                Grocery List
                            </h2>
                            <p className="text-sm mt-1" style={{ color: colors.textWhite, opacity: 0.9 }}>
                                {checkedCount} of {totalItems} items checked
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={resetChecked}
                                className="px-3 py-2 rounded-lg transition-all hover:opacity-80 flex items-center gap-2 text-sm"
                                style={{ background: 'rgba(255,255,255,0.2)', color: '#fff' }}
                            >
                                <RefreshCw className="w-4 h-4" />
                                Reset
                            </button>
                            <button
                                onClick={printList}
                                className="px-3 py-2 rounded-lg transition-all hover:opacity-80 flex items-center gap-2 text-sm"
                                style={{ background: 'rgba(255,255,255,0.2)', color: '#fff' }}
                            >
                                <Printer className="w-4 h-4" />
                                Print
                            </button>
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    {Object.keys(groceryItems).length === 0 ? (
                        <div className="text-center py-12">
                            <ShoppingBag className="w-16 h-16 mx-auto mb-4" style={{ color: colors.textMuted }} />
                            <h3 className="text-lg font-semibold mb-2" style={{ color: colors.text }}>No grocery items yet</h3>
                            <p className="text-sm" style={{ color: colors.textMuted }}>
                                {usedRecipes.length === 0
                                    ? "Create a meal plan first to generate your grocery list!"
                                    : "Your meal plan recipes don't have ingredients listed."}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {Object.entries(groceryItems).map(([category, items]) => (
                                <div key={category}>
                                    <h3 className="text-base font-semibold mb-3 pb-2 border-b flex items-center gap-2"
                                        style={{ color: colors.accent, borderBottomColor: colors.border }}>
                                        {getCategoryIcon(category)}
                                        <span>{category}</span>
                                        <span className="text-xs font-normal" style={{ color: colors.textMuted }}>({items.length})</span>
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                        {items.map((item) => (
                                            <label
                                                key={item.id}
                                                className="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all hover:shadow-sm"
                                                style={{ background: colors.bg, border: `1px solid ${colors.borderLight}` }}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={checkedItems[item.id] || false}
                                                    onChange={() => toggleItem(item.id)}
                                                    className="w-4 h-4 rounded focus:ring-2"
                                                    style={{ accentColor: colors.accent }}
                                                />
                                                <span className={`text-sm flex-1 ${checkedItems[item.id] ? 'line-through' : ''}`}
                                                      style={{ color: checkedItems[item.id] ? colors.textMuted : colors.text }}>
                                                    {item.name}
                                                </span>
                                                {item.amount && (
                                                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: colors.bgHover, color: colors.textMuted }}>
                                                        {item.amount}
                                                    </span>
                                                )}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Recipes Used Section */}
            {usedRecipes.length > 0 && (
                <div className="rounded-2xl p-5" style={{ background: colors.bgSecondary, border: `1px solid ${colors.border}` }}>
                    <h3 className="font-semibold mb-3 flex items-center gap-2" style={{ color: colors.text }}>
                        <ChefHat className="w-4 h-4" style={{ color: colors.accent }} />
                        Recipes in your meal plan
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {usedRecipes.map((recipe, index) => (
                            <span
                                key={`${recipe.id}-${index}`}
                                className="text-xs px-3 py-1.5 rounded-full"
                                style={{ background: colors.bg, color: colors.textMuted, border: `1px solid ${colors.border}` }}
                            >
                                {recipe.title}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}