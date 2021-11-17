<template>
  <select v-model="oscillator.state.waveForm" class="rounded w-full">
    <option value="sine">Sine</option>
    <option value="square">Square</option>
    <option value="triangle">Triangle</option>
  </select>

  <div class="mt-3">
    <p>Pitch {{ oscillator.state.pitch }}</p>
    <input type="range" min="-24" max="24" v-model="oscillator.state.pitch" />
  </div>

  <div class="mt-2">
    <p>Volume ({{ (oscillator.state.gain * 100).toFixed(0) }} %)</p>
    <input
      style="color: red"
      @input="handleGain"
      type="range"
      min="0"
      max="100"
      :value="oscillator.state.gain * 100"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, watch, PropType } from "vue";
import useSynthKeyboard from "@/composables/useSynthKeyboard";
import useSynthOscillator from "@/composables/useSynthOscillator";

export default defineComponent({
  props: {
    defaultWaveForm: {
      // eslint-disable-next-line
      type: String as PropType<OscillatorType>,
      default: "sine",
    },
  },
  setup(props) {
    const oscillator = useSynthOscillator();

    // par défaut, utiliser la valeur passé en prop.
    // eslint-disable-next-line
    oscillator.state.waveForm = props.defaultWaveForm;

    const keyboard = useSynthKeyboard();

    // Mettre à jour la note jouée par l'oscillateur quand la fréquence calculée change
    watch(
      () => keyboard.state.frequency,
      (value) => {
        oscillator.state.frequency = value;
      }
    );

    // mettre à jour la forme d'onde de l'oscillateur
    // si la prop de forme d'onde change.
    watch(
      () => props.defaultWaveForm,
      (value) => {
        oscillator.state.waveForm = value;
      }
    );

    function handleGain(event: any) {
      oscillator.state.gain = event.target.value / 100;
    }

    function handlePitch(event: any) {
      oscillator.state.pitch = event.target.value;
    }

    return { oscillator, handleGain, handlePitch };
  },
});
</script>
