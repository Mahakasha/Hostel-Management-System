<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import img1 from '../assets/profile.jpeg';
import SidebarComponent from "./sidebarComponent.vue";

const router = useRouter();
const userDetail = ref(null);
const roomDetail = ref(null);
const wardenDetail = ref(null);
const roommateDetails = ref([]);

const fetchHomeData = async () => {
  try {
    const token = localStorage.getItem("authToken");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await axios.get("http://localhost:8080/api/v1/home", config);

    if (response.status === 200) {
      userDetail.value = response.data.userDetail;
      roomDetail.value = response.data.roomDetail;
      wardenDetail.value = response.data.wardenDetail;
      roommateDetails.value = response.data.roommateDetails;
    } else {
      alert(response.data.msg || "Failed to fetch data.");
    }
  } catch (error) {
    console.error("Error fetching home data:", error);
    alert("Unable to fetch data. Please try again later.");
    router.push("/");
  }
};

onMounted(() => {
  fetchHomeData();
});
</script>

<template>
  <div class="homeContainer">
    <!-- Sidebar -->
   <SidebarComponent />

    <!-- Main Content -->
    <main class="mainContent">
      <header v-if="userDetail" class="header">
        <div class="profilePic">
          <img :src="img1" alt="Profile" />
        </div>
        <div>
          <h1>{{ userDetail.userName }}</h1>
          <p>{{ userDetail.email }}</p>
          <p>{{ userDetail.phoneNo }}</p>
        </div>
      </header>

      <div v-if="roomDetail && wardenDetail" class="detailsSection">
        <!-- Room Details -->
        <div class="card">
          <h2>Room Details</h2>
          <p>Room No: {{ roomDetail.roomNo }}</p>
          <p>Floor: {{ roomDetail.floor }}</p>
          <p>Wing: {{ roomDetail.wing }}</p>
          <p>Hostel: {{ roomDetail.hostel }}</p>
        </div>

        <!-- Warden Details -->
        <div class="card">
          <h2>Warden Details</h2>
          <p>Name: {{ wardenDetail.name }}</p>
          <p>Phone No: {{ wardenDetail.phoneNo }}</p>
          <p>Room No: {{ wardenDetail.roomNo }}</p>
          <p>Floor: {{ wardenDetail.floor }}</p>
          <p>Wing: {{ wardenDetail.wing }}</p>
          <p>Hostel: {{ wardenDetail.hostel }}</p>
        </div>

        <!-- Roommate Details -->
        <div class="card">
          <h2>Roommate Details</h2>
          <div v-for="roommate in roommateDetails" :key="roommate.name">
            <p>Name: {{ roommate.name }}</p>
            <p>Phone No: {{ roommate.phoneNo }}</p>
            <p>Email: {{ roommate.email }}</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.homeContainer {
  display: flex;
  height: 100vh;
  background: linear-gradient(180deg, #96aae5, #82bedc, #7a738d);
  font-family: Arial, sans-serif;
}

/* main container*/
.mainContent {
  margin-left: 5vw;
  flex: 1;
  padding: 20px;
}

.header {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
}

.profilePic {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-right: 20px;
  object-fit: cover;
  display: flex;
  justify-content: center;
  align-items: center;
}

.profilePic img {
  height: 100%;
  border-radius: 50%;
}

.detailsSection {
  display: flex;
  gap: 20px;
}

.card {
  background-color: #ffffff;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  flex: 1;
}

.card h2 {
  font-size: 18px;
  margin-bottom: 10px;
  color: #007bff;
}

.card p {
  margin: 5px 0;
  color: #555;
}
</style>
