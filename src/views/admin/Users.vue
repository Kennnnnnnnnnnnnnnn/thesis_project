<template>
  <div class="admin-users">
    <div class="header">
      <h1>User Management</h1>
      <div class="controls">
        <button @click="showAddUserModal = true" class="add-user-btn">
          <i class="fas fa-plus"></i> Add User
        </button>
        <div class="search-box">
          <input 
            v-model="searchQuery" 
            placeholder="Search users..." 
            @input="debounceSearch"
          />
          <i class="fas fa-search"></i>
        </div>
      </div>
    </div>

    <div class="filters">
      <select v-model="roleFilter" @change="fetchUsers">
        <option value="">All Roles</option>
        <option v-for="role in availableRoles" :value="role" :key="role">
          {{ role }}
        </option>
      </select>
      <select v-model="statusFilter" @change="fetchUsers">
        <option value="">All Statuses</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
        <option value="suspended">Suspended</option>
      </select>
      <button @click="resetFilters" class="reset-btn">Reset Filters</button>
    </div>

    <div class="user-table-container">
      <table class="user-table">
        <thead>
          <tr>
            <th @click="sortUsers('id')">
              ID <i :class="sortIcon('id')"></i>
            </th>
            <th @click="sortUsers('name')">
              Name <i :class="sortIcon('name')"></i>
            </th>
            <th @click="sortUsers('email')">
              Email <i :class="sortIcon('email')"></i>
            </th>
            <th @click="sortUsers('role')">
              Role <i :class="sortIcon('role')"></i>
            </th>
            <th @click="sortUsers('createdAt')">
              Joined <i :class="sortIcon('createdAt')"></i>
            </th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in paginatedUsers" :key="user.id">
            <td>{{ user.id }}</td>
            <td>
              <div class="user-avatar">
                <img :src="user.avatar || defaultAvatar" alt="User avatar" />
                {{ user.name }}
              </div>
            </td>
            <td>{{ user.email }}</td>
            <td>
              <span class="role-badge" :class="user.role.toLowerCase()">
                {{ user.role }}
              </span>
            </td>
            <td>{{ formatDate(user.createdAt) }}</td>
            <td>
              <span class="status-badge" :class="user.status">
                {{ user.status }}
              </span>
            </td>
            <td class="actions">
              <button @click="editUser(user)" class="edit-btn" title="Edit">
                <i class="fas fa-edit"></i>
              </button>
              <button 
                @click="toggleUserStatus(user)" 
                :class="['status-btn', user.status === 'active' ? 'deactivate' : 'activate']"
                :title="user.status === 'active' ? 'Deactivate' : 'Activate'"
              >
                <i :class="user.status === 'active' ? 'fas fa-user-slash' : 'fas fa-user-check'"></i>
              </button>
              <button 
                @click="confirmDelete(user)" 
                class="delete-btn" 
                title="Delete"
              >
                <i class="fas fa-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="loading" class="loading-spinner">
        <i class="fas fa-spinner fa-spin"></i> Loading users...
      </div>

      <div v-if="!loading && users.length === 0" class="no-results">
        No users found matching your criteria.
      </div>
    </div>

    <div class="pagination" v-if="users.length > 0">
      <button 
        @click="currentPage--" 
        :disabled="currentPage === 1"
      >
        Previous
      </button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button 
        @click="currentPage++" 
        :disabled="currentPage === totalPages"
      >
        Next
      </button>
      <select v-model="itemsPerPage" @change="fetchUsers">
        <option value="10">10 per page</option>
        <option value="25">25 per page</option>
        <option value="50">50 per page</option>
        <option value="100">100 per page</option>
      </select>
    </div>

    <!-- Add/Edit User Modal -->
    <modal v-if="showAddUserModal || editingUser" @close="closeModal">
      <h2>{{ editingUser ? 'Edit User' : 'Add New User' }}</h2>
      <form @submit.prevent="editingUser ? updateUser() : createUser()">
        <div class="form-group">
          <label>Full Name</label>
          <input v-model="userForm.name" required />
        </div>
        <div class="form-group">
          <label>Email</label>
          <input v-model="userForm.email" type="email" required />
        </div>
        <div class="form-group">
          <label>Role</label>
          <select v-model="userForm.role" required>
            <option v-for="role in availableRoles" :value="role" :key="role">
              {{ role }}
            </option>
          </select>
        </div>
        <div class="form-group" v-if="!editingUser">
          <label>Password</label>
          <input v-model="userForm.password" type="password" required />
        </div>
        <div class="form-group">
          <label>Status</label>
          <select v-model="userForm.status" required>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
        <div class="form-actions">
          <button type="button" @click="closeModal" class="cancel-btn">
            Cancel
          </button>
          <button type="submit" class="save-btn">
            {{ editingUser ? 'Update' : 'Create' }} User
          </button>
        </div>
      </form>
    </modal>

    <!-- Delete Confirmation Modal -->
    <modal v-if="showDeleteModal" @close="showDeleteModal = false">
      <h2>Confirm Deletion</h2>
      <p>Are you sure you want to delete user {{ userToDelete.name }}?</p>
      <div class="form-actions">
        <button @click="showDeleteModal = false" class="cancel-btn">
          Cancel
        </button>
        <button @click="deleteUser" class="delete-btn">
          Delete User
        </button>
      </div>
    </modal>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { debounce } from 'lodash';
