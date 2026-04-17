<script lang="ts">

    import ArtworkDetail from '$lib/components/ArtworkDetail.svelte'

    import type {PageData} from './$types'

    export let data: PageData

    const artwork = data.artwork

</script>

{#if artwork}

    <ArtworkDetail artwork={artwork} />

{:else}

    <section class="max-w-4xl mx-auto px-6 py-20">

        <h1 class="text-2xl font-semibold">Artwork not found</h1>

    </section>

{/if}