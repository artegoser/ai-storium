<script lang="ts">
	import { state } from '$lib/state.svelte';
	import { slide } from 'svelte/transition';

	export let onclick: () => any = () => {};
	export let className: string = '';
	export let disabled = false;
</script>

<button
	class="button {state.generating ? ' animate-pulse ' : ''}{className}"
	disabled={state.generating || disabled}
	{onclick}><slot /></button
>
