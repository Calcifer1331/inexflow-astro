import type { MiddlewareHandler } from 'astro';

/**
 * Funcion que se ejecuta en cada peticion
 */

export const onRequest: MiddlewareHandler = async ({ session, redirect, request, locals, url }, next) => {
    const tenantPath = url.pathname.startsWith('/tenants');
    const adminPath = url.pathname.startsWith('/admins');

    /**
    * Si intenta acceder a cualquier path que no sea /admins o /tenants lo dejara pasar
    */

    if (!tenantPath && !adminPath) return next();


    const user = await session?.get('user');

    /**
     * Si intenta acceder a /admins o /tenants y no tiene session, lo redirecciona a login
     */
    if (!user) return redirect('/auth/login');

    if (!user.id || !user.role || (tenantPath && (!user.businessId || user.role !== 'businessman')) || (adminPath && user.role !== 'admin')) {
        return new Response('No tienes permisos para acceder.', { status: 403 });
    }

    locals.authenticatedUser = user;

    // Si pasa todo, sigue al siguiente handler
    return next();
};
