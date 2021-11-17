<template>
  <h2>Presser une lettre du clavier pour jouer</h2>
  <div style="display: flex; justify-content: center">
    <div>
      <p>Global pitch</p>
      <input @input="handlePitch" type="range" min="55" max="220" />
    </div>
    <div>
      <p>Global volume</p>
      <input
        @input="handleVolume"
        type="range"
        min="0"
        max="100"
        :value="audioContext.state.gain * 100"
      />
    </div>
  </div>

  <div style="display: flex; justify-content: center">
    <div style="margin-right: 20px">
      <Oscillator defaultWaveForm="sine" />
    </div>
    <div style="margin-right: 20px">
      <Oscillator defaultWaveForm="triangle" />
    </div>
  </div>

  <h2 style="padding-top: 50px">Debug</h2>
  <div>Keyboard state: {{ keyboardAsPiano.state }}</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useSynthAudio, useKeyboardAsPiano } from "@/composables/useSynth";
import Oscillator from "@/components/Oscillator.vue";

export default defineComponent({
  components: {
    Oscillator,
  },
  setup() {
    const keyboardAsPiano = useKeyboardAsPiano();
    const audioContext = useSynthAudio();

    // mettre à jour le pitch du piano, c'est à dire à partir
    // de quelle note de départ la gamme de notes est crée.
    function handlePitch(event: any) {
      keyboardAsPiano.state.startFromFrequency = event.target.value;
    }

    function handleVolume(event: any) {
      console.log(" event.target.value ", event.target.value);
      audioContext.state.gain = event.target.value / 100;
    }

    return {
      handlePitch,
      handleVolume,
      keyboardAsPiano,
      audioContext,
    };
  },
});
</script>
