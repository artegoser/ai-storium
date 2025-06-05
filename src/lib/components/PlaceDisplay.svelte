<script lang="ts">
	import type { Setting } from '$lib/types';
	import AiImage from './AiImage.svelte';

	export let setting: Setting;
</script>

<div class="flex items-start gap-2 max-sm:flex-col">
	{#key setting.placeVisualPrompt}
		<AiImage prompt={setting.placeVisualPrompt} className="w-full aspect-square basis-1/2" />
	{/key}
	<div class="flex basis-1/2 flex-col gap-1">
		<h3 class="text-xl font-bold">
			{setting.placeName}
		</h3>
		<div class="flex flex-wrap gap-1">
			{setting.placeDescription}
		</div>
	</div>
</div>