import Modal from '@/views/admin/Model.vue';

export default {
  name: 'AdminUsers', 
  components: {
    Modal
  },
  setup() {
    const defaultAvatar = ref('/default-avatar.png');
    const users = ref([]);
    const loading = ref(true);
    const searchQuery = ref('');
    const roleFilter = ref('');
    const statusFilter = ref('');
    const currentPage = ref(1);
    const itemsPerPage = ref(10);
    const sortField = ref('createdAt');
    const sortDirection = ref('desc');
    const showAddUserModal = ref(false);
    const editingUser = ref(null);
    const showDeleteModal = ref(false);
    const userToDelete = ref(null);
    
    const availableRoles = ref(['Admin', 'Editor', 'Author', 'Subscriber']);
    
    const userForm = ref({
      name: '',
      email: '',
      role: 'Subscriber',
      status: 'active',
      password: ''
    });

    // Fetch users from API
    const fetchUsers = debounce(async () => {
      try {
        loading.value = true;
        // In a real app, you would make an API call here
        // const response = await api.get('/users', {
        //   params: {
        //     search: searchQuery.value,
        //     role: roleFilter.value,
        //     status: statusFilter.value,
        //     page: currentPage.value,
        //     perPage: itemsPerPage.value,
        //     sortBy: sortField.value,
        //     sortDir: sortDirection.value
        //   }
        // });
        // users.value = response.data.users;
        
        // Mock data for demonstration
        users.value = generateMockUsers();
        loading.value = false;
      } catch (error) {
        console.error('Error fetching users:', error);
        loading.value = false;
      }
    }, 300);

    // Computed properties
    const filteredUsers = computed(() => {
      return users.value.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
                             user.email.toLowerCase().includes(searchQuery.value.toLowerCase());
        const matchesRole = !roleFilter.value || user.role === roleFilter.value;
        const matchesStatus = !statusFilter.value || user.status === statusFilter.value;
        return matchesSearch && matchesRole && matchesStatus;
      });
    });

    const sortedUsers = computed(() => {
      return [...filteredUsers.value].sort((a, b) => {
        let modifier = 1;
        if (sortDirection.value === 'desc') modifier = -1;
        
        if (a[sortField.value] < b[sortField.value]) return -1 * modifier;
        if (a[sortField.value] > b[sortField.value]) return 1 * modifier;
        return 0;
      });
    });

    const paginatedUsers = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value;
      const end = start + itemsPerPage.value;
      return sortedUsers.value.slice(start, end);
    });

    const totalPages = computed(() => {
      return Math.ceil(sortedUsers.value.length / itemsPerPage.value);
    });

    // Methods
    const sortUsers = (field) => {
      if (sortField.value === field) {
        sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
      } else {
        sortField.value = field;
        sortDirection.value = 'asc';
      }
      fetchUsers();
    };

    const sortIcon = (field) => {
      if (sortField.value !== field) return 'fas fa-sort';
      return sortDirection.value === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down';
    };

    const resetFilters = () => {
      searchQuery.value = '';
      roleFilter.value = '';
      statusFilter.value = '';
      currentPage.value = 1;
      fetchUsers();
    };

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString();
    };

    const editUser = (user) => {
      editingUser.value = user;
      userForm.value = {
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        password: ''
      };
    };

    const createUser = async () => {
      try {
        // In a real app, you would make an API call here
        // await api.post('/users', userForm.value);
        console.log('Creating user:', userForm.value);
        
        // Add the new user to the list
        const newUser = {
          id: Math.max(...users.value.map(u => u.id)) + 1,
          ...userForm.value,
          createdAt: new Date().toISOString(),
          avatar: null
        };
        users.value.unshift(newUser);
        
        closeModal();
      } catch (error) {
        console.error('Error creating user:', error);
      }
    };

    const updateUser = async () => {
      try {
        // In a real app, you would make an API call here
        // await api.put(`/users/${editingUser.value.id}`, userForm.value);
        console.log('Updating user:', editingUser.value.id, userForm.value);
        
        // Update the user in the list
        const index = users.value.findIndex(u => u.id === editingUser.value.id);
        if (index !== -1) {
          users.value[index] = {
            ...users.value[index],
            ...userForm.value
          };
        }
        
        closeModal();
      } catch (error) {
        console.error('Error updating user:', error);
      }
    };

    const confirmDelete = (user) => {
      userToDelete.value = user;
      showDeleteModal.value = true;
    };

    const deleteUser = async () => {
      try {
        // In a real app, you would make an API call here
        // await api.delete(`/users/${userToDelete.value.id}`);
        console.log('Deleting user:', userToDelete.value.id);
        
        // Remove the user from the list
        users.value = users.value.filter(u => u.id !== userToDelete.value.id);
        
        showDeleteModal.value = false;
        userToDelete.value = null;
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    };

    const toggleUserStatus = (user) => {
      const newStatus = user.status === 'active' ? 'inactive' : 'active';
      // In a real app, you would make an API call here
      // await api.patch(`/users/${user.id}/status`, { status: newStatus });
      console.log('Toggling user status:', user.id, newStatus);
      
      // Update the user status in the list
      const index = users.value.findIndex(u => u.id === user.id);
      if (index !== -1) {
        users.value[index].status = newStatus;
      }
    };

    const closeModal = () => {
      showAddUserModal.value = false;
      editingUser.value = null;
      userForm.value = {
        name: '',
        email: '',
        role: 'Subscriber',
        status: 'active',
        password: ''
      };
    };

    // Mock data generator
    const generateMockUsers = () => {
      const roles = ['Admin', 'Editor', 'Author', 'Subscriber'];
      const statuses = ['active', 'inactive', 'suspended'];
      const mockUsers = [];
      
      for (let i = 1; i <= 50; i++) {
        const role = roles[Math.floor(Math.random() * roles.length)];
        mockUsers.push({
          id: i,
          name: `User ${i}`,
          email: `user${i}@example.com`,
          role: role,
          status: statuses[Math.floor(Math.random() * statuses.length)],
          createdAt: new Date(Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 365)).toISOString(),
          avatar: null
        });
      }
      
      return mockUsers;
    };

    // Lifecycle hooks
    onMounted(() => {
      fetchUsers();
    });

    return {
      defaultAvatar,
      users,
      loading,
      searchQuery,
      roleFilter,
      statusFilter,
      currentPage,
      itemsPerPage,
      sortField,
      sortDirection,
      showAddUserModal,
      editingUser,
      showDeleteModal,
      userToDelete,
      availableRoles,
      userForm,
      filteredUsers,
      sortedUsers,
      paginatedUsers,
      totalPages,
      fetchUsers: debounce(fetchUsers, 300),
      sortUsers,
      sortIcon,
      resetFilters,
      formatDate,
      editUser,
      createUser,
      updateUser,
      confirmDelete,
      deleteUser,
      toggleUserStatus,
      closeModal
    };
  }
};
</script>
<style scoped>
.users-admin {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;

}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #ffe680; /* Light yellow border */
}

