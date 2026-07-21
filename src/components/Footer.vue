<template>
	<footer class="footer">
		<div class="footer__content">
			<!-- links hidden by design (placeholder) -->
		</div>
		<div class="footer__copyright">
			@ {{ currentDate.getFullYear() }} IEDN
		</div>
	</footer>
</template>

<script setup>
const currentDate = new Date();

</script>
