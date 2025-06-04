<script lang="ts">
	import { getLocale, setLocale } from '$lib/paraglide/runtime';
</script>

<button
	class="button green-button cursor-pointer"
	onclick={() => setLocale(getLocale() === 'ru' ? 'en' : 'ru')}
>
	💬
	{#if getLocale() === 'ru'}
		Русский
	{:else}
		English
	{/if}
</button>
