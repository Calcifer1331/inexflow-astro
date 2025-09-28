import type { StrictUserSession, BusinessmanSession, AdminSession } from "@db/schema";
import type { UserRole } from "@schema/user.schema"
import type { AstroSession } from "astro"
import { ActionError } from "astro:actions"

export async function validateUserSession<R extends UserRole>(session: AstroSession<any> | undefined, userRole: R):
    Promise<
        R extends 'admin' ? AdminSession :
        R extends 'businessman' ? BusinessmanSession :
        StrictUserSession
    > {
    const user = await session?.get('user')

    if (!user || user.role !== userRole)
        throw new ActionError({
            code: 'UNAUTHORIZED',
            message: 'No tiene autorizacion para ver realizar esta accion'
        });
    return user as any;
}