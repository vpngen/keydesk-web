<template lang="pug">
include ../assets/pug/base
include ../assets/pug/data
+b.FOOTER.footer
	+e.content
		each link in data.footer.link
			+e.A.link(href="#")(v-if="false")
				!=link

	+e.copyright
		| `&copy;&nbsp;{{ currentDate.getFullYear() }}&nbsp;IEDN`

    
</template>
        
<script setup>

const currentDate = new Date

</script>
          