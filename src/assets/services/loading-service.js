import { reactive, readonly } from 'vue';

const state = reactive({
    isLoading: false,
});

export default {
    state: readonly(state),
    show() {
        state.isLoading = true;
    },
    hide() {
        state.isLoading = false;
    },
};
