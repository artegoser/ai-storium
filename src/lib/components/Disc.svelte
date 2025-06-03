<script lang="ts">
	import Arrow from '$lib/icons/Arrow.svelte';
	import type { Snippet } from 'svelte';
	import { slide } from 'svelte/transition';

	let {
		name,
		class: c,
		children,
		closed: o = false
	}: { name: string; class?: string; closed?: boolean; children: Snippet } = $props();

	let opened = $state(!o);
</script>

<div class="flex flex-col rounded-2xl border p-4{c ? ` ${c}` : ''}">
	<button class="flex items-center justify-between" onclick={() => (opened = !opened)}>
		<h2 class="text-2xl font-bold">
			{name}
		</h2>

		<Arrow class="transition {opened ? 'rotate-90' : ''}" />
	</button>

	{#if opened}
		<div class="flex flex-col gap-2 pt-2" transition:slide>
			{@render children()}
		</div>
	{/if}
</div>
