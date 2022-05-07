<template>
    <div class="text-red">Hello World {{ message }}</div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    setup() {
        const message = 123;
        return {
            message,
        };
    },
});
</script>
<style lang="scss">
$red: red;
.text-red {
    color: $red;
}
</style>
