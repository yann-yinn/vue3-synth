import { reactive, watch, ref, Ref } from "vue";

interface State {
  waveForm: OscillatorType;
  gain: number;
  pitch: number;
  currentFrequence: undefined | number;
}

interface useOscillatorReturn {
  oscillatorNode: OscillatorNode;
  gainNode: GainNode;
  state: State;
}

interface useKeyboardAsPianoReturn {
  frequence: Ref<undefined | number>;
}

/**
 * An oscillator has:
 * - a reactive gain (from 0 to 1)
 * - a reactive waveform
 */
export function useOscillator(audioContext: AudioContext): useOscillatorReturn {
  let oscillatorStarted = false;
  const state = reactive<State>({
    waveForm: "sine",
    gain: 1,
    pitch: 55,
    currentFrequence: undefined,
  });

  // Connect oscillator to gain, connect gain to audio output.
  const oscillatorNode = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  gainNode.connect(audioContext.destination);

  const notes = ref(_keyboardMap(state.pitch));

  oscillatorNode.type = state.waveForm;

  watch(
    () => state.waveForm,
    (value: OscillatorType) => {
      oscillatorNode.type = value;
    }
  );

  watch(
    () => state.pitch,
    (value: number) => {
      notes.value = _keyboardMap(value);
    }
  );

  watch(
    () => state.gain,
    (value: number) => {
      if (value < 0 || value > 1) {
        throw new Error(
          "useOscillator: Le gain doit être compris entre 0 et 1"
        );
      }
      gainNode.gain.value = value;
    }
  );

  document.addEventListener("keydown", (e) => {
    if (notes.value.get(e.key)) {
      // Note: un oscillateur ne peut être démarré qu'une seule fois.
      // Et on ne peut pas le démarrer sans interaction utilisateur car Chrome interdit cela
      // On joue juste la connexion / déconnexion à la sortie audio pour le faire démarrer / arrêter
      if (oscillatorStarted === false) {
        oscillatorStarted = true;
        oscillatorNode.start();
      }
      oscillatorNode.connect(gainNode);
      state.currentFrequence = notes.value.get(e.key);
      if (state.currentFrequence) {
        oscillatorNode.frequency.value = state.currentFrequence;
      }
    }
  });

  document.addEventListener("keyup", (e) => {
    if (notes.value.get(e.key)) {
      oscillatorNode.disconnect(gainNode);
    }
  });

  return {
    oscillatorNode,
    gainNode,
    state,
  };
}

export function useKeyboardAsPiano(): useKeyboardAsPianoReturn {
  const frequence = ref<undefined | number>(undefined);

  const notes = _keyboardMap();

  document.addEventListener("keydown", (e) => {
    if (notes.get(e.key)) {
      frequence.value = notes.get(e.key);
    }
  });

  document.addEventListener("keyup", (e) => {
    if (notes.get(e.key)) {
      frequence.value = undefined;
    }
  });

  return { frequence };
}

// fonction d'aide pour savoir quelle fréquence l'oscillateur
// doit avoir en fonction d'une touche du clavier.
// @param startNode: Fréquence en Hs de la note de départ qui permet de calculer toutes les autres
function _keyboardMap(startNote = 55): Map<string, number> {
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
