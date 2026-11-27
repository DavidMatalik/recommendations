<script setup lang="ts">
import ConfirmDialog from "@/components/ConfirmDialog.vue";
import PromptDialog from "@/components/PromptDialog.vue";
</script>

<template>
  <RouterView />
  <ConfirmDialog />
  <PromptDialog />
</template>
