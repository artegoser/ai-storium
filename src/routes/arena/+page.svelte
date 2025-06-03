<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Disc from '$lib/components/Disc.svelte';
	import Label from '$lib/components/Label.svelte';
	import TextArea from '$lib/components/TextArea.svelte';
	import { m } from '$lib/paraglide/messages';

	let world: string = $state(m.default_world());
	let place: string = $state(m.colosseum_place());
</script>

<Disc name={m.setting()} class="w-full border-blue-600 bg-blue-900">
	<Label name={m.world()} />
	<div class="flex flex-wrap gap-2">
		<Button onclick={() => (world = m.default_world())} className="blue-button">
			{m.default()}
		</Button>
		<Button onclick={() => (world = m.blood_world())} className="red-button">
			🩸 {m.blood_bath()}
		</Button>
		<Button onclick={() => (world = m.comedy_world())} className="gray-button">
			🤡 {m.comedy()}
		</Button>
	</div>
	<TextArea className="w-full h-40" bind:value={world} />
	<Button className="blue-button">
		🎲 {m.generate()}
	</Button>

	<Label name={m.place()} />
	<div class="flex flex-wrap gap-2">
		<Button onclick={() => (place = m.colosseum_place())} className="blue-button">
			{m.colosseum()}
		</Button>
		<Button onclick={() => (place = m.catacombs_place())} className="red-button">
			🩸 {m.catacombs()}
		</Button>
		<Button onclick={() => (place = m.junkyard_place())} className="gray-button">
			🤡 {m.junkyard()}
		</Button>
	</div>
	<TextArea className="w-full h-40" bind:value={place} />
	<Button className="blue-button">
		🎲 {m.generate()}
	</Button>
</Disc>
