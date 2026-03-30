<script lang="ts">

    export let print: {
        id: string;
        title: string;
        price: number;
        image: string;
    };

</script>

<a href={`/prints/${print.id}`} class="block group">

    <div class="aspect-[3/4] bg-gray-200 border flex items-center justify-center">

        Image

    </div>

    <div class="mt-4">

        <p class="text-sm uppercase tracking-wide group-hover:underline">{print.title}</p>

        <p class="text-sm text-gray-600 mt-1">{print.price}</p>

    </div>


</a>