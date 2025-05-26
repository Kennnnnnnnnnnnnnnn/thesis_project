<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start pt-2 z-50 font-khmer">
    <!-- Wrapper -->
    <div class="bg-white p-6 rounded-xl shadow-xl w-full max-w-5xl mx-auto overflow-y-auto h-full">
      <!-- Header -->
      <div class="flex justify-between items-center border-b pb-4 mb-6">
        <h2 class="text-2xl font-bold text-gray-700">Set Permission
          <span v-if="selectedUserName" class="text-blue-600">- {{ selectedUserName }}</span>
          <span v-if="selectedMainRole" class="text-blue-600">- {{ selectedMainRole }}</span>
        </h2>
        <i class="fa-solid fa-circle-xmark cursor-pointer text-red-600 hover:text-red-500 text-2xl"
          @click="$emit('close')"></i>
      </div>

      <!-- Role Selection -->
      <!-- <div class="bg-white p-4 rounded-lg shadow-sm mb-4">
        <h3 class="text-gray-800 font-semibold mb-4">Select Role</h3>
        <p class="text-sm text-gray-600 mb-2">Current role ID: {{ selectedRole }}</p>
        <select v-model="selectedRole" class="w-full border border-gray-300 rounded px-3 py-2">
          <option value="">Select a Role</option>
          <option v-for="role in roleAssignData" :key="role._id" :value="role._id">{{ role.name }}</option>
        </select>
      </div> -->

      <!-- Permission -->
      <div class="grid grid-cols-3 gap-6">
        <!-- Dashboard Template -->
        <div class="bg-gray-100 p-4 rounded-lg shadow-sm">
          <h3 class="text-blue-800 font-semibold mb-4">Dashboard</h3>
          <label class="flex justify-between items-center text-gray-700">
            Show
            <input type="checkbox" v-model="permissions.dashboard.show" class="toggle-switch">
          </label>
        </div>

        <!-- Product -->
        <div class="bg-gray-100 p-4 rounded-lg shadow-sm w-full max-w-sm mx-auto">
          <h3 class="text-pink-800 font-semibold mb-4">Product</h3>

          <div class="space-y-3">
            <label class="flex justify-between items-center text-gray-700">
              All
              <input type="checkbox" v-model="permissions.product.all" class="toggle-switch">
            </label>
            <label class="flex justify-between items-center text-gray-700">
              Create
              <input type="checkbox" v-model="permissions.product.create" class="toggle-switch">
            </label>
            <label class="flex justify-between items-center text-gray-700">
              View
              <input type="checkbox" v-model="permissions.product.view" class="toggle-switch">
            </label>
            <label class="flex justify-between items-center text-gray-700">
              Edit
              <input type="checkbox" v-model="permissions.product.edit" class="toggle-switch">
            </label>
            <label class="flex justify-between items-center text-gray-700">
              Delete
              <input type="checkbox" v-model="permissions.product.delete" class="toggle-switch">
            </label>
          </div>
        </div>

        <!-- Order -->
        <div class="bg-gray-100 p-4 rounded-lg shadow-sm w-full max-w-sm mx-auto">
          <h3 class="text-yellow-800 font-semibold mb-4">Order</h3>
          <div class="space-y-3">
            <label class="flex justify-between items-center text-gray-700">
              All
              <input type="checkbox" v-model="permissions.order.all" class="toggle-switch">
            </label>
            <label class="flex justify-between items-center text-gray-700">
              Create
              <input type="checkbox" v-model="permissions.order.create" class="toggle-switch">
            </label>
            <label class="flex justify-between items-center text-gray-700">
              View
              <input type="checkbox" v-model="permissions.order.view" class="toggle-switch">
            </label>
            <label class="flex justify-between items-center text-gray-700">
              Edit
              <input type="checkbox" v-model="permissions.order.edit" class="toggle-switch">
            </label>
            <label class="flex justify-between items-center text-gray-700">
              Delete
              <input type="checkbox" v-model="permissions.order.delete" class="toggle-switch">
            </label>
          </div>
        </div>

        <!-- Stock -->
        <div class="bg-gray-100 p-4 rounded-lg shadow-sm w-full max-w-sm mx-auto">
          <h3 class="text-green-800 font-semibold mb-4">Stock</h3>

          <div class="space-y-3">
            <label class="flex justify-between items-center text-gray-700">
              All
              <input type="checkbox" v-model="permissions.stock.all" class="toggle-switch">
            </label>
            <label class="flex justify-between items-center text-gray-700">
              Create
              <input type="checkbox" v-model="permissions.stock.create" class="toggle-switch">
            </label>
            <label class="flex justify-between items-center text-gray-700">
              View
              <input type="checkbox" v-model="permissions.stock.view" class="toggle-switch">
            </label>
            <label class="flex justify-between items-center text-gray-700">
              Edit
              <input type="checkbox" v-model="permissions.stock.edit" class="toggle-switch">
            </label>
            <label class="flex justify-between items-center text-gray-700">
              Delete
              <input type="checkbox" v-model="permissions.stock.delete" class="toggle-switch">
            </label>
          </div>
        </div>

         <!-- Tracking -->
         <div class="bg-gray-100 p-4 rounded-lg shadow-sm w-full max-w-sm mx-auto">
          <h3 class="text-purple-800 font-semibold mb-4">Tracking</h3>

          <div class="space-y-3">
            <label class="flex justify-between items-center text-gray-700">
              All
              <input type="checkbox" v-model="permissions.tracking.all" class="toggle-switch">
            </label>
            <label class="flex justify-between items-center text-gray-700">
              Create
              <input type="checkbox" v-model="permissions.tracking.create" class="toggle-switch">
            </label>
            <label class="flex justify-between items-center text-gray-700">
              View
              <input type="checkbox" v-model="permissions.tracking.view" class="toggle-switch">
            </label>
            <label class="flex justify-between items-center text-gray-700">
              Edit
              <input type="checkbox" v-model="permissions.tracking.edit" class="toggle-switch">
            </label>
            <label class="flex justify-between items-center text-gray-700">
              Delete
              <input type="checkbox" v-model="permissions.tracking.delete" class="toggle-switch">
            </label>
          </div>
        </div>

         <!-- Create User -->
         <div class="bg-gray-100 p-4 rounded-lg shadow-sm w-full max-w-sm mx-auto">
          <h3 class="text-purple-800 font-semibold mb-4">Create User</h3>

          <div class="space-y-3">
            <label class="flex justify-between items-center text-gray-700">
              All
              <input type="checkbox" v-model="permissions.user.all" class="toggle-switch">
            </label>
            <label class="flex justify-between items-center text-gray-700">
              Create
              <input type="checkbox" v-model="permissions.user.create" class="toggle-switch">
            </label>
            <label class="flex justify-between items-center text-gray-700">
              View
              <input type="checkbox" v-model="permissions.user.view" class="toggle-switch">
            </label>
            <label class="flex justify-between items-center text-gray-700">
              Edit
              <input type="checkbox" v-model="permissions.user.edit" class="toggle-switch">
            </label>
            <label class="flex justify-between items-center text-gray-700">
              Delete
              <input type="checkbox" v-model="permissions.user.delete" class="toggle-switch">
            </label>
          </div>
        </div>

        <!-- Report -->
        <div class="bg-gray-100 p-4 rounded-lg shadow-sm col-span-1">
          <h3 class="text-gray-800 font-semibold mb-4">Report</h3>
          <label class="flex justify-between items-center text-gray-700">
            Show
            <input type="checkbox" v-model="permissions.report.show" class="toggle-switch">
          </label>
        </div>
      </div>

      <!-- Confirm Button -->
      <div class="mt-8 flex justify-end items-center space-x-4">
        <button
          class="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-8 py-2 rounded-lg shadow-md transition duration-200"
          @click="updatePermissions">
          Update Role
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';
import apiURL from '@/api/config';
import { useStore } from '@/store/useStore';

