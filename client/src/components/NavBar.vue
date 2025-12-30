<script setup>
    
</script>

<template>
  <nav class="bg-black border-gray-200 shadow-sm top-0 z-150">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between text-white items-center h-16">
        <!-- Logo Section -->
        <div class="flex-shrink-0 flex items-center gap-2">
          <RouterLink to="/" class="flex items-center hover:opacity-80 transition-opacity">
            <img src="/images/quangdemy.png" class="h-8 w-auto" alt="QuangStudy Logo" />
            <span class="font-bold text-lg text-gray-900 ml-2 hidden sm:inline">QuangStudy</span>
          </RouterLink>
        </div>

        <!-- Desktop Navigation -->
        <div class="hidden lg:flex items-center justify-between flex-1 ml-8">
          <!-- Search Bar -->
          <form @submit.prevent="handleSearch" class="flex-1 max-w-md">
            <div class="relative">
              <input
                v-model="searchQuery"
                type="text"
                class="w-full bg-gray-100 text-gray-900 py-2 px-4 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all"
                placeholder="Search courses..."
              />
              <button
                type="submit"
                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <i class="fa-solid fa-magnifying-glass text-sm"></i>
              </button>
            </div>
          </form>

          <!-- Desktop Menu Items -->
          <div class="flex items-center space-x-8 ml-8">
            <!-- Cart -->
            <RouterLink
              to="/cart"
              class="relative hover:text-green-600 transition-colors flex items-center gap-2"
              title="Shopping Cart"
            >
              <i class="fa-solid fa-shopping-cart text-lg"></i>
              <span
                v-if="cartCount > 0"
                class="absolute -top-2 -right-3 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center font-semibold"
              >
                {{ cartCount }}
              </span>
            </RouterLink>

            <!-- Become a Lecturer -->
            <div
              class="hover:text-green-600 transition-colors cursor-pointer text-sm font-medium"
              @click="toLecturer(user?._id)"
              title="Become an Instructor"
            >
              Teach
            </div>

            <!-- Auth Menu -->
            <template v-if="isAuthenticated">
              <Menu as="div" class="relative z-1000">
                <MenuButton class="flex items-center gap-3 hover:opacity-80 transition-opacity">
                  <div class="text-right hidden sm:block">
                    <p class="text-xs">Welcome</p>
                    <p class="text-sm font-medium text-gray-900">{{ user?.username }}</p>
                  </div>
                  <img
                    :src="user.profileImg"
                    class="w-9 h-9 rounded-full object-cover border border-gray-200 hover:border-green-500 transition-colors"
                    :alt="user?.username"
                  />
                </MenuButton>

                <!-- Dropdown Menu -->
                <transition
                  enter-active-class="transition ease-out duration-100"
                  enter-from-class="transform opacity-0 scale-95"
                  enter-to-class="transform opacity-100 scale-100"
                  leave-active-class="transition ease-in duration-75"
                  leave-from-class="transform opacity-100 scale-100"
                  leave-to-class="transform opacity-0 scale-95"
                >
                  <MenuItems
                    class="absolute bg-white text-black right-0 mt-2 w-56 rounded-lg shadow-lg border divide-y divide-gray-100 overflow-hidden"
                  >
                    <!-- User Info -->
                    <div class="px-4 py-3">
                      <p class="text-sm font-medium text-gray-900">{{ user?.username }}</p>
                      <p class="text-xs text-gray-500 mt-1">{{ user?.email }}</p>
                    </div>

                    <!-- Menu Items -->
                    <div class="py-1">
                      <MenuItem v-slot="{ active }">
                        <RouterLink
                          to="/user/dashboard"
                          :class="[
                            active ? 'bg-gray-100' : '',
                            'block px-4 py-2 text-sm  hover:text-gray-900 transition-colors',
                          ]"
                        >
                          <i class="fa-solid fa-chart-line mr-2 w-4"></i>Dashboard
                        </RouterLink>
                      </MenuItem>
                      <MenuItem v-slot="{ active }">
                        <RouterLink
                          to="/user/profile"
                          :class="[
                            active ? 'bg-gray-100' : '',
                            'block px-4 py-2 text-sm  hover:text-gray-900 transition-colors',
                          ]"
                        >
                          <i class="fa-solid fa-user mr-2 w-4"></i>Profile
                        </RouterLink>
                      </MenuItem>
                      <MenuItem v-slot="{ active }">
                        <RouterLink
                          to="/cart"
                          :class="[
                            active ? 'bg-gray-100' : '',
                            'block px-4 py-2 text-sm  hover:text-gray-900 transition-colors',
                          ]"
                        >
                          <i class="fa-solid fa-shopping-cart mr-2 w-4"></i>My Cart
                        </RouterLink>
                      </MenuItem>
                    </div>

                    <!-- Sign Out -->
                    <div class="py-1">
                      <MenuItem v-slot="{ active }">
                        <button
                          @click="signOut"
                          :class="[
                            active ? 'bg-red-50' : '',
                            'w-full text-left px-4 py-2 text-sm text-red-600 hover:text-red-700 transition-colors',
                          ]"
                        >
                          <i class="fa-solid fa-sign-out-alt mr-2 w-4"></i>Sign Out
                        </button>
                      </MenuItem>
                    </div>
                  </MenuItems>
                </transition>
              </Menu>
            </template>

            <template v-else>
              <RouterLink
                to="/login"
                class="hover:text-green-600 transition-colors text-sm font-medium"
              >
                Login
              </RouterLink>
              <RouterLink
                to="/register"
                class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
              >
                Sign Up
              </RouterLink>
            </template>
          </div>
        </div>

        <!-- Mobile menu button -->
        <div class="flex lg:hidden gap-4">
          <!-- Mobile Cart -->
          <RouterLink to="/cart" class="relative hover:text-green-600 transition-colors">
            <i class="fa-solid fa-shopping-cart text-xl"></i>
            <span
              v-if="cartCount > 0"
              class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center font-semibold"
            >
              {{ cartCount }}
            </span>
          </RouterLink>

          <!-- Mobile Menu Toggle -->
          <button
            @click="isMobileMenuOpen = !isMobileMenuOpen"
            class="hover:text-green-600 transition-colors"
          >
            <i class="fa-solid text-xl" :class="isMobileMenuOpen ? 'fa-times' : 'fa-bars'"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile menu -->
    <transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <div v-if="isMobileMenuOpen" class="lg:hidden bg-white border-t border-gray-200">
        <div class="px-2 pt-2 pb-3 space-y-1">
          <!-- Mobile Search -->
          <form @submit.prevent="handleSearch" class="p-2 mb-2">
            <div class="relative">
              <input
                v-model="searchQuery"
                type="text"
                class="w-full bg-gray-100 text-gray-900 py-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Search courses..."
              />
              <button
                type="submit"
                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              >
                <i class="fa-solid fa-magnifying-glass"></i>
              </button>
            </div>
          </form>

          <!-- Mobile Menu Items -->
          <div class="space-y-1 border-t border-gray-100 pt-2">
            <div
              class="block px-3 py-2 rounded-md hover:bg-gray-100 cursor-pointer font-medium text-sm"
              @click="
                toLecturer(user?._id)
                closeMobileMenu()
              "
            >
              <i class="fa-solid fa-chalkboard-user mr-2 w-4"></i>Teach
            </div>

            <template v-if="isAuthenticated">
              <RouterLink
                to="/user/dashboard"
                class="block px-3 py-2 rounded-md hover:bg-gray-100 text-sm"
                @click="closeMobileMenu"
              >
                <i class="fa-solid fa-chart-line mr-2 w-4"></i>Dashboard
              </RouterLink>
              <RouterLink
                to="/user/profile"
                class="block px-3 py-2 rounded-md hover:bg-gray-100 text-sm"
                @click="closeMobileMenu"
              >
                <i class="fa-solid fa-user mr-2 w-4"></i>Profile
              </RouterLink>
              <button
                @click="
                  signOut()
                  closeMobileMenu()
                "
                class="w-full text-left px-3 py-2 rounded-md text-red-600 hover:bg-red-50 text-sm font-medium"
              >
                <i class="fa-solid fa-sign-out-alt mr-2 w-4"></i>Sign Out
              </button>
            </template>
            <template v-else>
              <RouterLink
                to="/login"
                class="block px-3 py-2 rounded-md hover:bg-gray-100 text-sm font-medium"
                @click="closeMobileMenu"
              >
                <i class="fa-solid fa-sign-in-alt mr-2 w-4"></i>Login
              </RouterLink>
              <RouterLink
                to="/register"
                class="block px-3 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 text-sm font-medium"
                @click="closeMobileMenu"
              >
                <i class="fa-solid fa-user-plus mr-2 w-4"></i>Sign Up
              </RouterLink>
            </template>
          </div>
        </div>
      </div>
    </transition>
  </nav>
</template>

<style lang="css" scoped>
.sticky {
  position: sticky;
  top: 0;
  z-index: 50;
}
</style>
