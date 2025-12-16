import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    // Middleware vazio propositalmente
  },
  {
    pages: {
      signIn: "/login",
    },
    callbacks: {
      authorized: ({ token }) => {
        // 🔐 Só permite se estiver autenticado
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path*"],
};
