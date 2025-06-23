<script setup>
import { ref, onMounted, watch } from 'vue';
import apiURL from '@/api/config';
import axios from 'axios';

// Define props to accept purchase ID from parent component
const props = defineProps({
    purchaseId: {
        type: String,
        required: true
    },
    show: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['close']);

const purchaseData = ref(null);
const isLoading = ref(false);
const error = ref('');
const supplierData = ref(null);

const formatDate = (dateString) => {
    if (!dateString) return '-';

    const options = {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    };

    return new Date(dateString).toLocaleDateString('en-US', options);
};

const formatPrice = (price) => {
    return new Intl.NumberFormat('km-KH').format(price || 0) + '៛';
};

const fetchPurchaseDetails = async () => {
    if (!props.purchaseId) return;

    isLoading.value = true;
    error.value = '';

    try {
        const token = localStorage.getItem('token');
        if (!token) {
            error.value = 'Authentication required. Please login again.';
            return;
        }

        // Fetch purchase data with the specific ID
        const response = await axios.get(`${apiURL}/api/getAllDocs/PurchaseProduct`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            params: {
                dynamicConditions: JSON.stringify([
                    {
                        field: '_id',
                        operator: '==',
                        value: props.purchaseId
                    }
                ])
            }
        });

        if (response.data.data && response.data.data.length > 0) {
            purchaseData.value = response.data.data[0];
            
            // Fetch supplier details if we have a supplierId
            if (purchaseData.value.supplierId) {
                await fetchSupplierDetails(purchaseData.value.supplierId);
            }
        } else {
            error.value = 'Purchase record not found';
        }
    } catch (err) {
        console.error('Error fetching purchase details:', err);
        error.value = err.response?.data?.message || err.message || 'Failed to load purchase details';
    } finally {
        isLoading.value = false;
    }
};

