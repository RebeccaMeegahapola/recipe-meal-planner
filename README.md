# 🥑 MealMind - Complete Recipe & Meal Planner Application

## 📋 Table of Contents

1. [Project Overview](#-project-overview)
2. [Features](#-features)
3. [Tech Stack](#-tech-stack)
4. [Project Structure](#-project-structure)
5. [Database Schema](#-database-schema)
6. [Authentication Flow](#-authentication-flow)
7. [Avocado Theme](#-avocado-theme)
8. [Component Documentation](#-component-documentation)
9. [API Reference](#-api-reference)
10. [Setup Instructions](#-setup-instructions)
11. [Environment Variables](#-environment-variables)

---

## 📋 Project Overview

**MealMind** is a full-stack web application that helps users discover recipes, plan weekly meals, generate shopping lists, and track nutrition. Built with modern web technologies, it provides a seamless experience for home cooks to organize their culinary life.

### Problem Solved

| Problem | Solution |
|---------|----------|
| Finding recipes across multiple websites | Centralized recipe search from 365,000+ recipes |
| Forgetting what to cook each week | Visual weekly meal planner with 21 slots |
| Making multiple trips to the store | Auto-generated grocery lists from meal plans |
| Not knowing nutritional intake | Nutrition tracking with interactive charts |
| Losing saved recipes | Personal database with Supabase |

---

## ✨ Features

### Core Features
- ✅ **User Authentication** - Sign up, login, logout with Supabase Auth
- ✅ **Recipe Search** - Search 365,000+ recipes from Spoonacular API
- ✅ **Save Recipes** - Save favorite recipes to personal database
- ✅ **Delete Recipes** - Remove unwanted recipes from collection
- ✅ **Weekly Meal Planner** - Plan 7 days × 3 meals (21 slots)
- ✅ **Grocery List Generator** - Auto-generate shopping lists from meal plans
- ✅ **Nutrition Tracker** - Track calories, protein, carbs, fat with charts
- ✅ **Responsive Design** - Works perfectly on mobile, tablet, and desktop

### Advanced Features
- 🎨 **Avocado Theme** - Consistent beautiful green theme throughout
- 📱 **Mobile Menu** - Hamburger menu for mobile devices
- 🖨️ **Print Support** - Print grocery lists for shopping
- 💾 **Persistent Checkmarks** - Checked items saved in localStorage
- 🔄 **Real-time Updates** - Data updates instantly across components
- 📊 **Data Visualization** - Interactive charts for nutrition tracking
- 🔐 **Email Rate Limit Fix** - Custom SMTP with Resend (3,000 free emails/month)

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 14.x | React framework with App Router |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 3.x | Utility-first styling |
| Framer Motion | 10.x | Smooth animations |
| Recharts | 2.x | Data visualization charts |
| Lucide React | Latest | Beautiful icons |
| date-fns | 3.x | Date manipulation |

### Backend & Database
| Technology | Purpose |
|------------|---------|
| Supabase | Backend-as-a-Service (PostgreSQL + Auth) |
| Row Level Security | Data isolation between users |
| PostgreSQL | Relational database |

### Email Service
| Service | Purpose | Free Tier |
|---------|---------|-----------|
| Resend | SMTP email delivery | 3,000 emails/month |

### APIs
| API | Purpose | Limits |
|-----|---------|--------|
| Spoonacular API | Recipe search, details, nutrition | 150 points/day (free tier) |

---

## 🗄️ Database Schema

### Table: profiles
| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Links to auth.users (Primary Key) |
| `email` | TEXT | User's email address |
| `name` | TEXT | Display name |
| `avatar_url` | TEXT | Profile picture URL |
| `created_at` | TIMESTAMP | Account creation date |
| `updated_at` | TIMESTAMP | Last profile update |

### Table: recipes
| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Unique recipe ID (Primary Key) |
| `user_id` | UUID | Owner of the recipe |
| `api_id` | INTEGER | Original Spoonacular ID |
| `title` | TEXT | Recipe name |
| `image` | TEXT | Recipe image URL |
| `ingredients` | JSONB | Array of ingredients |
| `instructions` | TEXT[] | Cooking instructions |
| `ready_in_minutes` | INTEGER | Total cooking time |
| `servings` | INTEGER | Number of portions |
| `nutrition` | JSONB | Calories, protein, carbs, fat |
| `saved_at` | TIMESTAMP | When saved |

### Table: meal_plans
| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Unique plan ID |
| `user_id` | UUID | Owner |
| `week_start` | DATE | Monday of the week |
| `meals` | JSONB | 21 meal slots |
| `created_at` | TIMESTAMP | Creation date |
| `updated_at` | TIMESTAMP | Last update |

### Table: grocery_lists
| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Unique list ID |
| `user_id` | UUID | Owner |
| `week_start` | DATE | Week this list is for |
| `items` | JSONB | Grocery items by category |
| `checked_items` | JSONB | Track checked-off items |

---

## 🔐 Authentication Flow

### How it Works

1. User enters email/password on Login page
2. Supabase Auth validates credentials
3. On success, user session is created
4. `useSession()` hook provides user data to all components
5. Middleware protects routes from unauthorized access

### Authentication Modes

| Mode | Purpose | Features |
|------|---------|----------|
| **Login** | Existing users sign in | Email + Password, Forgot password link |
| **Sign Up** | New users create account | Email + Password, Email confirmation required |
| **Forgot Password** | Password recovery | Email only, Sends reset link |

---

### Protected Routes (middleware.ts)
- `/dashboard`
- `/recipes`
- `/planner`
- `/grocery-list`
- `/nutrition`

### useSession Hook Usage
```typescript
const { user, loading, signOut } = useSession();

```

---

## 🧩 Component Documentation

### 🥗 RecipeCard Component

Displays a recipe with image, title, rating, and ingredients count.

#### Props

- `recipe` (required) — Recipe data object
- `onDelete` (optional) — Delete callback function
- `showDelete` (optional) — Show delete button

#### Features

- Displays recipe image, title, rating, and ingredient count
- Optional delete functionality for saved recipes
- Responsive card layout

---

### 🔍 RecipeSearch Component

Searches Spoonacular API for recipes.

#### Features

- Search by keyword
- Fetch recipes from Spoonacular API
- Display results in a responsive grid
- Click recipe to fetch full details
- Save recipe to database

---

### 📅 MealPlanner Component

Weekly meal planning interface.

#### Features

- 7 days × 3 meals grid (21 slots)
- Add meals to planner
- Remove meals from planner
- Save weekly plan to database
- Recipe picker modal for selection

---

### 🛒 GroceryList Component

Generates a shopping list from the meal plan.

#### Features

- Auto-extract ingredients from planned meals
- Categorize items (Produce, Dairy, etc.)
- Check-off tracking with localStorage
- Print-friendly grocery list

---

### 📊 NutritionTracker Component

Displays nutrition data using charts.

#### Features

- Daily calorie bar chart
- Macro distribution pie chart
- Weekly trends line chart
- Updates dynamically based on meal plan

---



