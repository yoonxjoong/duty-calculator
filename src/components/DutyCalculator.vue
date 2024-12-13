<template>
  <div class="min-h-screen bg-white">
    <div class="w-[430px] min-h-screen mx-auto bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
    <!-- Splash Screen -->
    <div
        v-if="showSplash"
        class="fixed w-[430px] left-1/2 -translate-x-1/2 inset-y-0 z-50 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600"
    >
      <div class="absolute inset-0 opacity-30">
        <div class="absolute top-1/4 left-1/4 w-48 h-48 bg-white rounded-full blur-3xl"></div>
        <div class="absolute top-1/3 right-1/4 w-64 h-64 bg-blue-200 rounded-full blur-3xl"></div>
        <div class="absolute bottom-1/4 left-1/3 w-56 h-56 bg-purple-200 rounded-full blur-3xl"></div>
      </div>

      <div class="relative h-full flex flex-col items-center justify-center p-6 text-center">
        <div class="animate-float mb-8">
          <div class="relative">
            <div class="absolute inset-0 bg-white/20 rounded-full blur-xl transform scale-110"></div>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-20 w-20 text-white" fill="none"
                 viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
                    d="M3 21v-4m0 0H1m2 4L9 15m-5 4V9a6 6 0 0112 0v6m0 0l-4-2m4 2h-4"/>
            </svg>
          </div>
        </div>
        <h1 class="text-3xl font-bold text-white mb-3 animate-fade-in">
          관부가세 계산기
        </h1>
        <p class="text-blue-100 text-sm mb-8 animate-fade-in-delay max-w-[200px]">
          해외 직구, 이제 더 쉽고 정확하게
        </p>
        <button
            @click="startCalculator"
            class="group px-8 py-3 bg-white/90 backdrop-blur-sm text-blue-600 rounded-full text-sm font-medium
                 shadow-lg hover:bg-white transition-all duration-300 transform hover:scale-105"
        >
          시작하기
          <span class="inline-block ml-2 transition-transform group-hover:translate-x-1">→</span>
        </button>
      </div>
    </div>

    <!-- Main Calculator -->
    <div v-if="!showSplash" class="w-full min-h-screen">
      <!-- Header -->
      <header class="bg-white/80 backdrop-blur-md shadow-sm border-b border-white/20">
        <div class="px-4 py-3">
          <h1 class="text-lg font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            관부가세 계산기
          </h1>
          <div class="flex justify-center items-center gap-2 mt-1">
            <span class="w-2 h-2 rounded-full bg-blue-500"></span>
            <span class="text-xs text-gray-500">{{ steps[currentStep - 1].title }}</span>
          </div>
        </div>

        <!-- Progress Bar -->
        <div class="h-1 bg-gradient-to-r from-blue-500 to-purple-500 transform scale-x-0 origin-left transition-transform duration-500"
             :style="`transform: scaleX(${(currentStep - 1) / 3})`">
        </div>
      </header>

      <!-- Main Content -->
      <div class="flex-1 p-4 overflow-auto">
        <!-- Step 1: Country Selection -->
        <div v-if="currentStep === 1" class="space-y-6 animate-fade-in">
          <div class="text-center mb-6">
            <h2 class="text-lg font-medium text-gray-800 mb-2">구매 국가 선택</h2>
            <p class="text-xs text-gray-500">해외직구를 진행할 국가를 선택해주세요</p>
          </div>

          <div class="grid grid-cols-3 gap-4">
            <button
                v-for="country in countries"
                :key="country.code"
                @click="selectedCountry = country.code"
                class="group relative"
            >
              <div :class="[
                'relative p-4 rounded-2xl transition-all duration-300 transform',
                selectedCountry === country.code
                  ? 'bg-blue-50 ring-2 ring-blue-400 scale-105'
                  : 'bg-white/80 hover:bg-white shadow-sm hover:shadow-md'
              ]">
                <div class="w-12 h-12 mx-auto mb-3 rounded-xl overflow-hidden ring-2 ring-white/50">
                  <img :src="country.flag" :alt="country.name" class="w-full h-full object-cover">
                </div>
                <p class="text-xs font-medium"
                   :class="selectedCountry === country.code ? 'text-blue-600' : 'text-gray-600'">
                  {{ country.name }}
                </p>
              </div>
            </button>
          </div>
        </div>

        <!-- Step 2: Product Selection -->
        <div v-if="currentStep === 2" class="space-y-6 animate-fade-in">
          <div class="text-center mb-6">
            <h2 class="text-lg font-medium text-gray-800 mb-2">상품 정보</h2>
            <p class="text-xs text-gray-500">구매하실 상품의 종류를 선택해주세요</p>
          </div>

          <div class="space-y-4">
            <div class="relative">
              <select
                  v-model="selectedCategory"
                  class="w-full text-sm bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl p-3 pr-10 appearance-none
                       focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              >
                <option value="">카테고리 선택</option>
                <option
                    v-for="(items, categoryName) in availableCategories"
                    :key="categoryName"
                    :value="categoryName"
                >
                  {{ categoryName }}
                </option>
              </select>
              <div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>

            <div class="relative">
              <select
                  v-model="selectedItem"
                  class="w-full text-sm bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl p-3 pr-10 appearance-none
                       focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  :disabled="!selectedCategory"
              >
                <option value="">상품 선택</option>
                <option
                    v-for="(itemData, itemName) in availableItems"
                    :key="itemName"
                    :value="itemName"
                >
                  {{ itemName }}
                </option>
              </select>
              <div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 3: Price Input -->
        <div v-if="currentStep === 3" class="space-y-6 animate-fade-in">
          <div class="text-center mb-6">
            <h2 class="text-lg font-medium text-gray-800 mb-2">가격 정보</h2>
            <p class="text-xs text-gray-500">상품 금액과 배송비를 입력해주세요</p>
          </div>

          <div class="space-y-4">
            <div class="relative">
              <label class="text-xs font-medium text-gray-500 mb-1.5 block">상품 가격</label>
              <div class="relative">
                <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                <input
                    type="number"
                    v-model.number="productPrice"
                    placeholder="0.00"
                    class="w-full text-sm bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl p-3 pl-8
                         focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                />
              </div>
            </div>

            <div class="relative">
              <label class="text-xs font-medium text-gray-500 mb-1.5 block">배송비</label>
              <div class="relative">
                <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                <input
                    type="number"
                    v-model.number="shippingCost"
                    placeholder="0.00"
                    class="w-full text-sm bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl p-3 pl-8
                         focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Step 4: Results -->
        <div v-if="currentStep === 4 && result" class="space-y-6 animate-fade-in">
          <div class="text-center mb-6">
            <h2 class="text-lg font-medium text-gray-800 mb-2">계산 결과</h2>
            <p class="text-xs text-gray-500">최종 세금 계산 결과입니다</p>
          </div>

          <div class="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-sm space-y-4">
            <div class="flex justify-between items-center pb-4 border-b border-gray-100">
              <div>
                <span class="text-xs text-gray-400 block mb-0.5">과세 대상 금액</span>
                <span class="text-sm font-medium text-gray-800">${{ taxableAmount }}</span>
              </div>
              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>

            <div class="flex justify-between items-center py-4 border-b border-gray-100">
              <div>
                <span class="text-xs text-gray-400 block mb-0.5">관세 ({{ getDutyRate }}%)</span>
                <span class="text-sm font-medium text-gray-800">${{ duty }}</span>
              </div>
              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z"></path>
              </svg>
            </div>

            <div class="flex justify-between items-center py-4 border-b border-gray-100">
              <div>
                <span class="text-xs text-gray-400 block mb-0.5">부가세 ({{ getVatRate }}%)</span>
                <span class="text-sm font-medium text-gray-800">${{ vat }}</span>
              </div>
              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path>
                <path d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path>
              </svg>
            </div>

            <div class="flex justify-between items-center pt-4">
              <div>
                <span class="text-xs font-medium text-blue-500 block mb-0.5">총 납부세액</span>
                <span class="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  ${{ totalTax }}
                </span>
              </div>
              <div class="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
          </div>

          <!-- Share Results Button -->
          <button class="w-full bg-gray-50 hover:bg-gray-100 text-gray-600 text-sm font-medium p-3 rounded-xl flex items-center justify-center gap-2 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
            </svg>
            결과 공유하기
          </button>
        </div>
      </div>

      <!-- Bottom Navigation -->
      <div class="fixed bottom-0 w-[430px] bg-white/80 backdrop-blur-md border-t border-gray-100 p-4 z-40">
        <div class="flex gap-3">
          <button
              @click="goToPreviousStep"
              class="flex-1 py-3 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium transition-colors
                   disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              :disabled="currentStep === 1"
          >
            <svg class="w-4 h-4 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
            이전
          </button>

          <button
              v-if="currentStep < 3"
              @click="goToNextStep"
              class="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-medium
                   disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all
                   hover:shadow-lg hover:from-blue-600 hover:to-purple-600"
              :disabled="(currentStep === 1 && !selectedCountry) || (currentStep === 2 && !(selectedCategory && selectedItem))"
          >
            다음
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </button>

          <button
              v-else-if="currentStep === 3"
              @click="calculate"
              class="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-medium
                   disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all
                   hover:shadow-lg hover:from-blue-600 hover:to-purple-600"
              :disabled="!canCalculate"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
            </svg>
            계산하기
          </button>

          <button
              v-else-if="currentStep === 4"
              @click="resetAll"
              class="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-medium
                   flex items-center justify-center gap-2 transition-all hover:shadow-lg hover:from-blue-600 hover:to-purple-600"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            다시 계산하기
          </button>
        </div>
      </div>

      <!-- Loading Overlay -->
      <div
          v-if="isLoading"
          class="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center"
      >
        <div class="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-xl text-center max-w-[200px] mx-4">
          <div class="relative mb-4">
            <div class="w-12 h-12 mx-auto border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <div class="absolute inset-0 transform rotate-45">
              <div class="w-12 h-12 mx-auto border-4 border-transparent border-t-purple-600 rounded-full animate-spin"></div>
            </div>
          </div>
          <p class="text-sm text-gray-600">계산 중입니다...</p>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-out forwards;
}

