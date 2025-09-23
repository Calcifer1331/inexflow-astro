import { db } from './index';
import type { EditItem, Item, ItemType, NewItem } from './schema';
import { item, measureUnit } from './schema';
import { eq, ilike, and } from 'drizzle-orm/mysql-core/expressions';
import type { UUID } from 'node:crypto';


export async function findAll() {
    return await db.select().from(measureUnit)
}