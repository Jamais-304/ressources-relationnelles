<script setup lang="ts">
interface Props {
  variant?: 'text' | 'outlined' | 'tonal' | 'elevated'
  color?: string
  to?: string
  icon?: string
  iconPosition?: 'prepend' | 'append'
}

withDefaults(defineProps<Props>(), {
  variant: 'text',
  color: 'primary',
  iconPosition: 'prepend'
})
</script>

<template>
  <v-btn
    :variant="variant"
    :color="color"
    :to="to"
    :prepend-icon="iconPosition === 'prepend' ? icon : undefined"
    :append-icon="iconPosition === 'append' ? icon : undefined"
    class="!font-marianne !font-medium !text-sm !h-10 !px-4 !rounded"
  >
    <slot></slot>
  </v-btn>
</template> 