<script lang="ts">
    import ArtworkDetail from '$lib/components/ArtworkDetail.svelte'
    import type { ActionData } from './$types'

    export let form: ActionData

    const artwork = {
        id: '',
        title: '',
        price: 0,
        size: '',
        year: new Date().getFullYear(),
        imagePublicId: '',
        sold: false
    }
</script>

<ArtworkDetail
    {artwork}
    mode="admin"
    form={form ?? undefined}
    submitLabel="Create Artwork"
    submittingLabel="Creating..."
    imageActionLabel="Choose Image"
    emptyImageLabel="Add Image"
    backHref="/admin/artworks"
    backLabel="Cancel"
    showStatus={false}
/>
