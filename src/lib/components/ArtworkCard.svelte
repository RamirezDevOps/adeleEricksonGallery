<script lang="ts">
    import { CldImage } from 'svelte-cloudinary'

    export let artwork: {
        id: string
        title: string
        price: number
        size: string
        year: number
        imagePublicId: string
        sold?: boolean
    }

    export let mode: 'public' | 'admin' = 'public'
</script>

<a href={mode === 'public' ? `/portfolio/${artwork.id}` : `/admin/artworks/${artwork.id}`} class="block group">
    <div class="aspect-[3/4] bg-gray-200 border overflow-hidden flex items-center justify-center">
        {#if artwork.imagePublicId}
            <CldImage
                src={artwork.imagePublicId}
                alt={artwork.title}
                width="600"
                height="800"
                crop="fill"
                gravity="auto"
                class="h-full w-full object-cover"
            />
        {:else}
            Large Artwork Image
        {/if}
    </div>

    <p class="mt-4 text-sm tracking-wide uppercase group-hover:underline">
        {artwork.title}
    </p>
</a>
