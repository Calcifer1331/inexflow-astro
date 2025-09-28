import { z } from "astro:schema";
import { stringBuilder, uuidBuilder, numBuilder, historicalFields, tenant, auditSchema } from "./common.schema";

/**
 * ASSETS = Activo; add:debit,subtract:credit
 * LIABILITIES = Pasivo; add:credit,subtract:debit
 * EQUITY = Patrimonio; add:credit,subtract:debit
 * INCOME = Ingreso; add:credit,subtract:debit
 * EXPENSE = Egreso; add:debit,subtract:credit
 * COST = Costo; add:credit,subtract:debit
 */
export const accountTypeValues = ['assets', 'liabilities', 'equity', 'income', 'expense', 'cost'] as const;


export const accountSubtypeSchema = z.object({
    id: numBuilder('El id', 1),
    code: numBuilder("El Código", 1, 99999),
    name: stringBuilder("El nombre", 2, 250, true),
    description: stringBuilder("La escripción", 2, 250, true),
    accountType: z.enum(accountTypeValues, { message: "El tipo de cuenta es incorrecto" }),
    businessId: uuidBuilder('El id del negocio').nullable(),
}).merge(auditSchema);

export const editAccountSubtypeSchema = accountSubtypeSchema.omit({ createdAt: true, updatedAt: true, businessId: true, createdBy: true, updatedBy: true })
export const createAccountSubtypeSchema = editAccountSubtypeSchema.omit({ id: true });
export const deleteAccountSubtypeSchema = editAccountSubtypeSchema.pick({ id: true });

export type AccountSubtypeSchema = z.infer<typeof accountSubtypeSchema>;
export type EditAccountSubtypeSchema = z.infer<typeof editAccountSubtypeSchema>;
export type CreateAccountSubtypeSchema = z.infer<typeof createAccountSubtypeSchema>;
export type DeleteAccountSubtypeSchema = z.infer<typeof deleteAccountSubtypeSchema>;

export type AccountType = typeof accountTypeValues[number];

export function calculateBalance(
    accountType: AccountType,
    balance: number,
    debit: number,
    credit: number
): number {
    switch (accountType) {
        case 'assets':
        case 'expense':
            return balance + debit - credit;
        case 'liabilities':
        case 'equity':
        case 'income':
        case 'cost':
            return balance + credit - debit;
        default:
            return balance;
    }
}

export const accountTypeOptions: Record<AccountType, string> =
{
    assets: 'Activo',
    liabilities: 'Pasivo',
    expense: 'Egreso',
    income: 'Ingreso',
    equity: 'Patrimonio',
    cost: 'Costo',
};

export const accountTypeCode: Record<AccountType, number> =
{
    assets: 1,
    liabilities: 2,
    expense: 3,
    income: 4,
    equity: 5,
    cost: 6,
};


export const accountSchema = z.object({
    accountSubtypeId: numBuilder('El id del subtipo de cuenta', 1),
}).merge(accountSubtypeSchema.omit({ accountType: true }));

export const editAccountSchema = accountSchema.omit({ createdAt: true, updatedAt: true, businessId: true, createdBy: true, updatedBy: true })
export const createAccountSchema = editAccountSchema.omit({ id: true });
export const deleteAccountSchema = deleteAccountSubtypeSchema

export type AccountSchema = z.infer<typeof accountSchema>;
export type EditAccountSchema = z.infer<typeof editAccountSchema>;
export type CreateAccountSchema = z.infer<typeof createAccountSchema>;
export type DeleteAccountSchema = DeleteAccountSubtypeSchema
