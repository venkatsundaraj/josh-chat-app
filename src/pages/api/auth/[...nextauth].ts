import NextAuth from "next-auth/next";
import { authOptions } from "@/utils/auth";

export default NextAuth(authOptions);
