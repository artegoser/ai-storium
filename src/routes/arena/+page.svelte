<script lang="ts">
	import AiImage from '$lib/components/AiImage.svelte';
	import Button from '$lib/components/Button.svelte';
	import Disc from '$lib/components/Disc.svelte';
	import Label from '$lib/components/Label.svelte';
	import TextArea from '$lib/components/TextArea.svelte';
	import Title from '$lib/components/Title.svelte';
	import { m } from '$lib/paraglide/messages';
	import { simplePrompt } from '$lib/pollinations';
	import { character, type Character } from '$lib/utils';

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

	let passed_first_step = $state(false);

	let game_char_description = $state('');
	let game_char: Character | undefined = $state();
	let game_char_description_generating = $state(false);

	async function tryCharacter(description: string) {
		return await simplePrompt(`Answer STRICTLY in json format. You have to generate a character for a game where fights between characters take place. Create a unique character for the dynamic arena based on the provided description. World description: ${world}. Place description: ${place}. ${description !== '' ? `Character short description: ${description}` : ''}
Answer STRICTLY in this JSON format:
{
		"name": "Creative name, on ${m.lang()}",
		"description": "Intriguing description, on ${m.lang()}",
		"visualPrompt": "Prompt for image generation ai, this MUST BE ON ENGLISH",
		"abilities": [list of abilities (only names) of character for use in battle, on ${m.lang()}]
}
`);
	}

	async function generateCharacter(description: string): Promise<Character> {
		try {
			let result = JSON.parse(await tryCharacter(description));
			if (character.parse(result)) return result;
			else return await generateCharacter(description);
		} catch {
			return await generateCharacter(description);
		}
	}

	let passed_second_step = $state(false);
</script>

<Title name="ARENA" />

<div class="flex w-full flex-col-reverse">
	<Disc name={m.setting()} unlocked={passed_first_step} closed={passed_first_step}>
		<Label name={m.world()} />

		{#if !passed_first_step}
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
		{/if}

		<TextArea bind:value={world} generating={world_generating} disabled={passed_first_step} />
		{#if !passed_first_step}
			<Button className="blue-button" onclick={generate_world} generating={world_generating}>
				🎲 {m.generate()}
			</Button>
		{/if}

		<Label name={m.place()} />
		{#if !passed_first_step}
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
		{/if}
		<TextArea generating={place_generating} bind:value={place} disabled={passed_first_step} />
		{#if !passed_first_step}
			<Button onclick={generate_place} className="blue-button" generating={place_generating}>
				🎲 {m.generate()}
			</Button>

			<Button
				onclick={() => (passed_first_step = true)}
				className="green-button"
				generating={place_generating}
			>
				{m.confirm()}
			</Button>
		{/if}
	</Disc>

	{#if passed_first_step}
		<Disc name={m.game_char()} unlocked={passed_second_step} closed={passed_second_step}>
			<Label name={m.description()} />
			<TextArea
				bind:value={game_char_description}
				generating={game_char_description_generating}
				disabled={passed_second_step}
			/>
			<Button
				onclick={async () => {
					game_char_description_generating = true;
					game_char = await generateCharacter(game_char_description);
					console.log(game_char);
					game_char_description_generating = false;
				}}
				className="blue-button"
				generating={game_char_description_generating}
			>
				🎲 {m.generate()}
			</Button>

			{#if game_char}
				<div class="flex flex-col gap-2">
					<div class="flex items-start gap-2 max-sm:flex-col">
						<AiImage prompt={game_char.visualPrompt} className="w-full aspect-square grow-2" />
						<div class="flex grow-1 flex-col gap-1">
							<h3 class="text-xl font-bold">
								{game_char.name}
							</h3>
							<div class="flex flex-wrap gap-1">
								{#each game_char.abilities as ability}
									<div class="rounded-2xl bg-zinc-900 p-2">
										{ability}
									</div>
								{/each}
							</div>
						</div>
					</div>
					<div>
						{game_char.description}
					</div>
				</div>

				<Button
					onclick={() => (passed_second_step = true)}
					className="green-button"
					generating={game_char_description_generating}
				>
					{m.confirm()}
				</Button>
			{/if}
		</Disc>
	{/if}
</div>
