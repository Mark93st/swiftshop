import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
    newUser: '/register',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const role = (auth?.user as any)?.role;
      const isAdmin = role === 'ADMIN';
      const isOnAdmin = nextUrl.pathname.startsWith('/admin');
      const isOnDashboard = nextUrl.pathname.startsWith('/profile') || nextUrl.pathname.startsWith('/orders');
      
      console.log(`🛡️ Middleware: ${nextUrl.pathname} | User: ${auth?.user?.email} | Role: ${role} | isAdmin: ${isAdmin}`);

      if (isOnAdmin) {
        if (isLoggedIn && isAdmin) return true;
        return false; // Redirect to login
      }
      
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn && (nextUrl.pathname === '/login' || nextUrl.pathname === '/register')) {
        const redirectUrl = isAdmin ? '/admin' : '/profile';
        return Response.redirect(new URL(redirectUrl, nextUrl));
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        console.log('🔑 JWT (Config) - user.role:', (user as any).role);
      }
      return token;
    },
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
        (session.user as any).role = token.role;
        console.log('👤 Session (Config) - role:', (session.user as any).role);
      }
      return session;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;