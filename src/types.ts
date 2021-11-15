export interface Piste {
  id: string;
  label: string;
  activeSteps: Array<number>;
  audio: HTMLAudioElement;
}
