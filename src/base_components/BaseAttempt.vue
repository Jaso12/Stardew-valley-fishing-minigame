<template>
    <BaseFishIcon
        v-if="successful"
        class="resultIcon"
        :fishType="fishType"
    />
    <img
        v-else
        class="resultIcon"
        :src="redCross"
    />
</template>

<script>
import BaseFishIcon from './BaseFishIcon.vue';
import redCross from '@/assets/img/red_cross.png';
import { DIFFICULTY_TO_FISH_TYPE } from '@/../public/globals.js';

export default {
    name: "BaseAttempt",
    components: {
        BaseFishIcon
    },
    props: {
        successful: {
            type: Boolean,
            required: true
        },
        difficulty: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            redCross
        };
    },
    computed: {
        fishType() {
            return DIFFICULTY_TO_FISH_TYPE[this.difficulty];
        }
    }
};
</script>

<style scoped>
.resultIcon {
    vertical-align: top;
}
</style>
