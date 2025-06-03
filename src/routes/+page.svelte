<script>
	import AiImage from '$lib/components/AiImage.svelte';
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

<AiImage
	prompt="A man with headphones holds the sword and runs, fantasy style, blade runner 2049 neon style"
/>
