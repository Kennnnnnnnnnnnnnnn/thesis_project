<template>
    <div class="mt-10 flex justify-end ml-auto space-x-2" v-if="searchQuery === '' && data.length > 0">
        <!-- First -->
        <button @click="goToPage(1)" :disabled="currentPage === 1 || isLoading" class="px-3 py-1.5 rounded-md border text-sm font-medium transition
              bg-white text-gray-700 border-gray-300
              hover:bg-green-50 hover:text-green-700
              disabled:opacity-40 disabled:cursor-not-allowed">
            First
        </button>

        <!-- Previous -->
        <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1 || isLoading" class="px-3 py-1.5 rounded-md border text-sm font-medium transition
              bg-white text-gray-700 border-gray-300
              hover:bg-green-50 hover:text-green-700
              disabled:opacity-40 disabled:cursor-not-allowed">
            Previous
        </button>

        <!-- Pages -->
        <template v-for="page in displayedPages" :key="page">
            <span v-if="page === '...'" class="px-3 py-1 text-gray-400 select-none">...</span>
            <button v-else @click="goToPage(page)" :disabled="isLoading" :class="[
                'px-3 py-1.5 rounded-md border text-sm font-medium transition',
                currentPage === page
                    ? 'bg-green-500 text-white border-green-500 shadow'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-green-50 hover:text-green-700',
                isLoading ? 'opacity-40 cursor-not-allowed' : ''
            ]">
                {{ page }}
            </button>
        </template>

        <!-- Next -->
        <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages || isLoading" class="px-3 py-1.5 rounded-md border text-sm font-medium transition
              bg-white text-gray-700 border-gray-300
              hover:bg-green-50 hover:text-green-700
              disabled:opacity-40 disabled:cursor-not-allowed">
            Next
        </button>

        <!-- Last -->
        <button @click="goToPage(totalPages)" :disabled="currentPage === totalPages || isLoading" class="px-3 py-1.5 rounded-md border text-sm font-medium transition
              bg-white text-gray-700 border-gray-300
              hover:bg-green-50 hover:text-green-700
              disabled:opacity-40 disabled:cursor-not-allowed">
            Last
        </button>
    </div>
</template>

<!-- No <style> needed—it's all Tailwind! -->


