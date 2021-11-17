<template>
  <div class="max-w-2xl mx-auto p-10">
    <h2 class="text-center">Presser une lettre du clavier pour jouer</h2>
    <div
      class="flex flex-col md:flex-row justify-between bg-white shadow-lg p-10"
    >
      <div>
        <h2>Oscillateur A</h2>
        <Oscillator defaultWaveForm="triangle" />
      </div>
      <div class="">
        <h2>Oscillateur B</h2>
        <Oscillator defaultWaveForm="triangle" />
      </div>
      <div class="">
        <h2>Oscillateur C</h2>
        <Oscillator defaultWaveForm="triangle" />
      </div>
    </div>

    <div class="p-10 mt-4 bg-white shadow-lg flex justify-between">
      <div>
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
      <div>
        <p>Low pass (cutoff: {{ synthAudio.state.filterFrequency }} Hz)</p>
        <input
          v-model="synthAudio.state.filterFrequency"
          type="range"
          min="20"
          max="2000"
        />
      </div>
    </div>

    <div id="oscilloscope" />

    <h2 style="padding-top: 50px">Debug</h2>
    <pre class="bg-gray-900 text-white p-5 rounded">
      <div>Keyboard state: {{ keyboard.state }}</div>
      <div>synthAudio state: {{ synthAudio.state }}</div>
    </pre>
  </div>
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
