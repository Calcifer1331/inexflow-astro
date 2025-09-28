import { and, asc, desc, eq, gte, lte, not, sql } from "drizzle-orm";
import { db } from "."
import { item, payment, record, transaction, type TransactionType } from "./schema";
import type { UUID } from "@/lib/schemas/common.schema";


/**
 * Opciones: db, businessId, dateFrom, dateTo
 * dateFrom/dateTo deben ser JS Date o strings compatibles con MySQL datetime.
 * 
 */
export async function getIncomeStatement(
    businessId: UUID,
    //   dateFrom: Date,
    //   dateTo: Date
) {
    // 1) Ingresos por productos (suma de transaction.total)
    const ingresosProductosRes = await db
        .select({
            value: sql`COALESCE(SUM(${transaction.total}), 0)`.as('value'),
        })
        .from(transaction)
        .where(
            and(
                eq(transaction.type, 'sale_product'),
                // gte(transaction.createdAt, dateFrom),
                // lte(transaction.createdAt, dateTo),
                eq(transaction.businessId, businessId)
            )
        );
    const ingresos_productos = Number(ingresosProductosRes[0].value ?? 0);

    // 2) Ingresos por servicios
    const ingresosServiciosRes = await db
        .select({
            value: sql`COALESCE(SUM(${transaction.total}), 0)`.as('value'),
        })
        .from(transaction)
        .where(
            and(
                eq(transaction.type, 'sale_service'),
                // gte(transaction.createdAt, dateFrom),
                // lte(transaction.createdAt, dateTo),
                eq(transaction.businessId, businessId)
            )
        );
    const ingresos_servicios = Number(ingresosServiciosRes[0].value ?? 0);

    // 3) Costo de ventas (COGS)
    // Join transaction_details (record) -> transactions -> items
    // SUM(items.cost * record.quantity) para las líneas de ventas (sale_product) y entity_type = 'item'
    const cogsRes = await db
        .select({
            value: sql`COALESCE(SUM(${record.cost} * ${record.quantity}), 00000)`.as('value'),
        })
        .from(record)
        .leftJoin(transaction, eq(record.transactionId, transaction.id))
        .where(
            and(
                eq(transaction.type, 'sale_product'),
                eq(record.entityType, 'item'),
                // gte(transaction.createdAt, dateFrom),
                // lte(transaction.createdAt, dateTo),
                eq(transaction.businessId, businessId)
            )
        );
    const cogs = Number(cogsRes[0].value ?? 0);

    // 4) Gastos operativos (compra de servicios)
    const gastosOperativosRes = await db
        .select({
            value: sql`COALESCE(SUM(${transaction.total}), 0)`.as('value'),
        })
        .from(transaction)
        .where(
            and(
                eq(transaction.type, 'purchase_service'),
                // gte(transaction.createdAt, dateFrom),
                // lte(transaction.createdAt, dateTo),
                eq(transaction.businessId, businessId)
            )
        );
    const gastos_operativos = Number(gastosOperativosRes[0].value ?? 0);

    // 5) Gastos administrativos (placeholder: aquí uso purchase_service con filtro en description opcional)
    // Puedes personalizar la condición para identificar administrativos.
    // Por ahora lo dejo igual a gastos operativos para que el flujo funcione.
    // const gastosAdministrativos = gastos_operativos; // ADÁPTALO según tus reglas

    // Cálculos finales
    const utilidad_bruta = ingresos_productos - cogs;
    const ingresos_totales = ingresos_productos + ingresos_servicios;
    // Un esquema simple: utilidad neta = (ingresos totales) - cogs - gastos operativos - gastos administrativos
    const utilidad_neta = ingresos_totales - cogs - gastos_operativos;

    return {
        // periodo: { from: dateFrom, to: dateTo },
        businessId,
        ingresos_productos,
        ingresos_servicios,
        ingresos_totales,
        cogs,
        utilidad_bruta,
        gastos_operativos,
        // gastos_administrativos: gastosAdministrativos,
        utilidad_neta,
    };
}

/**
 * Obtiene flujo de caja por fecha
 */
export async function getCashFlow(
    businessId: UUID,
    // dateFrom: Date ,
    // dateTo: Date ,
    saldoInicial = 0
) {
    // 1) Traer todos los pagos
    const pagos = await db
        .select({
            id: payment.id,
            fecha: payment.createdAt,
            monto: payment.amount,
            metodo: payment.paymentMethod,
            tipoTrans: transaction.type,
            descripcion: transaction.description,
            transNum: transaction.number,
        })
        .from(payment)
        .leftJoin(transaction, eq(payment.transactionId, transaction.id))
        .where(
            and(
                // gte(payment.createdAt, dateFrom),
                // lte(payment.createdAt, dateTo),
                eq(payment.businessId, businessId)
            )
        )
        .orderBy(
            desc(payment.createdAt)
        );

    let saldo = saldoInicial;
    const flujo = pagos.map(p => {
        const esEntrada = p.tipoTrans === 'sale_product' || p.tipoTrans === 'sale_service';
        const entrada = esEntrada ? Number(p.monto) : 0;
        const salida = esEntrada ? 0 : Number(p.monto);
        saldo += entrada - salida;

        return {
            fecha: p.fecha,
            descripcion: p.descripcion || `Transacción #${p.transNum}`,
            metodo: p.metodo,
            entrada,
            salida,
            saldo,
        };
    });

    return { saldoInicial, movimientos: flujo, saldoFinal: saldo };
}

