<script>
	import LinkButton from '$lib/components/LinkButton.svelte';
	import Title from '$lib/components/Title.svelte';
	import { m } from '$lib/paraglide/messages';
</script>

<Title name="STORIUM" />

<div class="flex flex-wrap">
	<LinkButton href="/arena" className="blue-button">
		⚔️ {m.arena()}</LinkButton
	>
</div>
