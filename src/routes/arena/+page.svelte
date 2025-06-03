<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Disc from '$lib/components/Disc.svelte';
	import Label from '$lib/components/Label.svelte';
	import TextArea from '$lib/components/TextArea.svelte';
	import Title from '$lib/components/Title.svelte';
	import { m } from '$lib/paraglide/messages';
	import { simplePrompt } from '$lib/pollinations';

	let world_generating = $state(false);
	let place_generating = $state(false);

	let world: string = $state(m.default_world());
	let place: string = $state(m.colosseum_place());

	async function generate_world() {
		world_generating = true;

		world = await simplePrompt(
			`You have to generate a description of the world where the battle takes place for the ai battle simulation game. The world can be anything. From dark fantasy to absolute memes and gags. For example: "${m.default_world()}".`
		);

		world_generating = false;
	}

	async function generate_place() {
		place_generating = true;

		place = await simplePrompt(
			`You have to generate a description of the arena where the battle takes place for the ai battle simulation game. For example: "${m.colosseum_place()}". CONSIDER the description of the world: "${world}"`
		);

		place_generating = false;
	}
</script>

<Title name="ARENA" />

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
	<TextArea className="w-full h-40" bind:value={world} generating={world_generating} />
	<Button className="blue-button" onclick={generate_world} generating={world_generating}>
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
	<TextArea className="w-full h-40" generating={place_generating} bind:value={place} />
	<Button onclick={generate_place} className="blue-button" generating={place_generating}>
		🎲 {m.generate()}
	</Button>
</Disc>
