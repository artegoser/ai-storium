<script lang="ts">
	import { state } from '$lib/state.svelte';
	import { slide } from 'svelte/transition';

	export let value: string = '';
	export let disabled: boolean = false;
	export let className: string = '';

	let inputElement: HTMLTextAreaElement;

	function handleKeydown(event: any) {
		const openingChars = { '(': ')', '{': '}', '[': ']', '"': '"', "'": "'" };
		const key = event.key;

		const start = inputElement.selectionStart;
		const end = inputElement.selectionEnd;

		//@ts-expect-error go fuck yourself
		if (openingChars[key]) {
			event.preventDefault();
			//@ts-expect-error go fuck yourself
			const closingChar = openingChars[key];

			const hasSelection = start !== end;

			let newValue;
			let newCursorPos;

			if (hasSelection) {
				// Wrap selection with brackets
				const selectedText = inputElement.value.substring(start!, end!);
				newValue =
					inputElement.value.slice(0, start!) +
					key +
					selectedText +
					closingChar +
					inputElement.value.slice(end!);
				newCursorPos = start! + selectedText.length + 2;

				// Update input value and cursor position
				inputElement.value = newValue;
				inputElement.setSelectionRange(start, newCursorPos);
			} else {
				// Insert both brackets and position cursor in between
				newValue =
					inputElement.value.slice(0, start!) +
					key +
					closingChar +
					inputElement.value.slice(start!);
				newCursorPos = start! + 1;

				// Update input value and cursor position
				inputElement.value = newValue;
				inputElement.setSelectionRange(start! + 1, newCursorPos);
			}

			// Update Svelte binding
			value = newValue;
		}
	}
</script>

<textarea
	bind:this={inputElement}
	class="interactive h-40 w-full {state.generating ? ' animate-pulse ' : ''}{className}"
	bind:value
	readonly={state.generating || disabled}
	onkeydown={handleKeydown}
	transition:slide
></textarea>
