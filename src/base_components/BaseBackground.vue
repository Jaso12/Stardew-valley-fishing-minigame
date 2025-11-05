<template>
    <img :src="dockSeaFloor" alt="dockSeaFloor" class="scaled-image overlay-image" />
    <img :src="dockWaves" alt="dockWaves" class="scaled-image overlay-image" />
    <img :src="dockUpperLayer" alt="dockUpperLayer" class="scaled-image overlay-image" />
</template>

<script>
import dockSeaFloor from '@/assets/img/dock_seafloor.png';
import dockWaves from '@/assets/img/dock_waves.webp';
import dockUpperLayer from '@/assets/img/dock_upperlayer.png';
import { SCALE_FACTOR } from '../../public/globals';

export default {
    name: 'BaseBackground',
    data() {
        return {
            SCALE_FACTOR,
            dockSeaFloor,
            dockWaves,
            dockUpperLayer
        };
    },
};
</script>

<style scoped>
.overlay-image {
  position: absolute;
  top: 0;
  left: 0;
}
.scaled-image {
  transform: scale(v-bind(SCALE_FACTOR));
  top: 0;
  left: 0;
  transform-origin: top left;
  object-fit: contain;
  image-rendering: pixelated;
}
</style>
