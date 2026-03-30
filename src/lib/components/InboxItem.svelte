<script context="module" lang="ts">
    export type Inquiry = {
        id: string
        name: string
        email: string
        message: string
        type: 'commission' | 'purchase'
        status: 'unread' | 'read'
        createdAt: number
    }
</script>

<script lang="ts">

    export let inquiry: Inquiry

</script>

<a href={`/admin/inbox/${inquiry.id}`} class="block p-4 hover:bg-gray-50 transition {inquiry.status === 'unread' ? 'font-semibold bg-gray-50' : ''}">

    <div class="flex justify-between">

        <div>

            <div class="flex items-center gap-2">

                {#if inquiry.status === 'unread'}
                    <span class="w-2 h-2 bg-black rounded-full"></span>
                {/if}

                <p>{inquiry.name}</p>

            </div>

            <p class="text-sm text-gray-500"> {inquiry.type === 'commission' ? 'Commission Request' : 'Purchase Inquiry'}</p>

        </div>

        <p class="text-sm text-gray-400">{new Date(inquiry.createdAt).toLocaleString()}</p>

    </div>

    <p class="text-sm text-gray-600 truncate mt-2">{inquiry.message}</p>

</a>