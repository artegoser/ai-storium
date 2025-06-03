<script lang="ts">
	import '../app.css';

	let { children } = $props();
</script>

<div class="mx-auto flex max-w-lg flex-col items-center gap-4 py-6">
	{@render children()}
</div>