.header h1 {
  color: #8a6d0b; /* Dark yellow text */
  font-size: 1.75rem;
  margin: 0;
}

.controls {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.add-user-btn {
  background-color: #ffd700; /* Gold yellow */
  color: #5d4a00; /* Dark yellow text */
  border: none;
  padding: 0.75rem 1.25rem;
  border-radius: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  transition: all 0.2s;
}

.add-user-btn:hover {
  background-color: #e6c200; /* Darker gold yellow */
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(139, 117, 0, 0.1); /* Yellow tint shadow */
}

.search-box {
  position: relative;
}

.search-box input {
  padding: 0.75rem 2rem 0.75rem 1rem;
  border: 1px solid #ffe680; /* Light yellow border */
  border-radius: 0.5rem;
  width: 250px;
  background-color: #fffae6; /* Light yellow background */
  color: #5d4a00; /* Dark yellow text */
  transition: all 0.2s;
}

.search-box input:focus {
  outline: none;
  border-color: #ffd700; /* Gold yellow */
  box-shadow: 0 0 0 2px rgba(255, 215, 0, 0.2); /* Gold yellow shadow */
}

.search-box i {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #b38b00; /* Medium yellow text */
}

.filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.filters select {
  padding: 0.75rem;
  border: 1px solid #ffe680; /* Light yellow border */
  border-radius: 0.5rem;
  background-color: #fffae6; /* Light yellow background */
  color: #5d4a00; /* Dark yellow text */
  cursor: pointer;
  min-width: 180px;
}

.reset-btn {
  background-color: #fff3cd; /* Light yellow */
  border: 1px solid #ffe680; /* Light yellow border */
  padding: 0.75rem 1.25rem;
  border-radius: 0.5rem;
  cursor: pointer;
  color: #856404; /* Dark yellow text */
  font-weight: 500;
  transition: all 0.2s;
}

.reset-btn:hover {
  background-color: #ffe680; /* Medium yellow */
}

.user-table-container {
  overflow-x: auto;
  margin-bottom: 1.5rem;
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 2px 8px rgba(139, 117, 0, 0.1); /* Yellow tint shadow */
  border: 1px solid #ffe680; /* Light yellow border */
}

.user-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95rem;
}

