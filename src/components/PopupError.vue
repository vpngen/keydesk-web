<template lang="pug">
include ../assets/pug/base
+b.popup
  +e.overlay.error
  +e.alert.error
    +e.icon-sad-error
    +e.title.error
      | Похоже что-то пошло не так
    +e.text.error
      | Попробуй обновить страницу и повторить то, что ты делаешь.
    +e.text.error
      span
        | А если все равно не получится - свяжись с нами тут:
      span
        a.popup__error-link(href="https://t.me/vpngensupportbot" target="_blank")
          |  VPN Generator Support
      span
        |  и расскажи подробно что произошло. Мы поможем:)
</template>