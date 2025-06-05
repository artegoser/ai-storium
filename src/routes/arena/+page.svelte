<script lang="ts">
	import AiAudio from '$lib/components/AiAudio.svelte';
	import AiImage from '$lib/components/AiImage.svelte';
	import Button from '$lib/components/Button.svelte';
	import CharDisplay from '$lib/components/CharDisplay.svelte';
	import Disc from '$lib/components/Disc.svelte';
	import Label from '$lib/components/Label.svelte';
	import OnlySplit from '$lib/components/OnlySplit.svelte';
	import PlaceDisplay from '$lib/components/PlaceDisplay.svelte';
	import SmallCharDisplay from '$lib/components/SmallCharDisplay.svelte';
	import Split from '$lib/components/Split.svelte';
	import TextArea from '$lib/components/TextArea.svelte';
	import Title from '$lib/components/Title.svelte';
	import Warning from '$lib/components/Warning.svelte';
	import WorldDisplay from '$lib/components/WorldDisplay.svelte';
	import { m } from '$lib/paraglide/messages';
	import {
		generateCharacters,
		generateEvent,
		generateSetting,
		getCharactersNarration,
		getEventNarration,
		getSettingNarration
	} from '$lib/prompts';
	import { type Character, type Event, type Setting } from '$lib/types';

	let world_short: string = $state('');
	let place_short: string = $state('');

	let setting_failed = $state(false);
	let setting: Setting | undefined = $state();

	let passed_setting = $state(false);

	let chars_failed = $state(false);

	let game_char_description = $state('');
	let enemy_char_description = $state('');

	let gameCharacter: Character | undefined = $state();
	let enemyCharacter: Character | undefined = $state();

	let passed_chars = $state(false);

	let events: Event[] = $state([]);
	let currentEvent: Event | undefined = $state();
	let game_char_action: string = $state('');
	let currentEventFailed = $state(false);
</script>

<Title name="RENA" />

<div class="flex w-full flex-col-reverse">
	<Disc class="border-blue-600 bg-blue-900" name={m.setting()} unlocked={passed_setting}>
		{#if setting}
			<AiAudio prompt={getSettingNarration(setting)} autoplay={!passed_setting} />
		{/if}

		<div class="grid grid-cols-2 gap-2 max-sm:grid-cols-1">
			<div class="flex flex-col gap-2">
				<Label name={m.world()} />
				{#if !passed_setting}
					<TextArea bind:value={world_short} disabled={passed_setting} />
				{/if}

				{#if setting}
					<WorldDisplay {setting} />
				{/if}
			</div>
			<div class="flex flex-col gap-2">
				<Label name={m.place()} />
				{#if !passed_setting}
					<TextArea bind:value={place_short} disabled={passed_setting} />
				{/if}

				{#if setting}
					<PlaceDisplay {setting} />
				{/if}
			</div>
		</div>

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
		<Disc class="border-green-600 bg-green-900" name={m.characters()} unlocked={passed_chars}>
			{#if enemyCharacter && gameCharacter}
				<AiAudio
					prompt={getCharactersNarration({ setting, gameCharacter, enemyCharacter })}
					autoplay={!passed_chars}
				/>
			{/if}

			<Split>
				<div class="flex flex-col gap-2">
					<Label name={m.game_char_description()} />

					{#if !passed_chars}
						<TextArea bind:value={game_char_description} />
					{/if}

					{#if gameCharacter}
						<CharDisplay char={gameCharacter} />
					{/if}
				</div>

				<div class="flex flex-col gap-2">
					<Label name={m.enemy_char_description()} />

					{#if !passed_chars}
						<TextArea bind:value={enemy_char_description} />
					{/if}

					{#if enemyCharacter}
						<CharDisplay char={enemyCharacter} />
					{/if}
				</div>
			</Split>

			{#if !passed_chars}
				<Button
					onclick={async () => {
						gameCharacter = undefined;
						enemyCharacter = undefined;
						try {
							chars_failed = false;
							const chars = await generateCharacters(
								game_char_description,
								enemy_char_description,
								setting!
							);

							gameCharacter = chars.gameCharacter;
							enemyCharacter = chars.enemyCharacter;
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

				{#if gameCharacter && enemyCharacter}
					<Button onclick={() => (passed_chars = true)} className="green-button">
						{m.confirm()}
					</Button>
				{/if}
			{/if}
		</Disc>
	{/if}

	{#each events as event, i}
		<Disc name="{m.round()} {i}" unlocked>
			<AiAudio
				prompt={getEventNarration({
					setting,
					gameCharacter,
					enemyCharacter,
					events: events.slice(0, i + 1)
				})}
			/>

			<OnlySplit>
				<SmallCharDisplay char={gameCharacter!} hp={event.gameCharacterHp} />
				<SmallCharDisplay char={enemyCharacter!} hp={event.enemyCharacterHp} />
			</OnlySplit>

			<AiImage prompt={event.visualPrompt} className="w-full" />
			<div>
				{event.description}
			</div>
		</Disc>
	{/each}

	{#if passed_chars}
		<Disc name={m.new_round()}>
			<Label name={m.game_char_action()} />
			<TextArea bind:value={game_char_description} />

			<Button
				onclick={async () => {
					currentEvent = undefined;
					try {
						currentEventFailed = false;
						const event = await generateEvent(
							game_char_action,
							events,
							gameCharacter!,
							enemyCharacter!,
							setting!
						);

						currentEvent = event;
					} catch {
						currentEventFailed = true;
					}
				}}
				className="blue-button"
			>
				🎲 {m.generate()}
			</Button>

			{#if currentEventFailed}
				<Warning title={m.generation_error()} />
			{/if}

			{#if currentEvent}
				<OnlySplit>
					<SmallCharDisplay char={gameCharacter!} hp={currentEvent.gameCharacterHp} />
					<SmallCharDisplay char={enemyCharacter!} hp={currentEvent.enemyCharacterHp} />
				</OnlySplit>

				<AiImage prompt={currentEvent.visualPrompt} className="w-full" />
				<div>
					{currentEvent.description}
				</div>

				<Button
					onclick={() => {
						events.push(currentEvent!);
						currentEvent = undefined;
					}}
					className="green-button"
				>
					{m.confirm()}
				</Button>
			{/if}
		</Disc>
	{/if}
</div>
