<script lang="ts">
	export let onclick: () => any = () => {};
	export let className: string = '';
	export let disabled = false;
	export let generating = false;
</script>

<button
	class="button {generating ? ' animate-pulse ' : ''}{className}"
	disabled={generating || disabled}
	{onclick}><slot /></button
>
