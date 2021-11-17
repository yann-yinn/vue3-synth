import { reactive, watch } from "vue";
import { UseOscillatorReturn, UseOscillatorState } from "@/types";
import useSynthAudio from "./useSynthAudio";

/**
 * useOscillator
 */
export default function useOscillator(): UseOscillatorReturn {
  let oscillatorStarted = false;
  const { audioContext, globalGainNode } = useSynthAudio();
  const state = reactive<UseOscillatorState>({
    waveForm: "sine",
    gain: 1,
    pitch: 0,
    frequency: undefined,
  });

  // connecter l'oscillateur à son gain, puis connecter
  // le gain de l'oscillateur au gain global du synthé, qui
  // est lui même connecté à la sortie audio de l'ordinateur.
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
      gainNode.gain.value = value;
    }
  );

  watch(
    () => state.frequency,
    (value: undefined | number) => {
      // Note: un oscillateur ne peut être démarré qu'une seule fois,
      // on ne peut donc pas utiliser start() et stop() puis à nouveau start()
      // pour déclencher / couper / redéclencher le son de l'oscillo.
      //
      // On ne peut également pas le démarrer sans interaction utilisateur
      // car Chrome l'interdit (afin qu'un son ne soit pas lancé automatiquement et
      // imposé à l'internaute sans qu'il sache d'où il provient)
      //
      // On démarre donc l'oscillateur ici, (lorsque l'utilisateur appuie sur une
      // touche de son clavier); puis on joue juste la connexion / déconnexion
      // à la sortie audio pour rendre audible / inaudible le son de l'oscillo.
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
