<script lang="ts">
    import { CldImage } from 'svelte-cloudinary'

    export let print: {
        id: string
        title: string
        price: number
        imagePublicId: string
    }

    export let mode: 'public' | 'admin' = 'public'
</script>

<a href={mode === 'public' ? `/prints/${print.id}` : `prints/${print.id}`} class="block group">
    <div class="aspect-[3/4] bg-gray-200 border flex items-center justify-center overflow-hidden">
        {#if print.imagePublicId}
            <CldImage
                src={print.imagePublicId}
                alt={print.title}
                width="600"
                height="800"
                crop="fill"
                gravity="auto"
                class="h-full w-full object-cover"
            />
        {:else}
            Print Image
        {/if}
    </div>

    <div class="mt-4">
        <p class="text-sm uppercase tracking-wide group-hover:underline">{print.title}</p>
        <p class="text-sm text-gray-600 mt-1">${print.price}</p>
    </div>
</a>
