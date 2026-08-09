<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import SidebarComponent from './sidebarComponent.vue';

const bookings = ref([]);
const errorMessage = ref('');

const fetchBookings = async () => {
  try {
    const token = localStorage.getItem('authToken'); 
    const response = await axios.get('http://localhost:8080/api/v1/studentNotify', {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (response.data.code === 1) {
      bookings.value = [response.data.bookingRequest]; 
    } else {
      errorMessage.value = response.data.msg;
    }
  } catch (error) {
    errorMessage.value = 'Failed to fetch booking requests';
  }
};

const getApprovalClass = (approvalStatus) => {
  if (approvalStatus === 'Approved') {
    return 'approved';
  } else if (approvalStatus === 'Rejected') {
    return 'rejected';
  } else {
    return 'pending';
  }
};

const getStatusClass = (status) => {
  if (status === 'Approved') {
    return 'approved';
  } else if (status === 'Rejected') {
    return 'rejected';
  } else {
    return 'pending';
  }
};

onMounted(fetchBookings);
</script>

<template>
  <div class="container">
    <SidebarComponent />
    <div class="content">
      <h2>Booking Requests</h2>
      <table v-if="bookings.length">
        <thead>
          <tr>
            <th>SNo</th>
            <th>Current Room No</th>
            <th>New Room No</th>
            <th>Warden 1 Approval</th>
            <th>Warden 2 Approval</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(booking, index) in bookings" :key="index">
            <td>{{ index + 1 }}</td>
            <td class="highlight">{{ booking.roomNo }}</td>
            <td class="highlight">{{ booking.newHostelRoomNo }}</td>
            <td :class="getApprovalClass(booking.warden1Approval)">{{ booking.warden1Approval }}</td>
            <td :class="getApprovalClass(booking.warden2Approval)">{{ booking.warden2Approval }}</td>
            <td :class="getStatusClass(booking.status)">{{ booking.status }}</td>
          </tr>
        </tbody>
      </table>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  height: 100vh;
  font-family: Arial, sans-serif;
  background: linear-gradient(180deg, rgb(150, 170, 236), rgb(130, 190, 218), rgb(122, 115, 141));
}
.content {
  flex: 1;
  padding: 20px;
}
h2 {
  text-align: center;
}
table {
  margin-left: 7.5%;
  width: 90%;
  border-collapse: collapse;
  margin-top: 20px;
  background-color: rgba(255, 255, 255, 0.8);
}
th, td {
  border: 1px solid #ddd;
  padding: 10px;
  text-align: center;
}
th {
  background-color: rgba(0, 0, 255, 0.3);
  font-weight: bold;
}
.highlight {
  font-weight: bold;
}
.approved {
  color: green;
  font-weight: bold;
}
.rejected {
  color: red;
  font-weight: bold;
}
.pending {
  color: orange;
  font-weight: bold;
}
.error {
  color: red;
  text-align: center;
  margin-top: 20px;
}
</style>
