<script lang="ts">
	import Arrow from '$lib/icons/Arrow.svelte';
	import type { Snippet } from 'svelte';
	import { slide } from 'svelte/transition';

	let {
		name,
		class: c,
		children,
		closed = false,
		unlocked = false
	}: {
		name: string;
		class?: string;
		closed?: boolean;
		unlocked?: boolean;
		children: Snippet;
	} = $props();

	let opened = $state(true);
</script>

<div class="my-1 flex w-full flex-col rounded-2xl border p-4{c ? ` ${c}` : ''}" transition:slide>
	<button class="flex items-center justify-between" onclick={() => unlocked && (opened = !opened)}>
		<h2 class="text-2xl font-bold">
			{name}
		</h2>

		<Arrow class="transition {closed !== opened ? 'rotate-90' : ''}" />
	</button>

	{#if closed !== opened}
		<div class="flex flex-col gap-2 pt-2" transition:slide>
			{@render children()}
		</div>
	{/if}
</div>
