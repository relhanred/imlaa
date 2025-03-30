<template>
  <div>
    <section class="py-12 md:py-20">
      <div class="text-center mb-12">
        <h1 class="text-4xl md:text-5xl font-bold mb-4 text-primary">Imla - تطبيق الإملاء العربي</h1>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto">
          Améliorez votre écriture en arabe grâce à nos exercices de dictée adaptés à votre niveau de connaissance de l'alphabet arabe.
        </p>
      </div>

      <div class="max-w-3xl mx-auto">
        <div class="card bg-white shadow-lg p-8 rounded-xl">
          <h2 class="text-2xl font-bold text-center mb-6">Choisissez votre niveau</h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <NuxtLink to="/dictation?level=advanced" class="card hover:shadow-lg transition flex flex-col items-center p-6 border border-gray-200 rounded-xl">
              <div class="bg-secondary text-white p-4 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 class="text-xl font-bold mb-2">Je connais l'alphabet</h3>
              <p class="text-gray-600 text-center">Accédez directement aux dictées complètes</p>
            </NuxtLink>

            <NuxtLink to="/pages/select-letter" class="card hover:shadow-lg transition flex flex-col items-center p-6 border border-gray-200 rounded-xl">
              <div class="bg-accent text-white p-4 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h3 class="text-xl font-bold mb-2">Je ne connais pas l'alphabet</h3>
              <p class="text-gray-600 text-center">Sélectionnez la dernière lettre que vous avez apprise</p>
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <section class="py-12 bg-gray-50">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-10">Comment ça marche</h2>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="card">
            <div class="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-4">1</div>
            <h3 class="text-xl font-bold mb-2">Choisissez votre niveau</h3>
            <p class="text-gray-600">Sélectionnez votre niveau de connaissance de l'alphabet arabe pour obtenir des dictées adaptées.</p>
          </div>

          <div class="card">
            <div class="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-4">2</div>
            <h3 class="text-xl font-bold mb-2">Écoutez la dictée</h3>
            <p class="text-gray-600">Écoutez l'audio et essayez d'écrire le texte correctement en arabe.</p>
          </div>

          <div class="card">
            <div class="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-4">3</div>
            <h3 class="text-xl font-bold mb-2">Vérifiez votre réponse</h3>
            <p class="text-gray-600">Comparez votre réponse avec la solution et passez à la dictée suivante.</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>