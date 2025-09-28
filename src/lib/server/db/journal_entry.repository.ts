import { and, asc, eq, max, sql } from "drizzle-orm";
import { db } from ".";
import { journalEntry, ledgerRecord } from "./schema";
import type { NewJournalEntry, EditJournalEntry, JournalEntry } from "./schema";
import type { UUID } from "@schema/common.schema";

export async function findAllJournalEntries() {
    return await db.select()
        .from(journalEntry)
        .innerJoin(ledgerRecord, eq(ledgerRecord.journalEntryId, journalEntry.id))
}
export async function findLastJournalEntryCode(businessId: UUID) {
    return await db.select({
        code: sql<number>`COALESCE(${max(journalEntry.code)}, 1)`.as('code'),
    })
        .from(journalEntry)
        .where(
            and(
                eq(journalEntry.businessId, businessId),
                eq(journalEntry.year, (new Date(Date.now())).getFullYear())
            )
        )
        .then(rest => rest[0].code)
}

export async function createJournalEntry(data: NewJournalEntry) {
    return await db.insert(journalEntry)
        .values(data);
}

export async function findJournalEntryByIdAndBusinessIdForEdit(id: number, businessId: UUID) {
    return await db.select()
        .from(journalEntry)
        .limit(1)
        .where(
            and(
                eq(journalEntry.businessId, businessId),
                eq(journalEntry.id, id)
            )
        ).then(rest => rest[0] ? rest[0] : null)
}
export async function findJournalEntryByIdAndBusinessIdForShow(id: number, businessId: UUID) {
    return await db.select()
        .from(journalEntry)
        .innerJoin(ledgerRecord, eq(ledgerRecord.journalEntryId, journalEntry.id))
        .limit(1)
        .where(
            and(
                eq(journalEntry.businessId, businessId),
                eq(journalEntry.id, id)
            )
        ).then(rest => rest[0] ? rest[0] : null)
}

export async function updateJournalEntryByIdAndBusinessId(id: number, businessId: UUID, data: EditJournalEntry) {
    await db.update(journalEntry)
        .set(data)
        .where(
            and(
                eq(journalEntry.businessId, businessId),
                eq(journalEntry.id, id),
            )
        );
}
export async function deleteJournalEntryByIdAndBusinessId(id: number, businessId: UUID) {
    await db.delete(journalEntry)
        .where(
            and(
                eq(journalEntry.businessId, businessId),
                eq(journalEntry.id, id)
            )
        );
}