import { reactive, watch } from "vue";
import { UseSynthAudioState } from "@/types";

// audioContext and global audio Nodes
const audioContext = new AudioContext();
const globalGainNode = audioContext.createGain();
globalGainNode.connect(audioContext.destination);

const state = reactive({
  gain: 1,
});

export default function useSynthAudio(): {
  audioContext: AudioContext;
  globalGainNode: GainNode;
  state: UseSynthAudioState;
} {
  watch(
    () => state.gain,
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

  return { audioContext, globalGainNode, state };
}
