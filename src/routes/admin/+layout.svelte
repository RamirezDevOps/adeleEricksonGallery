<script lang="ts"> 
    import { goto } from '$app/navigation';

    let { data, children } = $props();

    async function logout() {
        await fetch('/api/session', { method: 'DELETE' });
        await goto('/');
    }

</script>

<div class="min-h-screen flex">

    <!-- Sidebar -->
    <aside class="w-64 border-r p-6 space-y-6">

        <h2 class="text-lg font-semibold">Admin</h2>

        <nav class="flex flex-col gap-4 text-sm">

            <a href="/admin">Dashboard</a>
            <a href="/admin/artworks">Artworks</a>
            <a href="/admin/prints">Prints</a>
            <a href="/admin/inbox">Inbox</a>

        </nav>

        <!-- Spacer pushes logout to bottom -->
        <div class="flex-1"></div>


        {#if data.uid}
            <button onclick={logout} class="text-xs uppercase tracking-wider opacity-60 hover:opacity-100 transition text-left">
                Log out
            </button>
        {/if}



    </aside>

    <!-- Main Content -->
    <main class="flex-1 p-10">
        {@render children()}
    </main>

</div>