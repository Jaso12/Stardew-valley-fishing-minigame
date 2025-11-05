<template>
  <BaseLetter
    v-if="glyph"
    :character="character"
    :x="glyph.BoundsInTexture.X"
    :y="glyph.BoundsInTexture.Y"
    :width="glyph.BoundsInTexture.Width"
    :height="glyph.BoundsInTexture.Height"
    :verticalOffset="glyph.Cropping.Y"
  />
</template>

<script>
import BaseLetter from '@/base_components/BaseLetter.vue';
import fontData from '@/assets/SmallFont.json';

export default {
  name: "Letter",
  components: {
    BaseLetter
  },
  props: {
    character: {
      type: String,
      required: true
    }
  },
  computed: {
    glyph() {
      let glyph = fontData.Glyphs[this.character];
      if (!glyph) {
        // Fallback
        glyph = fontData.Glyphs[fontData.DefaultCharacter];
      }
      return glyph;
    }
  }
};
</script>
