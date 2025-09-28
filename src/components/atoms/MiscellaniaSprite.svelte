<script lang="ts">
    import type { SvelteHTMLElements } from "svelte/elements";

    export type Action = "new" | "show" | "edit" | "delete";
    const icons: Record<Action, string> = {
        delete: "fe-trash",
        new: "fe-plus",
        edit: "fe-edit",
        show: "fe-info",
    };
    let {
        action,
        width = 20,
        height = 20,
        ...attrs
    }: { action: Action } & SvelteHTMLElements["svg"] = $props();
</script>

<svg {...attrs} class="bi flex-shrink-0" role="img" {width} {height}>
    <use href={`/assets/svg/miscellaniaSprite.svg#${icons[action]}`}></use>
</svg>
