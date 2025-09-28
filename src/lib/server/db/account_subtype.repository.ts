import { and, asc, eq } from "drizzle-orm";
import { db } from ".";
import { accountSubtype } from "./schema";
import type { EditAccountSubtype, NewAccountSubtype } from "./schema";
import type { UUID } from "@schema/common.schema";

export async function findAllAccountsSubtype() {
    return await db.select()
        .from(accountSubtype)
        .orderBy(
            asc(accountSubtype.accountType),
            asc(accountSubtype.code)
        )
}

export async function findAllAccountsSubtypeBySelect() {
    return await db.select({
        id: accountSubtype.id,
        name: accountSubtype.name,
        accountType: accountSubtype.accountType,
        code: accountSubtype.code
    })
        .from(accountSubtype)
}
export async function createAccountSubtype(data: NewAccountSubtype) {
    return await db.insert(accountSubtype)
        .values(data);
}

export async function findAccountSubtypeByIdAndBusinessIdForEdit(id: number, businessId: UUID) {
    return await db.select({
        name: accountSubtype.name,
        id: accountSubtype.id,
        code: accountSubtype.code,
        description: accountSubtype.description,
        accountType: accountSubtype.accountType
    }
    )
        .from(accountSubtype)
        .limit(1)
        .where(
            and(
                eq(accountSubtype.businessId, businessId),
                eq(accountSubtype.id, id)
            )
        ).then(rest => rest[0] ? rest[0] : null)
}
export async function findAccountSubtypeByIdAndBusinessIdForShow(id: number, businessId: UUID) {
    return await db.select()
        .from(accountSubtype)
        .limit(1)
        .where(
            and(
                eq(accountSubtype.businessId, businessId),
                eq(accountSubtype.id, id)
            )
        ).then(rest => rest[0] ? rest[0] : null)
}

export async function updateAccountSubtypeByIdAndBusinessId(id: number, businessId: UUID, data: EditAccountSubtype) {
    await db.update(accountSubtype)
        .set(data)
        .where(
            and(
                eq(accountSubtype.businessId, businessId),
                eq(accountSubtype.id, id),
            )
        );
}
export async function deleteAccountSubtypeByIdAndBusinessId(id: number, businessId: UUID) {
    await db.delete(accountSubtype)
        .where(
            and(
                eq(accountSubtype.businessId, businessId),
                eq(accountSubtype.id, id)
            )
        );
}