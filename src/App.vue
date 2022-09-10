<script setup>
import HelloWorld from './components/HelloWorld.vue'
import TheWelcome from './components/TheWelcome.vue'
import {computed, ref, watch} from "vue";
import axios from "axios";
import {v4 as uuidv4} from 'uuid';

const file = ref(null);
const chunks = ref([]);
const uploaded = ref(0);
const isUploading = ref(false);

const progress = computed(() => Math.floor((uploaded.value * 100) / file.value?.size))

const config = {
  method: 'POST',
  //url: 'http://127.0.0.1:8080/file/247070db-86f5-4693-8fa3-eee8e0b157b6',
  url: 'http://127.0.0.1:3001/upload',
  headers: {
    'Content-Type': 'application/octet-stream'
  },
}

const createFormData = (chunk, key) => {
  const formData = new FormData;
  formData.set('block', chunk, `${file.value?.name}.part.${key}`);
  formData.set('blockUUID', uuidv4());
  return formData;
}

const select = (event) => {
  file.value = event.target.files.item(0);
  const timeStart = Date.now();
  console.log('creating chunks', timeStart)
  createChunks();
  console.log('chunks created', Date.now() - timeStart)
}

const upload = (chunk, key) => {
  return axios({ ...config, data: createFormData(chunk, key) }).then(response => {
    //console.log(`Chunk with key: ${key} uploaded`)
  }).catch(error => {console.log(error)});
}

const createChunks = () => {
  chunks.value = [];
  const chunksNum = 32;
  const size = Math.ceil(file.value.size / chunksNum);
  // 2MB
  //const size = 2_000_000, chunksNum = Math.ceil(file.value.size / size);

  for (let i = 0; i < chunksNum; i++) {
    chunks.value = [
        ...chunks.value,
        file.value.slice(
          i * size, Math.min(i * size + size, file.value.size), file.value.type
      )
    ]
  }
}

const makeUpload = async () => {
  isUploading.value = true;
  const start = Date.now();
  const promises = chunks.value.map((chunk, key) => upload(chunk, key))
  Promise.all(promises)
      .then(() => {
        console.log('all uploaded', (Date.now() - start) / 1000)
        isUploading.value = false
      })
      .catch(error => console.log(error))
}

</script>

<template>
  <header>
    <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <HelloWorld msg="You did it!" /><br>
      <input name="file" type="file" @change="select"/><br>
      Chunks count: {{ chunks?.length }}<br>
      File size: {{ file?.size }}<br>
      <button @click="makeUpload" :disabled="isUploading">Upload</button><br>
    </div>
  </header>

  <main>
    <TheWelcome />
  </main>
</template>

<style>
@import './assets/base.css';

#app {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;

  font-weight: normal;
}

header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

a,
.green {
  text-decoration: none;
  color: hsla(160, 100%, 37%, 1);
  transition: 0.4s;
}

@media (hover: hover) {
  a:hover {
    background-color: hsla(160, 100%, 37%, 0.2);
  }
}

@media (min-width: 1024px) {
  body {
    display: flex;
    place-items: center;
  }

  #app {
    display: grid;
    grid-template-columns: 1fr 1fr;
    padding: 0 2rem;
  }

  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  .logo {
    margin: 0 2rem 0 0;
  }
}
</style>
