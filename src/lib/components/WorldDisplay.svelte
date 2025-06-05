<script lang="ts">
	import type { Setting } from '$lib/types';
	import { slide } from 'svelte/transition';
	import AiImage from './AiImage.svelte';

	export let setting: Setting;
</script>

<div class="flex flex-col gap-2 rounded-2xl border-2 p-2 max-sm:flex-col" transition:slide>
	{#key setting.worldVisualPrompt}
		<AiImage prompt={setting.worldVisualPrompt} className="w-full aspect-square" />
	{/key}
	<div class="flex flex-col gap-1">
		<h3 class="text-xl font-bold">
			{setting.worldName}
		</h3>
		<div class="flex flex-wrap gap-1">
			{setting.worldDescription}
		</div>
	</div>
</div>
