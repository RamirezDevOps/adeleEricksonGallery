<script lang="ts">
    import PurchaseInquiryForm from '$lib/components/PurchaseInquiryForm.svelte'
    import { formatPrintCategory, formatPrintSize } from '$lib/prints'
    import type { PageData } from './$types'

    export let data: PageData

    const print = data.print
</script>

{#if print}
    <PurchaseInquiryForm
        item={{
            id: print.id,
            title: print.title,
            price: print.price,
            imagePublicId: print.imagePublicId,
            kind: 'print',
            summary: print.size ? `${formatPrintSize(print.size)} (${formatPrintCategory(print.size.category)})` : undefined
        }}
    />
{:else}
    <section class="max-w-4xl mx-auto px-6 py-20">
        <h1 class="text-2xl font-semibold">Print not found</h1>
    </section>
{/if}
