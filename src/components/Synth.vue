<template>
  <h2>Oscillator 1</h2>
  <input
    @input="handleFrequence"
    type="range"
    id="frequence"
    name="frequence"
    min="50"
    max="10000"
  />
  <button @click="startOscillator" :disabled="!oscillatorMuted">Start</button>
  <button @click="stopOscillator" :disabled="oscillatorMuted">Mute</button>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  setup() {
    const oscillatorMuted = ref(true);
    const audioContext = new AudioContext();
    const oscillatorAudioNode = audioContext.createOscillator();
    const gainAudioNode = audioContext.createGain();

    gainAudioNode.connect(audioContext.destination);

    let oscillatorStarted = false;

    oscillatorAudioNode.frequency.value = 100;
    oscillatorAudioNode.type = "square";

    // un oscillateur ne peut être démarrer qu'une seule fois.
    // Et on ne peut pas le démarrer sans interaction utilisateur car Chrome interdit cela
    // On joue juste la connexion / déconnexion à la sortie audio pour le faire démarrer / arrêter
    function startOscillator() {
      if (oscillatorStarted === false) {
        oscillatorStarted = true;
        oscillatorAudioNode.start();
      }
      oscillatorMuted.value = false;
      oscillatorAudioNode.connect(gainAudioNode);
    }
    function stopOscillator() {
      oscillatorMuted.value = true;
      oscillatorAudioNode.disconnect(gainAudioNode);
    }

    function handleFrequence(value) {
      oscillatorAudioNode.frequency.value = value.target.value;
      console.log(value.target.value);
    }

    return {
      startOscillator,
      stopOscillator,
      oscillatorMuted,
      handleFrequence,
    };
  },
});
</script>
