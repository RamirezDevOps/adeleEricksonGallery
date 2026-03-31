
<script lang="ts">

    import PrintCard from "$lib/components/PrintCard.svelte";
    import type {PageData} from "./$types"

    export let data: PageData

</script>

<section class="max-w-6xl mx-auto px-6 py-16">

    <div class="flex justify-between items-center mb-6">

        <h1 class="text-2xl font-semibold">Manage Prints</h1>

        <a href="/admin/prints/new" class="px-4 py-2 bg-black text-white text-sm uppercase tracking-wide hover:opacity-80">
        
            + Add Print

        </a>

    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">

        {#each data.prints as print}
            <PrintCard {print} mode={"admin"} />
        {/each}

    </div>

</section>