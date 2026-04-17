<script lang="ts">
    import PurchaseInquiryForm from '$lib/components/PurchaseInquiryForm.svelte'
    import type { PageData } from './$types'

    export let data: PageData

    const artwork = data.artwork
</script>

{#if artwork}
    <PurchaseInquiryForm
        item={{
            id: artwork.id,
            title: artwork.title,
            price: artwork.price,
            imagePublicId: artwork.imagePublicId,
            kind: 'artwork',
            summary: `${artwork.size}, ${artwork.year}`
        }}
    />
{:else}
    <section class="max-w-4xl mx-auto px-6 py-20">
        <h1 class="text-2xl font-semibold">Artwork not found</h1>
    </section>
{/if}
