<template>
    <div class="p-4 md:p-6 bg-gray-50 ">
        <!-- Header Section -->
        <div
            class="bg-white rounded-2xl shadow-sm border border-gray-100/50 p-6 mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div class="flex items-center gap-4">
                <div class="p-3 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-700 text-white shadow-lg">
                    <i class="fas fa-coins text-xl"></i>
                </div>
                <div>
                    <h1 class="text-xl font-bold text-gray-900 tracking-tight">Currency Management</h1>
                    <p class="text-sm text-gray-500 mt-1">Manage your currencies and their symbols</p>
                </div>
            </div>
            <button @click="showAddModal = true"
                class="w-[160px] xs:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white px-4 sm:px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg hover:from-amber-600 hover:to-orange-700 transition-all duration-200 transform hover:scale-[1.02] hover:shadow-xl">
                <i class="fas fa-plus mr-2"></i> Add Currency
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
                                <th
                                    class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                    #</th>
                                <th
                                    class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                    Name</th>
                                <th
                                    class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                    Symbol</th>
                                <th
                                    class="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">
                                    Status</th>
                                <th
                                    class="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">
                                    Type of Rounding</th>
                                <th
                                    class="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">
                                    Decimal Places</th>
                                <th
                                    class="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">
                                    Created By</th>
                                <th
                                    class="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">
                                    Created At</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-100">
                            <tr v-for="(item, index) in currencies" :key="item._id"
                                class="hover:bg-orange-50/50 transition-colors duration-200">
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{{ index + 1
                                    }}</td>
                                <td class="px-6 py-4 whitespace-nowrap">{{ item.name }}</td>
                                <td class="px-6 py-4 whitespace-nowrap text-xl">
                                    <!-- Show all symbols in the symbol object -->
                                    <span v-for="(sym, key) in item.symbol" :key="key" class="mr-2">
                                        {{ sym.symbol || sym }}
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-center">
                                    <span :class="item.status ? 'text-green-600' : 'text-red-600'">
                                        {{ item.status ? 'Active' : 'Inactive' }}
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-center">{{ item.typeOfRounding || '-' }}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-center">{{ item.numberOfDecimalPlaces ?? '-'
                                    }}</td>
                                <td class="px-6 py-4 whitespace-nowrap text-center">
                                    {{ getUserName(item.createdBy) }}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-center">{{ formatDate(item.createdAt) }}
                                </td>
                            </tr>
                            <tr v-if="currencies.length === 0 && !isLoading">
                                <td colspan="8" class="px-6 py-20 text-center text-gray-400">
                                    <div class="flex flex-col items-center gap-4">
                                        <div class="p-6 rounded-2xl bg-orange-50 border border-orange-200">
                                            <i class="fas fa-coins text-5xl text-orange-400"></i>
                                        </div>
                                        <div>
                                            <h3 class="text-lg font-bold text-gray-900">No currencies found</h3>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                </div>
                <div class="px-6 py-4 border-t border-gray-100 bg-gray-50/30">
                    <Pagination :currentPage="currentPage" @onEmitDataFromPagination="handleListenToPagination"
                        @onEmitIsLoading="handleListenIsLoading"
                        @onEmitCurrentPageIsLastRecord="handleListenIsLastRecordOnPage" :limitedPerPage="pageSize"
                        :searchQuery="searchText" />
                </div>
            </div>
        </div>

        <!-- Add Currency Modal -->
        <div v-if="showAddModal"
            class="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-[1000] p-4">
            <div class="bg-white rounded-3xl shadow-2xl w-full max-w-md border border-gray-200">
                <div class="flex items-center justify-between p-6 border-b border-gray-100">
                    <h2 class="text-xl font-bold text-gray-900 tracking-tight">Add Currency</h2>
                    <button
                        class="p-2.5 rounded-xl hover:bg-orange-50 text-orange-400 hover:text-orange-600 transition-all"
                        @click="showAddModal = false">
                        <i class="fas fa-times text-lg"></i>
                    </button>
                </div>
                <form @submit.prevent="createCurrency" class="p-6 space-y-6">
                    <div>
                        <label class="block text-sm font-bold text-gray-700 mb-2">Currency Name</label>
                        <input v-model="newCurrency.name" type="text" placeholder="e.g. KHR"
                            class="border rounded px-3 py-2 w-full" required />
                    </div>
                    <div>
                        <label class="block text-sm font-bold text-gray-700 mb-2">Symbol(s)</label>
                        <select v-model="newCurrency.selectedSymbolId" class="border rounded px-3 py-2 w-full">
                            <option disabled value="">Select a symbol</option>
                            <option v-for="symbol in symbolsList" :key="symbol._id" :value="symbol._id">
                                {{ symbol.symbol }}
                            </option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-bold text-gray-700 mb-2">Type of Rounding</label>
                        <input v-model="newCurrency.typeOfRounding" type="text" placeholder="e.g. no decimal"
                            class="border rounded px-3 py-2 w-full" />
                    </div>
                    <div>
                        <label class="block text-sm font-bold text-gray-700 mb-2">Decimal Places</label>
                        <input v-model.number="newCurrency.numberOfDecimalPlaces" type="number" min="0"
                            class="border rounded px-3 py-2 w-full" />
                    </div>
                    <div class="flex items-center gap-2">
                        <input v-model="newCurrency.status" type="checkbox" class="form-checkbox" />
                        <label class="text-sm font-medium text-gray-700">Active</label>
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
    </div>
