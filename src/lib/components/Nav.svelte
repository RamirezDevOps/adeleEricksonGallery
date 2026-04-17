<script lang="ts">
    import {page} from '$app/stores'
</script>

<nav class="w-full border-b border-neutral-200 bg-white">

    <div class="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        
        <!-- Site Title -->
        <a href="/" class="text-xl font-semibold tracking-wide hover:opacity-70 transition">Adele Erickson Gallery</a>

        <div class="flex gap-8 text-sm uppercase tracking-wider">

            <!-- Navigation Links -->
            <a href="/portfolio" class="hover:opacity-70 transition" class:underline={$page.url.pathname.startsWith('/portfolio')} aria-label="Portfolio">Portfolio</a>

            <a href="/prints" class="hover:opacity-70 transition" class:underline={$page.url.pathname.startsWith('/prints')} aria-label="Prints">Prints</a>
            
            <a href="/commissions" class="hover:opacity-70 transition" class:underline={$page.url.pathname.startsWith('/commissions')} aria-label="Commissions">Commissions</a>

            <a href="/#aboutMe" class="hover:opacity-70 transition" class:underline={$page.url.hash === '#aboutMe'} aria-label="About the Artist">About Me</a>

        </div>

    </div>

</nav>