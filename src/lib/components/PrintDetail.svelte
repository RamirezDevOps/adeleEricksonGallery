<script lang="ts">
    import { enhance } from '$app/forms'
    import { CLOUDINARY_UPLOAD_PRESET, extractCloudinaryPublicId } from '$lib/cloudinary'
    import {
        PRINT_SIZES,
        formatPrintCategory,
        formatPrintSize,
        formatPrintSizeOption,
        normalizeStoredPrintSize,
        type PrintSize
    } from '$lib/prints'
    import {
        CldImage,
        CldUploadWidget,
        type CloudinaryUploadWidgetOptions,
        type CloudinaryUploadWidgetResults
    } from 'svelte-cloudinary'
    import type { SubmitFunction } from '@sveltejs/kit'

    export let print: {
        id: string
        title: string
        price: number
        imagePublicId: string
        size?: PrintSize | null
    }
    export let mode: 'public' | 'admin' = 'public'
    export let submitLabel = 'Save Changes'
    export let submittingLabel = 'Saving...'
    export let formAction = ''
    export let backHref = '/admin/prints'
    export let backLabel = 'Back'
    export let imageActionLabel = 'Replace Image'
    export let emptyImageLabel = 'Large Print Image'
    export let titlePlaceholder = 'Print title'
    export let showDeleteAction = false
    export let deleteLabel = 'Delete Print'
    export let form: {
        errors?: Partial<Record<'title' | 'price' | 'imagePublicId' | 'sizeLabel' | '_form', string>>
        values?: Partial<{
            title: string
            price: string
            imagePublicId: string
            sizeLabel: string
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
        title: print.title,
        price: String(print.price),
        imagePublicId: print.imagePublicId,
        sizeLabel: ''
    }

    let errors: Partial<Record<'title' | 'price' | 'imagePublicId' | 'sizeLabel' | '_form', string>> = {}
    let displaySize: PrintSize | null = null

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

    function getEmptyValues() {
        const size = normalizeStoredPrintSize(print.size ?? null)

        return {
            title: print.title,
            price: String(print.price),
            imagePublicId: print.imagePublicId,
            sizeLabel: size?.label ?? ''
        }
    }

    $: values = {
        ...getEmptyValues(),
        ...form?.values
    }

    $: errors = form?.errors ?? {}
    $: displaySize = normalizeStoredPrintSize(print.size ?? null)
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

                            <div class="aspect-[3/4] bg-gray-200 border flex items-center justify-center overflow-hidden">
                                {#if values.imagePublicId}
                                    <CldImage
                                        src={values.imagePublicId}
                                        alt={values.title || 'Print image'}
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
                            <label for="sizeLabel" class="sr-only">Print size</label>
                            <select
                                id="sizeLabel"
                                name="sizeLabel"
                                required
                                value={values.sizeLabel}
                                aria-invalid={errors.sizeLabel ? 'true' : 'false'}
                                aria-describedby={errors.sizeLabel ? 'size-error' : undefined}
                                class="ml-2 min-w-[15rem] bg-transparent border border-black/20 px-3 py-2 text-gray-700 focus:outline-none focus:border-black"
                            >
                                <option value="" disabled>Select size</option>
                                {#each PRINT_SIZES as size}
                                    <option value={size.label}>{formatPrintSizeOption(size)}</option>
                                {/each}
                            </select>
                        </p>

                        {#if errors.sizeLabel}
                            <p id="size-error" class="text-sm text-red-600">{errors.sizeLabel}</p>
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

                                    if (window.confirm('Delete this print? This cannot be undone.')) {
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
            <div class="aspect-[3/4] bg-gray-200 border flex items-center justify-center overflow-hidden">
                {#if print.imagePublicId}
                    <CldImage
                        src={print.imagePublicId}
                        alt={print.title}
                        width="1200"
                        height="1600"
                        crop="fill"
                        gravity="auto"
                        class="h-full w-full object-cover"
                    />
                {:else}
                    Large Print Image
                {/if}
            </div>

            <div class="flex flex-col justify-center">
                <h1 class="text-3xl font-semibold mb-6">{print.title}</h1>

                <p class="text-lg mb-4">${print.price}</p>

                <div class="mb-8">
                    <p class="text-gray-700">
                        <span class="font-medium">Size:</span>
                        {#if displaySize}
                            {formatPrintSize(displaySize)} ({formatPrintCategory(displaySize.category)})
                        {:else}
                            Unavailable
                        {/if}
                    </p>
                </div>

                <a href={`/purchase/print/${print.id}`} class="inline-block border px-6 py-3 text-sm uppercase tracking-wide hover:bg-black hover:text-white transition">Purchase</a>
            </div>
        </div>
    {/if}
</section>
