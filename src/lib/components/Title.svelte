<script lang="ts">
	import { m } from '$lib/paraglide/messages';

	export let name: string;
</script>

<h1 class="text-5xl font-bold"><span class="text-blue-600">AI</span>{name}</h1>
<div>
	{m.created_by()}
	<a href="https://artegoser.ru" class="text-red-600 underline hover:no-underline">artegoser</a>
</div>
