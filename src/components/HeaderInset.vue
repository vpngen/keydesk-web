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
				+e.BUTTON.lang(type="button", @click="openLangMenu")
					SvgIcon(name="lang-de")
				+e.lang-menu(:class="showLangMenu ? 'active' : ''")
					for item in data.headerInset.langList
						+e.A.lang-item(href=item.href)
							+e.lang-img
								SvgIcon(name=`lang-${item.img}`)
							+e.lang-name
								!=item.lang
			+e.BUTTON.burger(type="button")
				+e.SPAN
				+e.SPAN
				+e.SPAN


</template>

<script setup>
import SvgIcon from './SvgIcon.vue';
import { onMounted, ref } from 'vue'

const showLangMenu = ref(false)

const openLangMenu = () => {
	showLangMenu.value = !showLangMenu.value
}

onMounted(() => {
	const langMenu = document.querySelector('.header__lang-menu');

	document.querySelector('body').addEventListener('click', (e) => {
		if (!e.target.closest('.header__lang-menu') && !e.target.closest('.header__lang')) {
			langMenu.classList.remove('active');

			if(showLangMenu.value) {
				showLangMenu.value = !showLangMenu.value
			}
		}
	});
})

</script>
