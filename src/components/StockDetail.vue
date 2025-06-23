<script setup>
import { ref, onMounted, watch } from 'vue';
import apiURL from '@/api/config';
import axios from 'axios';

// Define props to accept stock ID from parent component
const props = defineProps({
    stockId: {
        type: String,
        required: true
    },
    show: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['close']);

const stockData = ref(null);
const productData = ref(null);
const categoryData = ref(null);
const isLoading = ref(false);
const error = ref('');

const formatDate = (dateString) => {
    if (!dateString) return '-';

    const options = {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };

    return new Date(dateString).toLocaleDateString('en-US', options);
};

const formatPrice = (price) => {
    return new Intl.NumberFormat('km-KH').format(price || 0) + '៛';
};

const fetchStockDetails = async () => {
    if (!props.stockId) return;

    isLoading.value = true;
    error.value = '';

    try {
        const token = localStorage.getItem('token');
        if (!token) {
            error.value = 'Authentication required. Please login again.';
            return;
        }

        // Fetch stock data with the specific ID
        const response = await axios.get(`${apiURL}/api/getAllDocs/Stock`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            params: {
                dynamicConditions: JSON.stringify([
                    {
                        field: '_id',
                        operator: '==',
                        value: props.stockId
                    }
                ])
            }
        });

        if (response.data.data && response.data.data.length > 0) {
            stockData.value = response.data.data[0];

            // Fetch product and category details
            if (stockData.value.productId) {
                await fetchProductDetails(stockData.value.productId);
            }

            if (stockData.value.categoryId) {
                await fetchCategoryDetails(stockData.value.categoryId);
            }
        } else {
            error.value = 'Stock record not found';
        }
    } catch (err) {
        console.error('Error fetching stock details:', err);
        error.value = err.response?.data?.message || err.message || 'Failed to load stock details';
    } finally {
        isLoading.value = false;
    }
};

const fetchProductDetails = async (productId) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${apiURL}/api/getAllDocs/Product`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            params: {
                dynamicConditions: JSON.stringify([
                    {
                        field: '_id',
                        operator: '==',
                        value: productId
                    }
                ])
            }
        });

        if (response.data.data && response.data.data.length > 0) {
            productData.value = response.data.data[0];
        }
    } catch (err) {
        console.error('Error fetching product details:', err);
    }
};

const fetchCategoryDetails = async (categoryId) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${apiURL}/api/getAllDocs/Category`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            params: {
                dynamicConditions: JSON.stringify([
                    {
                        field: '_id',
                        operator: '==',
                        value: categoryId
                    }
                ])
            }
        });

        if (response.data.data && response.data.data.length > 0) {
            categoryData.value = response.data.data[0];
        }
    } catch (err) {
        console.error('Error fetching category details:', err);
    }
};

const getStockStatus = () => {
    if (!stockData.value) return { text: 'Unknown', colorClass: 'text-gray-500' };

    if (stockData.value.isOutOfStock) {
        return { text: 'Out of Stock', colorClass: 'text-red-600' };
    } else if (stockData.value.quantity <= stockData.value.minThreshold) {
        return { text: 'Low Stock', colorClass: 'text-amber-600' };
    } else {
        return { text: 'In Stock', colorClass: 'text-green-600' };
    }
};

watch(() => props.stockId, (newVal) => {
    if (newVal && props.show) {
        fetchStockDetails();
    }
});

watch(() => props.show, (newVal) => {
    if (newVal && props.stockId) {
        fetchStockDetails();
    }
});

onMounted(() => {
    if (props.show && props.stockId) {
        fetchStockDetails();
    }
});
</script>

