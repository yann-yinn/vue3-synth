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
 * useOscillator
 *
 * An oscillator has:
 * - a reactive gain (from 0 to 1)
 * - a reactive waveform
 */
export function useOscillator(): useOscillatorReturn {
  const { audioContext, globalGainNode } = useSynthAudio();
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
  gainNode.connect(globalGainNode);

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

interface useKeyboardAsPianoReturn {
  state: UseKeyboardAsPianoState;
}

/**
 * useKeyboardAsPiano()
 */

let useKeyboardAsPianoKeydownListenerAttached = false;
let useKeyboardAsPianoKeyupListenerAttached = false;

const state: UseKeyboardAsPianoState = reactive({
  frequency: undefined,
  startFromFrequency: 55,
  keyPressed: undefined,
});

export function useKeyboardAsPiano(): useKeyboardAsPianoReturn {
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

/**
 * useSynthAudio
 */
let audioContext: AudioContext;
let globalGainNode: GainNode;

interface useSynthAudioState {
  gain: number;
}

const useSynthAudioState = reactive({
  gain: 1,
});

export function useSynthAudio(): {
  audioContext: AudioContext;
  globalGainNode: GainNode;
  state: useSynthAudioState;
} {
  if (!audioContext) {
    audioContext = new AudioContext();
    globalGainNode = audioContext.createGain();
    globalGainNode.connect(audioContext.destination);
  }

  watch(
    () => useSynthAudioState.gain,
    (value: number) => {
      if (value < 0 || value > 1) {
        globalGainNode.gain.value = 0;
        throw new Error(
          "useOscillator: Le gain doit être compris entre 0 et 1"
        );
      }
      globalGainNode.gain.value = value;
    }
  );

  return { audioContext, globalGainNode, state: useSynthAudioState };
}
