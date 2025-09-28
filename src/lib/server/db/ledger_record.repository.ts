import { and, asc, eq } from "drizzle-orm";
import { db } from ".";
import { ledgerRecord } from "./schema";
import type { LedgerRecord, EditLedgerRecord, NewLedgerRecord } from "./schema";
import type { UUID } from "@schema/common.schema";

export async function findAllLedgerRecords() {
    return await db.select()
        .from(ledgerRecord)
}

export async function createLedgerRecord(data: NewLedgerRecord) {
    return await db.insert(ledgerRecord)
        .values(data);
}

export async function findLedgerRecordByIdAndBusinessIdForEdit(id: number, businessId: UUID) {
    return await db.select()
        .from(ledgerRecord)
        .limit(1)
        .where(
            and(
                eq(ledgerRecord.businessId, businessId),
                eq(ledgerRecord.id, id)
            )
        ).then(rest => rest[0] ? rest[0] : null)
}
export async function findLedgerRecordByIdAndBusinessIdForShow(id: number, businessId: UUID) {
    return await db.select()
        .from(ledgerRecord)
        .limit(1)
        .where(
            and(
                eq(ledgerRecord.businessId, businessId),
                eq(ledgerRecord.id, id)
            )
        ).then(rest => rest[0] ? rest[0] : null)
}

export async function updateLedgerRecordByIdAndBusinessId(id: number, businessId: UUID, data: EditLedgerRecord) {
    await db.update(ledgerRecord)
        .set(data)
        .where(
            and(
                eq(ledgerRecord.businessId, businessId),
                eq(ledgerRecord.id, id),
            )
        );
}
export async function deleteLedgerRecordByIdAndBusinessId(id: number, businessId: UUID) {
    await db.delete(ledgerRecord)
        .where(
            and(
                eq(ledgerRecord.businessId, businessId),
                eq(ledgerRecord.id, id)
            )
        );
}