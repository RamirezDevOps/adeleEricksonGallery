<script lang="ts">

    export let artwork;

</script>


<section class="max-w-6xl mx-auto px-6 py-16">

    <div class="grid md:grid-cols-2 gap-16">

        <!-- Left: image -->
        <div class="w-full aspect-[3/4] bg-gray-200 border flex items-center justify-center">

            {#if artwork.image}
                <img src={artwork.image} alt={artwork.title} class="w-full h-full object-cover" />
            {:else}
                Large Artwork Image
            {/if}
            
        </div>

        <!-- RIGHT: DETAILS -->
        <div class="flex flex-col justify-center">

            <h1 class="text-3xl font-semibold mb-6">{artwork.title}</h1>

            <div class="space-y-2 text-gray-700 mb-8">

                <p><span class="font-medium">Price:</span> ${artwork.price}</p>
                <p><span class="font-medium">Size:</span> {artwork.size}</p>
                <p><span class="font-medium">Year:</span> {artwork.year}</p>

            </div>

            {#if artwork.sold}
                <p class="text-red-600 font-medium">Sold</p>
            {:else}
                <button class="border px-6 py-3 text-sm uppercase tracking-wide hover:bg-black hover:text-white transition">Purchase</button> 
            {/if}


        </div>

    </div>

</section>