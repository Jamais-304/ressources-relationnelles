<script setup lang="ts">
const props = defineProps({
  message: {
    type: String,
    required: true,
  },
  item: {
    required: false,
  },
})

const isVisible = defineModel({ type: Boolean, required: true })

const emit = defineEmits(['confirm'])

function close() {
  isVisible.value = false
}

function confirm() {
  emit('confirm', props.item)
  close()
}
</script>

<template>
  <v-dialog v-model="isVisible" max-width="400px">
    <v-card>
      <v-card-title class="headline"> Confirmation </v-card-title>
      <v-card-text>
        <div>
          {{ message }}
        </div>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="close"> Annuler </v-btn>
        <v-btn @click="confirm"> Confirmer </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
