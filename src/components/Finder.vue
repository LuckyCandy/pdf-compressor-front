<template>
  
  <el-input
      v-model="filePath"
      placeholder="选择目录"
      class="input-with-select"
      style="flex-grow: 1;"
    >
      <template #append>
        <el-button :icon="Folder" @click="handleButtonClick"/>
      </template>
    </el-input>

  
</template>
<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { Folder } from '@element-plus/icons-vue'
import ipc_client from '~/renderer';



const filePath = ref<string>('')
const startLoading = ref(false)
const emitFunc = defineEmits(['sel-file'])


const handleButtonClick = async () => {
  startLoading.value = true
  await ipc_client.invoke('CHANNEL_FILE_UPLOAD', null)
}

const cutStr = (str: string, len: number) => {
  var char_length = 0;
  for (var i = str.length - 1; i >= 0; i--) {
    var char_code = str.charCodeAt(i);
    if (char_code >= 0 && char_code <= 128) {
      char_length += 1;
    } else {
      char_length += 2;
    }
    if (char_length > len) {
      return str.substring(i + 1);
    }
  }
  return str;
}

const fileUploadResponseHandler = (_event: any, localPath: string) => {
  filePath.value = '...' + cutStr(localPath, 50)
  startLoading.value = false
  //上传文件到服务器
  emitFunc('sel-file', localPath)
}

onMounted(() => {
  ipc_client.addListener('CHANNEL_FILE_UPLOAD_RES', fileUploadResponseHandler)
})

onUnmounted(() => {
  ipc_client.removeListener('CHANNEL_FILE_UPLOAD_RES', fileUploadResponseHandler)
})
</script>