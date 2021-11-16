<template>
  <h2>Play with keys: aqzsedrftgyhujikolpm</h2>
  <p v-show="currentFrequence">{{ currentFrequence }} Hz</p>
  <!--
  <input
    @input="handleFrequence"
    type="range"
    id="frequence"
    name="frequence"
    min="50"
    max="200"
  />
  -->
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  setup() {
    const oscillatorMuted = ref(true);
    const currentFrequence = ref(null as null | number);
    const audioContext = new AudioContext();
    const oscillatorAudioNode = audioContext.createOscillator();
    const gainAudioNode = audioContext.createGain();

    gainAudioNode.connect(audioContext.destination);

    let oscillatorStarted = false;

    const notes = new Map();
    // do
    notes.set("a", 311.126);
    notes.set("q", 329.627);
    // ré
    notes.set("z", 349.228);
    notes.set("s", 369.994);
    notes.set("e", 391.995);
    notes.set("d", 415.304);
    // la
    notes.set("r", 440);
    notes.set("f", 466.163);
    notes.set("t", 493.883);
    notes.set("g", 523.251);
    notes.set("y", 554.365);
    notes.set("h", 587.329);
    notes.set("u", 622.253);
    notes.set("j", 659.255);
    notes.set("i", 698.456);
    notes.set("k", 739.988);
    notes.set("o", 783.991);
    notes.set("l", 830.609);
    notes.set("p", 880.0);
    notes.set("m", 932.327);

    oscillatorAudioNode.frequency.value = 100;
    oscillatorAudioNode.type = "square";

    document.addEventListener("keydown", (e) => {
      if (oscillatorStarted === false) {
        oscillatorStarted = true;
        oscillatorAudioNode.start();
      }
      if (notes.get(e.key)) {
        oscillatorAudioNode.connect(gainAudioNode);
        currentFrequence.value = notes.get(e.key);
        oscillatorAudioNode.frequency.value = notes.get(e.key);
      }
    });

    document.addEventListener("keyup", (e) => {
      if (notes.get(e.key)) {
        oscillatorAudioNode.disconnect(gainAudioNode);
        console.log("e", e.key);
      }
    });

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

    function handleFrequence(event: any) {
      oscillatorAudioNode.frequency.value = event.target.value;
      console.log(event.target.value);
    }

    return {
      currentFrequence,
      startOscillator,
      stopOscillator,
      oscillatorMuted,
      handleFrequence,
    };
  },
});
</script>
