<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

// Replace 'require' with 'import'
import loginimage from "../assets/loginForm_leftImage.avif";
import logo from "../assets/logo.png";

const username = ref("");
const password = ref("");
const loading = ref(false);

const router = useRouter();

const submitForm = async () => {
  loading.value = true;
  try {
    const response = await axios.post("http://localhost:8080/api/v1/login", {
      userName: username.value,
      password: password.value,
    });

    if (response.data.code === 1) {
      localStorage.setItem("authToken", response.data.JWT);
      localStorage.setItem("userType", response.data.userType);
      router.push("/home");
    } else {
      alert("Login failed: " + response.data.message);
    }
  } catch (error) {
    alert("Unable to connect to the server.");
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="outerContainer">
    <div class="innerContainer">
      <div class="leftImage">
        <img :src="loginimage" />
      </div>
      <div class="rightForm">
        <div class="header">
          <img :src="logo" alt="Student Icon" class="icon" />
          <h1>Hostel room management system</h1>
        </div>
        <form class="loginForm" @submit.prevent="submitForm">
          <div class="inputGroup">
            <input
              type="text"
              id="username"
              v-model="username"
              placeholder="Enter your username"
              required
            />
          </div>
          <div class="inputGroup">
            <input
              type="password"
              id="password"
              v-model="password"
              placeholder="Enter your password"
              required
            />
          </div>
          <div class="submitWrapper">
            <button v-if="!loading" type="submit" class="submitButton">
              Login
            </button>
            <div v-else class="loadingAnimation">
              <div class="thunder"></div>
              <div class="thunder"></div>
              <div class="thunder"></div>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>


  <style scoped>
  .outerContainer {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background: linear-gradient(180deg, rgb(150, 170, 236), rgb(130, 190, 218), rgb(122, 115, 141));
  }
  
  .innerContainer {
    display: flex;
    height: 63%;
    width: 63%;
    background-color: #f8f8f8;
    border-radius: 15px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
    overflow: hidden;
  }
  
  .leftImage {
    height: 100%;
    width: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .leftImage img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
  
  .rightForm {
    height: 100%;
    width: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;
  }
  
  .header .icon {
    width: 60px;
    height: 60px;
    margin-left: 150px;

  }
  
  .header h1 {
    font-size: 24px;
    color: #333;
    margin-bottom: 18px;
  }
  
  .loginForm {
    width: 100%;
    max-width: 300px;
    display: flex;
    flex-direction: column;
  }
  
  .inputGroup {
    margin-bottom: 15px;
  }
  
  .inputGroup input {
    width: 100%;
    padding: 10px;
    font-size: 14px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  
  .submitWrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
  }
  
  .submitButton {
    width: 100%;
    padding: 10px;
    font-size: 16px;
    color: white;
    background-color: #007bff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .submitButton:hover {
    background-color: #0056b3;
  }
  
  .loadingAnimation {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 5px;
  }
  
  .thunder {
    width: 10px;
    height: 40px;
    background: linear-gradient(to bottom, #ffcc00, #ff9900);
    border-radius: 5px;
    animation: thunderFlash 0.5s infinite;
  }
  
  .thunder:nth-child(2) {
    animation-delay: 0.2s;
  }
  
  .thunder:nth-child(3) {
    animation-delay: 0.4s;
  }
  
  @keyframes thunderFlash {
    0%, 100% {
      transform: scaleY(0.5);
      opacity: 0.5;
    }
    50% {
      transform: scaleY(1);
      opacity: 1;
    }
  }
  </style>
  