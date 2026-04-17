<script lang="ts">

    import ArtworkCard from "$lib/components/ArtworkCard.svelte"
    import type { PageData } from "./$types"

    export let data: PageData

</script>

<section class="max-w-6xl mx-auto px-6 py-16">

    <h1 class="text-3xl font-semibold mb-12">Portfolio</h1>

    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">

        {#each data.artworks as artwork}
            <ArtworkCard {artwork} />
        {/each}

    </div>

</section>