<template>
    <div v-if="show"
        class="fixed inset-0 flex justify-center items-start bg-black/60 backdrop-blur-sm z-[1000] p-4 overflow-auto">
        <div class="bg-white w-full max-w-2xl rounded-lg shadow-xl p-6">
            <!-- Loading state -->
            <div v-if="isLoading" class="py-12 text-center">
                <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-green-500 mx-auto"></div>
                <p class="mt-4 text-gray-600">Loading stock details...</p>
            </div>

            <!-- Error state -->
            <div v-else-if="error" class="py-12 text-center text-red-600">
                {{ error }}
            </div>

            <!-- No data state -->
            <div v-else-if="!stockData" class="py-12 text-center text-gray-600">
                Stock details not found.
            </div>

            <!-- Stock Details -->
            <div v-else class="text-gray-800">
                <!-- Header -->
                <div class="flex justify-between items-start mb-6">
                    <div class="flex items-center">
                        <div
                            class="bg-green-500 rounded-full h-10 w-10 flex items-center justify-center mr-3 text-white">
                            <i class="fas fa-box-open"></i>
                        </div>
                        <div>
                            <h1 class="text-xl font-bold">Stock Details</h1>
                        </div>
                    </div>
                    <div class="text-right">
                        <span :class="['px-2.5 py-1 rounded-full text-xs font-medium', getStockStatus().colorClass]">
                            {{ getStockStatus().text }}
                        </span>
                        <button @click="$emit('close')" class="text-gray-500 hover:text-red-600 ml-4">
                            <i class="fas fa-times text-xl"></i>
                        </button>
                    </div>
                </div>

                <!-- Product Details with Image -->
                <div class="flex flex-col md:flex-row gap-6 mb-6">
                    <!-- Product Image -->
                    <div class="md:w-1/3">
                        <div
                            class="bg-gray-100 rounded-lg border border-gray-200 h-48 flex items-center justify-center overflow-hidden">
                            <img v-if="stockData.imageURL" :src="stockData.imageURL" alt="Product Image"
                                class="max-h-full max-w-full object-contain" />
                            <div v-else class="text-gray-400">
                                <i class="fas fa-image text-4xl"></i>
                                <p class="mt-2 text-xs">No image available</p>
                            </div>
                        </div>
                    </div>

                    <!-- Product Info -->
                    <div class="md:w-2/3">

                        <h2 class="text-lg font-bold mb-2"><span class="text-gray-600">Product:</span>
                            {{ stockData.name }}</h2>
                        <div class="text-sm mb-4" v-if="stockData.description">
                            <p class="text-gray-600">{{ stockData.description }}</p>
                        </div>

                        <div class="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p class="font-medium text-gray-500">Quantity</p>
                                <p class="font-bold text-xl">
                                    {{ stockData.quantity }} <span class="text-sm">{{ stockData.unit }}</span>
                                </p>
                            </div>
                            <!-- <div>
                                <p class="font-medium text-gray-500">Category</p>
                                <p>{{ categoryData ? categoryData.name : 'Unknown' }}</p>
                            </div> -->
                        </div>
                    </div>
                </div>

                <!-- Stock Management Info -->
                <div class="mb-6">
                    <h2 class="text-gray-500 text-sm mb-2 pb-1 border-b border-gray-200">Stock Management</h2>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                            <p class="font-medium text-gray-500">Min Threshold</p>
                            <p>{{ stockData.minThreshold }} {{ stockData.unit }}</p>
                        </div>
                        <div>
                            <p class="font-medium text-gray-500">Max Capacity</p>
                            <p>{{ stockData.maxCapacity }} {{ stockData.unit }}</p>
                        </div>
                        <div>
                            <p class="font-medium text-gray-500">Stock Level</p>
                            <div class="w-full bg-gray-200 h-2 rounded-full mt-2">
                                <div class="h-2 rounded-full" :class="{
                                    'bg-red-500': stockData.quantity <= stockData.minThreshold,
                                    'bg-amber-500': stockData.quantity > stockData.minThreshold && stockData.quantity < stockData.maxCapacity * 0.5,
                                    'bg-green-500': stockData.quantity >= stockData.maxCapacity * 0.5
                                }"
                                    :style="`width: ${Math.min(100, (stockData.quantity / stockData.maxCapacity) * 100)}%`">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Recent Activity -->
                <div class="mb-6">
                    <h2 class="text-gray-500 text-sm mb-2 pb-1 border-b border-gray-200">Activity Timeline</h2>
                    <div class="text-sm space-y-3">
                        <div v-if="stockData.lastRestockedAt" class="flex items-start">
                            <div class="bg-green-100 p-1.5 rounded-full text-green-600 mr-2">
                                <i class="fas fa-plus text-xs"></i>
                            </div>
                            <div>
                                <p class="font-medium">Last Restocked</p>
                                <p class="text-gray-500">{{ formatDate(stockData.lastRestockedAt) }}</p>
                            </div>
                        </div>
                        <div v-if="stockData.lastSoldAt" class="flex items-start">
                            <div class="bg-blue-100 p-1.5 rounded-full text-blue-600 mr-2">
                                <i class="fas fa-shopping-cart text-xs"></i>
                            </div>
                            <div>
                                <p class="font-medium">Last Sold</p>
                                <p class="text-gray-500">{{ formatDate(stockData.lastSoldAt) }}</p>
                            </div>
                        </div>
                        <div class="flex items-start">
                            <div class="bg-gray-100 p-1.5 rounded-full text-gray-600 mr-2">
                                <i class="fas fa-clock text-xs"></i>
                            </div>
                            <div>
                                <p class="font-medium">Created At</p>
                                <p class="text-gray-500">{{ formatDate(stockData.createdAt) }}</p>
                            </div>
                        </div>
                        <div v-if="stockData.updatedAt && stockData.updatedAt !== stockData.createdAt"
                            class="flex items-start">
                            <div class="bg-amber-100 p-1.5 rounded-full text-amber-600 mr-2">
                                <i class="fas fa-edit text-xs"></i>
                            </div>
                            <div>
                                <p class="font-medium">Last Updated</p>
                                <p class="text-gray-500">{{ formatDate(stockData.updatedAt) }}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Purchase History Section (if there are purchase products) -->
                <!-- <div v-if="stockData.purchaseProducts && Object.keys(stockData.purchaseProducts).length > 0" class="mb-6">
                    <h2 class="text-gray-500 text-sm mb-2 pb-1 border-b border-gray-200">Last Purchase</h2>
                    <div class="overflow-x-auto">
                        <table class="w-full text-sm">
                            <thead>
                                <tr class="text-left text-gray-500">
                                    <th class="py-2">Product</th>
                                    <th class="py-2 text-center">Quantity</th>
                                    <th class="py-2 text-center">Unit</th>
                                    <th class="py-2 text-right">Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(purchase, id) in stockData.purchaseProducts" :key="id"
                                    class="border-b border-gray-100">
                                    <td class="py-2">{{ purchase.name }}</td>
                                    <td class="py-2 text-center">{{ purchase.quantity }}</td>
                                    <td class="py-2 text-center">{{ purchase.unit }}</td>
                                    <td class="py-2 text-right">{{ formatPrice(purchase.unitPrice) }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div> -->

                <!-- Related IDs for debugging/admin purposes -->

            </div>

            <!-- Close button -->
            <div class="mt-6 text-right">
                <button class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded" @click="$emit('close')">
                    Close
                </button>
            </div>
        </div>
    </div>
</template>