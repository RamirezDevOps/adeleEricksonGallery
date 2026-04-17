<script lang="ts">
    import { CldImage } from 'svelte-cloudinary'

    export let item: {
        id: string
        title: string
        price: number
        imagePublicId: string
        kind: 'artwork' | 'print'
        summary?: string
    }

    let success = false
    let error: string | null = null
    let loading = false

    let fieldErrors = {
        name: '',
        email: '',
        message: ''
    }

    function clean(value: FormDataEntryValue | null) {
        return String(value ?? '').trim().replace(/<[^>]*>?/gm, '')
    }

    async function submitForm(event: SubmitEvent) {
        fieldErrors = { name: '', email: '', message: '' }
        error = null
        success = false

        event.preventDefault()

        const form = event.currentTarget as HTMLFormElement
        const formData = new FormData(form)

        const payload = {
            name: clean(formData.get('name')),
            email: clean(formData.get('email')),
            message: clean(formData.get('message')),
            relatedType: item.kind,
            relatedId: item.id,
            relatedTitle: item.title
        }

        if (!payload.name) {
            fieldErrors.name = 'Please enter your name.'
        }

        if (!payload.email) {
            fieldErrors.email = 'Please enter your email.'
        }

        if (!payload.message) {
            fieldErrors.message = 'Please enter a message.'
        }

        if (fieldErrors.name || fieldErrors.email || fieldErrors.message) {
            error = 'Something went wrong. Please try again.'
            return
        }

        loading = true

        const res = await fetch('/api/forms/purchase', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })

        loading = false

        if (res.ok) {
            success = true
            form.reset()
            return
        }

        error = 'Something went wrong. Please try again.'
    }
</script>

<section class="max-w-6xl mx-auto px-6 py-16">
    <div class="grid gap-16 md:grid-cols-2">
        <div class="space-y-6">
            <div class="text-sm uppercase tracking-[0.18em] text-gray-500">
                {item.kind === 'artwork' ? 'Artwork Purchase Inquiry' : 'Print Purchase Inquiry'}
            </div>

            <div>
                <h1 class="text-3xl font-semibold">{item.title}</h1>
                <p class="mt-3 text-gray-700">${item.price}</p>
                {#if item.summary}
                    <p class="mt-3 text-gray-600">{item.summary}</p>
                {/if}
            </div>

            <p class="text-gray-700 leading-relaxed">
                Submit an inquiry and we will follow up with availability, next steps, and any additional details for this piece.
            </p>
        </div>

        <div class="border p-8">
            <form class="space-y-6" on:submit={submitForm} novalidate>
                <h2 class="text-2xl font-semibold">Purchase Request</h2>

                {#if error}
                    <p role="alert" class="text-sm text-red-600">{error}</p>
                {/if}

                <div>
                    <label for="name" class="block text-sm mb-2">Name</label>
                    <input id="name" name="name" type="text" maxlength="100" class="w-full border p-3 focus:outline-none focus:ring-2 focus:ring-black" aria-invalid={fieldErrors.name ? 'true' : 'false'} />
                    {#if fieldErrors.name}
                        <p class="mt-1 text-sm text-red-600">{fieldErrors.name}</p>
                    {/if}
                </div>

                <div>
                    <label for="email" class="block text-sm mb-2">Email</label>
                    <input id="email" name="email" type="email" maxlength="200" class="w-full border p-3 focus:outline-none focus:ring-2 focus:ring-black" aria-invalid={fieldErrors.email ? 'true' : 'false'} />
                    {#if fieldErrors.email}
                        <p class="mt-1 text-sm text-red-600">{fieldErrors.email}</p>
                    {/if}
                </div>

                <div>
                    <label for="message" class="block text-sm mb-2">Message</label>
                    <textarea id="message" name="message" maxlength="2000" class="min-h-40 w-full border p-3 focus:outline-none focus:ring-2 focus:ring-black" aria-invalid={fieldErrors.message ? 'true' : 'false'}></textarea>
                    {#if fieldErrors.message}
                        <p class="mt-1 text-sm text-red-600">{fieldErrors.message}</p>
                    {/if}
                </div>

                <button type="submit" class="border px-6 py-3 hover:bg-black hover:text-white transition focus:outline-none focus:ring-2 focus:ring-black">
                    {loading ? 'Sending...' : 'Send Inquiry'}
                </button>

                {#if success}
                    <p class="text-sm text-green-600">Your inquiry has been sent successfully. We will follow up soon.</p>
                {/if}
            </form>
        </div>
    </div>
</section>
