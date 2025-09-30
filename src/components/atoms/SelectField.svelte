<script lang="ts">
    import type { SvelteHTMLElements } from "svelte/elements";

    interface Props {
        label: string;
        errors?: string[];
        transition?: boolean;
        options: { value: string | number; text: string; selected?: boolean }[];
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
    }: Props & SvelteHTMLElements["select"] = $props();

    id ??= name && `input-${name}`;
</script>

<div class="form-floating mb-3">
    <select
        {name}
        {id}
        bind:value
        {...attrs}
        class={["form-control", errors && "is-invalid"]}
    >
        {#if options}
            {#each options as { text, value, selected }}
                <option {value} {selected}>{text}</option>
            {/each}
        {/if}
    </select>
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
</div>
