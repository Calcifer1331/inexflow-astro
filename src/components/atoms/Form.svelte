<script lang="ts">
    import type { Snippet } from "svelte";
    import type { SvelteHTMLElements } from "svelte/elements";

    let {
        children,
        method = "POST",
        class: formClass,
        ...attrs
    }: { children: Snippet } & SvelteHTMLElements["form"] = $props();
</script>

<form {...attrs} {method} class={[formClass, "needs-validation"]} novalidate>
    {@render children?.()}
</form>
