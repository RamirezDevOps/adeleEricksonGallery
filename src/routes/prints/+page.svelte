<script lang="ts">

    import PrintCard from "$lib/components/PrintCard.svelte";
    import type {PageData} from "./$types"

    export let data: PageData

    // const prints = [
    //     {
    //         id: '0',
    //         title: 'Evening Silence',
    //         price: 120,
    //         image: ''
    //     },
    //     {
    //         id: '1',
    //         title: 'Blue Figure',
    //         price: 95,
    //         image: ''
    //     }
    // ];

</script>

<section class="max-w-6xl mx-auto px-6 py-16">

    <h1 class="text-3xl font-semibold mb-12">Prints</h1>

    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">

        {#each data.prints as print}
            <PrintCard {print} />
        {/each}

    </div>

</section>