<script lang="ts">
    import type { ActionData } from './$types'

    type Inquiry = {
        id: string
        name: string
        email: string
        message: string
        type: "commission" | "purchase"
        status: "read" | "unread"
        createdAt: number

        relatedType?: "artwork" | "print"
        relatedId?: string
        relatedTitle?: string
        selectedSize?: string
    }

    export let data: { inquiry: Inquiry }
    export let form: ActionData

    const inquiry = data.inquiry

    function confirmDelete(event: SubmitEvent) {
        if (!window.confirm('Delete this inquiry? This cannot be undone.')) {
            event.preventDefault()
        }
    }

</script>

<a href="/admin/inbox" class="text-sm text-gray-500 hover:underline mb-6 inline-block">← Back to Inbox</a>

<div class="border rounded p-8 space-y-6 max-w-3xl">

    <div class="flex justify-between items-start">

        <div>

            <h1 class="text-xl font-semibold">{inquiry.name}</h1>

            <p class="text-sm text-gray-500">
                {#if inquiry.type === "commission"}
                    Commission Request
                {:else if inquiry.type === "purchase"}
                    Purchase Inquiry
                    {#if inquiry.relatedTitle}
                    - {inquiry.relatedTitle}
                    {/if}
                {/if}
            </p>


        </div>

        <p class="text-sm text-gray-400">{new Date(inquiry.createdAt).toLocaleString()}</p>

        

    </div>

    <div class="border-t pt-6 space-y-4">

        <p class="text-sm text-gray-500">From: <a class="underline" href={`mailto:${inquiry.email}`}>{inquiry.email}</a></p>

        <div class="whitespace-pre-wrap leading-relaxed">

            {inquiry.message}

        </div>

        <div class="border-t pt-6 flex gap-4 flex-wrap">

            <a href={`mailto:${inquiry.email}?subject=Re: Your ${inquiry.type === 'commission' ? 'commission request' : 'art inquiry'}`} class="border px-4 py-2 hover:bg-black hover:text-white transition">Reply via Email</a>

            <form method="POST" action="?/markUnread">
                <button class="border px-4 py-2 hover:bg-black hover:text-white transition">
                    Mark Unread
                </button>
            </form>

            <form method="POST" action="?/delete" on:submit={confirmDelete}>
                <button class="border border-red-600 px-4 py-2 text-red-600 hover:bg-red-600 hover:text-white transition">
                    Delete
                </button>
            </form>

        </div>

        {#if form?.error}
            <p class="text-sm text-red-600">{form.error}</p>
        {/if}

    </div>

</div>
