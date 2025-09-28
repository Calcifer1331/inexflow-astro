<script lang="ts">
    import type { Snippet } from "svelte";
    import type { SvelteHTMLElements } from "svelte/elements";
    import MiscellaniaSprite, { type Action } from "./MiscellaniaSprite.svelte";
    interface Props {
        action: Action;
        children?: Snippet;
    }
    let {
        action,
        children,
        class: btnClass,
        ...attrs
    }: Props & SvelteHTMLElements["button"] = $props();
</script>

<button
    {...attrs}
    class={[
        btnClass,
        "btn d-flex gap-1 align-items-center float-none",
        (action === "new" || action === "show") && "btn-outline-primary",
        action === "edit" && "btn-primary",
        action === "delete" && "btn-danger",
    ]}
>
    {@render children?.()}
    <MiscellaniaSprite {action} />
</button>
