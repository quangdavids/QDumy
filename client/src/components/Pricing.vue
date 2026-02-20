<script setup>
const props = defineProps({ modelValue: Object });
const emit = defineEmits(['update:modelValue']);

const currencies = [
  { symbol: '$', code: 'USD', name: 'US Dollar' },
  { symbol: '€', code: 'EUR', name: 'Euro' },
  { symbol: '£', code: 'GBP', name: 'British Pound' },
];
</script>

<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-xl font-bold text-gray-900">Pricing</h2>
      <p class="mt-1 text-sm text-gray-500">Set the price for your course.</p>
    </div>

    <div class="max-w-md">
      <label class="block text-sm font-medium text-gray-700 mb-1">Course Price</label>
      <div class="relative rounded-md shadow-sm">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span class="text-gray-500 sm:text-sm">$</span>
        </div>
        <input
          type="number"
          v-model="props.modelValue.price"
          class="focus:ring-green-500 focus:border-green-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md py-3"
          placeholder="0.00"
          min="0"
          step="0.01"
        />
        <div class="absolute inset-y-0 right-0 flex items-center">
          <label for="currency" class="sr-only">Currency</label>
          <select
            id="currency"
            name="currency"
            class="focus:ring-green-500 focus:border-green-500 h-full py-0 pl-2 pr-7 border-transparent bg-transparent text-gray-500 sm:text-sm rounded-md"
          >
            <option>USD</option>
            <option>EUR</option>
            <option>GBP</option>
          </select>
        </div>
      </div>
      <p class="mt-2 text-xs text-gray-500">
        Set to 0 for a free course.
      </p>
    </div>

    <div class="bg-blue-50 border-l-4 border-blue-400 p-4 mt-6">
      <div class="flex">
        <div class="flex-shrink-0">
          <i class="fa-solid fa-circle-info text-blue-400"></i>
        </div>
        <div class="ml-3">
          <p class="text-sm text-blue-700">
            Note: The platform takes a 10% commission on all course sales.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
