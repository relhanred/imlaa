<template>
  <div>
    <h1 class="text-3xl font-bold mb-6">Administration des dictées</h1>

    <!-- Formulaire de connexion -->
    <div v-if="!isLoggedIn" class="card bg-white shadow-lg p-8 rounded-xl max-w-md mx-auto">
      <h2 class="text-xl font-bold mb-4">Connexion administrateur</h2>

      <div v-if="authError" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {{ authError }}
      </div>

      <form @submit.prevent="login">
        <div class="mb-4">
          <label for="email" class="block text-gray-700 mb-2">Email</label>
          <input
              v-model="email"
              type="email"
              id="email"
              class="w-full p-2 border border-gray-300 rounded"
              required
          />
        </div>

        <div class="mb-6">
          <label for="password" class="block text-gray-700 mb-2">Mot de passe</label>
          <input
              v-model="password"
              type="password"
              id="password"
              class="w-full p-2 border border-gray-300 rounded"
              required
          />
        </div>

        <button
            type="submit"
            class="w-full bg-primary text-white py-2 px-4 rounded hover:bg-opacity-90 transition"
            :disabled="isLoading"
        >
          {{ isLoading ? 'Connexion en cours...' : 'Se connecter' }}
        </button>
      </form>
    </div>

    <!-- Interface d'administration -->
    <div v-else>
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold">Liste des dictées</h2>
        <button
            @click="showAddForm = true"
            class="bg-secondary text-white py-2 px-4 rounded hover:bg-opacity-90 transition"
        >
          Ajouter une dictée
        </button>
      </div>

      <!-- Filtres -->
      <div class="bg-gray-50 p-4 rounded-lg mb-6">
        <div class="flex flex-wrap gap-4">
          <div>
            <label for="levelFilter" class="block text-gray-700 mb-1">Niveau</label>
            <select
                v-model="levelFilter"
                id="levelFilter"
                class="p-2 border border-gray-300 rounded"
            >
              <option value="">Tous</option>
              <option value="beginner">Débutant</option>
              <option value="intermediate">Intermédiaire</option>
              <option value="advanced">Avancé</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Liste des dictées -->
      <div v-if="isLoading" class="text-center py-8">
        <p>Chargement des dictées...</p>
      </div>

      <div v-else-if="dictations.length === 0" class="text-center py-8 bg-gray-50 rounded-lg">
        <p>Aucune dictée trouvée.</p>
      </div>

      <div v-else class="bg-white shadow overflow-hidden rounded-lg">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Titre</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Niveau</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Difficulté</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="dictation in filteredDictations" :key="dictation.id">
            <td class="px-6 py-4 whitespace-nowrap">{{ dictation.title }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span
                    :class="{
                    'px-2 py-1 text-xs rounded-full': true,
                    'bg-green-100 text-green-800': dictation.level === 'beginner',
                    'bg-yellow-100 text-yellow-800': dictation.level === 'intermediate',
                    'bg-red-100 text-red-800': dictation.level === 'advanced'
                  }"
                >
                  {{
                    dictation.level === 'beginner' ? 'Débutant' :
                        dictation.level === 'intermediate' ? 'Intermédiaire' : 'Avancé'
                  }}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">{{ dictation.difficulty }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex space-x-2">
                <button
                    @click="editDictation(dictation)"
                    class="text-blue-600 hover:text-blue-900"
                >
                  Modifier
                </button>
                <button
                    @click="confirmDelete(dictation.id)"
                    class="text-red-600 hover:text-red-900"
                >
                  Supprimer
                </button>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>

      <!-- Modal ajout/édition -->
      <div v-if="showAddForm || showEditForm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl">
          <h3 class="text-xl font-bold mb-4">
            {{ showEditForm ? 'Modifier la dictée' : 'Ajouter une dictée' }}
          </h3>

          <form @submit.prevent="saveDictation">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label for="title" class="block text-gray-700 mb-1">Titre</label>
                <input
                    v-model="currentDictation.title"
                    type="text"
                    id="title"
                    class="w-full p-2 border border-gray-300 rounded"
                    required
                />
              </div>

              <div>
                <label for="level" class="block text-gray-700 mb-1">Niveau</label>
                <select
                    v-model="currentDictation.level"
                    id="level"
                    class="w-full p-2 border border-gray-300 rounded"
                    required
                >
                  <option value="beginner">Débutant</option>
                  <option value="intermediate">Intermédiaire</option>
                  <option value="advanced">Avancé</option>
                </select>
              </div>

              <div>
                <label for="difficulty" class="block text-gray-700 mb-1">Difficulté (1-10)</label>
                <input
                    v-model.number="currentDictation.difficulty"
                    type="number"
                    id="difficulty"
                    min="1"
                    max="10"
                    class="w-full p-2 border border-gray-300 rounded"
                    required
                />
              </div>

              <div>
                <label for="audioFile" class="block text-gray-700 mb-1">Fichier audio</label>
                <input
                    type="file"
                    id="audioFile"
                    accept="audio/*"
                    @change="handleFileUpload"
                    class="w-full p-2 border border-gray-300 rounded"
                    :required="!showEditForm || !currentDictation.audioUrl"
                />
              </div>
            </div>

            <div class="mb-4">
              <label for="arabic" class="block text-gray-700 mb-1">Texte arabe</label>
              <textarea
                  v-model="currentDictation.arabic"
                  id="arabic"
                  rows="3"
                  dir="rtl"
                  class="w-full p-2 border border-gray-300 rounded text-right font-arabic"
                  required
              ></textarea>
            </div>

            <div class="mb-6">
              <label for="french" class="block text-gray-700 mb-1">Traduction française</label>
              <textarea
                  v-model="currentDictation.french"
                  id="french"
                  rows="3"
                  class="w-full p-2 border border-gray-300 rounded"
                  required
              ></textarea>
            </div>

            <div class="flex justify-end space-x-3">
              <button
                  type="button"
                  @click="closeForm"
                  class="py-2 px-4 border border-gray-300 rounded hover:bg-gray-100 transition"
              >
                Annuler
              </button>
              <button
                  type="submit"
                  class="py-2 px-4 bg-primary text-white rounded hover:bg-opacity-90 transition"
                  :disabled="isSaving"
              >
                {{ isSaving ? 'Enregistrement...' : 'Enregistrer' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Modal confirmation suppression -->
      <div v-if="showDeleteConfirm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
          <h3 class="text-xl font-bold mb-4">Confirmer la suppression</h3>
          <p class="mb-6">Êtes-vous sûr de vouloir supprimer cette dictée? Cette action est irréversible.</p>

          <div class="flex justify-end space-x-3">
            <button
                @click="showDeleteConfirm = false"
                class="py-2 px-4 border border-gray-300 rounded hover:bg-gray-100 transition"
            >
              Annuler
            </button>
            <button
                @click="deleteDictation"
                class="py-2 px-4 bg-red-600 text-white rounded hover:bg-red-700 transition"
                :disabled="isDeleting"
            >
              {{ isDeleting ? 'Suppression...' : 'Supprimer' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const {
  user,
  login: firebaseLogin,
  getDictations: fetchDictations,
  addDictation: fbAddDictation,
  updateDictation: fbUpdateDictation,
  deleteDictation: fbDeleteDictation,
  uploadAudio: fbUploadAudio
} = useFirebase();

// État d'authentification
const isLoggedIn = computed(() => !!user.value);
const email = ref('');
const password = ref('');
const authError = ref('');
const isLoading = ref(false);

// État des dictées
const dictations = ref([]);
const levelFilter = ref('');

// État du formulaire
const showAddForm = ref(false);
const showEditForm = ref(false);
const currentDictation = ref({
  title: '',
  level: 'beginner',
  difficulty: 1,
  arabic: '',
  french: '',
  audioUrl: '',
  audioFile: null
});
const isSaving = ref(false);

// État suppression
const showDeleteConfirm = ref(false);
const dictationIdToDelete = ref(null);
const isDeleting = ref(false);

// Dictées filtrées
const filteredDictations = computed(() => {
  if (!levelFilter.value) return dictations.value;
  return dictations.value.filter(d => d.level === levelFilter.value);
});

// Fonctions
async function login() {
  try {
    isLoading.value = true;
    authError.value = '';
    await firebaseLogin(email.value, password.value);
    await loadDictations();
  } catch (error) {
    authError.value = "Échec de la connexion: " + (error.message || "Vérifiez vos identifiants");
  } finally {
    isLoading.value = false;
  }
}

async function loadDictations() {
  try {
    isLoading.value = true;
    const allDictations = await fetchDictations();
    dictations.value = allDictations;
  } catch (error) {
    console.error("Erreur lors du chargement des dictées:", error);
  } finally {
    isLoading.value = false;
  }
}

function handleFileUpload(event) {
  const file = event.target.files[0];
  if (file) {
    currentDictation.value.audioFile = file;
  }
}

function editDictation(dictation) {
  currentDictation.value = { ...dictation, audioFile: null };
  showEditForm.value = true;
}

function closeForm() {
  showAddForm.value = false;
  showEditForm.value = false;
  currentDictation.value = {
    title: '',
    level: 'beginner',
    difficulty: 1,
    arabic: '',
    french: '',
    audioUrl: '',
    audioFile: null
  };
}

async function saveDictation() {
  try {
    isSaving.value = true;

    const dictationData = { ...currentDictation.value };
    delete dictationData.audioFile;

    // Gérer l'upload du fichier audio si nécessaire
    if (currentDictation.value.audioFile) {
      const filePath = `dictations/${Date.now()}_${currentDictation.value.audioFile.name}`;
      const audioUrl = await fbUploadAudio(currentDictation.value.audioFile, filePath);
      dictationData.audioUrl = audioUrl;
    }

    if (showEditForm.value) {
      // Mode édition
      const id = dictationData.id;
      delete dictationData.id;
      await fbUpdateDictation(id, dictationData);
    } else {
      // Mode ajout
      await fbAddDictation(dictationData);
    }

    await loadDictations();
    closeForm();
  } catch (error) {
    console.error("Erreur lors de l'enregistrement:", error);
    alert("Une erreur est survenue lors de l'enregistrement.");
  } finally {
    isSaving.value = false;
  }
}

function confirmDelete(id) {
  dictationIdToDelete.value = id;
  showDeleteConfirm.value = true;
}

async function deleteDictation() {
  try {
    isDeleting.value = true;
    await fbDeleteDictation(dictationIdToDelete.value);
    await loadDictations();
    showDeleteConfirm.value = false;
  } catch (error) {
    console.error("Erreur lors de la suppression:", error);
    alert("Une erreur est survenue lors de la suppression.");
  } finally {
    isDeleting.value = false;
  }
}

// Chargement initial
onMounted(async () => {
  if (isLoggedIn.value) {
    await loadDictations();
  }
});
</script>