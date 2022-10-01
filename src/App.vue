<template>
    <div class="h-screen flex sm:justify-center items-center flex-col sm:p-0">
        <div class="text-6xl text-red-800 font-bold font-mono mt-8">Quotidie</div>
        <div class="my-4 font-mono italic">
            {{ dateDisplay }}
        </div>
        <div class="font-sans font-bold px-8 text-lg w-full sm:w-1/2 mb-8">{{ evangile.title }}</div>
        <div class="w-full sm:w-1/2 px-8 overflow-y-auto">
            <div v-html="evangile.evangile"></div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import axios from "axios";

const evangile = ref({ title: "", evangile: "" });
const date = new Date();
const options = { weekday: "long", year: "numeric", month: "long", day: "2-digit" };
const dateDisplay = ref(date.toLocaleDateString("fr-FR", options));

onMounted(async () => {
    const { data } = await axios.get("/.netlify/functions/evangile");
    evangile.value = data;
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
    background: gray;
    border-radius: 10px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
    background: #555;
}
</style>
