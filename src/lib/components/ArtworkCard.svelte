<script lang="ts">

    export let artwork: {
        id: string;
        title: string;
        price: number;
        size: string;
        year: number;
        image: string;
        sold?: boolean;
    };

</script>

<a href={`/portfolio/${artwork.id}`} class="block group">

    <div class="aspect-[3/4] bg-gray-200 border overflow-hidden flex items-center justify-center">
        {#if artwork.image}
            <img src={artwork.image} alt={artwork.title} class="w-full h-full object-cover" />
        {:else}
            Large Artwork Image
        {/if}
    </div>

    <p class="mt-4 text-sm tracking-wide uppercase group-hover:underline">
        {artwork.title}
    </p>

</a>