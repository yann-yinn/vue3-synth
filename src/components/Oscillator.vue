<template>
  <h2>Oscillateur</h2>
  <div>
    <p>Forme d'onde</p>
    <select v-model="oscillator.state.waveForm">
      <option value="sine">Sine</option>
      <option value="square">Square</option>
      <option value="triangle">Triangle</option>
    </select>
  </div>

  <div>
    <p>Volume ({{ (oscillator.state.gain * 100).toFixed(0) }} %)</p>
    <input
      @input="handleGain"
      type="range"
      min="0"
      max="100"
      :value="oscillator.state.gain * 100"
    />
  </div>
  -
</template>

<script lang="ts">
import { defineComponent, watch, PropType } from "vue";
import { useKeyboardAsPiano, useOscillator } from "@/composables/useSynth";

export default defineComponent({
  props: {
    defaultWaveForm: {
      // eslint-disable-next-line
      type: String as PropType<OscillatorType>,
      default: "sine",
    },
  },
  setup(props) {
    const oscillator = useOscillator();

    // par défaut, utiliser la valeur passé en prop.
    // eslint-disable-next-line
    oscillator.state.waveForm = props.defaultWaveForm;
    const keyboard = useKeyboardAsPiano();

    // mettre à jour la forme d'onde de l'oscillateur
    // si la prop de forme d'onde change.
    watch(
      () => props.defaultWaveForm,
      (value) => {
        oscillator.state.waveForm = value;
      }
    );

    // utiliser la fréquence envoyée par le clavier
    // comme fréquence de l'oscillator
    watch(
      () => keyboard.state.frequency,
      (frequency) => {
        oscillator.state.frequency = frequency;
      }
    );

    function handleGain(event: any) {
      oscillator.state.gain = event.target.value / 100;
    }

    return { oscillator, handleGain };
  },
});
</script>
