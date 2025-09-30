import { and, asc, desc, eq, getTableColumns, max, sql } from "drizzle-orm";
import { db } from ".";
import { account, journalEntry, ledgerRecord } from "./schema";
import type { NewJournalEntry, EditJournalEntry, JournalEntry, NewLedgerRecord } from "./schema";
import type { UUID } from "@schema/common.schema";

export async function findAllJournalEntries() {
    return await db.select()
        .from(journalEntry)
        .innerJoin(ledgerRecord, eq(ledgerRecord.journalEntryId, journalEntry.id))
}

export async function findJournal(businessId: UUID, year: number) {
    return await db
        .select({
            id: ledgerRecord.id,
            debit: ledgerRecord.debit,
            credit: ledgerRecord.credit,
            reference: ledgerRecord.reference,
            entry: {
                date: journalEntry.date,
                id: journalEntry.id,
                code: journalEntry.code,
                year: journalEntry.year,
                name: journalEntry.name,

            },
            account: {
                name: account.name,
                code: account.code,
            },
        })
        .from(ledgerRecord)
        .innerJoin(journalEntry, eq(ledgerRecord.journalEntryId, journalEntry.id))
        .innerJoin(account, eq(account.id, ledgerRecord.accountId))
        .orderBy(
            desc(journalEntry.date),
            desc(journalEntry.code),
            desc(ledgerRecord.debit),
        )
        .where(
            and(
                eq(ledgerRecord.businessId, businessId),
                eq(sql`YEAR(${journalEntry.date})`, year)
            )
        )
}

export async function findLastJournalEntryCode(businessId: UUID) {
    return await db.select({
        code: sql<number>`COALESCE(${max(journalEntry.code)}, 0)`.as('code'),
        id: sql<number>`COALESCE(${max(journalEntry.id)}, 0)`.as('id'),
    })
        .from(journalEntry)
        .where(
            and(
                eq(journalEntry.businessId, businessId),
                eq(journalEntry.year, (new Date(Date.now())).getFullYear()),
            )
        )
        .then(rest => rest[0])
}
export async function findNextJournalEntryCodeAndId(businessId: UUID, year: number = (new Date(Date.now())).getFullYear()) {
    const [code, id] = await Promise.all([db.select({
        code: sql<number>`COALESCE(${max(journalEntry.code)}, 0) + 1`.as('code'),
    })
        .from(journalEntry)
        .where(
            and(
                eq(journalEntry.businessId, businessId),
                eq(journalEntry.year, year),
            )
        )
        .then(rest => rest[0].code)
        , db.select({
            id: sql<number>`COALESCE(${max(journalEntry.id)}, 0) + 1`.as('id'),
        })
            .from(journalEntry)
            .where(
                and(
                    eq(journalEntry.businessId, businessId),
                )
            )
            .then(rest => rest[0].id)
    ]);
    return { code, id };
}

export async function createJournalEntry(jorunal: NewJournalEntry, records: NewLedgerRecord[]) {
    await db.transaction(async (tx) => {
        await tx.insert(journalEntry).values(jorunal);
        await tx.insert(ledgerRecord).values(records);
    });
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