.user-table th, .user-table td {
  padding: 1rem 1.25rem;
  text-align: left;
  border-bottom: 1px solid #ffe680; /* Light yellow border */
}

.user-table th {
  background-color: #fffae6; /* Light yellow background */
  color: #8a6d0b; /* Dark yellow text */
  font-weight: 600;
  position: relative;
  cursor: pointer;
  transition: background-color 0.2s;
}

.user-table th:hover {
  background-color: #ffe680; /* Medium yellow */
}

.user-table tr:last-child td {
  border-bottom: none;
}

.user-table tr:hover {
  background-color: #fffae6; /* Light yellow background */
}

.user-avatar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-avatar img {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #ffe680; /* Light yellow border */
}

.role-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.role-badge:before {
  content: "";
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
}

.role-badge.admin {
  background-color: #fff3cd; /* Light yellow */
  color: #856404; /* Dark yellow text */
}

.role-badge.admin:before {
  background-color: #ffd700; /* Gold yellow */
}

.role-badge.editor {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.role-badge.editor:before {
  background-color: #4CAF50;
}

.role-badge.author {
  background-color: #e3f2fd;
  color: #1565c0;
}

.role-badge.author:before {
  background-color: #2196F3;
}

.role-badge.subscriber {
  background-color: #f3e5f5;
  color: #6a1b9a;
}

.role-badge.subscriber:before {
  background-color: #9C27B0;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: capitalize;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.status-badge:before {
  content: "";
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
}

.status-badge.active {
  background-color: #ecfccb;
  color: #3f6212;
}

.status-badge.active:before {
  background-color: #84cc16;
}

.status-badge.inactive {
  background-color: #fff3cd; /* Light yellow */
  color: #92400e;
}

.status-badge.inactive:before {
  background-color: #f59e0b;
}

.status-badge.suspended {
  background-color: #fee2e2;
  color: #991b1b;
}

.status-badge.suspended:before {
  background-color: #ef4444;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.actions button {
  border: none;
  padding: 0.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  width: 36px;
  height: 36px;
}

.actions button:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.edit-btn {
  background-color: #2196F3;
  color: white;
}

.edit-btn:hover {
  background-color: #0b7dda;
}

.status-btn {
  color: white;
}

.status-btn.activate {
  background-color: #4CAF50;
}

.status-btn.activate:hover {
  background-color: #45a049;
}

.status-btn.deactivate {
  background-color: #ff9800;
}

.status-btn.deactivate:hover {
  background-color: #e68a00;
}

.delete-btn {
  background-color: #f44336;
  color: white;
}

.delete-btn:hover {
  background-color: #d32f2f;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 1.5rem;
  color: #b38b00; /* Medium yellow text */
}

.pagination button {
  padding: 0.5rem 1rem;
  border: 1px solid #ffe680; /* Light yellow border */
  background-color: #fffae6; /* Light yellow background */
  cursor: pointer;
  border-radius: 0.5rem;
  color: #8a6d0b; /* Dark yellow text */
  transition: all 0.2s;
}

.pagination button:hover:not(:disabled) {
  background-color: #ffe680; /* Medium yellow */
}

.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background-color: #f5f5f5;
}

