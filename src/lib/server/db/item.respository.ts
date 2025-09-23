import { db } from './index';
import type { Item, NewItem } from './schema';
import { item, measureUnit } from './schema';
import { eq, ilike, and } from 'drizzle-orm/mysql-core/expressions';
import type { UUID } from 'node:crypto';


export async function findAllByBusinessIdAndType(businessId: UUID, type: Item['type']) {
    return await db.select({
        id: item.id,
        name: item.name,
        cost: item.cost,
        sellingPrice: item.sellingPrice,
        stock: item.stock,
        minStock: item.minStock,
        businessId: item.businessId,
        measureUnit: measureUnit.value
    })
        .from(item)
        .leftJoin(measureUnit, eq(measureUnit.id, item.measureUnitId))
        .where(
            and(
                eq(item.businessId, businessId),
                eq(item.type, type)
            )
        )
}

export async function findByIdAndBusinessIdAndTypeForEdit(id: number, businessId: UUID, type: Item['type']) {
    return await db.select({
        name: item.name,
        cost: item.cost,
        sellingPrice: item.sellingPrice,
        stock: item.stock,
        minStock: item.minStock,
        measureUnitId: item.measureUnitId
    })
        .from(item)
        .limit(1)
        .where(
            and(
                eq(item.businessId, businessId),
                eq(item.type, type),
                eq(item.id, id)
            )
        ).then(rest => rest[0] ? rest[0] : null)
}
export async function findByIdAndBusinessIdAndTypeForShow(id: number, businessId: UUID, type: Item['type']) {
    return await db.select({
        name: item.name,
        cost: item.cost,
        sellingPrice: item.sellingPrice,
        stock: item.stock,
        minStock: item.minStock,
        measureUnit: measureUnit.value,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
    })
        .from(item)
        .leftJoin(measureUnit, eq(measureUnit.id, item.measureUnitId))
        .limit(1)
        .where(
            and(
                eq(item.businessId, businessId),
                eq(item.type, type),
                eq(item.id, id)
            )
        ).then(rest => rest[0] ? rest[0] : null)
}
export async function updateProductByIdAndBusinessIdAndType(id: number, businessId: UUID, data: Partial<Item>) {
    await db.update(item)
        .set(data)
        .where(
            and(
                eq(item.businessId, businessId),
                eq(item.type, 'product'),
                eq(item.id, id)
            )
        );
}
export async function deleteProductByIdAndBusinessIdAndType(id: number, businessId: UUID) {
    await db.delete(item)
        .where(
            and(
                eq(item.businessId, businessId),
                eq(item.type, 'product'),
                eq(item.id, id)
            )
        );
}