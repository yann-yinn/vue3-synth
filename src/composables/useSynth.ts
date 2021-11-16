import { reactive, watch, computed } from "vue";

interface UseOscillatorState {
  waveForm: OscillatorType;
  gain: number;
  pitch: undefined | number;
  frequency: undefined | number;
}

interface useOscillatorReturn {
  oscillatorNode: OscillatorNode;
  gainNode: GainNode;
  state: UseOscillatorState;
}

/**
 * An oscillator has:
 * - a reactive gain (from 0 to 1)
 * - a reactive waveform
 */
export function useOscillator(audioContext: AudioContext): useOscillatorReturn {
  let oscillatorStarted = false;
  const state = reactive<UseOscillatorState>({
    waveForm: "sine",
    gain: 1,
    pitch: 55,
    frequency: undefined,
  });

  // Connect oscillator to gain, connect gain to audio output.
  const oscillatorNode = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  gainNode.connect(audioContext.destination);

  oscillatorNode.type = state.waveForm;

  watch(
    () => state.waveForm,
    (value: OscillatorType) => {
      oscillatorNode.type = value;
    }
  );

  watch(
    () => state.gain,
    (value: number) => {
      if (value < 0 || value > 1) {
        gainNode.gain.value = 0;
        throw new Error(
          "useOscillator: Le gain doit être compris entre 0 et 1"
        );
      }
      console.log(value);
      gainNode.gain.value = value;
    }
  );

  watch(
    () => state.frequency,
    (value: undefined | number) => {
      // Note: un oscillateur ne peut être démarré qu'une seule fois,
      // on ne peut donc pas utiliser start() et stop() puis à nouveau start()
      // pour déclencher / couper / redéclencher le son de l'oscillo.
      // On ne peut également pas le démarrer sans interaction utilisateur
      // car Chrome l'interdit ( pour qu'un son ne soit pas lancé automatiquement et
      // imposé à l'internaute sans qu'il sache d'où il provient)
      //
      // On démarre donc l'oscillateur ici, lorsque l'utilisateur appuie sur une
      // touche de son clavier; puis on joue juste la connexion / déconnexion
      // à la sortie audio pour le faire démarrer / arrêter le son de l'oscillo.
      if (oscillatorStarted === false) {
        oscillatorNode.start();
        oscillatorStarted = true;
      }
      if (value) {
        oscillatorNode.frequency.value = value;
        oscillatorNode.connect(gainNode);
      } else {
        oscillatorNode.disconnect(gainNode);
      }
    }
  );

  return {
    oscillatorNode,
    gainNode,
    state,
  };
}

interface UseKeyboardAsPianoState {
  frequency: undefined | number;
  keyPressed: undefined | string;
  startFromFrequency: number;
}

interface useKeyboardAsPianoOptions {
  onFrequencyChange: (frequence: undefined | number) => void;
}

interface useKeyboardAsPianoReturn {
  state: UseKeyboardAsPianoState;
}

export function useKeyboardAsPiano(
  options: useKeyboardAsPianoOptions
): useKeyboardAsPianoReturn {
  const state: UseKeyboardAsPianoState = reactive({
    frequency: undefined,
    startFromFrequency: 55,
    keyPressed: undefined,
  });

  const frequencies = computed(() => {
    return _keyboardMap(state.startFromFrequency);
  });

  document.addEventListener("keydown", (e) => {
    if (frequencies.value.get(e.key)) {
      state.keyPressed = e.key;
      state.frequency = frequencies.value.get(e.key);
      options.onFrequencyChange(frequencies.value.get(e.key));
    }
  });

  document.addEventListener("keyup", (e) => {
    if (frequencies.value.get(e.key)) {
      state.frequency = undefined;
      options.onFrequencyChange(undefined);
      state.keyPressed = undefined;
    }
  });

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
