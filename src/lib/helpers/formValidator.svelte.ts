import type { z } from "astro:content";
import { SvelteMap } from "svelte/reactivity";

export function formValidator<T extends z.AnyZodObject, Entity = z.infer<T>>(schema: T, defaultValue?: Partial<z.infer<T>>) {
    type Keys = keyof Entity;
    let value = $state<Partial<Entity>>({ ...defaultValue as Partial<Entity> });
    let inputErrors = new SvelteMap<Keys, string[]>();

    // Booleano reactivo: hay algún error
    let form = $state({ hasErrors: (!!inputErrors.size) });

    const hasErrors = () => form.hasErrors = (!!inputErrors.size);

    function validateField(field: Keys) {
        console.log(field);

        const result = schema.shape[field].safeParse(value[field]);

        if (!result.success) {
            let errors = result.error.errors.map(e => e.message) as Array<string>;
            inputErrors.set(field, errors);
        } else {
            inputErrors.delete(field);
        }
        hasErrors();
    }

    function setFieldError(field: Keys, ...errors: string[]) {
        if (inputErrors.has(field)) {
            const others = inputErrors.get(field);
            if (others) inputErrors.set(field, others.concat(errors));
        } else
            inputErrors.set(field, errors);
    }

    function validateAll() {
        const result = schema.safeParse(value);
        if (!result.success) {
            inputErrors.clear();
            const fieldErrors = result.error.formErrors.fieldErrors;
            for (const key in fieldErrors) {
                const fieldErrorsFromKey = fieldErrors[key as Keys];
                if (fieldErrorsFromKey) inputErrors.set(key as Keys, fieldErrorsFromKey);
            }
            hasErrors();
            return false;
        } else {
            inputErrors.clear();
            hasErrors()
            return result.data as Entity;
        }
    }

    return { value, inputErrors, form, validateField, validateAll, setFieldError };
}