</template>

<script setup>
import apiURL from '@/api/config';
import formatDate from '@/composables/formatDate';
import { useStore } from '@/store/useStore';
import axios from 'axios';
import { onMounted, ref } from 'vue';
import Pagination from '@/components/Pagination.vue';

const store = useStore()
const currencies = ref([])
const users = ref([])
const showAddModal = ref(false)
const isLoading = ref(false)
const currentPage = ref(1);
const pageSize = ref(10);
const currentPageIsLastRecord = ref(null);
const searchText = ref("");
const searchQuery = ref('');
const limitedPerPage = ref(1);

const newCurrency = ref({
    name: '',
    selectedSymbolId: '',
    typeOfRounding: '',
    numberOfDecimalPlaces: 0,
    status: true
})

const symbolsList = ref([])

const handleListenToPagination = (items) => {
    currencies.value = items || [];
};
const handleListenIsLoading = (status) => {
    isLoading.value = status;
};
const handleListenIsLastRecordOnPage = (page) => {
    currentPage.value = page;
    if (currentPage.value > 1) {
        currentPage.value -= 1;
    }
};

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

const fetchCurrencies = async () => {
    try {
        isLoading.value = true
        const res = await axios.get(`${apiURL}/api/getAllDocs/Currency`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        currencies.value = res.data.data || []
    } catch (err) {
        alert('Failed to fetch currencies')
    } finally {
        isLoading.value = false
    }
}

const fetchSymbols = async () => {
    try {
        const res = await axios.get(`${apiURL}/api/getAllDocs/SymbolCurrency`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        symbolsList.value = res.data.data || [];
    } catch (err) {
        symbolsList.value = [];
    }
};

const createCurrency = async () => {
    if (!newCurrency.value.name.trim() || !newCurrency.value.selectedSymbolId) return
    isLoading.value = true
    try {
        // Build symbol object map
        const symbolObj = {}
        const sym = symbolsList.value.find(s => s._id === newCurrency.value.selectedSymbolId)
        if (sym) symbolObj[`symbol1`] = sym

        await axios.post(`${apiURL}/api/insertDoc/Currency`, {
            fields: {
                name: newCurrency.value.name.trim(),
                symbol: symbolObj,
                status: newCurrency.value.status,
                typeOfRounding: newCurrency.value.typeOfRounding,
                numberOfDecimalPlaces: newCurrency.value.numberOfDecimalPlaces,
                createdBy: store.getUserId
            }
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        // Reset form
        newCurrency.value = {
            name: '',
            selectedSymbolId: '',
            typeOfRounding: '',
            numberOfDecimalPlaces: 0,
            status: true
        }
        showAddModal.value = false
        await fetchCurrencies()
    } catch (err) {
        alert('Failed to create currency')
    } finally {
        isLoading.value = false
    }
}

onMounted(() => {
    fetchCurrencies()
    fetchUsers()
    fetchSymbols()
})
</script>

<style lang="scss" scoped></style>