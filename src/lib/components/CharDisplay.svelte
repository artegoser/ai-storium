<script lang="ts">
	import type { Character } from '$lib/utils';
	import AiImage from './AiImage.svelte';

	export let char: Character;
</script>

<div class="flex flex-col gap-2">
	<div class="flex items-start gap-2 max-sm:flex-col">
		{#key char.visualPrompt}
			<AiImage prompt={char.visualPrompt} className="w-full aspect-square basis-1/2" />
		{/key}
		<div class="flex basis-1/2 flex-col gap-1">
			<h3 class="text-xl font-bold">
				{char.name}
			</h3>
			<div class="flex flex-wrap gap-1">
				<div class="rounded-2xl bg-green-700 p-2">
					❤️ {char.max_hp}
				</div>
				{#each char.abilities as ability}
					<div class="rounded-2xl bg-zinc-900 p-2">
						{ability}
					</div>
				{/each}
			</div>
		</div>
	</div>
	<div>
		{char.description}
	</div>
</div>
