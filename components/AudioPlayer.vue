<template>
  <div class="bg-white shadow rounded-lg p-4">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold">{{ title || "Dictée" }}</h3>

      <div class="flex space-x-2">
        <button
            @click="toggleLoop"
            class="p-2 rounded-full hover:bg-gray-100 transition"
            :class="{ 'text-accent': isLooping }"
            title="Lecture en boucle"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>

        <div class="relative">
          <button
              @click="showSpeedOptions = !showSpeedOptions"
              class="p-2 rounded-full hover:bg-gray-100 transition"
              :class="{ 'text-accent': playbackRate !== 1 }"
              title="Vitesse de lecture"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>

          <div v-if="showSpeedOptions" class="absolute right-0 mt-1 bg-white shadow-lg rounded-lg z-10">
            <div class="p-2">
              <div class="text-sm font-semibold mb-1">Vitesse</div>
              <div class="flex flex-col space-y-1">
                <button
                    v-for="rate in [0.5, 0.75, 1, 1.25, 1.5]"
                    :key="rate"
                    @click="setPlaybackRate(rate)"
                    class="px-3 py-1 text-left rounded hover:bg-gray-100"
                    :class="{ 'bg-light': playbackRate === rate }"
                >
                  {{ rate }}x
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="flex items-center space-x-4">
      <button
          @click="togglePlay"
          class="p-3 bg-primary text-white rounded-full hover:bg-opacity-90 transition focus:outline-none"
      >
        <svg v-if="!isPlaying" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>

      <div class="flex-grow">
        <div class="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
              class="absolute top-0 left-0 h-full bg-secondary transition-all duration-300"
              :style="{ width: `${