<script lang="ts">
    import { enhance } from '$app/forms'
    import { CLOUDINARY_UPLOAD_PRESET, extractCloudinaryPublicId } from '$lib/cloudinary'
    import {
        CldImage,
        CldUploadWidget,
        type CloudinaryUploadWidgetOptions,
        type CloudinaryUploadWidgetResults
    } from 'svelte-cloudinary'
    import type { SubmitFunction } from '@sveltejs/kit'

    export let artwork: {
        id: string
        title: string
        price: number
        size: string
        year: number
        imagePublicId: string
        sold?: boolean
    }
    export let mode: 'public' | 'admin' = 'public'
    export let submitLabel = 'Save Changes'
    export let submittingLabel = 'Saving...'
    export let formAction = ''
    export let backHref = '/admin/artworks'
    export let backLabel = 'Back'
    export let imageActionLabel = 'Replace Image'
    export let emptyImageLabel = 'Large Artwork Image'
    export let titlePlaceholder = 'Artwork title'
    export let showStatus = true
    export let showDeleteAction = false
    export let deleteLabel = 'Delete Artwork'
    export let form: {
        errors?: Partial<Record<'title' | 'price' | 'size' | 'year' | 'imagePublicId' | '_form', string>>
        values?: Partial<{
            title: string
            price: string
            size: string
            year: string
            imagePublicId: string
            sold: boolean
        }>
        success?: boolean
        data?: unknown
        imageFilePresent?: boolean
    } | null | undefined = undefined

    const uploadWidgetOptions: CloudinaryUploadWidgetOptions = {
        multiple: false,
        maxFiles: 1,
        sources: ['local'],
        resourceType: 'image',
        clientAllowedFormats: ['jpg', 'jpeg', 'png', 'webp']
    }

    let submitting = false
    let widgetError = ''

    let values = {
        title: artwork.title,
        price: String(artwork.price),
        size: artwork.size,
        year: String(artwork.year),
        imagePublicId: artwork.imagePublicId,
        sold: Boolean(artwork.sold)
    }

    let errors: Partial<Record<'title' | 'price' | 'size' | 'year' | 'imagePublicId' | '_form', string>> = {}

    const enhanceSubmit: SubmitFunction = () => {
        submitting = true

        return async ({ update }) => {
            await update()
            submitting = false
        }
    }

    function handleUploadSuccess(result: CloudinaryUploadWidgetResults) {
        const publicId = extractCloudinaryPublicId(result)

        if (!publicId) {
            widgetError = 'Unable to save the selected image.'
            return
        }

        widgetError = ''
        values = { ...values, imagePublicId: publicId }
    }

    function handleUploadError() {
        widgetError = 'Unable to save the selected image.'
    }

    $: values = {
        title: artwork.title,
        price: String(artwork.price),
        size: artwork.size,
        year: String(artwork.year),
        imagePublicId: artwork.imagePublicId,
        sold: Boolean(artwork.sold),
        ...form?.values
    }

    $: errors = form?.errors ?? {}
</script>

