<template>
	<footer class="footer">
		<div class="footer__content">
			<template v-for="link in data.footer.link">
				<a href="#" class="footer__link" v-if="false">
					{{ link }}
				</a>
			</template>
		</div>
		<div class="footer__copyright">
			@ {{ currentDate.getFullYear() }} IEDN
		</div>
	</footer>
</template>

<script setup>
import data from "@/assets/helpers/data.ts";
const currentDate = new Date

</script>
