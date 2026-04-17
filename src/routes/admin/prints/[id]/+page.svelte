<script lang="ts">

    import PrintDetail from "$lib/components/PrintDetail.svelte"
    import type { ActionData, PageData } from "./$types"

    export let data: PageData
    export let form: ActionData

    const print = data.print

</script>

{#if print}

    <PrintDetail print={print} mode={"admin"} form={form ?? undefined} showDeleteAction={true} formAction="?/save" />

{:else}

    <section class="max-w-4xl mx-auto px-6 py-20">

        <h1 class="text-2xl font-semibold">Print not found</h1>

    </section>

{/if}
