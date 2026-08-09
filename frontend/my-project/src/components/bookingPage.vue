<script setup>
import { ref, reactive } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import SidebarComponent from "./sidebarComponent.vue";

const router = useRouter();

// Hostel, floor, and wing options
const hostels = ["Emerald", "Ruby", "Sapphire"];
const floors = ["Ground Floor", "First Floor", "Second Floor", "Third Floor"];
const wings = ["Left Wing", "Right Wing"];

// Mapping floor names to integers
const floorMapping = {
  "Ground Floor": 0,
  "First Floor": 1,
  "Second Floor": 2,
  "Third Floor": 3,
};

// Reactive state for selected filters and data
const selectedFilters = reactive({
  hostel: "",
  floor: null,
  wing: "",
});

const roomData = ref([]);
const isLoading = ref(false);
const error = ref("");
const bookingError = ref("");
const bookingSuccess = ref("");

// Validate token and redirect to login if invalid
const validateToken = () => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    router.push("/login");
    return null;
  }
  return token;
};

// Fetch room availability from the backend
const fetchRoomAvailability = async () => {
  if (!selectedFilters.hostel || !selectedFilters.floor || !selectedFilters.wing) {
    error.value = "Please select all filters.";
    return;
  }

  isLoading.value = true;
  error.value = "";
  roomData.value = [];

  try {
    const token = validateToken();
    if (!token) return;

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const wingMapping = {
      "Left Wing": "left",
      "Right Wing": "right",
    };

    const filtersToSend = {
      ...selectedFilters,
      floor: floorMapping[selectedFilters.floor] ?? null,
      wing: wingMapping[selectedFilters.wing] ?? selectedFilters.wing,
    };

    const response = await axios.post(
      "http://localhost:8080/api/v1/availability",
      filtersToSend,
      config
    );

    if (response.data.code === 1) {
      roomData.value = response.data.data;
    } else {
      error.value = response.data.msg || "Failed to fetch room availability.";
    }
  } catch (err) {
    error.value = "An error occurred while fetching room data.";
  } finally {
    isLoading.value = false;
  }
};

// Book a room
const bookRoom = async (room) => {
  const token = validateToken();
  if (!token) return;

  bookingError.value = "";
  bookingSuccess.value = "";

  const bookingDetails = {
    newHostel: selectedFilters.hostel,
    floor: floorMapping[selectedFilters.floor],
    wing: selectedFilters.wing.toLowerCase(),
    newRoomNo: room.roomNo,
  };

  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await axios.post(
  "http://localhost:8080/api/v1/book/initiate-booking", 
  bookingDetails, 
  config
);

    if (response.data.code === 1) {
      bookingSuccess.value = `Successfully booking initiated room ${room.roomNo}.`;
    } else {
      bookingError.value = response.data.msg || "Failed to initiate room booking.";
    }
  } catch (err) {
    bookingError.value = "An error occurred while initiating booking.";
  }
};
</script>

<template>
    <div class="container">
    <SidebarComponent />
    <!-- Main Content -->
    <main class="mainContent">
      <div class="roomAvailabilityContainer">
        <!-- Filters Section -->
        <div class="filters">
          <div>
            <label for="hostel">Select Hostel</label>
            <select
              v-model="selectedFilters.hostel"
              @change="selectedFilters.floor = null"
            >
              <option value="" disabled>Select Hostel</option>
              <option v-for="hostel in hostels" :key="hostel" :value="hostel">
                {{ hostel }}
              </option>
            </select>
          </div>
          <div>
            <label for="floor">Select Floor</label>
            <select
              v-model="selectedFilters.floor"
              :disabled="!selectedFilters.hostel"
              @change="selectedFilters.wing = ''"
            >
              <option value="" disabled>Select Floor</option>
              <option v-for="floor in floors" :key="floor" :value="floor">
                {{ floor }}
              </option>
            </select>
          </div>
          <div>
            <label for="wing">Select Wing</label>
            <select
              v-model="selectedFilters.wing"
              :disabled="!selectedFilters.floor"
              @change="fetchRoomAvailability"
            >
              <option value="" disabled>Select Wing</option>
              <option v-for="wing in wings" :key="wing" :value="wing">
                {{ wing }}
              </option>
            </select>
          </div>
        </div>

        <!-- Room Availability Table -->
        <div class="tableContainer" v-if="!isLoading && roomData.length">
          <table>
            <thead>
              <tr>
                <th>SNo</th>
                <th>Room No</th>
                <th>Warden</th>
                <th>Occupied</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(room, index) in roomData" :key="room.roomNo">
                <td>{{ index + 1 }}</td>
                <td>{{ room.roomNo }}</td>
                <td>{{ room.warden }}</td>
                <td>{{ room.occupied }}/{{ room.capacity }}</td>
                <td>
                  <button @click="bookRoom(room)">Book</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Loading and Error States -->
        <p v-if="isLoading">Loading room availability...</p>
        <p v-if="error" class="error">{{ error }}</p>
        <p v-if="bookingError" class="error">{{ bookingError }}</p>
        <p v-if="bookingSuccess" class="success">{{ bookingSuccess }}</p>
        <p v-if="!isLoading && !roomData.length && !error">No data available.</p>
      </div>
    </main>
  </div>
</template>

<style scoped>
/* Main container for sidebar and content */
.container {
  display: flex;
  height: 100vh;
  font-family: Arial, sans-serif;
  background: linear-gradient(
    180deg,
    rgb(150, 170, 236),
    rgb(130, 190, 218),
    rgb(122, 115, 141)
  );
}

/* Main Content */
.mainContent {
  margin-left: 5vw;
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

/* Filters Section */
.filters {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.filters div {
  flex: 1;
  margin: 0 10px;
}

.filters label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.filters select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

/* Table styling */
.tableContainer {
  overflow-x: auto;
}

.tableContainer button {
  background-color: #6fa6e2;
  border-radius: 8px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

table th,
table td {
  padding: 10px;
  border: 1px solid #ccc;
  text-align: center;
}

.roomNumber {
  display: inline-block;
  padding: 5px 10px;
  border-radius: 5px;
  background-color: #d9fdd3;
  font-weight: bold;
}

/* Success and Error Messages */
.success {
  color: green;
  font-weight: bold;
}

.error {
  color: red;
  font-weight: bold;
}

</style>
