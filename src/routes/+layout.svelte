<script lang="ts">
	import '../app.css';

	let { children } = $props();
</script>

<div class="mx-auto flex w-full max-w-xl flex-col items-center justify-center gap-4 px-2 py-6">
	{@render children()}
</div>
