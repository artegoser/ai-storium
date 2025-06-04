<script lang="ts">
	import AiImage from '$lib/components/AiImage.svelte';
	import Button from '$lib/components/Button.svelte';
	import CharDisplay from '$lib/components/CharDisplay.svelte';
	import Disc from '$lib/components/Disc.svelte';
	import Label from '$lib/components/Label.svelte';
	import PlaceDisplay from '$lib/components/PlaceDisplay.svelte';
	import TextArea from '$lib/components/TextArea.svelte';
	import Title from '$lib/components/Title.svelte';
	import Warning from '$lib/components/Warning.svelte';
	import WorldDisplay from '$lib/components/WorldDisplay.svelte';
	import { m } from '$lib/paraglide/messages';
	import { simplePrompt } from '$lib/pollinations';
	import { generateCharacter, generateSetting } from '$lib/prompts';
	import { type Character, type Setting } from '$lib/utils';

	let world_short: string = $state('');
	let place_short: string = $state('');

	let setting_failed = $state(false);
	let setting: Setting | undefined = $state();

	let passed_setting = $state(false);

	let game_char: Character | undefined = $state();
	let game_char_failed = $state(false);
	let game_char_description = $state('');

	let passed_game_char = $state(false);

	let enemy_char: Character | undefined = $state();
	let enemy_char_failed = $state(false);
	let enemy_char_description = $state('');

	let passed_enemy_char = $state(false);
</script>

<Title name="RENA" />

<div class="flex w-full flex-col-reverse">
	<Disc
		class="border-blue-600 bg-blue-900"
		name={m.setting()}
		unlocked={passed_setting}
		closed={passed_setting}
	>
		<Label name={m.world()} />
		{#if !passed_setting}
			<TextArea bind:value={world_short} disabled={passed_setting} />
		{/if}

		{#if setting}
			<WorldDisplay {setting} />
		{/if}

		<Label name={m.place()} />
		{#if !passed_setting}
			<TextArea bind:value={place_short} disabled={passed_setting} />
		{/if}

		{#if setting}
			<PlaceDisplay {setting} />
		{/if}

		{#if !passed_setting}
			<Button
				onclick={async () => {
					try {
						setting_failed = false;
						setting = await generateSetting(world_short, place_short);
					} catch {
						setting_failed = true;
					}
				}}
				className="blue-button"
			>
				🎲 {m.generate()}
			</Button>

			{#if setting_failed}
				<Warning title={m.generation_error()} />
			{/if}

			{#if setting}
				<Button onclick={() => (passed_setting = true)} className="green-button">
					{m.confirm()}
				</Button>
			{/if}
		{/if}
	</Disc>

	{#if passed_setting}
		<Disc
			class="border-green-600 bg-green-900"
			name={m.game_char()}
			unlocked={passed_game_char}
			closed={passed_game_char}
		>
			{#if !passed_game_char}
				<Label name={m.description()} />
				<TextArea bind:value={game_char_description} />

				<Button
					onclick={async () => {
						try {
							game_char_failed = false;
							game_char = await generateCharacter(
								game_char_description,
								setting!.worldDescription,
								setting!.placeDescription
							);
						} catch {
							game_char_failed = true;
						}
					}}
					className="blue-button"
				>
					🎲 {m.generate()}
				</Button>

				{#if game_char_failed}
					<Warning title={m.generation_error()} />
				{/if}
			{/if}

			{#if game_char}
				<CharDisplay char={game_char} />
				{#if !passed_game_char}
					<Button onclick={() => (passed_game_char = true)} className="green-button">
						{m.confirm()}
					</Button>
				{/if}
			{/if}
		</Disc>

		{#if passed_game_char}
			<Disc
				class="border-red-600 bg-red-900"
				name={m.enemy_char()}
				unlocked={passed_enemy_char}
				closed={passed_enemy_char}
			>
				{#if !passed_enemy_char}
					<Label name={m.description()} />
					<TextArea bind:value={enemy_char_description} />

					<Button
						onclick={async () => {
							try {
								enemy_char_failed = false;
								enemy_char = await generateCharacter(
									enemy_char_description,
									setting!.worldDescription,
									setting!.placeDescription,
									game_char
								);
							} catch {
								enemy_char_failed = true;
							}
						}}
						className="blue-button"
					>
						🎲 {m.generate()}
					</Button>

					{#if enemy_char_failed}
						<Warning title={m.generation_error()} />
					{/if}
				{/if}

				{#if enemy_char}
					<CharDisplay char={enemy_char} />
					{#if !passed_enemy_char}
						<Button onclick={() => (passed_enemy_char = true)} className="green-button">
							{m.confirm()}
						</Button>
					{/if}
				{/if}
			</Disc>
		{/if}
	{/if}
</div>
