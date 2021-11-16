<template>
  <h2>Presser une lettre du clavier pour jouer</h2>
  <p>{{ oscillatorA.state }}</p>
  <div>
    <h2>Oscillateur A</h2>
    <p>Pitch</p>
    <input @input="handlePitchA" type="range" min="55" max="220" />

    <div>
      <p>Forme d'onde</p>
      <select v-model="oscillatorA.state.waveForm">
        <option value="sine">Sine</option>
        <option value="square">Square</option>
        <option value="triangle">Triangle</option>
      </select>
    </div>

    <div>
      <p>Volume ({{ oscillatorA.state.gain * 100 }} %)</p>
      <input
        @input="handleGainA"
        type="range"
        min="0"
        max="100"
        :value="oscillatorA.state.gain * 100"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useOscillatorWithKeyboard } from "@/composables/useSynth";

export default defineComponent({
  setup() {
    const audioContext = new AudioContext();
    const oscillatorA = useOscillatorWithKeyboard(audioContext);

    function handlePitchA(event: any) {
      oscillatorA.state.pitch = event.target.value;
    }
    function handleGainA(event: any) {
      console.log("event.target.value ", event.target.value);
      oscillatorA.state.gain = event.target.value / 100;
    }

    return {
      oscillatorA,
      handlePitchA,
      handleGainA,
    };
  },
});
</script>
