<template>
  <div class="min-h-screen flex flex-col">
    <header class="bg-white shadow-sm">
      <div class="container mx-auto px-4 py-4 flex justify-between items-center">
        <div class="flex items-center">
          <NuxtLink to="/" class="flex items-center">
            <Logo class="h-10 w-auto" />
            <span class="ml-3 text-2xl font-bold text-primary">Imla</span>
          </NuxtLink>
        </div>
        <nav>
          <ul class="flex space-x-6">
            <li>
              <NuxtLink to="/" class="text-gray-600 hover:text-primary transition">
                Accueil
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/dictation" class="text-gray-600 hover:text-primary transition">
                Dictée
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/admin" class="text-gray-600 hover:text-primary transition">
                Admin
              </NuxtLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>

    <main class="flex-grow container mx-auto px-4 py-8">
      <slot />
    </main>

    <footer class="bg-primary text-white py-6">
      <div class="container mx-auto px-4">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <div class="mb-4 md:mb-0">
            <p>&copy; {{ new Date().getFullYear() }} Imla - Application de dictée en arabe</p>
          </div>
          <div class="flex space-x-4">
            <a href="#" class="text-white hover:text-secondary transition">Conditions d'utilisation</a>
            <a href="#" class="text-white hover:text-secondary transition">Confidentialité</a>
            <a href="#" class="text-white hover:text-secondary transition">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>