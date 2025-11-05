<template>
    <img
        id="fishBitIndicator"
        :src="imgSrc"
        alt="fishBitIndicator"
        ref="fishBitIndicator"
        :style="inlineStyle"
    />
</template>

<script>
import smallExclamation from '@/assets/img/small_exclamation.png';
import { SCALE_FACTOR } from '@/../public/globals';

export default {
    name: "BaseYellowIndicator",
    props: {
        showTrigger: {
            type: Number,
            required: true
        }
    },
    data() {
        return {
            SCALE_FACTOR,
            imgSrc: smallExclamation,
            inlineStyle: 'opacity: 0;'
        };
    },
    methods: {
        recursivelyCheckOpacity(ticks=0) {
            const computedStyle = window.getComputedStyle(this.$refs.fishBitIndicator);
            if ('1' !== computedStyle.opacity) {
                this.$nextTick(_ => this.recursivelyCheckOpacity(ticks + 1));
            } else {
                this.inlineStyle = `transform: translateY(-20px) scale(${SCALE_FACTOR}); opacity: 0; transition: transform 1s, opacity 1s;`;
            }
        }
    },
    watch: {
        showTrigger() {
            this.inlineStyle = `transform: scale(${SCALE_FACTOR}); opacity: 1;`;
            this.recursivelyCheckOpacity();
        }
    }
};
</script>

<style scoped>
#fishBitIndicator {
    position: absolute;
    top: 430px;
    left: 870px;
    image-rendering: pixelated;
    transform: scale(v-bind(SCALE_FACTOR));
}
</style>
