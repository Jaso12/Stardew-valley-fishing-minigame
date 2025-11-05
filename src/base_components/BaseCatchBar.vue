<template>
    <img id="catchBar" :src="catchBar" alt="catchBar" :style="innerStyle" ref="catchBar" />
</template>

<script>
import catchBar from '@/assets/img/catch_bar.png';
import {
    CATCH_BAR_INITIAL_POSITION,
    CATCH_BAR_MAX_POS,
    CATCH_BAR_SPEED,
    SCALE_FACTOR,
    computeCatchBarCurrentPosition,
    calculateAnimationDuration
} from '@/../public/globals';

const CATCH_BAR_PADDING_TOP = 7;

export default {
    name: "BaseCatchBar",
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
        }
    },
    data() {
        return {
            catchBar,
            SCALE_FACTOR,
            isAnimated: false,
            top: CATCH_BAR_INITIAL_POSITION,
            correctedLastSwapPosition: null
        };
    },
    methods: {
        finalTop() {
            return (CATCH_BAR_MAX_POS - this.top + CATCH_BAR_PADDING_TOP) * SCALE_FACTOR;
        },
        recursivelyCheckTop(expectedValue, ticks=0) {
            const expectedValueStr = `${expectedValue}px`;
            const computedStyle = window.getComputedStyle(this.$refs.catchBar);
            if (expectedValueStr !== computedStyle.top) {
                this.$nextTick(_ => this.recursivelyCheckTop(expectedValue, ticks + 1));
            } else {
                this.isAnimated = true;
                this.top = this.direction === "up" ? CATCH_BAR_MAX_POS : 0;
            }
        }
    },
    computed: {
        innerStyle() {
            const top = this.finalTop();
            const animationDuration = this.animationDuration;
            const transition = animationDuration ? `top ${animationDuration}ms linear` : 'none';
            return `top: ${top}px; transition: ${transition};`;
        },
        animationDuration() {
            if (!this.isAnimated || this.correctedLastSwapPosition === this.top) {
                return 0;
            }
            const limit = this.direction === "up" ? CATCH_BAR_MAX_POS : 0.0;
            return calculateAnimationDuration(this.correctedLastSwapPosition, limit, CATCH_BAR_SPEED);
        }
    },
    watch: {
        lastSwapAt(newValue) {
            if (newValue) {
                this.correctedLastSwapPosition = parseInt(computeCatchBarCurrentPosition(this.direction, this.lastSwapAt, this.lastSwapPosition));
                this.top = this.correctedLastSwapPosition;
                this.isAnimated = false;
                this.recursivelyCheckTop(this.finalTop());
            }
        }
    }
};
</script>

<style scoped>
#catchBar {
    position: absolute;
    width: calc(9px * v-bind(SCALE_FACTOR));
    height: calc(36px * v-bind(SCALE_FACTOR));
    left: calc(21px * v-bind(SCALE_FACTOR));
}
</style>
