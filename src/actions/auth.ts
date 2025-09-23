import { authenticateUser } from '@db/user.repository';
import { ActionError, defineAction } from 'astro:actions';
import { z } from "astro:schema";

export const auth = {
    login: defineAction({
        accept: "form",
        input: z.object({
            email: z.string({ message: 'Error de email' })
                .email('El formato es invalido')
                .nonempty("El email no puede estar vacio"),
            password: z.string({ message: "la contrasena es inavlida" })
                .nonempty('La contrasena no puede estar basia')
        }),
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

                await session?.set("user", user);

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