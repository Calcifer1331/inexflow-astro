import { loginSchema } from '@/lib/schemas/user.schema';
import type { StrictUserSession } from '@/lib/server/db/schema';
import { authenticateUser } from '@db/user.repository';
import { ActionError, defineAction } from 'astro:actions';

export const auth = {
    login: defineAction({
        accept: "form",
        input: loginSchema,
        handler: async ({ password, email }, { session }) => {
            try {
                const user = await authenticateUser(email, password);

                if (!user) return {
                    success: false,
                    message: 'Credenciales inválidas, Email o contraseña incorrectos'
                };

                if (!user.isActive) return {
                    success: false,
                    message: 'Cuenta deshabilitada, Para poder acceder a su cuenta tiene que validar su identidad mediante su direccion de correo electronico.'
                };

                await session?.set("user", user as StrictUserSession);

                return {
                    success: true,
                    message: user.role === 'businessman' ? '/tenants/businesses' : '/admins'
                }

            } catch (error) {
                console.error("Login Error:", error);
                throw new ActionError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: "Error del servidor",
                });
            }
        }
    }),
}
export default auth;