export default {
  props: {
    selectedUser: {
      type: Object,
      default: null
    }
  },
  emits: ['close'],
  setup(props, { emit }) {
    const store = useStore();
    const userId = ref(null);
    const selectedUserName = ref('');
    const selectedMainRole = ref('');
    const selectedRole = ref('');
    const roleAssignData = ref([]);
    const permissions = ref({
      dashboard: {
        show: false
      },
      product: {
        all: false,
        create: false,
        view: false,
        edit: false,
        delete: false
      },
      order: {
        all: false,
        create: false,
        view: false,
        edit: false,
        delete: false
      },
      stock: {
        all: false,
        create: false,
        view: false,
        edit: false,
        delete: false
      },
      tracking: {
        all: false,
        create: false,
        view: false,
        edit: false,
        delete: false
      },
      user: {
        all: false,
        create: false,
        view: false,
        edit: false,
        delete: false
      },
      report: {
        show: false
      }
    });
    const isLoading = ref(false);

    // Fetch roles for dropdown
    const fetchRoles = async () => {
      try {
        const response = await axios.get(`${apiURL}/loan/api/getAllDocs/Role`);
        if (response.data.data.length > 0) {
          roleAssignData.value = response.data.data.filter(role => role.status === true);
        }
      } catch (error) {
        console.error('Error fetching roles:', error);
      }
    };

    // Fetch user permissions
    const fetchUserPermissions = async () => {
      if (!userId.value) return;
      
      try {
        isLoading.value = true;
        const response = await axios.get(`${apiURL}/loan/api/getAllDocs/Permission`, {
          params: {
            dynamicConditions: JSON.stringify([
              {
                field: 'userId',
                operator: '==',
                value: userId.value
              }
            ])
          }
        });

        if (response.data.data.length > 0) {
          const userPermissions = response.data.data[0];
          // Map permissions from API to local state
          if (userPermissions.permissions) {
            permissions.value = userPermissions.permissions;
          }
          selectedRole.value = userPermissions.roleId || '';
        }
      } catch (error) {
        console.error('Error fetching user permissions:', error);
      } finally {
        isLoading.value = false;
      }
    };

    // Watch for changes in the "all" permission for each section
    watch(() => permissions.value.product.all, (newVal) => {
      if (newVal !== undefined) {
        permissions.value.product.create = newVal;
        permissions.value.product.view = newVal;
        permissions.value.product.edit = newVal;
        permissions.value.product.delete = newVal;
      }
    });

    watch(() => permissions.value.order.all, (newVal) => {
      if (newVal !== undefined) {
        permissions.value.order.create = newVal;
        permissions.value.order.view = newVal;
        permissions.value.order.edit = newVal;
        permissions.value.order.delete = newVal;
      }
    });

    watch(() => permissions.value.stock.all, (newVal) => {
      if (newVal !== undefined) {
        permissions.value.stock.create = newVal;
        permissions.value.stock.view = newVal;
        permissions.value.stock.edit = newVal;
        permissions.value.stock.delete = newVal;
      }
    });

    watch(() => permissions.value.tracking.all, (newVal) => {
      if (newVal !== undefined) {
        permissions.value.tracking.create = newVal;
        permissions.value.tracking.view = newVal;
        permissions.value.tracking.edit = newVal;
        permissions.value.tracking.delete = newVal;
      }
    });

    watch(() => permissions.value.user.all, (newVal) => {
      if (newVal !== undefined) {
        permissions.value.user.create = newVal;
        permissions.value.user.view = newVal;
        permissions.value.user.edit = newVal;
        permissions.value.user.delete = newVal;
      }
    });

    // Update permissions
    const updatePermissions = async () => {
      if (!userId.value) return;
      
      try {
        isLoading.value = true;
        
        const permissionData = {
          userId: userId.value,
          roleId: selectedRole.value,
          permissions: permissions.value
        };

        // Check if permission exists
        const checkResponse = await axios.get(`${apiURL}/loan/api/getAllDocs/Permission`, {
          params: {
            dynamicConditions: JSON.stringify([
              {
                field: 'userId',
                operator: '==',
                value: userId.value
              }
            ])
          }
        });

        if (checkResponse.data.data.length > 0) {
          // Update existing permission
          await axios.put(`${apiURL}/loan/api/updateDoc/Permission/${checkResponse.data.data[0]._id}`, permissionData);
        } else {
          // Create new permission
          await axios.post(`${apiURL}/loan/api/createDoc/Permission`, permissionData);
        }

        // Also update user's role
        await axios.put(`${apiURL}/loan/api/updateDoc/User/${userId.value}`, {
          roleId: selectedRole.value
        });

        alert('Permissions updated successfully');
      } catch (error) {
        console.error('Error updating permissions:', error);
        alert('Failed to update permissions');
      } finally {
        isLoading.value = false;
      }
    };

    // Watch for changes in selected user
    watch(() => props.selectedUser, (newUser) => {
      if (newUser) {
        userId.value = newUser._id;
        selectedUserName.value = newUser.name;
        selectedMainRole.value = newUser.mainRole;
        selectedRole.value = newUser.roleId?._id || '';
        fetchUserPermissions();
      }
    }, { immediate: true });

    onMounted(() => {
      fetchRoles();
    });

    return {
      userId,
      selectedUserName,
      selectedMainRole,
      selectedRole,
      roleAssignData,
      permissions,
      isLoading,
      updatePermissions
    };
  }
};
</script>

<style>
.toggle-switch {
  appearance: none;
  width: 3rem;
  height: 1.5rem;
  background-color: #ccc;
  border-radius: 9999px;
  position: relative;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
}

.toggle-switch::before {
  content: '';
  position: absolute;
  top: 0.125rem;
  left: 0.125rem;
  width: 1.25rem;
  height: 1.25rem;
  background-color: white;
  border-radius: 9999px;
  transition: transform 0.2s ease-in-out;
}

.toggle-switch:checked {
  background-color: #1e3a8a;
  /* blue-900 */
}

.toggle-switch:checked::before {
  transform: translateX(1.5rem);
}

.toggle-switch:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

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


/* .overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
} */
</style>
