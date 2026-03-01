# SwiftShop - Modern E-commerce Application

SwiftShop is a full-featured, high-performance e-commerce platform built with the latest web technologies. It provides a seamless shopping experience for users and a robust management dashboard for administrators, featuring **AI-driven diagnostics** and **enterprise-grade security**.

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

### 🔒 Enterprise-Grade Security
*   **Server-Side Invalidation:** Secure session management with the Prisma Adapter.
*   **Multi-Tab Synchronization:** Real-time logout broadcasting via the `BroadcastChannel API` ensures all open tabs are cleared instantly when a user signs out.
*   **Cache Busting:** Strict HTTP `Cache-Control` headers prevent sensitive data from being leaked via the browser's "Back" button history.
*   **Client-Side Wipe:** Automatic clearing of Zustand stores and `sessionStorage` on logout to protect user privacy on shared devices.
*   **Secure Redirection:** Hardcoded safe redirection targets prevent open-redirect vulnerabilities.

### 🇪🇺 GDPR & Privacy Compliance
*   **Cookie Consent Banner:** A sleek, dark-themed banner for granular control over user privacy.
*   **Conditional Analytics:** Google Analytics (GA4) only loads *after* user consent is granted, triggered by a custom event system.
*   **Transparency:** A professional, GDPR-compliant Privacy and Cookie Policy live at `/privacy-policy`.

### 🧠 AI-Powered Admin Specialist
*   **System Health Dashboard:** Dedicated monitoring tab for system-wide health and error tracking.
*   **AI Error Analyst:** Integrated with **Groq (Llama 3)** to provide real-time diagnosis, root-cause analysis, and suggested code fixes for system incidents (e.g., Stripe webhook failures).
*   **Automated Diagnostics:** Real-time error catching and storage for every critical path.

### 🛍️ User Experience
*   **Responsive Design:** Mobile-first layout with a dedicated mobile filter drawer and UI-resilient headings for long category/user names.
*   **Product Discovery:** Advanced search with debouncing, filtering by category/price, and multi-criteria sorting.
*   **Shopping Cart:** Persistent client-side cart state using Zustand.
*   **Checkout:** Secure payment processing via Stripe Checkout with real-time stock reservation.
*   **User Accounts:** Full registration, order history, and a favorites wishlist with optimistic UI updates.

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

# AI (For the System Health Specialist)
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

## 🧪 Testing

SwiftShop includes a comprehensive suite of End-to-End (E2E) tests powered by Playwright to ensure reliability and prevent regressions.

### Running Tests
Ensure the development server is NOT running, as Playwright will manage the server lifecycle:
```bash
npx playwright test
```

### Test Coverage
*   **Homepage:** Smoke tests for core layout and navigation.
*   **Cart Management:** Adding items, updating quantities, and persistent state.
*   **Product Discovery:** Search functionality, filtering logic, and sorting.
*   **Authentication:** Login flow, session management, and protected routes.
*   **Security:** Verification of role-based access control (RBAC) and protected admin paths.

## 📂 Project Structure

```
├── app/                  # Next.js App Router pages and layouts
│   ├── admin/            # Admin dashboard & AI Health Specialist
│   ├── api/              # API routes (Webhooks, Auth, Checkout)
│   ├── products/         # Storefront product listings
├── components/           # Reusable React components
│   ├── ui/               # Shadcn UI primitives
│   ├── CookieConsent.tsx # GDPR compliance component
├── lib/                  # Utility functions and configuration
│   ├── store.ts          # Zustand store
├── prisma/               # Database schema and seeds
└── public/               # Static assets
```

## 🔒 Security & Performance
*   **Type Safety:** Strict TypeScript usage throughout the codebase.
*   **Optimizations:** Database indexing on frequently queried fields.
*   **SEO:** Dynamic metadata generation for product and category pages.
*   **Validation:** Server-side input validation using Zod schemas.
*   **History Protection:** Middleware-driven Cache-Control for all sensitive paths.

## 📄 License
This project is licensed under the MIT License.
