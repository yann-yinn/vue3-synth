import { reactive, computed } from "vue";
import { UseKeyboardAsPianoState, UseKeyboardAsPianoReturn } from "@/types";

let useKeyboardAsPianoKeydownListenerAttached = false;
let useKeyboardAsPianoKeyupListenerAttached = false;

const state: UseKeyboardAsPianoState = reactive({
  frequency: undefined,
  startFromFrequency: 55,
  keyPressed: undefined,
});

export default function useSynthKeyboard(): UseKeyboardAsPianoReturn {
  const frequencies = computed(() => {
    return _keyboardMap(state.startFromFrequency);
  });

  if (useKeyboardAsPianoKeydownListenerAttached === false) {
    document.addEventListener("keydown", (e) => {
      useKeyboardAsPianoKeydownListenerAttached = true;
      if (frequencies.value.get(e.key)) {
        state.keyPressed = e.key;
        state.frequency = frequencies.value.get(e.key);
      }
    });
  }

  if (useKeyboardAsPianoKeyupListenerAttached === false) {
    document.addEventListener("keyup", (e) => {
      useKeyboardAsPianoKeyupListenerAttached = true;
      if (frequencies.value.get(e.key)) {
        state.frequency = undefined;
        state.keyPressed = undefined;
      }
    });
  }

  return { state };
}

// fonction d'aide pour savoir quelle fréquence l'oscillateur
// doit avoir en fonction d'une touche du clavier.
// @param startNode: Fréquence en Hs de la note de départ qui permet de calculer toutes les autres
function _keyboardMap(startFrequencey = 55): Map<string, number> {
  // https://lecompositeur.com/wp-content/uploads/2016/04/Frequences.pdf
  // Fréquence = 440 Hz * r puissance n
  // où n est le nombre de demi-tons
  // fréquence do 4 = 440 * r puissance 3
  // résultat: 523.251 Hz
  const notes = new Map();
  const r = 1.05946;
  const keys = "azertyuiopqsdfghjklmwxcvbn";
  for (let i = 0; i < keys.length; i++) {
    const frequency = startFrequencey * Math.pow(r, i + 1);
    notes.set(keys[i], frequency);
  }
  return notes;
}
