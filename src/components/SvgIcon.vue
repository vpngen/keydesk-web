<template>
  <svg :class="className" xmlns="http://www.w3.org/2000/svg">
    <use :xlink:href="iconPath" xmlns:xlink="http://www.w3.org/1999/xlink" />
  </svg>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  name: {
    type: String,
    required: true
  },

  // title: {
  //   type: String,
  //   default: null
  // }
})

const iconPath = computed(() => {
  let icon = require(`@/assets/images/sprites/svg/${props.name}.svg`);
  if (Object.prototype.hasOwnProperty.call(icon, 'default')) {
    icon = icon.default;
  }

  return icon.url;
});

const className = computed(() => {
  return 'svg-icon svg-icon--' + props.name;
})

// export default {
//   name: 'svg-icon',

//   props: {
//     name: {
//       type: String,
//       required: true
//     },

//     // title: {
//     //   type: String,
//     //   default: null
//     // }
//   },

//   computed: {
//     iconPath() {
//       let icon = require(`@/assets/images/sprites/svg/${this.name}.svg`);
//       if (Object.prototype.hasOwnProperty.call(icon, 'default')) {
//         icon = icon.default;
//       }

//       return icon.url;
//     },

//     className() {
//       return 'svg-icon svg-icon--' + this.name;
//     }
//   }
// };
</script>
