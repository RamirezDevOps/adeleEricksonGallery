<script lang="ts">

    export let print;

</script>

    <section class="max-w-6xl mx-auto px-6 py-16">

        <div class="grid md:grid-cols-2 gap-16">

            <!-- LEFT: IMAGE -->
            <div class="aspect-[3/4] bg-gray-200 border flex items-center justify-center">
                
                {#if print.image}
                    <img src={print.image} alt={print.title} class="w-full h-full object-cover" /> 
                {:else}
                    Large Print Image
                {/if}
                
            </div>

            <!-- RIGHT: DETAILS -->
            <div class="flex flex-col justify-center">

                <h1 class="text-3xl font-semibold mb-6">{print.title}</h1>

                <p class="text-lg mb-4">${print.price}</p>

                <div class="mb-8">

                    <p class="font-medium mb-2">Available Sizes:</p>

                    <ul class="space-y-1 text-gray-700">

                        {#each print.sizes as size}
                            <li>{size}</li>
                        {/each}

                    </ul>

                </div>

                <button class="border px-6 py-3 text-sm uppercase tracking-wide hover:bg-black hover:text-white transition">Purchase</button>

            </div>

        </div>

    </section>