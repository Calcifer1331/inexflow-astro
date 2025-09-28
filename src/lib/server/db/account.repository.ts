import { and, asc, eq, getTableColumns } from "drizzle-orm";
import { db } from ".";
import { account, accountSubtype } from "./schema";
import type { EditAccount, NewAccount } from "./schema";
import type { UUID } from "@schema/common.schema";

export async function findAllAccounts() {
    return await db.select()
        .from(account)
        .innerJoin(accountSubtype, eq(accountSubtype.id, account.accountSubtypeId))
        .orderBy(asc(account.code))
}
export async function findAllAccountsToSelect() {
    return await db
        .select({
            code: account.code,
            name: account.name,
            id: account.id,
            accountType: accountSubtype.accountType,
        })
        .from(account)
        .innerJoin(accountSubtype, eq(accountSubtype.id, account.accountSubtypeId))
        .orderBy(asc(account.code))
}

export async function createAccount(data: NewAccount) {
    await db.insert(account)
        .values(data);
}

export async function findAccountByIdAndBusinessIdForEdit(id: number, businessId: UUID) {
    return await db.select()
        .from(account)
        .limit(1)
        .where(
            and(
                eq(account.businessId, businessId),
                eq(account.id, id)
            )
        )
        .then(rest => rest[0] ? rest[0] : null)
}
export async function findAccountByIdAndBusinessIdForShow(id: number, businessId: UUID) {
    return await db.select({
        code: account.code,
        name: account.name,
        description: account.description,
        createdBy: account.createdBy,
        createdAt: account.createdAt,
        updatedAt: account.updatedAt,
        updatedBy: account.updatedBy,
        accountSubtype: {
            name: accountSubtype.name,
            code: accountSubtype.code,
            accountType: accountSubtype.accountType,
            id: accountSubtype.id
        },
    })
        .from(account)
        .innerJoin(accountSubtype, eq(accountSubtype.id, account.accountSubtypeId))
        .limit(1)
        .where(
            and(
                eq(account.businessId, businessId),
                eq(account.id, id)
            )
        ).then(rest => rest[0] ? rest[0] : null)
}

export async function updateAccountByIdAndBusinessId(id: number, businessId: UUID, data: EditAccount) {
    await db.update(account)
        .set(data)
        .where(
            and(
                eq(account.businessId, businessId),
                eq(account.id, id),
            )
        );
}
export async function deleteAccountByIdAndBusinessId(id: number, businessId: UUID) {
    await db.delete(account)
        .where(
            and(
                eq(account.businessId, businessId),
                eq(account.id, id)
            )
        );
}