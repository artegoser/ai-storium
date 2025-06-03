<script lang="ts">
	export let onclick: () => any = () => {};
	export let className: string = '';
</script>

<button class="button {className}" {onclick}><slot /></button>
