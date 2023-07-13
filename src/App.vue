<template>
  <el-divider content-position="center">参数说明</el-divider>
    <ol>
      <li>像素密度：PDF文件每页生成的PNG图片的像素密度，范围在[72,600],一般150足够阅读使用；</li>
      <li>页数：可以指定处理PDF文件的页数，-1表示全部处理。</li>
    </ol>
    <el-divider style="margin-bottom: 20px;">
      <el-icon><star-filled /></el-icon>
    </el-divider>
  <div style="display: flex; gap: 5px;margin-bottom: 20px;">
    <div style="display: flex; flex-direction: column; flex-grow: 1;">
      <Finder @sel-file="path => params.targetDir = path"></Finder>
      <div style="height: 10px;"></div>
      <div style="display: flex; gap: 5px; justify-content: space-between;">
        <div style="display: flex;">
          <span class="label">DPI:</span>
          <el-input-number v-model="params.imgDpi" :step="20" :min="72" :max="600" class="input-with-select" />
        </div>
        <div style="display: flex;">
          <span class="label">
            页数:
          </span>
          <el-input-number :min="-1" :step="20" v-model="params.pageNo" class="input-with-select" />
        </div>
      </div>
      
    </div>
    <el-button v-loading="compressing" type="primary" style="height: 80px;" @click="handleCompressClick">开 始<br/><br/>执 行</el-button>
  </div>
  <el-alert :title="params.alertContent" :type="params.alertType" :closable="false"  effect="dark" show-icon/>
</template>

<script lang="ts" setup>
import 'element-plus/theme-chalk/el-message.css';

import { ref, reactive, onMounted, onUnmounted } from 'vue';
import Finder from './components/Finder.vue'
import ipc_client from '~/renderer';
import {ElMessage} from 'element-plus'
import { StarFilled } from '@element-plus/icons-vue'

const compressing = ref(false)
const params = reactive({
  targetDir: '',
  imgDpi: 150,
  pageNo: -1,
  alertType: 'info',
  alertContent: '已停止',
})

const handleCompressClick = async() => {
  compressing.value = true
  if (params.targetDir == '') {
    ElMessage.error('请先选择PDF文件所在目录！')
    compressing.value = false
    return
  }
  await ipc_client.invoke('CHANNEL_EXECUTE_COMPRESS', JSON.stringify(params))
}

const compressInfo = (_event: any, info: string) => {
  var infoObject = JSON.parse(info)
  params.alertContent = infoObject.message
  params.alertType = infoObject.type
  compressing.value = infoObject.start
}

onMounted(() => {
  ipc_client.addListener('CHANNEL_EXECUTE_COMPRESS_INFO', compressInfo)
})

onUnmounted(() => {
  ipc_client.removeListener('CHANNEL_EXECUTE_COMPRESS_INFO', compressInfo)
})

</script>

<style scoped>
.el-alert {
  padding: 0 5px;
}
.label {
  color: #606266;
  line-height: 32px;
  font-size: 15px;
  margin-right: 10px;
}
.tips {
  color: goldenrod;
  font-size: 15px;
}
.el-divider--horizontal {
  margin: 0;
}

.el-alert__content {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

ol {
  list-style: none;
  counter-reset: my-counter;
  padding-left: 0;
}

ol li {
  font-size: 14px;
  color: darkcyan;
}

ol li:before {
  counter-increment: my-counter;
  content: counter(my-counter) '. ';
  color: gray;
  font-weight: bold;
  font-size: 14px;
  margin-right: 5px;
}
</style>