import { reactive, watch } from "vue";
import { UseSynthAudioState } from "@/types";

// audioContext and global audio Nodes
const audioContext = new AudioContext();
const globalGainNode = audioContext.createGain();
const filterNode = audioContext.createBiquadFilter();
globalGainNode.connect(filterNode);
filterNode.connect(audioContext.destination);

const state = reactive({
  gain: 0.25,
  filterFrequency: 2000,
});

filterNode.type = "lowpass";
filterNode.frequency.setValueAtTime(
  state.filterFrequency,
  audioContext.currentTime
);

globalGainNode.gain.value = state.gain;

watch(
  () => state.filterFrequency,
  (value: number) => {
    filterNode.frequency.setValueAtTime(value, audioContext.currentTime);
  }
);

watch(
  () => state.gain,
  (value: number) => {
    if (value < 0 || value > 1) {
      globalGainNode.gain.value = 0;
      throw new Error("useOscillator: Le gain doit être compris entre 0 et 1");
    }
    globalGainNode.gain.value = value;
  }
);

export default function useSynthAudio(): {
  audioContext: AudioContext;
  globalGainNode: GainNode;
  filterNode: BiquadFilterNode;
  state: UseSynthAudioState;
} {
  return { audioContext, globalGainNode, state, filterNode };
}
