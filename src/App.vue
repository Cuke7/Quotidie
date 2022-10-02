<template>
    <div class="h-screen flex sm:justify-center items-center flex-col px-4 pb-4 sm:px-0">
        <div class="text-6xl text-red-800 font-bold font-mono mt-8">Quotidie</div>
        <div class="absolute top-8 right-8">
            <label for="toogleA" class="flex items-center cursor-pointer">
                <!-- toggle -->
                <div class="relative">
                    <!-- input -->
                    <input id="toogleA" type="checkbox" class="sr-only" v-model="notif" />
                    <!-- line -->
                    <div class="w-10 h-4 bg-gray-300 rounded-full shadow-inner"></div>
                    <!-- dot -->
                    <div class="dot absolute w-8 h-8 rounded-full -left-3 -top-2 transition">
                        <BellIcon v-if="notif" class="text-red-800"></BellIcon>
                        <BellSlashIcon v-else class="text-red-800"></BellSlashIcon>
                    </div>
                </div>
            </label>
        </div>

        <div class="my-4 font-mono italic">
            {{ dateDisplay }}
        </div>
        <div class="font-sans font-bold px-8 text-lg w-full sm:w-1/2 mb-8">{{ evangile.title }}</div>
        <div class="w-full sm:w-1/2 px-8 overflow-y-auto pb-8">
            <div v-html="evangile.evangile"></div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import axios from "axios";
import { initializeApp } from "firebase/app";
import { BellIcon, BellSlashIcon } from "@heroicons/vue/24/solid";
import { GoogleAuthProvider, getAuth, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";

const notif = ref(false);

const firebaseConfig = {
    apiKey: "AIzaSyDciTaq_4JN4uhy29PDTqCx36ukF6F290U",
    authDomain: "quotidiev2.firebaseapp.com",
    databaseURL: "https://quotidiev2-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "quotidiev2",
    storageBucket: "quotidiev2.appspot.com",
    messagingSenderId: "518768548588",
    appId: "1:518768548588:web:ae8a64816d43a1eeab63c9",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
auth.languageCode = "fr";

const evangile = ref({ title: "", evangile: "" });
const date = new Date();
const dateDisplay = ref(date.toLocaleDateString("fr-FR", { weekday: "long", year: "numeric", month: "long", day: "2-digit" }));

onMounted(async () => {
    const { data } = await axios.get("/.netlify/functions/evangile");
    evangile.value = data;
});

const provider = new GoogleAuthProvider();
const user = ref<any>(null);
watch(notif, (isChecked) => {
    if (isChecked) {
        if (!user.value) {
            signInWithPopup(auth, provider)
                .then((result) => {
                    user.value = result.user;
                    console.log("Registering for notifications!");
                })
                .catch((error) => {
                    console.error("Error login in", error);
                });
        }
    } else {
        signOut(auth)
            .then(() => {
                user.value = null;
            })
            .catch((error) => {
                console.error("Error login in", error);
            });
    }
});

onAuthStateChanged(auth, (user2) => {
    if (user2) {
        user.value = user2;
        notif.value = true;
        console.log("Signed in!");
        // ...
    } else {
        user.value = null;
        notif.value = false;
        console.log("Signed out!");
    }
});
</script>

<style>
body {
    background-image: url("./assets/background.jpg");
    background-repeat: repeat;
}

/* width */
::-webkit-scrollbar {
    width: 5px;
}

/* Handle */
::-webkit-scrollbar-thumb {
    background: #991b1b;
    border-radius: 10px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
    background: #555;
}

input:checked ~ .dot {
    transform: translateX(100%);
    /* background-color: #991b1b; */
}
</style>
