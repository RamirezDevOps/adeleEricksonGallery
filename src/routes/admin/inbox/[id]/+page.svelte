<script lang="ts">

    type Inquiry = {
        id: string
        name: string
        email: string
        message: string
        type: "commission" | "purchase"
        status: "read" | "unread"
        createdAt: number
    }

    export let data: { inquiry: Inquiry }

    const inquiry = data.inquiry

</script>

<a href="/admin/inbox" class="text-sm text-gray-500 hover:underline mb-6 inline-block">← Back to Inbox</a>

<div class="border rounded p-8 space-y-6 max-w-3xl">

    <div class="flex justify-between items-start">

        <div>

            <h1 class="text-xl font-semibold">{inquiry.name}</h1>

            <p class="text-sm text-gray-500">{inquiry.type === "commission" ? "Commission Request" : "Purchase Inquiry"}</p>

        </div>

        <p class="text-sm text-gray-400">{new Date(inquiry.createdAt).toLocaleString()}</p>

    </div>

    <div class="border-t pt-6 space-y-4">

        <p class="text-sm text-gray-500">From: <a class="underline" href={`mailto:${inquiry.email}`}>{inquiry.email}</a></p>

        <div class="whitespace-pre-wrap leading-relaxed">

            {inquiry.message}

        </div>

        <div class="border-t pt-6 flex gap-4">

            <a href={`mailto:${inquiry.email}?subject=Re: Your ${inquiry.type === 'commission' ? 'commission request' : 'art inquiry'}`} class="border px-4 py-2 hover:bg-black hover:text-white transition">Reply via Email</a>

        </div>

    </div>

</div>