<section class="max-w-6xl mx-auto px-6 py-16">
    {#if mode === 'admin'}
        <form method="POST" action={formAction || undefined} use:enhance={enhanceSubmit} novalidate>
            <input type="hidden" name="imagePublicId" value={values.imagePublicId} />

            <div class="grid md:grid-cols-2 gap-16">
                <div>
                    <CldUploadWidget
                        uploadPreset={CLOUDINARY_UPLOAD_PRESET}
                        options={uploadWidgetOptions}
                        onSuccess={handleUploadSuccess}
                        onError={handleUploadError}
                        let:open
                    >
                        <button
                            type="button"
                            class="group relative block w-full text-left"
                            on:click={() => open()}
                            disabled={!CLOUDINARY_UPLOAD_PRESET}
                        >
                            <div class="absolute right-4 top-4 z-10 rounded-full border border-black/15 bg-white/95 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-black shadow-sm transition group-hover:bg-black group-hover:text-white">
                                {imageActionLabel}
                            </div>

                            <div class="w-full aspect-[3/4] bg-gray-200 border flex items-center justify-center overflow-hidden">
                                {#if values.imagePublicId}
                                    <CldImage
                                        src={values.imagePublicId}
                                        alt={values.title || 'Artwork image'}
                                        width="1200"
                                        height="1600"
                                        crop="fill"
                                        gravity="auto"
                                        class="h-full w-full object-cover"
                                    />
                                {:else}
                                    {emptyImageLabel}
                                {/if}
                            </div>
                        </button>
                    </CldUploadWidget>

                    {#if widgetError || errors.imagePublicId || !CLOUDINARY_UPLOAD_PRESET}
                        <p id="image-file-error" class="mt-3 text-sm text-red-600">
                            {widgetError || errors.imagePublicId || 'Cloudinary upload preset is not configured.'}
                        </p>
                    {/if}
                </div>

                <div class="flex flex-col justify-center">
                    <div>
                        <label for="title" class="sr-only">Title</label>
                        <input
                            id="title"
                            name="title"
                            type="text"
                            maxlength="120"
                            required
                            value={values.title}
                            placeholder={titlePlaceholder}
                            aria-invalid={errors.title ? 'true' : 'false'}
                            aria-describedby={errors.title ? 'title-error' : undefined}
                            class="w-full bg-transparent border border-black/20 px-3 py-2 text-3xl font-semibold placeholder:text-gray-400 focus:outline-none focus:border-black"
                        />

                        {#if errors.title}
                            <p id="title-error" class="mt-2 text-sm text-red-600">{errors.title}</p>
                        {/if}
                    </div>

                    <div class="space-y-2 text-gray-700 mb-8 mt-6">
                        <p>
                            <span class="font-medium">Price:</span>
                            <label for="price" class="sr-only">Price</label>
                            <span class="inline-flex items-center ml-2">
                                $
                                <input
                                    id="price"
                                    name="price"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    required
                                    value={values.price}
                                    inputmode="decimal"
                                    aria-invalid={errors.price ? 'true' : 'false'}
                                    aria-describedby={errors.price ? 'price-error' : undefined}
                                    class="w-32 bg-transparent border border-black/20 px-2 py-1 ml-1 focus:outline-none focus:border-black"
                                />
                            </span>
                        </p>

                        {#if errors.price}
                            <p id="price-error" class="text-sm text-red-600">{errors.price}</p>
                        {/if}

                        <p>
                            <span class="font-medium">Size:</span>
                            <label for="size" class="sr-only">Size</label>
                            <input
                                id="size"
                                name="size"
                                type="text"
                                maxlength="60"
                                required
                                value={values.size}
                                aria-invalid={errors.size ? 'true' : 'false'}
                                aria-describedby={errors.size ? 'size-error' : undefined}
                                class="w-40 bg-transparent border border-black/20 px-2 py-1 ml-2 focus:outline-none focus:border-black"
                            />
                        </p>

                        {#if errors.size}
                            <p id="size-error" class="text-sm text-red-600">{errors.size}</p>
                        {/if}

                        <p>
                            <span class="font-medium">Year:</span>
                            <label for="year" class="sr-only">Year</label>
                            <input
                                id="year"
                                name="year"
                                type="number"
                                min="1000"
                                max={new Date().getFullYear()}
                                step="1"
                                required
                                value={values.year}
                                inputmode="numeric"
                                aria-invalid={errors.year ? 'true' : 'false'}
                                aria-describedby={errors.year ? 'year-error' : undefined}
                                class="w-24 bg-transparent border border-black/20 px-2 py-1 ml-2 focus:outline-none focus:border-black"
                            />
                        </p>

                        {#if errors.year}
                            <p id="year-error" class="text-sm text-red-600">{errors.year}</p>
                        {/if}

                        {#if showStatus}
                            <div class="flex items-center gap-4">
                                <span class="font-medium">Status:</span>

                                <label class="inline-flex items-center gap-2">
                                    <input
                                        name="sold"
                                        type="radio"
                                        value="false"
                                        checked={!values.sold}
                                        class="h-4 w-4 border"
                                    />
                                    <span class:font-medium={!values.sold}>Available</span>
                                </label>

                                <label class="inline-flex items-center gap-2">
                                    <input
                                        name="sold"
                                        type="radio"
                                        value="true"
                                        checked={values.sold}
                                        class="h-4 w-4 border"
                                    />
                                    <span class:text-red-600={values.sold} class:font-medium={values.sold}>Sold</span>
                                </label>
                            </div>
                        {/if}
                    </div>

                    <div class="flex gap-4">
                        <button
                            type="submit"
                            class="border px-6 py-3 text-sm uppercase tracking-wide hover:bg-black hover:text-white transition disabled:cursor-not-allowed disabled:opacity-60"
                            disabled={submitting || !CLOUDINARY_UPLOAD_PRESET}
                        >
                            {submitting ? submittingLabel : submitLabel}
                        </button>

                        <a
                            href={backHref}
                            class="border px-6 py-3 text-sm uppercase tracking-wide hover:bg-black hover:text-white transition"
                        >
                            {backLabel}
                        </a>

                        {#if showDeleteAction}
                            <button
                                type="submit"
                                formaction="?/delete"
                                formnovalidate
                                on:click|preventDefault
                                on:click={(event) => {
                                    const form = (event.currentTarget as HTMLButtonElement).form

                                    if (!form) {
                                        return
                                    }

                                    if (window.confirm('Delete this artwork? This cannot be undone.')) {
                                        form.requestSubmit(event.currentTarget as HTMLButtonElement)
                                    }
                                }}
                                class="border border-red-600 px-6 py-3 text-sm uppercase tracking-wide text-red-600 hover:bg-red-600 hover:text-white transition"
                            >
                                {deleteLabel}
                            </button>
                        {/if}
                    </div>

                    {#if errors._form}
                        <p class="mt-4 text-sm text-red-600">{errors._form}</p>
                    {/if}
                </div>
            </div>
        </form>
    {:else}
        <div class="grid md:grid-cols-2 gap-16">
            <div class="w-full aspect-[3/4] bg-gray-200 border flex items-center justify-center overflow-hidden">
                {#if artwork.imagePublicId}
                    <CldImage
                        src={artwork.imagePublicId}
                        alt={artwork.title}
                        width="1200"
                        height="1600"
                        crop="fill"
                        gravity="auto"
                        class="h-full w-full object-cover"
                    />
                {:else}
                    Large Artwork Image
                {/if}
            </div>

            <div class="flex flex-col justify-center">
                <h1 class="text-3xl font-semibold mb-6">{artwork.title}</h1>

                <div class="space-y-2 text-gray-700 mb-8">
                    <p><span class="font-medium">Price:</span> ${artwork.price}</p>
                    <p><span class="font-medium">Size:</span> {artwork.size}</p>
                    <p><span class="font-medium">Year:</span> {artwork.year}</p>
                </div>

                {#if artwork.sold}
                    <p class="text-red-600 font-medium">Sold</p>
                {:else}
                    <a href={`/purchase/artwork/${artwork.id}`} class="inline-block border px-6 py-3 text-sm uppercase tracking-wide hover:bg-black hover:text-white transition">Purchase</a>
                {/if}
            </div>
        </div>
    {/if}
</section>
