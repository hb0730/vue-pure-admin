<template>
  <div class="console-files">
    <div class="avue-crud__menu">
      <div class="avue-crud__left">
        <el-input
          v-model="currentPath"
          v-on:keyup.enter="getFileList()"
        ></el-input>
      </div>
      <div class="avue-crud__right">
        <el-button-group>
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-arrow-up"
            @click="upDirectory"
          ></el-button>
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-refresh"
            @click="getFileList()"
          ></el-button>
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-upload"
            @click="openUploadDialog"
          ></el-button>
        </el-button-group>
      </div>
    </div>
    <el-table v-loading="loading" :data="fileList" @row-dblclick="rowClick">
      <el-table-column label="名字" sortable>
        <template v-slot="scope">
          <p
            v-if="scope.row.IsDir === true"
            style="color: #0c60b5"
            class="el-icon-folder"
          >
            {{ scope.row.Name }}
          </p>
          <p v-else-if="scope.row.IsDir === false" class="el-icon-document">
            {{ scope.row.Name }}
          </p>
        </template>
      </el-table-column>
      <el-table-column label="大小" prop="Size"></el-table-column>
      <el-table-column
        label="修改时间"
        prop="ModifyTime"
        sortable
      ></el-table-column>
    </el-table>

    <el-dialog
      title="文件上传"
      v-model="uploadVisible"
      append-to-body
      destroy-on-close
      width="30%"
    >
      <el-upload
        ref="upload"
        class="upload-demo"
        drag
        action="https://jsonplaceholder.typicode.com/posts/"
        :auto-upload="false"
        multiple
        :http-request="uploadHandler"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <template #tip>
          <div class="el-upload__tip">
            {{ uploadTip }}
          </div>
          <el-button
            style="margin-left: 10px"
            @click="submitUpload"
            size="small"
            type="success"
            >上传</el-button
          >
        </template>
      </el-upload>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import {
  getCurrentInstance,
  onBeforeUnmount,
  onMounted,
  ref,
  toRef
} from "vue-demi";
import { hostStore } from "/@/store/modules/host/host";
import { warnMessage } from "/@/utils/message";
import { getUUidV4NoDash } from "/@/utils/uuid";

const props = defineProps({
  hostId: {
    type: Number,
    required: true
  }
});

const hostId = toRef(props, "hostId");

const id = ref("");
const fileList: any = ref([]);
const currentPath = ref("");
const downPath = ref("");
const loading = ref(false);
const uploadVisible = ref(false);
const uploadTip = ref("");
const fileData = ref<File[]>([]);
const instance = getCurrentInstance();
const rowClick = row => {
  let path =
    currentPath.value.charAt(currentPath.value.length - 1) === "/"
      ? currentPath.value + row.Name
      : currentPath.value + "/" + row.Name;
  if (row.IsDir) {
    // 文件夹处理
    currentPath.value = path;
    getFileList();
  } else {
    downPath.value = path;
    downloadFile();
  }
};
const upDirectory = () => {
  if (currentPath.value === "/") {
    return;
  }
  let pathList = currentPath.value.split("/");
  if (pathList[pathList.length - 1] === "") {
    pathList = pathList.slice(0, pathList.length - 2);
  } else {
    pathList = pathList.slice(0, pathList.length - 1);
  }
  currentPath.value = pathList.length === 1 ? "/" : pathList.join("/");
  getFileList();
};
const getFileList = async () => {
  currentPath.value = currentPath.value.replace(/\/+/g, "/");
  if (currentPath.value == "") {
    currentPath.value = "/";
  }
  // 获取列表
  loading.value = true;
  const result = await hostStore().fileList(
    id.value,
    hostId.value,
    currentPath.value
  );
  loading.value = false;
  if (result.code === 0) {
    if (result.data.list === null) {
      fileList.value = [];
    } else {
      fileList.value = result.data.list;
    }
  } else {
    fileList.value = [];

    warnMessage("获取列表失败:" + result.msg);
  }
};
const downloadFile = async () => {
  hostStore().downloadFile(id.value, hostId.value, downPath.value);
};
const openUploadDialog = async () => {
  uploadTip.value = `当前上传目录: ${currentPath.value}`;
  uploadVisible.value = true;
};
const submitUpload = () => {
  //@ts-ignore
  instance.refs.upload.submit();
  const files = fileData.value;
  if (files.length <= 0) {
    warnMessage("请上传文件");
    return;
  }
  uploadTip.value = `正在上传文件 到 ${currentPath.value}, 请勿关闭窗口..`;
  hostStore()
    .uploadFile(id.value, hostId.value, files, currentPath.value)
    .then(result => {
      if (result.code === 0) {
        uploadTip.value = `上传完成!`;
        setTimeout(() => {
          uploadVisible.value = false;
          cleanUpload();
        }, 3000);
      } else {
        warnMessage("上传失败:" + result.msg);
      }
    });
};
const uploadHandler = val => {
  fileData.value.push(val.file);
};
const cleanUpload = () => {
  //@ts-ignore
  instance.refs.upload.clearFiles();
  fileData.value = [];
  getFileList();
};
onMounted(() => {
  id.value = getUUidV4NoDash();
  getFileList();
});

onBeforeUnmount(async () => {
  hostStore().fileClose(id.value);
});
</script>

<style lang="scss">
.console-files {
  .el-input__inner {
    border: 0 none;
    border-bottom: 1px solid #ccc;
    border-radius: 0;
    width: 80%;
  }
}

.upload-demo {
  text-align: center;
}
</style>
