
<script lang="ts">
    import { page } from '$app/stores'

    import ArtworkCard from "$lib/components/ArtworkCard.svelte"
    import type { PageData } from "./$types"

    export let data: PageData

    $: showSavedBanner = $page.url.searchParams.get('saved') === '1'

</script>

<section class="max-w-6xl mx-auto px-6 py-16">

    {#if showSavedBanner}
        <div class="mb-6 border border-green-700/20 bg-green-50 px-4 py-3 text-sm text-green-900">
            Artwork saved.
        </div>
    {/if}

    <div class="flex justify-between items-center mb-6">

        <h1 class="text-2xl font-semibold">Manage Artworks</h1>

        <a href="/admin/artworks/new" class="px-4 py-2 bg-black text-white text-sm uppercase tracking-wide hover:opacity-80">
        
            + Add Artwork

        </a>

    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">

        {#each data.artworks as artwork}
            <ArtworkCard {artwork} mode={"admin"} />
        {/each}

    </div>

</section>
