<script setup lang="ts">
import { ref } from 'vue'
import axios, { AxiosError } from 'axios'
import SubmitNotice from '@/components/SubmitNotice.vue'

const isSubmitted = ref(false)
const isLoading = ref(false)
const message = ref('')
const error = ref('')

const handleSubmit = async () => {
  if (message.value.length < 10) {
    return
  }

  isLoading.value = true
  try {
    await axios.post('/confessional', {
      message: message.value
    })
  } catch (err) {
    const axiosErr = err as AxiosError
    console.log(axiosErr)
    if (axiosErr.response?.status == 429) {
      error.value = 'Du kannst nicht so viele Geständnisse abschicken.'
    } else {
      error.value = axiosErr.message
    }
  }
  message.value = ''
  isSubmitted.value = true
  isLoading.value = false
}
</script>

<template>
  <main class="flex flex-col items-center w-full gap-4 p-4">
    <div v-if="error" class="w-full max-w-lg bg-red-900 text-white text-center p-8 rounded-md">
      {{ error }}
    </div>

    <div v-if="!isSubmitted" class="w-full max-w-lg flex flex-col gap-4">
      <div class="w-full flex flex-col gap-2">
        <label for="confession-input" class="text-white">Mein Geheimnis:</label>
        <textarea
          v-model="message"
          id="confession-input"
          placeholder="Mein Geheimnis ist, dass..."
          class="w-full p-4 h-52 rounded-md"
        ></textarea>
      </div>
      <button
        :class="{ invisible: message?.length < 10 }"
        class="w-full text-white hover:text-purple-400 border-white hover:border-purple-400 border-2 p-4 rounded-md"
        @click="handleSubmit"
      >
        Abschicken
      </button>
    </div>

    <div
      v-else-if="isLoading"
      class="w-full max-w-lg bg-purple-800 text-white text-center p-8 rounded-md"
    >
      Bitte warten...
    </div>

    <SubmitNotice v-else-if="!error"></SubmitNotice>
  </main>
</template>
