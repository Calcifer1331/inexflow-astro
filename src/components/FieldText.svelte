<script lang="ts">
    import type { SvelteHTMLElements } from "svelte/elements";

    interface Props {
        label: string;
        errors?: string[];
        transition?: boolean;
        options?: string[];
    }

    let {
        label,
        id,
        name,
        options,
        errors,
        required,
        value = $bindable(),
        ...attrs
    }: Props & SvelteHTMLElements["input"] = $props();

    id ??= name && `input-${name}`;
    const listId = options && name && `${name}-datalist`;
</script>

<div class="form-floating mb-3">
    <input
        {name}
        {id}
        bind:value
        {...attrs}
        class={["form-control", errors && "is-invalid"]}
        list={listId}
    />
    <label for={id}>{label}</label>
    {#if errors}
        <div class="invalid-feedback">
            <ul>
                {#each errors as value}
                    <li>{value}</li>
                {/each}
            </ul>
        </div>
    {/if}

    {#if listId}
        <datalist id={listId}>
            {#each listId as value}
                <option {value}>{value}</option>
            {/each}
        </datalist>
    {/if}
</div>
