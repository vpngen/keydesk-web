import { onMounted, onUnmounted } from 'vue';

export default function useClickOutside(ref, callback) {
    const handleClick = e => {
        if (ref.value && !ref.value.contains(e.target)) {
            callback();
        }
    }

    onMounted(() => {
        document.addEventListener('click', handleClick);
    });

    onUnmounted(() => {
        document.removeEventListener('click', handleClick);
    });
}
