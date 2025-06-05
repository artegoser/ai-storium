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
	import { generateCharacters, generateSetting } from '$lib/prompts';
	import { type Character, type Setting } from '$lib/types';

	let world_short: string = $state('');
	let place_short: string = $state('');

	let setting_failed = $state(false);
	let setting: Setting | undefined = $state();

	let passed_setting = $state(false);

	let chars_failed = $state(false);

	let game_char_description = $state('');
	let enemy_char_description = $state('');

	let game_char: Character | undefined = $state();
	let enemy_char: Character | undefined = $state();

	let passed_chars = $state(false);
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
					setting = undefined;
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
			name={m.characters()}
			unlocked={passed_chars}
			closed={passed_chars}
		>
			<Label name={m.game_char_description()} />

			{#if !passed_chars}
				<TextArea bind:value={game_char_description} />
			{/if}

			{#if game_char}
				<CharDisplay char={game_char} />
			{/if}

			<Label name={m.enemy_char_description()} />

			{#if !passed_chars}
				<TextArea bind:value={enemy_char_description} />

				{#if enemy_char}
					<CharDisplay char={enemy_char} />
				{/if}

				<Button
					onclick={async () => {
						game_char = undefined;
						enemy_char = undefined;
						try {
							chars_failed = false;
							const chars = await generateCharacters(
								game_char_description,
								enemy_char_description,
								setting!
							);

							game_char = chars.gameCharacter;
							enemy_char = chars.enemyCharacter;
						} catch {
							chars_failed = true;
						}
					}}
					className="blue-button"
				>
					🎲 {m.generate()}
				</Button>

				{#if chars_failed}
					<Warning title={m.generation_error()} />
				{/if}

				{#if game_char && enemy_char}
					<Button onclick={() => (passed_chars = true)} className="green-button">
						{m.confirm()}
					</Button>
				{/if}
			{/if}
		</Disc>
	{/if}
</div>
