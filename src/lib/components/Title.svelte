<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import ChangeLang from './ChangeLang.svelte';

	export let name: string;
</script>

<h1 class="flex items-center gap-2 text-5xl font-bold">
	<div>
		<span class="text-blue-600">AI</span>{name}
	</div>
	<ChangeLang />
</h1>
<div>
	{m.created_by()}
	<a href="https://artegoser.ru" class="text-red-600 underline hover:no-underline">artegoser</a>
</div>
