<template>
    <div class="letterWrapper">
        <img v-if="character?.length > 0" :src="smallFontImage" :alt="letterAlt" />
    </div>
</template>

<script>
import smallFontImage from '@/assets/img/SmallFont.png';

export default {
    name: "BaseLetter",
    props: {
        character: {
            type: String,
            required: true
        },
        x: {
            type: Number,
            required: true
        },
        y: {
            type: Number,
            required: true
        },
        width: {
            type: Number,
            required: true
        },
        height: {
            type: Number,
            required: true
        },
        verticalOffset: {
            type: Number,
            required: true
        }
    },
    data() {
        return {
            smallFontImage
        };
    },
    computed: {
        letterAlt() {
            return this.character && this.character.length > 0 ? `letter_${this.character}` : '';
        },
        width_Px() {
            return `${this.width}px`;
        },
        height_Px() {
            return `${this.height + this.verticalOffset}px`;
        },
        positionX_Px() {
            return `-${this.x}px`;
        },
        positionY_Px() {
            return `-${this.y}px`;
        },
        objectPosition() {
            return `${this.positionX_Px} ${this.positionY_Px}`;
        },
        transform() {
            return `translateY(${this.verticalOffset}px)`;
        }
    }
};
</script>

<style>
.letterWrapper {
    width: v-bind(width_Px);
    height: v-bind(height_Px);
    overflow: hidden;
    display: inline-block;
}
.letterWrapper img {
    position: relative;
    width: 256px;
    height: 260px;
    object-fit: none;
    object-position: v-bind(objectPosition);
    transform: v-bind(transform);
}
</style>
