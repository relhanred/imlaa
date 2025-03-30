<template>
  <div>
    <div v-if="loading" class="flex justify-center items-center py-16">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p>Chargement de la dictée...</p>
      </div>
    </div>

    <div v-else-if="error" class="bg-red-100 border-l-4 border-red-500 p-4 rounded">
      <p class="text-red-700">{{ error }}</p>
      <NuxtLink to="/" class="text-primary hover:underline mt-2 inline-block">
        Retour à l'accueil
      </NuxtLink>
    </div>

    <div v-else-if="!currentDictation" class="bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded">
      <p>Aucune dictée disponible pour votre niveau.</p>
      <NuxtLink to="/" class="text-primary hover:underline mt-2 inline-block">
        Retour à l'accueil
      </NuxtLink>
    </div>

    <div v-else class="max-w-3xl mx-auto">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">{{ currentDictation.title }}</h1>
        <div class="flex space-x-2">
          <span
              :class="{
              'px-3 py-1 text-sm rounded-full': true,
              'bg-green-100 text-green-800': currentDictation.level === 'beginner',
              'bg-yellow-100 text-yellow-800': currentDictation.level === 'intermediate',
              'bg-red-100 text-red-800': currentDictation.level === 'advanced'
            }"
          >
            {{
              currentDictation.level === 'beginner' ? 'Débutant' :
                  currentDictation.level === 'intermediate' ? 'Intermédiaire' : 'Avancé'
            }}
          </span>
          <span class="px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-800">
            Difficulté: {{ currentDictation.difficulty }}/10
          </span>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <!-- Lecteur audio -->
        <div class="card">
          <AudioPlayer :audio-url="currentDictation.audioUrl" :title="'Écoutez la dictée'" />

          <div class="mt-4 text-sm text-gray-600">
            <p>1. Écoutez l'audio autant de fois que nécessaire</p>
            <p>2. Écrivez ce que vous entendez en arabe</p>
            <p>3. Vérifiez votre réponse</p>
          </div>
        </div>

        <!-- Zone de réponse -->
        <div class="card">
          <h3 class="text-lg font-semibold mb-4">Votre réponse</h3>

          <textarea
              v-model="userAnswer"
              class="w-full p-3 border border-gray-300 rounded-lg font-arabic text-right"
              dir="rtl"
              rows="6"
              :disabled="showSolution"
              placeholder="Écrivez ici en arabe..."
          ></textarea>

          <div class="flex justify-end mt-4">
            <button
                @click="checkAnswer"
                class="btn-primary"
                :disabled="showSolution || !userAnswer.trim()"
            >
              Vérifier
            </button>
          </div>
        </div>
      </div>

      <!-- Solution -->
      <div v-if="showSolution" class="card mb-8">
        <h3 class="text-lg font-semibold mb-4">Solution</h3>

        <div class="mb-6">
          <div class="font-arabic text-right text-xl mb-2" dir="rtl">
            {{ currentDictation.arabic }}
          </div>
          <div class="text-gray-600 italic">
            {{ currentDictation.french }}
          </div>
        </div>

        <div class="bg-gray-50 p-4 rounded-lg mb-4">
          <h4 class="font-semibold mb-2">Votre réponse</h4>
          <div class="font-arabic text-right" dir="rtl">
            {{ userAnswer }}
          </div>
        </div>

        <div class="flex justify-end">
          <button
              @click="nextDictation"
              class="btn-secondary"
          >
            Dictée suivante
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute();
const router = useRouter();

const { getDictations } = useFirebase();

// Récupérer les paramètres de la requête
const level = computed(() => route.query.level || 'advanced');
const knownLetters = computed(() => route.query.letters);

// État
const loading = ref(true);
const error = ref(null);
const dictations = ref([]);
const currentDictationIndex = ref(0);
const userAnswer = ref('');
const showSolution = ref(false);

// Dictée actuelle
const currentDictation = computed(() => {
  if (!dictations.value.length) return null;
  return dictations.value[currentDictationIndex.value];
});

// Méthodes
async function loadDictations() {
  try {
    loading.value = true;
    error.value = null;

    dictations.value = await getDictations(level.value, knownLetters.value);

    if (dictations.value.length === 0) {
      error.value = "Aucune dictée disponible pour ce niveau ou ces lettres connues.";
    }
  } catch (err) {
    console.error('Erreur lors du chargement des dictées:', err);
    error.value = "Une erreur est survenue lors du chargement des dictées.";
  } finally {
    loading.value = false;
  }
}

function checkAnswer() {
  if (!userAnswer.value.trim()) return;
  showSolution.value = true;
}

function nextDictation() {
  if (currentDictationIndex.value < dictations.value.length - 1) {
    currentDictationIndex.value++;
    userAnswer.value = '';
    showSolution.value = false;
    // Faire défiler vers le haut
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  } else {
    // Dernière dictée complétée
    completedAllDictations();
  }
}

function completedAllDictations() {
  // Rediriger vers une page de félicitations ou afficher un message
  alert('Bravo! Vous avez terminé toutes les dictées disponibles pour ce niveau.');
  router.push('/');
}

// Charger les dictées au montage du composant
onMounted(() => {
  loadDictations();
});

// Réinitialiser lors du changement de route (si les paramètres changent)
watch(
    [() => route.query.level, () => route.query.letters],
    () => {
      if (route.name === 'dictation') {
        loadDictations();
        currentDictationIndex.value = 0;
        userAnswer.value = '';
        showSolution.value = false;
      }
    }
);
</script>

<style scoped>
.card {
  @apply bg-white shadow p-6 rounded-lg;
}

.btn-primary {
  @apply bg-primary text-white py-2 px-6 rounded hover:bg-opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed;
}

.btn-secondary {
  @apply bg-secondary text-white py-2 px-6 rounded hover:bg-opacity-90 transition;
}
</style>