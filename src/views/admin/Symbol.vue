<template>
    <div class="p-4 md:p-6 bg-gray-50">
        <!-- Header Section -->
        <div
            class="bg-white rounded-2xl shadow-sm border border-gray-100/50 p-6 mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div class="flex items-center gap-4">
                <div class="p-3 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-700 text-white shadow-lg">
                    <i class="fas fa-coins text-xl"></i>
                </div>
                <div>
                    <h1 class="text-xl font-bold text-gray-900 tracking-tight">Symbol Management</h1>
                    <p class="text-sm text-gray-500 mt-1">Manage your currency symbols</p>
                </div>
            </div>
            <button @click="showAddModal = true"
                class="w-[160px] xs:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white px-4 sm:px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg hover:from-amber-600 hover:to-orange-700 transition-all duration-200 transform hover:scale-[1.02] hover:shadow-xl">
                <i class="fas fa-plus mr-2"></i> Add Symbol
            </button>
        </div>

        <!-- Main Table Card -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100/50 overflow-hidden">
            <div class="relative overflow-hidden">
                <div v-if="isLoading" class="absolute inset-0 bg-white/70 flex items-center justify-center z-10">
                    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
                </div>
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-100">
                        <thead class="bg-gray-50/50">
                            <tr>
                                <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">#</th>
                                <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Symbol</th>
                                <th class="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Status</th>
                                <th class="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Created By</th>
                                <th class="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Created At</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-100">
                            <tr v-for="(item, index) in symbols" :key="item._id"
                                class="hover:bg-orange-50/50 transition-colors duration-200">
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{{ index + 1 }}</td>
                                <td class="px-6 py-4 whitespace-nowrap text-xl">{{ item.symbol }}</td>
                                <td class="px-6 py-4 whitespace-nowrap text-center">
                                    <span :class="item.status ? 'text-green-600' : 'text-red-600'">
                                        {{ item.status ? 'Active' : 'Inactive' }}
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-center">
                                  {{ getUserName(item.createdBy) }}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-center">{{ formatDate(item.createdAt) }}</td>
                            </tr>
                            <tr v-if="symbols.length === 0 && !isLoading">
                                <td colspan="5" class="px-6 py-20 text-center text-gray-400">
                                    <div class="flex flex-col items-center gap-4">
                                        <div class="p-6 rounded-2xl bg-orange-50 border border-orange-200">
                                            <i class="fas fa-coins text-5xl text-orange-400"></i>
                                        </div>
                                        <div>
                                            <h3 class="text-lg font-bold text-gray-900">No symbols found</h3>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <div class="px-6 py-4 border-t border-gray-100 bg-gray-50/30">
                        <Pagination :currentPage="currentPage" @onEmitDataFromPagination="handleListenToPagination"
                            @onEmitIsLoading="handleListenIsLoading"
                            @onEmitCurrentPageIsLastRecord="handleListenIsLastRecordOnPage" :limitedPerPage="pageSize"
                            :searchQuery="searchText" />
                    </div>


                </div>

            </div>
        </div>
    </div>

    <!-- Add Symbol Modal -->
    <div v-if="showAddModal"
        class="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-[1000] p-4">
        <div class="bg-white rounded-3xl shadow-2xl w-full max-w-md border border-gray-200">
            <div class="flex items-center justify-between p-6 border-b border-gray-100">
                <h2 class="text-xl font-bold text-gray-900 tracking-tight">Add Symbol</h2>
                <button class="p-2.5 rounded-xl hover:bg-orange-50 text-orange-400 hover:text-orange-600 transition-all"
                    @click="showAddModal = false">
                    <i class="fas fa-times text-lg"></i>
                </button>
            </div>
            <form @submit.prevent="createSymbol" class="p-6 space-y-6">
                <div>
                    <label class="block text-sm font-bold text-gray-700 mb-2">Symbol</label>
                    <input v-model="newSymbol" type="text" maxlength="2" placeholder="Enter symbol (e.g. ៛, $, ฿)"
                        class="border rounded px-3 py-2 w-full" required />
                </div>
                <div class="flex justify-end gap-3">
                    <button type="button" @click="showAddModal = false"
                        class="px-6 py-3 rounded-2xl text-sm font-bold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all">
                        Cancel
                    </button>
                    <button type="submit"
                        class="px-6 py-3 rounded-2xl bg-orange-600 text-white font-bold hover:bg-orange-700 transition-all"
                        :disabled="isLoading">
                        Add
                    </button>
                </div>
            </form>
        </div>
    </div>

</template>

<script setup>
import apiURL from '@/api/config';
import Pagination from '@/components/Pagination.vue';
import formatDate from '@/composables/formatDate';
import { useStore } from '@/store/useStore';
import axios from 'axios';
import { onMounted, ref } from 'vue';

const store = useStore()
const symbols = ref([])
const users = ref([])
const newSymbol = ref('')
const showAddModal = ref(false)
const isLoading = ref(false)
const currentPage = ref(1);
const pageSize = ref(10);
const currentPageIsLastRecord = ref(null);
const searchText = ref("");
const searchQuery = ref('');
const limitedPerPage = ref(1);

const handleListenToPagination = async (items) => {
    symbols.value = items || [];
};
const handleListenIsLoading = (status) => {
    isLoading.value = status;
};
const handleListenIsLastRecordOnPage = (page) => {
    currentPageIsLastRecord.value = page;
    if (currentPage.value > 1) {
        currentPage.value -= 1;
    }
};



// Fetch all symbols
const fetchSymbols = async () => {
    try {
        isLoading.value = true
        const params = {
            populate: JSON.stringify(['createdBy'])
        }
        const res = await axios.get(`${apiURL}/api/getAllDocs/SymbolCurrency`, {params,
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })

        console.log('Fetched symbols:', res.data.data)
        symbols.value = res.data.data || []
    } catch (err) {
        alert('Failed to fetch symbols')
    } finally {
        isLoading.value = false
    }
}


// Fetch all users
const fetchUsers = async () => {
  try {
    const res = await axios.get(`${apiURL}/api/getAllDocs/User`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    users.value = res.data.data || [];
  } catch (err) {
    users.value = [];
  }
};

const getUserName = (userId) => {
  const user = users.value.find(u => u._id === userId);
  return user?.name || '-';
};

const createSymbol = async () => {
    if (!newSymbol.value.trim()) return
    isLoading.value = true
    try {
        await axios.post(`${apiURL}/api/insertDoc/SymbolCurrency`, {
            fields: {
                symbol: newSymbol.value.trim(),
                createdBy: store.getUserId
            }
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        newSymbol.value = ''
        showAddModal.value = false
        await fetchSymbols()
    } catch (err) {
        alert(err.response?.data?.message || 'Failed to create symbol')
    } finally {
        isLoading.value = false
    }
}

onMounted(async () => {
    await fetchSymbols()
    await fetchUsers()
})
</script>

<style scoped>
/* Match Orders page style */
.overflow-y-auto::-webkit-scrollbar {
    width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
    background-color: #f9f9f6;
    border-radius: 20px;
}

.overflow-y-auto::-webkit-scrollbar-track {
    background: #f1f1f1;
}
</style>