<template>
  <div>
    <div class="max-w-3xl mx-auto">
      <div class="card">
        <h1 class="text-3xl font-bold mb-6">Sélectionnez la dernière lettre apprise</h1>

        <p class="mb-6 text-gray-600">
          Choisissez la dernière lettre de l'alphabet arabe que vous avez apprise.
          Les dictées ne contiendront que les lettres que vous connaissez.
        </p>

        <div class="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-7 gap-3 mb-8">
          <button
              v-for="(letter, index) in arabicLetters"
              :key="index"
              @click="selectLetter(letter, index)"
              class="letter-button"
              :class="{ 'selected': selectedLetterIndex >= index }"
          >
            <span class="text-2xl font-arabic">{{ letter.char }}</span>
            <span class="text-xs mt-1">{{ letter.name }}</span>
          </button>
        </div>

        <div v-if="selectedLetterIndex !== null" class="mb-8">
          <h2 class="text-xl font-bold mb-2">Lettres sélectionnées:</h2>
          <div class="bg-light p-4 rounded-lg">
            <div class="direction-rtl font-arabic text-2xl">
              {{ selectedLetters.map(l => l.char).join(' ') }}
            </div>
            <div class="text-sm text-gray-600 mt-2">
              {{ selectedLetters.map(l => l.name).join(', ') }}
            </div>
          </div>
        </div>

        <div class="flex justify-end">
          <button
              @click="proceedToDictation"
              class="btn-primary"
              :disabled="selectedLetterIndex === null"
              :class="{ 'opacity-50 cursor-not-allowed': selectedLetterIndex === null }"
          >
            Commencer la dictée
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const selectedLetterIndex = ref(null);
const router = useRouter();

const arabicLetters = [
  { char: 'ا', name: 'Alif' },
  { char: 'ب', name: 'Ba' },
  { char: 'ت', name: 'Ta' },
  { char: 'ث', name: 'Tha' },
  { char: 'ج', name: 'Jim' },
  { char: 'ح', name: 'Ha' },
  { char: 'خ', name: 'Kha' },
  { char: 'د', name: 'Dal' },
  { char: 'ذ', name: 'Dhal' },
  { char: 'ر', name: 'Ra' },
  { char: 'ز', name: 'Zay' },
  { char: 'س', name: 'Sin' },
  { char: 'ش', name: 'Shin' },
  { char: 'ص', name: 'Sad' },
  { char: 'ض', name: 'Dad' },
  { char: 'ط', name: 'Ta' },
  { char: 'ظ', name: 'Dha' },
  { char: 'ع', name: 'Ayn' },
  { char: 'غ', name: 'Ghayn' },
  { char: 'ف', name: 'Fa' },
  { char: 'ق', name: 'Qaf' },
  { char: 'ك', name: 'Kaf' },
  { char: 'ل', name: 'Lam' },
  { char: 'م', name: 'Mim' },
  { char: 'ن', name: 'Nun' },
  { char: 'ه', name: 'Ha' },
  { char: 'و', name: 'Waw' },
  { char: 'ي', name: 'Ya' }
];

const selectedLetters = computed(() => {
  if (selectedLetterIndex === null) return [];
  return arabicLetters.slice(0, selectedLetterIndex + 1);
});

function selectLetter(letter, index) {
  selectedLetterIndex.value = index;
}

function proceedToDictation() {
  if (selectedLetterIndex.value === null) return;

  const knownLetters = selectedLetters.value.map(l => l.char).join('');
  router.push(`/dictation?level=beginner&letters=${encodeURIComponent(knownLetters)}`);
}
</script>

<style scoped>
.letter-button {
  @apply flex flex-col items-center justify-center p-2 border rounded-lg transition;
}

.letter-button:hover {
  @apply border-secondary;
}

.letter-button.selected {
  @apply bg-secondary text-white border-secondary;
}
</style>