.animate-fade-in-delay {
  animation: fadeIn 0.5s ease-out 0.3s both;
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

/* Hide number input spinners */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type="number"] {
  -moz-appearance: textfield;
}
</style>

<script setup>
import { ref, computed } from 'vue'

// Constants
const steps = [
  { id: 1, title: '국가 선택' },
  { id: 2, title: '상품 선택' },
  { id: 3, title: '가격 입력' },
  { id: 4, title: '결과 확인' }
]

const countries = [
  { code: 'us', name: '미국', flag: '/images/flags/usa.png' },
  { code: 'uk', name: '영국', flag: '/images/flags/uk.png' },
  { code: 'jp', name: '일본', flag: '/images/flags/japan.png' }
]

// State
const currentStep = ref(1)
const productPrice = ref('')
const shippingCost = ref('')
const selectedCountry = ref('')
const selectedCategory = ref('')
const selectedItem = ref('')
const result = ref(null)
const showSplash = ref(true)
const isLoading = ref(false)

// Tax rates data
const taxRates = {
  "us": {
    "전자제품": {
      items: {
        "노트북": { dutyRate: 2, vatRate: 10 },
        "스마트폰": { dutyRate: 1.5, vatRate: 10 }
      }
    },
    "의류": {
      items: {
        "티셔츠": { dutyRate: 5, vatRate: 10 },
        "청바지": { dutyRate: 5, vatRate: 10 }
      }
    }
  },
  "uk": {
    "화장품": {
      items: {
        "향수": { dutyRate: 3, vatRate: 20 },
        "립스틱": { dutyRate: 3, vatRate: 20 }
      }
    }
  },
  "jp": {
    "식품": {
      items: {
        "과자": { dutyRate: 8, vatRate: 10 },
      }
    }
  }
}

