# SwiftShop - Modern E-commerce Application

SwiftShop is a full-featured, high-performance e-commerce platform built with the latest web technologies. It provides a seamless shopping experience for users and a robust management dashboard for administrators.

## 🚀 Tech Stack

*   **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/)
*   **Database:** [PostgreSQL](https://www.postgresql.org/)
*   **ORM:** [Prisma](https://www.prisma.io/)
*   **Authentication:** [Auth.js (NextAuth v5)](https://authjs.dev/)
*   **State Management:** [Zustand](https://github.com/pmndrs/zustand)
*   **Payments:** [Stripe](https://stripe.com/)
*   **Validation:** [Zod](https://zod.dev/)
*   **Testing:** [Playwright](https://playwright.dev/)

## ✨ Key Features

### User Experience
*   **Responsive Design:** Mobile-first layout with a dedicated mobile filter drawer.
*   **Product Discovery:**
    *   Advanced search with debouncing.
    *   Filtering by category and price range.
    *   Sorting options (Price, Name, Date).
*   **Shopping Cart:** Persistent client-side cart state using Zustand.
*   **Checkout:** Secure payment processing via Stripe Checkout.
*   **User Accounts:**
    *   Registration & Login.
    *   Order History & Tracking.
    *   Favorites/Wishlist (with Optimistic UI for instant feedback).
    *   Profile Management.

### Admin Dashboard
*   **Overview:** Real-time revenue charts and order statistics.
*   **AI Error Analyst:** 
    *   **System Health Dashboard:** Dedicated monitoring tab for system-wide errors.
    *   **Automated Diagnostics:** Real-time error catching for Stripe payments and webhooks.
    *   **AI Diagnosis:** Integrated with Groq (Llama 3) to provide instant explanations and suggested code fixes for every incident.
*   **Product Management:** Create, update, and delete products.
*   **Order Management:** View and update order statuses.
*   **User Management:** Manage user roles and account status.

## 🛠️ Getting Started

Follow these steps to set up the project locally.

### Prerequisites
*   Node.js (v18+)
*   Docker (for the local PostgreSQL database)
*   Stripe Account (for payment testing)

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/swiftshop.git
cd swiftshop
```

### 2. Environment Setup
Create a `.env` file in the root directory:
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/swiftshop_db"

# Authentication (Generate a random string: openssl rand -base64 32)
AUTH_SECRET="your-secret-key"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."

# AI (Optional - for System Health Diagnosis)
GROQ_API_KEY="gsk_..."

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Database Setup
Start the PostgreSQL container:
```bash
docker-compose up -d
```

Run migrations to set up the schema:
```bash
npx prisma migrate dev
```

Seed the database with initial products:
```bash
npx prisma db seed
```

### 4. Run the Application
Start the development server:
```bash
npm run dev
```
Visit `http://localhost:3000` to see the app.

### 5. Webhook Testing (Optional)
To test the full checkout flow locally with Stripe:
```bash
stripe listen --forward-to localhost:3000/api/webhook
```

## 🧪 Testing

SwiftShop includes a comprehensive suite of End-to-End (E2E) tests powered by Playwright to ensure reliability and prevent regressions.

### Running Tests
Ensure the development server is NOT running, as Playwright will manage the server lifecycle:
```bash
npx playwright test
```

To view the test report:
```bash
npx playwright show-report
```

### Test Coverage
*   **Homepage:** Smoke tests for core layout and navigation.
*   **Cart Management:** Adding items, updating quantities, and persistent state.
*   **Product Discovery:** Search functionality, filtering logic, and sorting.
*   **Authentication:** Login flow, session management, and protected routes.
*   **Checkout Flow:** Interception and verification of the Stripe checkout initialization.
*   **Admin Security:** Role-based access control (RBAC) verification for dashboard access.

## 📂 Project Structure

```
├── app/                  # Next.js App Router pages and layouts
│   ├── admin/            # Admin dashboard routes
│   ├── api/              # API routes (Webhooks, Auth, Checkout)
│   ├── (shop)/           # Storefront routes
├── components/           # Reusable React components
│   ├── admin/            # Admin-specific components
│   ├── ui/               # Shadcn UI primitives
├── lib/                  # Utility functions and configuration
│   ├── prisma.ts         # Database client
│   ├── store.ts          # Zustand store
├── tests/                # Playwright E2E tests
├── prisma/               # Database schema and seeds
└── public/               # Static assets
```

## 🔒 Security & Performance
*   **Type Safety:** Strict TypeScript usage throughout the codebase.
*   **Optimizations:** Database indexing on frequently queried fields.
*   **SEO:** Dynamic metadata generation for product pages.
*   **Validation:** Server-side input validation using Zod schemas.
*   **E2E Testing:** High-coverage automated testing for all critical paths.

## 📄 License
This project is licensed under the MIT License.
