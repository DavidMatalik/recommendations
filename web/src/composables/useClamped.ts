import {
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
  type ShallowRef,
  type WatchSource,
} from "vue";

// Tracks whether any of the line-clamped elements cuts off text, so a
// "show more" toggle is only offered when there's more to show.
export function useClamped(
  targets: Readonly<ShallowRef<HTMLElement | null>>[],
  content: WatchSource,
) {
  const expanded = ref(false);
  const clamped = ref(false);

  function check() {
    if (expanded.value) return;
    clamped.value = targets.some(
      (t) => !!t.value && t.value.scrollHeight > t.value.clientHeight,
    );
  }

  // Re-check when the card is resized or the text changes.
  const observer = new ResizeObserver(check);
  watch(content, check, { flush: "post" });

  onMounted(() => {
    for (const t of targets) if (t.value) observer.observe(t.value);
  });
  onBeforeUnmount(() => observer.disconnect());

  return { expanded, clamped };
}
