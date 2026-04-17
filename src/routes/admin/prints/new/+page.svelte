<script lang="ts">
    import PrintDetail from '$lib/components/PrintDetail.svelte'
    import type { ActionData } from './$types'

    export let form: ActionData

    const print = {
        id: '',
        title: '',
        price: 0,
        imagePublicId: '',
        size: null
    }
</script>

<PrintDetail
    {print}
    mode="admin"
    form={form ?? undefined}
    submitLabel="Create Print"
    submittingLabel="Creating..."
    imageActionLabel="Choose Image"
    emptyImageLabel="Add Image"
    backHref="/admin/prints"
    backLabel="Cancel"
/>
