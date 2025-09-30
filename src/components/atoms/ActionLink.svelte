<script lang="ts">
    import type { Snippet } from "svelte";
    import type { SvelteHTMLElements } from "svelte/elements";
    import MiscellaniaSprite, {
        type Action,
    } from "../modules/MiscellaniaSprite.svelte";

    interface Props {
        action: Action;
        children: Snippet;
    }
    let {
        action,
        children,
        class: linkClass,
        ...attrs
    }: Props & SvelteHTMLElements["a"] = $props();
</script>

<a
    {...attrs}
    class={[
        linkClass,
        "btn d-flex gap-1 align-items-center float-none",
        (action === "new" || action === "show") && "btn-outline-primary",
        action === "edit" && "btn-primary",
        action === "delete" && "btn-danger",
    ]}
>
    {@render children?.()}
    <MiscellaniaSprite {action} />
</a>
