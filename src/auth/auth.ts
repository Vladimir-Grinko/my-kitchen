import NextAuth from "next-auth";
import bcryptjs from "bcryptjs";
import { ZodError } from "zod";
import Credentials from "next-auth/providers/credentials";
import { signInSchema } from "@/schema/zod";
import { getUserFromDb } from "@/utils/user";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/utils/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      // Определяем поля формы логина
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      // проверка учетных данных пользователя и возврат данных для создания сессии
      authorize: async (credentials) => {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Email и пароль обязательны");
          }

          const { email, password } = await signInSchema.parseAsync(
            credentials
          );

          // существует ли пользователь
          const user = await getUserFromDb(email);

          if (!user || !user.password) {
            throw new Error("Неверный ввод данных");
          }
          // сверяем пароли
          const isPasswordValid = await bcryptjs.compare(
            password,
            user.password
          );

          if (!isPasswordValid) {
            throw new Error("Неверный ввод данных");
          }

          return { id: user.id, email: user.email };
        } catch (error) {
          if (error instanceof ZodError) {
            // Return `null` to indicate that the credentials are invalid
            return null;
          }
          return null;
        }
      },
    }),
  ],
  // наскройка сессии
  session: {
    strategy: "jwt",
    maxAge: 3600,
  },
  // путь до секретного файла, который используется для шифрования
  secret: process.env.NEXTAUTH_SECRET,
  // кастомизируем поведение аутентификации
  // добавляем или модифицируем токены для сессии
  callbacks: {
    // вызывается каждый раз, когда создается или обновляется jwt токен
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
});