<script>
import apiURL from '@/api/config';
import socket from '@/services/socket';
import { useStore } from '@/store/useStore';
import axios from 'axios';
import moment from 'moment-timezone';
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
export default {
    props: ['limitedPerPage', 'isLastRecord', 'currentPage', 'searchQuery', 'isFilter', 'createdBy', 'currentDate', 'status'],
    emit: ['onEmitDataFromPagination', 'onEmitIsLoading', 'onEmitCurrentPageIsLastRecord'],

    setup(props, { emit }) {
        const route = useRoute();
        const totalPages = ref(1);
        const data = ref([]);
        const isLoading = ref(false);
        const limitedPerPage = ref(props.limitedPerPage || 1);
        const currentPage = ref(props.currentPage || 1);
        const searchQuery = ref(props.searchQuery || '');
        const populate = ref(null);
        let collectionName = '';
        const searchFieldsArray = ref(null);
        let dynamicCondition = [];
        let sortOrder = ''
        let sortField = '';
        // const mainRole = ref('')


        async function fetchData() {
            try {
                handleSetCollectionName(); // run this function to set collection name first

                // Escape special MongoDB characters in the search term
                let escapedSearchTerm = '';
                if (searchQuery.value) {
                    escapedSearchTerm = searchQuery.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                } else {
                    escapedSearchTerm = '';
                }
                isLoading.value = true;

                const token = localStorage.getItem('token');
                if (!token) {
                    console.error('Authentication token not found. Cannot fetch pagination data.');
                    isLoading.value = false;
                    return;
                }

                const params = {
                    collectionName: collectionName,
                    pageSize: limitedPerPage.value,
                    page: currentPage.value,
                    searchFields: searchFieldsArray.value,
                    populate: populate.value,
                    searchTerm: escapedSearchTerm,
                    sortField: sortField || '_id',
                    sortOrder: sortOrder ? sortOrder : 'asc',
                    dynamicConditions: JSON.stringify(dynamicCondition)
                }


                const response = await axios.get(`${apiURL}/api/getPagination`, {
                    params,
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.data.data.length > 0) {
                    data.value = response.data.data;
                    totalPages.value = response.data.pagination.totalPages;

                } else {
                    data.value = [];
                    totalPages.value = 1;
                    setTimeout(() => {
                        isLoading.value = false;
                    }, 200);
                }

                setTimeout(() => {
                    isLoading.value = false;
                }, 200);

                // console.log("data.value", data.value);
            } catch (error) {
                console.error('Error fetching data:', error);
                isLoading.value = false;
            }
        };




        const goToPage = async (page) => {
            currentPage.value = page;
            await fetchData();
        };



        const setupSocketListeners = () => {
            socket.off('dataUpdate');
            socket.off('serverLastRecordResponse');

            socket.on('dataUpdate', async (data) => {
                if (data.collection === collectionName) {
                    console.log("Data update received:", data);
                    await fetchData();
                }
            });

            socket.on('serverLastRecordResponse', (data) => {
                if (data.collection === collectionName) {
                    console.log("Last record response received:", data);
                    goToPage(currentPage.value - 1);
                }
            });
        };

        onMounted(async () => {

            // await fetchUserbyID();
            await fetchData();
            setupSocketListeners();
        })



        onBeforeUnmount(() => {
            socket.off('dataUpdate');
            socket.off('serverLastRecordResponse');
        });


        watch(props, async () => {
            limitedPerPage.value = props.limitedPerPage || 1;
        });

        watch(limitedPerPage, async () => {
            currentPage.value = 1;
            await fetchData();
        });


        watch(isLoading, (newValue) => {
            emit('onEmitIsLoading', newValue);
        }, { immediate: true });

        // Update the watch to trigger search when searchQuery prop changes
        watch(() => props.searchQuery, async (newValue) => {
            data.value = [];
            totalPages.value = 1;
            currentPage.value = 1; // Reset to first page when search changes
            searchQuery.value = newValue;

            await fetchData(); // Fetch new data with search query
        }, { immediate: true });



        watch(() => props.isFilter, async (newValue) => {
            if (newValue === true) {
                data.value = [];
                totalPages.value = 1;
                currentPage.value = 1;
                dynamicCondition = [];

                if (props.createdBy) {


                    // Add the createdBy condition
                    dynamicCondition.push({
                        field: 'createdBy',
                        operator: '==',
                        value: props.createdBy
                    });
                }


                if (props.currentDate) {
                    const filterStartDate = moment(props.currentDate[0]).startOf('day').tz('UTC').toDate(); // Start of today in UTC
                    const filterEndDate = moment(props.currentDate[1]).endOf('day').tz('UTC').toDate(); // End of today in UTC

                    dynamicCondition.push(
                        {
                            field: 'createdAt',
                            operator: '&gte',
                            value: filterStartDate,
                            type: "Date"
                        },
                        {
                            field: 'createdAt',
                            operator: '&lte',
                            value: filterEndDate,
                            type: "Date"
                        }
                    );
                }

                if (props.status) {
                    dynamicCondition.push(
                        {
                            field: 'status',
                            operator: '==',
                            value: props.status
                        },

                    );
                }

                // Fetch data after applying the filter
                await fetchData();
            }
        }, { immediate: true });


        watch([data, currentPage], () => {
            if (data.value.length === 1 && currentPage.value > 1) {
                emit('onEmitCurrentPageIsLastRecord', currentPage.value);
            }
        })


        watch(data, () => {
            emit('onEmitDataFromPagination', data.value);
        });



        function handleSetCollectionName() {


            switch (route.path) {

                case '/admin/categories':
                    collectionName = 'Category';
                    searchFieldsArray.value = 'name';
                    break;

                case '/admin/permission':
                    collectionName = 'User';
                    searchFieldsArray.value = 'name';
                    break;
                case '/admin/users':
                    collectionName = 'User';
                    searchFieldsArray.value = 'name';
                    break;

                case '/admin/supplier':
                    collectionName = 'Supplier';
                    searchFieldsArray.value = 'name';
                    break;
                case '/admin/stock':
                    collectionName = 'Stock';
                    searchFieldsArray.value = 'name';
                    break;

                case '/admin/create':
                    collectionName = 'Product';
                    searchFieldsArray.value = 'name';
                    break;
                case '/admin/restock':
                    collectionName = 'PurchaseProduct';
                    searchFieldsArray.value = 'name';
                    break;
                case '/admin/orders':
                    collectionName = 'Order';
                    // searchFieldsArray.value = 'name';
                    break;

                case '/admin/currency':
                    collectionName = 'Currency';
                    // searchFieldsArray.value = 'name';
                    break;

                case '/admin/symbol':
                    collectionName = 'SymbolCurrency';
                    // searchFieldsArray.value = 'name';
                    break;

            }


        }


        const displayedPages = computed(() => {
            const totalPagesValue = totalPages.value;
            const currentPageValue = currentPage.value;
            const siblingCount = 1; // Number of siblings around the current page
            const maxVisiblePages = 5; // Max number of pages visible including boundaries and ellipses

            // Helper function to create a range of numbers
            const range = (start, end) => {
                const length = end - start + 1;
                return Array.from({ length }, (_, i) => start + i);
            };

            if (totalPagesValue <= maxVisiblePages) {
                // If total pages are less than or equal to max visible, show all pages
                return range(1, totalPagesValue);
            }

            const startPages = 1; // Always include the first page
            const endPages = totalPagesValue; // Always include the last page

            // Calculate siblings around the current page
            const siblingsStart = Math.max(currentPageValue - siblingCount, 2); // Minimum of 2 (to leave space for the first page)
            const siblingsEnd = Math.min(currentPageValue + siblingCount, totalPagesValue - 1); // Maximum of totalPagesValue - 1 (to leave space for the last page)

            const shouldShowLeftEllipsis = siblingsStart > 2; // Ellipsis needed if there's a gap after the first page
            const shouldShowRightEllipsis = siblingsEnd < totalPagesValue - 1; // Ellipsis needed if there's a gap before the last page

            let pages = [startPages];

            if (shouldShowLeftEllipsis) {
                pages.push('...');
            }

            pages = [...pages, ...range(siblingsStart, siblingsEnd)];

            if (shouldShowRightEllipsis) {
                pages.push('...');
            }

            pages.push(endPages);

            return pages;
        });



        return {
            searchQuery,
            data,
            goToPage,
            totalPages,
            currentPage,
            displayedPages,

        }

    }

}
</script>

<style></style>
