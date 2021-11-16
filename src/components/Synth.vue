<template>
  <h2>Presser une lettre du clavier pour jouer</h2>
  <div>
    <p>Global pitch</p>
    <input @input="handlePitch" type="range" min="55" max="220" />
  </div>

  <div style="display: flex; justify-content: center">
    <div style="margin-right: 20px">
      <h2>Oscillateur A</h2>
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

    <div>
      <h2>Oscillateur B</h2>
      <div>
        <p>Forme d'onde</p>
        <select v-model="oscillatorB.state.waveForm">
          <option value="sine">Sine</option>
          <option value="square">Square</option>
          <option value="triangle">Triangle</option>
        </select>
      </div>
      <div>
        <p>Volume ({{ oscillatorB.state.gain * 100 }} %)</p>
        <input
          @input="handleGainB"
          type="range"
          min="0"
          max="100"
          :value="oscillatorB.state.gain * 100"
        />
      </div>
    </div>
  </div>

  <h2 style="padding-top: 50px">Debug</h2>
  <div>Keyboard state: {{ keyboardAsPiano.state }}</div>
  <div>Oscillator A state: {{ oscillatorA.state }}</div>
  <div>Oscillator B state: {{ oscillatorB.state }}</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useOscillator, useKeyboardAsPiano } from "@/composables/useSynth";

export default defineComponent({
  setup() {
    const audioContext = new AudioContext();
    const oscillatorA = useOscillator(audioContext);
    const oscillatorB = useOscillator(audioContext);

    const keyboardAsPiano = useKeyboardAsPiano({
      onFrequencyChange: (frequency) => {
        oscillatorA.state.frequency = frequency;
        oscillatorB.state.frequency = frequency;
      },
    });

    function handlePitch(event: any) {
      keyboardAsPiano.state.startFromFrequency = event.target.value;
    }

    function handleGainA(event: any) {
      console.log("event.target.value ", event.target.value);
      oscillatorA.state.gain = event.target.value / 100;
    }

    function handleGainB(event: any) {
      console.log("event.target.value ", event.target.value);
      oscillatorB.state.gain = event.target.value / 100;
    }

    return {
      oscillatorA,
      oscillatorB,
      handlePitch,
      handleGainA,
      handleGainB,
      keyboardAsPiano,
    };
  },
});
</script>
