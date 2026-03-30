<script lang="ts">

    let success: boolean = false
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

        event.preventDefault()

        const form = event.target as HTMLFormElement
        const formData = new FormData(form)

        const payload = {
            name: clean(formData.get('name')),
            email: clean(formData.get('email')),
            message: clean(formData.get('message'))
        }

        if (!payload.name) {
            fieldErrors.name = "Please enter your name."
        }

        if (!payload.email) {
            fieldErrors.email = "Please enter your email."
        }

        if (!payload.message) {
            fieldErrors.message = "Please enter a message."
        }

        if (fieldErrors.name || fieldErrors.email || fieldErrors.message) {
            error = "Something went wrong. Please try again."
            return
        }

        loading = true

        const res = await fetch('/api/forms/commissions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })

        if (res.ok) {
            success = true
            loading = false
            form.reset()
        } else {
            error = "Something went wrong. Please try again."
        }
    }

</script>


<section class="max-w-4xl mx-auto px-6 py-20">

    <h1 class="text-3xl font-semibold mb-10">Commissions</h1>

    <div class="space-y-6 text-gray-700 leading-relaxed">

        <p>I offer custom commission work tailored to your vision. Whether you are looking for a portrait, abstract piece, or something uniquely personal, each commission is created with intention and care.</p>

        <p>Turnaround times, pricing, and sizing vary depending on scope. Please submit a request below and I will follow up with more details.</p>

    </div>

    <div class="mt-12">

        <a href="#request" class="inline-block border px-8 py-3 text-sm uppercase tracking-wide hover:bg-black hover:text-white transition">Fill Out Request</a>

    </div>

</section>

<!-- REQUEST FORM SECTION -->
<section id="request" class="max-w-4xl mx-auto px-6 py-20 border-t">

    <!-- svelte-ignore component_name_lowercase -->
    <form name="commission" method="POST" data-netlify="true" on:submit={submitForm} class="space-y-6 mt-10" novalidate>

        <h2 class="text-2xl font-semibold mb-8">Commission Request</h2>

        <p class="text-sm text-gray-500 mb-6"> Fields marked with <span class="text-red-600">*</span> are required.</p>

        {#if error}
            <p role="alert" class="text-red-600 text-sm mb-4">{error}</p>
        {/if}

        <input type="hidden" name="form-name" value="commission" />

        <div>
            <label for="name" class="block text-sm mb-2">Name <span class="text-red-600">*</span></label>
            <input id="name" type="text" name="name" maxlength="100" aria-invalid={fieldErrors.name ? "true" : "false"} required class="w-full border p-3 focus:outline-none focus:ring-2 focus:ring-black" />

            {#if fieldErrors.name}
                <p class="text-red-600 text-sm mt-1">{fieldErrors.name}</p>
            {/if}
        </div>

        <div>
            <label for="email" class="block text-sm mb-2">Email <span class="text-red-600">*</span></label>
            <input id="email" name="email" aria-invalid={fieldErrors.email ? "true" : "false"} maxlength="200" type="email" required class="w-full border p-3 focus:outline-none focus:ring-2 focus:ring-black" />

            {#if fieldErrors.email}
                <p class="text-red-600 text-sm mt-1">{fieldErrors.email}</p>
            {/if}
        </div>

        <div>
            <label for="message" class="block text-sm mb-2">Message <span class="text-red-600">*</span></label>
            <textarea id="message" name="message" aria-invalid={fieldErrors.message ? "true" : "false"} maxlength="2000" required class="w-full border p-3 focus:outline-none focus:ring-2 focus:ring-black"></textarea>

            {#if fieldErrors.message}
                <p class="text-red-600 text-sm mt-1">{fieldErrors.message}</p>
            {/if}

        </div>

        <button type="submit" class="border px-6 py-3 hover:bg-black hover:text-white transition focus:outline-none focus:ring-2 focus:ring-black">
            {loading ? "Sending..." : "Submit Request"}
        </button>

        {#if success}
            <p class="text-green-600 text-sm mt-4">Your request has been sent successfully. I will follow up soon.</p>
        {/if}

    </form>
    
</section>