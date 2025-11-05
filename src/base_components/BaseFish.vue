<template>
    <img id="fish" :src="fishSrc" alt="fish" :style="innerStyle" ref="fish" />
</template>

<script>
import fish from '@/assets/img/fish.png';
import fishLegend from '@/assets/img/fish_legend.png';
import {
    FISH_MAX_POS,
    FISH_PADDING_TOP,
    SCALE_FACTOR,
    computeFishCurrentPosition
} from '@/../public/globals';

export default {
    name: "BaseFish",
    props: {
        direction: {
            type: String,
            default: null
        },
        lastSwapPosition: {
            type: Number,
            default: null
        },
        lastSwapAt: {
            type: Number,
            default: null
        },
        speed: {
            type: Number,
            required: true
        },
        isLegend: {
            type: Boolean,
            required: true
        }
    },
    data() {
        return {
            fish,
            fishLegend,
            SCALE_FACTOR,
            isAnimated: false,
            top: null,
            correctedLastSwapPosition: null
        };
    },
    methods: {
        getCurrentFishTop() {
            const top = parseInt(computeFishCurrentPosition(this.direction, this.lastSwapAt, this.lastSwapPosition, this.speed));
            return top;
        },
        finalTop() {
            const result = (FISH_MAX_POS - this.top + FISH_PADDING_TOP) * SCALE_FACTOR;
            return result;
        },
        recursivelyCheckTop(expectedValue, ticks=0) {
            const expectedValueStr = `${expectedValue}px`;
            const computedStyle = window.getComputedStyle(this.$refs.fish);
            if (expectedValueStr !== computedStyle.top) {
                this.$nextTick(_ => this.recursivelyCheckTop(expectedValue, ticks + 1));
            } else {
                this.isAnimated = true;
                this.top = this.direction === "up" ? FISH_MAX_POS : 0;
            }
        }
    },
    computed: {
        animationDuration() {
            if (!this.isAnimated || this.correctedLastSwapPosition === this.top) {
                return 0;
            }
            const limit = this.direction === "up" ? FISH_MAX_POS : 0;
            const durationNumber = Math.max(Math.abs((limit - this.correctedLastSwapPosition)) / this.speed, 0);
            const durationInt = parseInt(durationNumber);
            return durationInt;
        },
        innerStyle() {
            if (this.top === null) {
                return '';
            }
            const top = this.finalTop();
            const animationDuration = this.animationDuration;
            const transition = animationDuration ? `top ${animationDuration}ms linear` : 'none';
            const result = `top: ${top}px; transition: ${transition};`;
            return result;
        },
        fishSrc() {
            return this.isLegend ? fishLegend : fish;
        }
    },
    watch: {
        lastSwapAt(newValue) {
            if (newValue) {
                this.correctedLastSwapPosition = this.getCurrentFishTop();
                this.top = this.correctedLastSwapPosition;
                this.isAnimated = false;
                this.recursivelyCheckTop(this.finalTop());
            }
        }
    }
};
</script>

<style scoped>
#fish {
    position: absolute;
    width: calc(19px * v-bind(SCALE_FACTOR) / 2);
    height: calc(19px * v-bind(SCALE_FACTOR) / 2);
    left: calc(21px * v-bind(SCALE_FACTOR));
}
</style>