.pagination select {
  padding: 0.5rem;
  border: 1px solid #ffe680; /* Light yellow border */
  border-radius: 0.5rem;
  background-color: #fffae6; /* Light yellow background */
  color: #5d4a00; /* Dark yellow text */
}

.loading-spinner {
  text-align: center;
  padding: 2rem;
  color: #b38b00; /* Medium yellow text */
}

.no-results {
  text-align: center;
  padding: 2rem;
  color: #b38b00; /* Medium yellow text */
  font-style: italic;
  background-color: #fffae6; /* Light yellow background */
  border-radius: 0.75rem;
  margin: 1rem 0;
  border: 1px dashed #ffe680; /* Light yellow border */
}

/* Modal styles */
.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #8a6d0b; /* Dark yellow text */
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ffe680; /* Light yellow border */
  border-radius: 0.5rem;
  background-color: #fffae6; /* Light yellow background */
  color: #5d4a00; /* Dark yellow text */
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}

.cancel-btn {
  background-color: #fff3cd; /* Light yellow */
  border: 1px solid #ffe680; /* Light yellow border */
  padding: 0.75rem 1.25rem;
  border-radius: 0.5rem;
  cursor: pointer;
  color: #856404; /* Dark yellow text */
  font-weight: 500;
}

.cancel-btn:hover {
  background-color: #ffe680; /* Medium yellow */
}

.save-btn {
  background-color: #ffd700; /* Gold yellow */
  color: #5d4a00; /* Dark yellow text */
  border: none;
  padding: 0.75rem 1.25rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 600;
}

.save-btn:hover {
  background-color: #e6c200; /* Darker gold yellow */
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .controls {
    width: 100%;
    flex-wrap: wrap;
  }
  
  .search-box input {
    width: 100%;
  }
  
  .filters {
    flex-direction: column;
  }
  
  .filters select {
    width: 100%;
  }
  
  .actions {
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .pagination {
    flex-wrap: wrap;
  }
}
</style>