<template>
    <div id="progressBar" :style="innerStyle" ref="progressBar" />
</template>

<script>
import {
    SCALE_FACTOR,
    PROGRESS_BAR_SPEED,
    PROGRESS_BAR_MAX_POS,
    PROGRESS_BAR_INITIAL_POSITION,
    computeProgressBarCurrentPosition,
    calculateAnimationDuration
} from '@/../public/globals';

const PROGRESS_BAR_PADDING_TOP = 6;
const PROGRESS_BAR_MIN_COLOR = [255, 0, 0];
const PROGRESS_BAR_MID_COLOR = [255, 255, 0];
const PROGRESS_BAR_MAX_COLOR = [0, 255, 0];
const MAX_ANIMATION_DURATION = calculateAnimationDuration(0, PROGRESS_BAR_MAX_POS, PROGRESS_BAR_SPEED);

export default {
    name: "BaseProgressBar",
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
            SCALE_FACTOR,
            height: PROGRESS_BAR_INITIAL_POSITION,
            isAnimated: false,
            correctedLastSwapPosition: null
        };
    },
    methods: {
        finalHeight() {
            return this.height * SCALE_FACTOR;
        },
        recursivelyCheckHeight(expectedValue, ticks=0) {
            const expectedValueStr = `${expectedValue}px`;
            const computedStyle = window.getComputedStyle(this.$refs.progressBar);
            if (expectedValueStr !== computedStyle.height) {
                this.$nextTick(_ => this.recursivelyCheckHeight(expectedValue, ticks + 1));
            } else {
                this.isAnimated = true;
                this.height = this.direction === "up" ? PROGRESS_BAR_MAX_POS : 0.0;
            }
        }
    },
    computed: {
        innerStyle() {
            const top = (PROGRESS_BAR_MAX_POS + PROGRESS_BAR_PADDING_TOP - this.height) * SCALE_FACTOR;
            const height = this.finalHeight();
            const animationDuration = this.animationDuration;
            const backgroundColor = this.backgroundColor;
            const transition = animationDuration ? `top ${animationDuration}ms linear, height ${animationDuration}ms linear` : 'none';
            const keyframes = this.direction === "up" ? 'backgroundColorRedToGreen' : 'backgroundColorGreenToRed';
            const animation = animationDuration ? `animation: ${keyframes} ${animationDuration}ms linear forwards;` : '';
            const perc = animationDuration / MAX_ANIMATION_DURATION;
            const delay = perc * (MAX_ANIMATION_DURATION - animationDuration);
            const animationDelay = animationDuration ? `animation-delay: -${delay}ms;` : '';
            return `top: ${top}px; height: ${height}px; background-color: ${backgroundColor}; transition: ${transition}; ${animation} ${animationDelay}`;
        },
        backgroundColor() {
            let mid = PROGRESS_BAR_MAX_POS / 2;
            let t;
            let startColor, endColor;
            if (this.height <= mid) {
                t = this.height / mid;
                startColor = PROGRESS_BAR_MIN_COLOR;
                endColor = PROGRESS_BAR_MID_COLOR;
            } else {
                t = (this.height - mid) / (PROGRESS_BAR_MAX_POS - mid);
                startColor = PROGRESS_BAR_MID_COLOR;
                endColor = PROGRESS_BAR_MAX_COLOR;
            }
            let r = Math.round(startColor[0] + t * (endColor[0] - startColor[0]));
            let g = Math.round(startColor[1] + t * (endColor[1] - startColor[1]));
            let b = Math.round(startColor[2] + t * (endColor[2] - startColor[2]));
            const backgroundColorStr = `rgb(${r},${g},${b})`;
            return backgroundColorStr;
        },
        animationDuration() {
            if (!this.isAnimated || this.correctedLastSwapPosition === this.height) {
                return 0;
            }
            const limit = this.direction === "up" ? PROGRESS_BAR_MAX_POS : 0.0;
            return calculateAnimationDuration(this.correctedLastSwapPosition, limit, PROGRESS_BAR_SPEED);
        }
    },
    watch: {
        lastSwapAt(newValue) {
            if (newValue) {
                this.correctedLastSwapPosition = parseInt(computeProgressBarCurrentPosition(this.direction, this.lastSwapAt, this.lastSwapPosition));
                this.height = this.correctedLastSwapPosition;
                this.isAnimated = false;
                this.recursivelyCheckHeight(this.finalHeight());
            }
        }
    }
};
</script>

<style>
@keyframes backgroundColorRedToGreen {
    0% {
        background-color: rgb(255, 0, 0);
    }
    50% {
        background-color: rgb(255, 255, 0);
    }
    100% {
        background-color: rgb(0, 255, 0);
    }
}

@keyframes backgroundColorGreenToRed {
    0% {
        background-color: rgb(0, 255, 0);
    }
    50% {
        background-color: rgb(255, 255, 0);
    }
    100% {
        background-color: rgb(255, 0, 0);
    }
}
</style>

<style scoped>
#progressBar {
    position: absolute;
    width: calc(4px * v-bind(SCALE_FACTOR));
    left: calc(36px * v-bind(SCALE_FACTOR));
}
</style>
