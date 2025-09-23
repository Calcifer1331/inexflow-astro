import { db } from './index';
import type { Business, NewBusiness } from './schema';
import { business } from './schema';
import { eq, ilike } from 'drizzle-orm/mysql-core/expressions';
import type { UUID } from 'node:crypto';


export async function findById(id: UUID) {
    return await db.select().from(business).where(eq(business.id, id)).limit(1).then(rest => rest[0] ? rest[0] : null)
}