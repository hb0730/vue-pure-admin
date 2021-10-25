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
            ></el-button>
          </el-button-group>
        </el-button-group>
      </div>
    </div>
    <el-table :data="fileList" @row-dblclick="rowClick">
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
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, toRef } from "vue-demi";
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
const rowClick = row => {
  if (row.IsDir) {
    // 文件夹处理
    currentPath.value =
      currentPath.value.charAt(currentPath.value.length - 1) === "/"
        ? currentPath.value + row.Name
        : currentPath.value + "/" + row.Name;
    getFileList();
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
  const result = await hostStore().fileList(
    id.value,
    hostId.value,
    currentPath.value
  );
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
</style>
