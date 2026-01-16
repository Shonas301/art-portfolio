import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth/config";

// create the nextauth handler with our config
const handler = NextAuth(authOptions);

// export handler for both get and post requests
// next.js 15 app router requires named exports
export { handler as GET, handler as POST };
