<template>
  <div id="app" class="min-h-screen bg-gray-100">
    <!-- Desktop Navigation -->
    <nav class="hidden md:block bg-white shadow-md">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <div class="flex-shrink-0 flex items-center">
              <h1 class="text-2xl font-bold text-gray-900">🃏 Doppelkopf</h1>
            </div>
            <div class="ml-6 flex space-x-8">
              <router-link to="/" class="nav-link">
                Rangliste
              </router-link>
              <router-link to="/game" class="nav-link">
                Neues Spiel
              </router-link>
              <router-link to="/players" class="nav-link">
                Spieler
              </router-link>
              <router-link to="/stats" class="nav-link">
                Statistiken
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <router-view />
    </main>

    <!-- Mobile Bottom Navigation -->
    <nav class="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200">
      <div class="flex justify-around">
        <router-link to="/" class="mobile-nav-link">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <span class="text-xs mt-1">Rangliste</span>
        </router-link>
        <router-link to="/game" class="mobile-nav-link">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          <span class="text-xs mt-1">Spiel</span>
        </router-link>
        <router-link to="/players" class="mobile-nav-link">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <span class="text-xs mt-1">Spieler</span>
        </router-link>
        <router-link to="/stats" class="mobile-nav-link">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <span class="text-xs mt-1">Stats</span>
        </router-link>
      </div>
    </nav>
  </div>
</template>

<style scoped>
.nav-link {
  @apply inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors;
  @apply border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700;
}

.nav-link.router-link-active {
  @apply border-blue-500 text-gray-900;
}

.mobile-nav-link {
  @apply flex flex-col items-center justify-center py-2 px-3 text-gray-600 hover:text-blue-600 transition-colors;
}

.mobile-nav-link.router-link-active {
  @apply text-blue-600;
}
</style>