const fetchSupplierDetails = async (supplierId) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${apiURL}/api/getAllDocs/Supplier`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            params: {
                dynamicConditions: JSON.stringify([
                    {
                        field: '_id',
                        operator: '==',
                        value: supplierId
                    }
                ])
            }
        });

        if (response.data.data && response.data.data.length > 0) {
            supplierData.value = response.data.data[0];
        }
    } catch (err) {
        console.error('Error fetching supplier details:', err);
    }
};

const calculateTotalQuantity = () => {
    if (!purchaseData.value || !purchaseData.value.products) return 0;
    return purchaseData.value.products.reduce((sum, item) => sum + (item.quantity || 0), 0);
};

const calculateTotalAmount = () => {
    if (!purchaseData.value || !purchaseData.value.products) return 0;
    return purchaseData.value.products.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
};

watch(() => props.purchaseId, (newVal) => {
    if (newVal && props.show) {
        fetchPurchaseDetails();
    }
});

watch(() => props.show, (newVal) => {
    if (newVal && props.purchaseId) {
        fetchPurchaseDetails();
    }
});

onMounted(() => {
    if (props.show && props.purchaseId) {
        fetchPurchaseDetails();
    }
});
</script>

<template>
    <div v-if="show"
        class="fixed inset-0  flex justify-center items-start bg-black/60 backdrop-blur-sm z-[1000] p-4 overflow-auto">
        <div class="bg-white w-full max-w-2xl rounded-lg shadow-xl p-6">
            <!-- Loading state -->
            <div v-if="isLoading" class="py-12 text-center">
                <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500 mx-auto"></div>
                <p class="mt-4 text-gray-600">Loading purchase details...</p>
            </div>

            <!-- Error state -->
            <div v-else-if="error" class="py-12 text-center text-red-600">
                {{ error }}
            </div>

            <!-- No data state -->
            <div v-else-if="!purchaseData" class="py-12 text-center text-gray-600">
                Purchase details not found.
            </div>

            <!-- Purchase Details -->
            <div v-else class="text-gray-800">
                <!-- Header -->
                <div class="flex justify-between items-start mb-6">
                    <div class="flex items-center">
                        <div
                            class="bg-orange-500 rounded-full h-10 w-10 flex items-center justify-center mr-3 text-white">
                            <i class="fas fa-shopping-bag"></i>
                        </div>
                        <div>
                            <h1 class="text-xl font-bold">Purchase Receipt</h1>
                            <!-- <p class="text-sm text-gray-500">Restock Order Details</p> -->
                        </div>
                    </div>
                    <div class="text-left  p-4">
                        <p class="text-xs text-gray-500">Date: {{ formatDate(purchaseData.createdAt) }}</p>
                        <!-- <p class="text-xs text-gray-500">Status:
                            <span :class="purchaseData.status ? 'text-blue-600' : 'text-green-600'">
                                {{ purchaseData.status ? 'Pending' : 'Completed' }}
                            </span>
                        </p> -->
                    </div>
                    <button @click="$emit('close')" class="text-gray-500 hover:text-red-600">
                        <i class="fas fa-times text-xl"></i>
                    </button>
                </div>

                <!-- Order Details -->
                <div class="mb-6">
                    <h2 class="text-gray-500 text-sm mb-2 pb-1 border-b border-gray-200">Products Purchased</h2>
                    <table class="w-full text-sm">
                        <thead>
                            <tr class="text-left text-gray-500">
                                <th class="py-2">Item</th>
                                 <th class="py-2 text-center">Note</th>
                                <th class="py-2 text-center">Quantity</th>
                                <th class="py-2 text-right">Unit Price</th>
                                <th class="py-2 text-right">Total Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(product, index) in purchaseData.products" :key="index"
                                class="border-b border-gray-100">
                                <td class="py-2">
                                    <div class="font-medium">{{ product.name }}</div>
                                    <div class="text-xs text-gray-500" v-if="product.description">
                                        {{ product.description }}
                                    </div>
                                </td>
                                 <td class="py-2 text-center">
                                    {{ product.note || '-' }} 
                                </td>
                                <td class="py-2 text-center">
                                    {{ product.quantity }} {{ product.unit }}
                                </td>
                                <td class="py-2 text-right">
                                    {{ formatPrice(product.unitPrice) }}
                                </td>
                                <td class="py-2 text-right font-medium">
                                    {{ formatPrice(product.totalPrice) }}
                                </td>
                            </tr>
                        </tbody>
                        <!-- <tfoot>
                            <tr class="font-semibold text-gray-700 bg-gray-50 ">
                                <td class="py-2 pl-2">Total</td>
                                <td class="py-2 text-center">{{ calculateTotalQuantity() }} items</td>
                                <td class="py-2"></td>
                                <td class="py-2 text-right pr-2">{{ formatPrice(calculateTotalAmount()) }}</td>
                            </tr>
                        </tfoot> -->
                    </table>
                </div>

                <!-- Supplier Info -->
                <div class="mb-6">
                    <h2 class="text-gray-500 text-sm mb-2 pb-1 border-b border-gray-200">Supplier Information</h2>
                    <div v-if="supplierData" class="grid grid-cols-3 gap-4 text-sm">
                        <div>
                            <p class="font-medium">Name</p>
                            <p>{{ supplierData.name }}</p>
                        </div>
                        <div>
                            <p class="font-medium">Contact</p>
                            <p>{{ supplierData.contact || 'N/A' }}</p>
                        </div>
                        <div>
                            <p class="font-medium">Address</p>
                            <p>{{ supplierData.address || 'N/A' }}</p>
                        </div>
                    </div>
                    <div v-else class="text-sm text-gray-500">
                        Supplier ID: {{ purchaseData.supplierId }}
                    </div>
                </div>

                <!-- Notes -->
                <!-- <div v-if="purchaseData.description" class="mb-6">
                    <h2 class="text-gray-500 text-sm mb-2 pb-1 border-b border-gray-200">Notes</h2>
                    <p class="text-sm italic">{{ purchaseData.description || '-'}}</p>
                </div> -->

                <!-- Footer -->
                <!-- <div class="text-center text-xs text-gray-500 pt-4 border-t border-gray-200">
                    <p>Purchase ID: {{ purchaseData._id }}</p>
                    <p class="mt-1">Created by: User ID {{ purchaseData.createdBy }}</p>
                </div> -->
            </div>

            <!-- Close button -->
            <div class="mt-6 text-right">
                <button class="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded" @click="$emit('close')">
                    Close
                </button>
            </div>
        </div>
    </div>
</template>