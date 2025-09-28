<script lang="ts">
    import type { Snippet } from "svelte";

    interface Props {
        type?:
            | "primary"
            | "secundary"
            | "success"
            | "info"
            | "dark"
            | "light"
            | "warning"
            | "danger";
        children?: Snippet;
        dismissible?: boolean;
    }
    let { type = "primary", children, dismissible }: Props = $props();
</script>

<div
    class={[
        "alert  show",
        `alert-${type}`,
        dismissible && "alert-dismissible fade",
    ]}
    role="alert"
>
    {@render children?.()}
    {#if dismissible}
        <button
            type="button"
            class="btn-close"
            data-bs-dismiss="alert"
            aria-label="Cerrar"
        ></button>
    {/if}
</div>
