import { reactive, computed } from "vue";
import { UseKeyboardAsPianoState, UseKeyboardAsPianoReturn } from "@/types";
import { keyboardMap } from "@/lib/synth";

const state: UseKeyboardAsPianoState = reactive({
  frequency: undefined,
  startFromFrequency: 55,
  keyPressed: undefined,
});

const frequencies = computed(() => {
  return keyboardMap(state.startFromFrequency);
});

document.addEventListener("keydown", (e) => {
  if (frequencies.value.get(e.key)) {
    state.keyPressed = e.key;
    state.frequency = frequencies.value.get(e.key);
  }
});

document.addEventListener("keyup", (e) => {
  if (frequencies.value.get(e.key)) {
    state.frequency = undefined;
    state.keyPressed = undefined;
  }
});

export default function useSynthKeyboard(): UseKeyboardAsPianoReturn {
  return { state };
}
