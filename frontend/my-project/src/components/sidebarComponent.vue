<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';

const router = useRouter();
const userType = ref("");

onMounted(() => {
  userType.value = localStorage.getItem("userType");
});
</script>

<template>
    <div class="container">
        <aside class="sidebar">
            <div class="top">
                <span class="icon">🏫</span>
                <div class="logo">
                    <p>Hostel Management</p>
                </div>
            </div>
            <div class="mid">
                <ul>
                    <li>
                        <router-link to="/home">
                            <span class="icon">🏠</span>
                            <span class="text">Home</span>
                        </router-link>
                    </li>
                    <li>
                        <router-link to="/room-availability">
                            <span class="icon">📃</span>
                            <span class="text">Room Availability</span>
                        </router-link>
                    </li>
                    <li>
                        <RouterLink to="/book">
                            <span class="icon">🐐</span>
                            <span class="text">Booking Page</span>
                        </RouterLink>
                    </li>
                    <li>
                        <RouterLink :to="userType === 'warden' ? '/wardenNotify' : '/studentNotify'">
                            <span class="icon">🧑‍🎓</span>
                            <span class="text">Notification</span>
                        </RouterLink>
                    </li>
                </ul>
            </div>
            <div class="bot">
                <ul>
                    <li>
                        <RouterLink to="/">
                            <span class="icon">🧑</span>
                            <span class="text">Log Out</span>
                        </RouterLink>
                    </li>
                </ul>
            </div>
        </aside>
    </div>
</template>

<style scoped>
.sidebar{
  width: 5vw;
  height: 100vh;
  background-color: whitesmoke;
  position: absolute;
  overflow: hidden;
  transition: all ease-in-out 500ms;
}
.sidebar:hover{
    width: 300px;
    background-color: white;
}
.sidebar .top{
    width:20vw;
    height:100px;
    font-size: 20px;
    font-weight: bold;
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    display: flex;
    justify-content: center;
    align-items: center;
}

.sidebar .mid{
    width: 20vw;
    height: calc(100vh - 100px - 100px);
}
.sidebar ul{
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-left: 15px;
    padding: 20px;
}
.sidebar li{
    width: 84%;
    height:50px;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all ease-in-out 500ms;
    margin-bottom: 20px;
}
.sidebar li a{
    width: 100%;
    display: flex;
    color: black;
   text-decoration: none;
}
.sidebar li:hover{
   border-radius: 5px;
   background-color: rgb(70, 127, 252);
   color: white;
   transform: scale(1.1);
}
.sidebar .icon{
     width:20%;
    display: flex;
    justify-content: center;
}
.sidebar .text{
    width: 80%;
}
.sidebar .bot{
    width: 20vw;
    height: 100px;
}
</style>