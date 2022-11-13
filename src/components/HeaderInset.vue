<template lang="pug">
include ../assets/pug/base
include ../assets/pug/data
+b.HEADER.header--inset
	+e.container
		+e.logo
			SvgIcon(name="logo-vpn")
		+e.content
			+e.NAV.nav
				each link in data.headerInset.link
					+e.A.link(href=link.href)
						!=link.text
			+e.language
				+e.BUTTON.lang(type="button")
					SvgIcon(name="lang-de")
			+e.BUTTON.burger(type="button")
				+e.SPAN
				+e.SPAN
				+e.SPAN

    
</template>
      
<script setup>
import SvgIcon from './SvgIcon.vue';

</script>
      