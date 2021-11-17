export interface Piste {
  id: string;
  label: string;
  activeSteps: Array<number>;
  audio: HTMLAudioElement;
}

export interface UseOscillatorState {
  waveForm: OscillatorType;
  gain: number;
  pitch: undefined | number;
  frequency: undefined | number;
}

export interface UseOscillatorReturn {
  oscillatorNode: OscillatorNode;
  gainNode: GainNode;
  state: UseOscillatorState;
}

export interface UseKeyboardAsPianoState {
  frequency: undefined | number;
  keyPressed: undefined | string;
  startFromFrequency: number;
}

export interface UseKeyboardAsPianoReturn {
  state: UseKeyboardAsPianoState;
}

export interface UseSynthAudioState {
  gain: number;
}
