<script lang="ts">
    import { page } from '$app/stores';
    import { auth } from '$lib/firebase/client';
    import { signInWithEmailAndPassword } from 'firebase/auth';
    import { goto } from '$app/navigation';

    let email = '';
    let password = '';
    let error = '';
    let loading = false;

    async function handleLogin() {
    error = '';
    loading = true;

        try {
            const cred = await signInWithEmailAndPassword(auth, email, password);
            const idToken = await cred.user.getIdToken();

            const res = await fetch('/api/session', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ idToken })
            });

            if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            throw new Error(data?.error ?? 'Login failed');
            }

            const next = $page.url.searchParams.get('next') || '/admin';
            await goto(next);
        } catch (e) {
            error = e instanceof Error ? e.message : 'Login failed';
        } finally {
            loading = false;
        }
    }
</script>

<div class="max-w-md mx-auto mt-16 p-8 border rounded-lg">

    <h1 class="text-2xl font-semibold mb-6">Admin Login</h1>

    <form on:submit|preventDefault={handleLogin} class="space-y-4">

        <div>
            <label for="email" class="block text-sm mb-1">Email</label>
            <input id="email" class="w-full border rounded px-3 py-2" bind:value={email} type="email" required />
        </div>

        <div>
            <label for="password" class="block text-sm mb-1">Password</label>
            <input id="password" class="w-full border rounded px-3 py-2" bind:value={password} type="password" required />
        </div>

        {#if error}
            <p class="text-sm text-red-600">{error}</p>
        {/if}

        <button class="w-full border rounded px-3 py-2 hover:opacity-80 transition" type="submit" disabled={loading}>

            {loading ? 'Signing in…' : 'Sign in'}

        </button>

    </form>

</div>