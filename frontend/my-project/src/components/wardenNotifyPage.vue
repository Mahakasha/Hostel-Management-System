<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import SidebarComponent from './sidebarComponent.vue';

const bookings = ref([]);
const errorMessage = ref('');
const fetchBookings = async () => {
  try {
    const token = localStorage.getItem('authToken'); 
    const response = await axios.get('http://localhost:8080/api/v1/wardenNotify', {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log("Fetched Bookings:", response.data); 

    if (response.data.code === 1) {
      bookings.value = response.data.bookingRequests.map(booking => ({
        ...booking,
        bookingId: String(booking.bookingId), 
        userName: booking.userName,
        currentRoomNo: booking.currentRoomNo,  // Ensure correct mapping
        newRoomNo: booking.newRoomNo,  
        warden1Approval: booking.warden1Approval,
        warden2Approval: booking.warden2Approval,
        status: booking.status
      }));
    } else {
      errorMessage.value = response.data.msg;
    }
  } catch (error) {
    errorMessage.value = 'no Booking Request found';
  }
};

const updateApproval = async (bookingId, status) => {
  try {
    if (!bookingId || bookingId === 'N/A') {
      console.error("Invalid booking ID:", bookingId);
      errorMessage.value = "Invalid booking ID";
      return;
    }

    console.log("Updating Booking ID:", bookingId, "Status:", status);
    console.log("hi",bookingId);
    const token = localStorage.getItem("authToken");
    await axios.put(`http://localhost:8080/api/v1/wardenNotify/${bookingId}`, { status }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    fetchBookings();
  } catch (error) {
    console.error("Failed to update approval status:", error);
    errorMessage.value = "Failed to update approval status";
  }
};



const getApprovalClass = (approvalStatus) => {
  return approvalStatus === 'approved' ? 'approved' : 
         approvalStatus === 'rejected' ? 'rejected' : 'pending';
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
            <th>User Name</th>
            <th>Current Room No</th>
            <th>New Room No</th>
            <th>Booking ID</th>
            <th>Warden 1 Approval</th>
            <th>Warden 2 Approval</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(booking, index) in bookings" :key="booking.bookingId">
            <td>{{ index + 1 }}</td>
            <td class="highlight">{{ booking.userName }}</td>
            <td class="highlight">{{ booking.roomNo }}</td>
            <td class="highlight">{{ booking.newHostelRoomNo }}</td>
            <td class="highlight">{{ booking.bookingId }}</td>
            <td :class="getApprovalClass(booking.warden1Approval)">{{ booking.warden1Approval }}</td>
            <td :class="getApprovalClass(booking.warden2Approval)">{{ booking.warden2Approval }}</td>
            <td :class="getApprovalClass(booking.status)">{{ booking.status }}</td>
            <td>
              <button class="approve-btn" @click="updateApproval(booking.bookingId, 'approved')">Approve</button>
              <button class="reject-btn" @click="updateApproval(booking.bookingId, 'rejected')">Reject</button>
            </td>
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
.approve-btn {
  background-color: green;
  color: white;
  padding: 5px 10px;
  border: none;
  margin-right: 5px;
  cursor: pointer;
}
.reject-btn {
  background-color: red;
  color: white;
  padding: 5px 10px;
  border: none;
  cursor: pointer;
}
</style>
