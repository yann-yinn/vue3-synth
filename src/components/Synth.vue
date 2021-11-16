<template>
  <h2>Play with your keyboard: azertyuiopqsdfghjklmwxcvbn</h2>

  <p>Pitch oscillateur A</p>
  <input
    @input="handlePitch"
    type="range"
    id="frequence"
    name="frequence"
    min="55"
    max="220"
  />

  <select v-model="oscillatorWaveForm">
    <option value="sine">Sine</option>
    <option value="square">Square</option>
    <option value="triangle">Triangle</option>
  </select>

  <p v-show="currentFrequence">{{ currentFrequence }} Hz</p>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";

function generateNotes(startNote = 55) {
  // https://lecompositeur.com/wp-content/uploads/2016/04/Frequences.pdf
  // Fréquence = 440 Hz * r puissance n
  // où n est le nombre de demi-tons
  // fréquence do 4 = 440 * r puissance 3
  // résultat: 523.251 Hz
  const notes = new Map();
  const r = 1.05946;
  const keys = "azertyuiopqsdfghjklmwxcvbn";
  for (let i = 0; i < keys.length; i++) {
    const frequence = startNote * Math.pow(r, i + 1);
    notes.set(keys[i], frequence);
  }
  return notes;
}

export default defineComponent({
  setup() {
    const currentFrequence = ref(null as null | number);
    const notes = ref(generateNotes());
    // eslint-disable-next-line
    const oscillatorWaveForm = ref("sine" as OscillatorType);

    const audioContext = new AudioContext();
    const oscillatorAudioNode = audioContext.createOscillator();
    const gainAudioNode = audioContext.createGain();
    gainAudioNode.connect(audioContext.destination);

    let oscillatorStarted = false;

    oscillatorAudioNode.frequency.value = 100;
    oscillatorAudioNode.type = oscillatorWaveForm.value;

    watch(oscillatorWaveForm, (v) => {
      oscillatorAudioNode.type = v;
    });

    document.addEventListener("keydown", (e) => {
      // Note: un oscillateur ne peut être démarré qu'une seule fois.
      // Et on ne peut pas le démarrer sans interaction utilisateur car Chrome interdit cela
      // On joue juste la connexion / déconnexion à la sortie audio pour le faire démarrer / arrêter
      if (oscillatorStarted === false) {
        oscillatorStarted = true;
        oscillatorAudioNode.start();
      }
      if (notes.value.get(e.key)) {
        oscillatorAudioNode.connect(gainAudioNode);
        currentFrequence.value = notes.value.get(e.key);
        oscillatorAudioNode.frequency.value = notes.value.get(e.key);
      }
    });

    document.addEventListener("keyup", (e) => {
      if (notes.value.get(e.key)) {
        oscillatorAudioNode.disconnect(gainAudioNode);
      }
    });

    function handlePitch(event: any) {
      notes.value = generateNotes(event.target.value);
    }

    return {
      currentFrequence,
      handlePitch,
      oscillatorWaveForm,
    };
  },
});
</script>
