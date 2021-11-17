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
        :value="synthAudio.state.gain * 100"
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
  <div>Keyboard state: {{ keyboard.state }}</div>
  <div>synthAudio state: {{ synthAudio.state }}</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import useSynthKeyboard from "@/composables/useSynthKeyboard";
import useSynthAudio from "@/composables/useSynthAudio";
import Oscillator from "@/components/Oscillator.vue";

export default defineComponent({
  components: {
    Oscillator,
  },
  setup() {
    const keyboard = useSynthKeyboard();
    const synthAudio = useSynthAudio();

    // mettre à jour le pitch du piano, c'est à dire à partir
    // de quelle note de départ la gamme de notes est crée.
    function handlePitch(event: any) {
      keyboard.state.startFromFrequency = event.target.value;
    }

    function handleVolume(event: any) {
      synthAudio.state.gain = event.target.value / 100;
    }

    return {
      handlePitch,
      handleVolume,
      keyboard,
      synthAudio,
    };
  },
});
</script>
