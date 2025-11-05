<template>
    <img :alt="fishType" :src="imgSrc" />
</template>

<script>
import crab from '@/assets/img/crab.png';
import pufferfish from '@/assets/img/pufferfish.png';
import tuna from '@/assets/img/tuna.png';
import legend from '@/assets/img/legend.png';

const fishTypeToFishSrc = {
    'crab': crab,
    'pufferfish': pufferfish,
    'tuna': tuna,
    'legend': legend
};

export default {
    name: "BaseFishIcon",
    props: {
        fishType: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            crab,
            pufferfish,
            tuna,
            legend
        };
    },
    computed: {
        imgSrc() {
            return fishTypeToFishSrc[this.fishType];
        }
    }
};
</script>
