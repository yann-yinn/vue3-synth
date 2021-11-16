<script lang="ts">
import { defineComponent, reactive, ref } from "vue";
import { Piste } from "@/types";

export default defineComponent({
  props: {
    steps: { type: Number, default: 16 },
  },
  setup(props) {
    let intervalId: undefined | number;

    const audioContext = new AudioContext();
    const audioNodeGain = audioContext.createGain();
    audioNodeGain.connect(audioContext.destination);

    const steps = ref(props.steps);
    const currentStep = ref(1);
    const isPlaying = ref(false);
    const pistes: Piste[] = reactive([
      {
        id: "kick",
        label: "Kick",
        activeSteps: [],
        audio: new Audio("/samples/kick.mp3"),
      },
      {
        id: "snare",
        label: "Snare",
        activeSteps: [],
        audio: new Audio("/samples/snare.mp3"),
      },
    ]);

    function setPisteActiveStep(pisteId: string, stepIndex: number) {
      const piste = pistes.find((p) => p.id === pisteId);
      if (!piste) return;
      const existingStepIndex = piste.activeSteps.indexOf(stepIndex);
      if (existingStepIndex === -1) {
        piste.activeSteps.push(stepIndex);
      } else {
        piste.activeSteps.splice(existingStepIndex, 1);
      }
    }

    function play() {
      isPlaying.value = true;
      intervalId = setInterval(() => {
        if (currentStep.value < steps.value) {
          pistes[0].audio.play();
          currentStep.value++;
        } else {
          currentStep.value = 1;
        }
      }, 300);
    }

    function stop() {
      isPlaying.value = false;
      clearInterval(intervalId);
    }

    return { play, stop, setPisteActiveStep, currentStep, isPlaying, pistes };
  },
});
</script>

<template>
  <div class="pistes-wrapper">
    {{ currentStep }}
    <div>
      <button @click="play" :disabled="isPlaying">PLAY</button>
      <button @click="stop" :disabled="!isPlaying">STOP</button>
    </div>
    <div v-for="piste in pistes" :key="piste.id" class="steps">
      <div
        v-for="stepIndex in steps"
        class="step"
        :key="stepIndex"
        @click="() => setPisteActiveStep(piste.id, stepIndex)"
        :class="{
          active: piste.activeSteps.includes(stepIndex),
          currentStep: stepIndex === currentStep,
        }"
      ></div>
    </div>
  </div>
</template>

<style>
.pistes-wrapper {
  border: solid silver 1px;
  width: 900px;
  margin: auto;
  text-align: center;
  padding: 20px;
}

.step {
  height: 25px;
  width: 25px;
  background-color: #bbb;
  border-radius: 50%;
}

.step.active {
  background-color: red;
}

.steps {
  display: flex;
  font-size: 100px;
  cursor: pointer;
  margin-bottom: 10px;
}

.step.currentStep {
  background-color: yellow;
}
</style>
