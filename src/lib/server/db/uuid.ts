
import { customType } from "drizzle-orm/mysql-core";
import type { UUID } from "node:crypto";
import { randomUUID } from 'node:crypto';

export function uuidToBin(uuid: UUID | string): Buffer {
    const hex = uuid.replace(/-/g, '');
    return Buffer.from(hex, 'hex');
}

export function binToUuid(buffer: Buffer): UUID {
    const hex = buffer.toString('hex');
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}` as UUID;
}

export const mysqlUUID = customType<{
    data: UUID;
    driverData: Buffer;
    config: { length?: number };
}>({
    dataType(config) {
        return `binary(${config?.length ?? 16})`;
    },
    fromDriver(value: unknown) {
        return binToUuid(value as Buffer);
    },
    toDriver(value: unknown) {
        if (value == null) {
            return uuidToBin(randomUUID());
        }
        return uuidToBin(value as string);
    }
});
export default mysqlUUID;