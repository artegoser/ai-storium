<script lang="ts">
	export let href: string;
	export let className: string = '';
</script>

<a class="button {className}" {href}><slot /></a>