// Computed properties
const availableCategories = computed(() => {
  if (!selectedCountry.value) return {}
  return taxRates[selectedCountry.value] || {}
})

const availableItems = computed(() => {
  if (!selectedCategory.value) return {}
  const categoryData = taxRates[selectedCountry.value]?.[selectedCategory.value]
  return categoryData?.items || {}
})

const canCalculate = computed(() => {
  return productPrice.value > 0 && shippingCost.value >= 0 && selectedCountry.value &&
      selectedCategory.value && selectedItem.value
})

const getDutyRate = computed(() => {
  if (!selectedItem.value) return 0
  return taxRates[selectedCountry.value][selectedCategory.value].items[selectedItem.value].dutyRate
})

const getVatRate = computed(() => {
  if (!selectedItem.value) return 0
  return taxRates[selectedCountry.value][selectedCategory.value].items[selectedItem.value].vatRate
})

const taxableAmount = computed(() => (result.value ? result.value.taxableAmount.toFixed(2) : '0.00'))
const duty = computed(() => (result.value ? result.value.duty.toFixed(2) : '0.00'))
const vat = computed(() => (result.value ? result.value.vat.toFixed(2) : '0.00'))
const totalTax = computed(() => (result.value ? result.value.totalTax.toFixed(2) : '0.00'))

// Methods
const startCalculator = () => {
  showSplash.value = false
}

const calculate = () => {
  if (!canCalculate.value) return

  isLoading.value = true

  setTimeout(() => {
    const { dutyRate, vatRate } = taxRates[selectedCountry.value][selectedCategory.value].items[selectedItem.value]

    const taxableAmountVal = productPrice.value + (shippingCost.value || 0)
    const dutyVal = taxableAmountVal * (dutyRate / 100)
    const vatVal = (taxableAmountVal + dutyVal) * (vatRate / 100)
    const totalTaxVal = dutyVal + vatVal

    result.value = {
      taxableAmount: taxableAmountVal,
      duty: dutyVal,
      vat: vatVal,
      totalTax: totalTaxVal
    }

    isLoading.value = false
    goToNextStep()
  }, 1500)
}

const goToNextStep = () => {
  if (currentStep.value < 4) {
    currentStep.value++
  }
}

const goToPreviousStep = () => {
  if (currentStep.value > 1) {
    if (currentStep.value === 2) {
      selectedCategory.value = ''
      selectedItem.value = ''
    }
    if (currentStep.value === 3) {
      productPrice.value = ''
      shippingCost.value = ''
    }
    currentStep.value--
  }
}

const resetAll = () => {
  currentStep.value = 1
  selectedCountry.value = ''
  selectedCategory.value = ''
  selectedItem.value = ''
  productPrice.value = ''
  shippingCost.value = ''
  result.value = null
  showSplash.value = true
}
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
}

.animate-fade-in {
  animation: fadeIn 1s ease-out;
}

.animate-fade-in-delay {
  animation: fadeIn 1s ease-out 0.5s both;
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}
</style>