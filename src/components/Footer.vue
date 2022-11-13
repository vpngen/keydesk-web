<template lang="pug">
include ../assets/pug/base
include ../assets/pug/data
+b.FOOTER.footer
	+e.content
		each link in data.footer.link
			+e.A.link(href="#")
				!=link

	+e.copyright
		!=data.footer.copyright

    
</template>
        
<script setup>

</script>
          