<template>
    <img :src="imgSrc" alt="player" id="player" />
</template>

<script>
import catching from '@/assets/img/catching.png';
import standing from '@/assets/img/standing.png';
import showingCrab from '@/assets/img/showing_crab.png';
import showingPufferfish from '@/assets/img/showing_pufferfish.png';
import showingTuna from '@/assets/img/showing_tuna.png';
import showingLegend from '@/assets/img/showing_legend.png';
import throwingHook from '@/assets/img/throwing_hook.webp';
import retrievingHook from '@/assets/img/retrieving_hook.webp';
import retrievingCrab from '@/assets/img/retrieving_crab.webp';
import retrievingPufferfish from '@/assets/img/retrieving_pufferfish.webp';
import retrievingTuna from '@/assets/img/retrieving_tuna.webp';
import retrievingLegend from '@/assets/img/retrieving_legend.webp';
import { SCALE_FACTOR } from '@/../public/globals';

const FISH_TYPE_TO_RETRIEVING_IMG_SRC = {
    'crab': retrievingCrab,
    'pufferfish': retrievingPufferfish,
    'tuna': retrievingTuna,
    'legend': retrievingLegend
};

const FISH_TYPE_TO_SHOWING_IMG_SRC = {
    'crab': showingCrab,
    'pufferfish': showingPufferfish,
    'tuna': showingTuna,
    'legend': showingLegend
};

export default {
    name: "Player",
    emits: ["animationFinished", "showingCaughtFish"],
    props: {
        state: {
            type: String,
            required: true
        },
        capturedFish: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            SCALE_FACTOR,
            imgSrc: standing,
            animationFinishedTimeout: null
        };
    },
    methods: {
        async updateAnimation() {
            let animation = throwingHook;
            if (this.state === "reeling_in") {
                animation = this.capturedFish in FISH_TYPE_TO_RETRIEVING_IMG_SRC ? FISH_TYPE_TO_RETRIEVING_IMG_SRC[this.capturedFish] : retrievingHook;
            }
            const response = await fetch(animation);
            const blob = await response.blob();
            this.imgSrc = URL.createObjectURL(blob);
            if (this.animationFinishedTimeout) {
                clearTimeout(this.animationFinishedTimeout);
            }

            this.animationFinishedTimeout = setTimeout(_ => {

                if (this.state === "reeling_in")
                {
                    if (this.capturedFish in FISH_TYPE_TO_SHOWING_IMG_SRC)
                    {
                        this.imgSrc = FISH_TYPE_TO_SHOWING_IMG_SRC[this.capturedFish];
                        this.$emit("showingCaughtFish");
                    }
                    else
                    {
                        this.imgSrc = standing;
                    }
                }
                this.$emit("animationFinished");
                this.animationFinishedTimeout = null;
            }, 35 * 12);
        }
    },
    watch: {
        state(newValue) {
            if (["casting", "reeling_in"].includes(newValue)) {
                this.updateAnimation();
            } else if (newValue === "playing") {
                this.imgSrc = catching;
            }
        },
        capturedFish(newValue) {
            // This is to reset player sprite when RETRY button is pressed
            if (this.state === "reeling_in" && newValue === "") {
                this.imgSrc = standing;
            }
        }
    }
};
</script>

<style scoped>
#player {
    position: absolute;
    top: 400px;
    left: 788px;
    image-rendering: pixelated;
}
</style>
