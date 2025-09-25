import { db } from './index';
import type { Recipe, RecipeComponent, NewRecipe, NewRecipeComponent, RecipeType } from './schema';
import { item, measureUnit, recipe, recipeComponent, service } from './schema';
import { eq, ilike, and, inArray } from 'drizzle-orm/mysql-core/expressions';
import type { UUID } from 'node:crypto';


export async function findAllOfItemByBusinessIdAndType(businessId: UUID) {
    return await db.select()
        .from(recipe)
        .innerJoin(item, eq(item.id, recipe.outputId))
        .where(
            and(
                eq(recipe.businessId, businessId),
                eq(recipe.outputType, 'item')
            )
        )
}
export async function findAllOfItemByOuyputIdByBusinessIdAndType(outputId: number, businessId: UUID) {
    const recipes = await db.select()
        .from(recipe)
        .where(
            and(
                eq(recipe.businessId, businessId),
                eq(recipe.outputType, 'item'),
                eq(recipe.outputId, outputId)
            )
        );

    console.log("Recipes: ", recipes);


    const recipeComponents = await db.select({
        createdAt: recipeComponent.createdAt,
        updatedAt: recipeComponent.updatedAt,
        id: recipeComponent.id,
        inputType: recipeComponent.inputType,
        inputId: recipeComponent.inputId,
        quantity: recipeComponent.quantity,
        recipeId: recipeComponent.recipeId,
    })
        .from(recipeComponent)
        .where(
            and(
                inArray(recipeComponent.recipeId, recipes.map(e => e.id))
            )
        )

    console.log("Recipes Compo: ", recipeComponents);

    const inputIds = { items: [], services: [] } as { items: number[], services: number[] };

    recipeComponents.forEach(e => {
        if (e.inputType === 'item')
            inputIds.items.push(e.inputId)
        else if (e.inputType === 'service')
            inputIds.services.push(e.inputId)
    })

    console.log("Ids : ", inputIds);

    const [items, services] = await Promise.all([
        await db.select({
            id: item.id,
            name: item.name,
            measureUnitSymbol: measureUnit.symbol,
            cost: item.cost
        })
            .from(item)
            .innerJoin(measureUnit, eq(measureUnit.id, item.measureUnitId))
            .where(
                and(inArray(item.id, inputIds.items))
            ),
        await db.select({
            id: service.id,
            name: service.name,
            measureUnitSymbol: measureUnit.symbol,
            cost: service.cost
        })
            .from(service)
            .innerJoin(measureUnit, eq(measureUnit.id, service.measureUnitId))
            .where(
                and(inArray(service.id, inputIds.services))
            ),
    ]);


    console.log("Inputs : ", items, services);

    const result = recipes.map(e => {
        return {
            ...e,
            components: recipeComponents.filter(v => v.recipeId === e.id).map(o => {
                let item: typeof items[number] | null = null;
                if (o.inputType === 'item')
                    item = items.find(i => i.id === o.inputId) ?? null
                else
                    item = services.find(i => i.id === o.inputId) ?? null;
                return {
                    ...o,
                    ...item
                }
            })
        }
    })




    return result;
}