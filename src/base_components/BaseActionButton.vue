<template>
    <img
        id="actionButton"
        :src="imgSrc"
        alt="actionButton"
        ref="actionButton"
        @mousedown="mouseDown"
        @mouseup="mouseUp"
    />
</template>

<script>
import buttonCast from '@/assets/img/button_cast.png';
import buttonStart from '@/assets/img/button_start.png';
import buttonPull from '@/assets/img/button_pull.png';
import buttonRetry from '@/assets/img/button_retry.png';
import { SCALE_FACTOR } from '@/../public/globals';

const textToImg = {
    "cast": buttonCast,
    "start": buttonStart,
    "pull": buttonPull,
    "retry": buttonRetry
};

export default {
    name: "BaseActionButton",
    emits: ["pressed", "released"],
    props: {
        text: {
            type: String,
            required: true
        },
        disabled: {
            type: Boolean,
            required: true
        }
    },
    data() {
        return {
            SCALE_FACTOR
        };
    },
    methods: {
        mouseDown() {
            if (!this.disabled) {
                this.$emit('pressed');
            }
        },
        mouseUp() {
            if (!this.disabled) {
                this.$emit('released');
            }
        }
    },
    computed: {
        imgSrc() {
            if (this.text in textToImg) {
                return textToImg[this.text];
            }
            return '';
        },
        buttonFilter() {
            return this.disabled ? 'brightness(0.5)' : 'none';
        },
        buttonHoverFilter() {
            return this.disabled ? 'none' : 'brightness(1.3)';
        }
    }
};
</script>

<style scoped>
#actionButton {
    position: absolute;
    top: 646px;
    left: 855px;
    image-rendering: pixelated;
    transform: scale(v-bind(SCALE_FACTOR));
    filter: v-bind(buttonFilter);
}

#actionButton:hover {
    filter: v-bind(buttonHoverFilter);
}

#actionButton:active {
    transform: scale(v-bind(SCALE_FACTOR)) translate(1px, 1px);
}
</style>
