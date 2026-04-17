<script lang="ts">

    import InboxItem from "$lib/components/InboxItem.svelte"

    type Inquiry = {
        id: string
        name: string
        email: string
        message: string
        type: 'commission' | 'purchase'
        status: 'unread' | 'read'
        createdAt: number
    }

    export let data: { inquiries: Inquiry[] }

</script>

<h1 class="text-2xl font-semibold mb-6">Inbox</h1>

<div class="border rounded divide-y">

    {#if data.inquiries.length === 0}
        <p class="p-6 text-sm text-gray-500">No inquiries yet.</p>

    {:else}

        {#each data.inquiries as inquiry (inquiry.id)}
            <InboxItem {inquiry} />
        {/each}

    {/if}

</div>