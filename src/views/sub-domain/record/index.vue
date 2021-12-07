<template>
  <div class="app-container">
    <el-form>
      <el-row justify="space-between">
        <el-col :span="6">
          <el-form-item label="域名">
            <el-input
              disabled
              v-model="pageData.domainListModel.domainName"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="子域">
            <el-input
              disabled
              v-model="pageData.domainListModel.domainList"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="申请地址">
            <el-input
              disabled
              v-model="pageData.domainListModel.certbotName"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-row>
      <div class="avue-crud__menu">
        <div class="avue-crud__left">
          <el-button type="success" @click="applyCert" size="mini"
            >申请</el-button
          >
        </div>
        <div class="avue-crud__right"></div>
      </div>
      <el-col :xs="10">
        <el-table
          :data="pageData.tableData"
          style="width: 99.9%"
          ref="tableRef"
          border
          :fit="true"
          :header-cell-style="{ 'text-align': 'center' }"
        >
        </el-table>
      </el-col>
    </el-row>
    <el-pagination
      v-model:currentPage="pageData.searchModel.pageNum"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageData.searchModel.pageSize"
      layout="total,sizes, prev, pager, next, jumper"
      :total="pageData.searchModel.total"
      @size-change="sizeChange"
      @current-change="currentChange"
    ></el-pagination>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, onMounted, reactive } from "vue";
import router from "/@/router";
import { certRecordStoreHook } from "/@/store/modules/certs/record";
import { successMessage, warnMessage } from "/@/utils/message";
const store = certRecordStoreHook();
const pageData = reactive({
  tableData: [],
  searchModel: {
    pageNum: 1,
    pageSize: 10,
    total: 0
  },
  domainListModel: {
    id: null,
    domainId: null,
    domainName: null,
    domainList: null,
    certbotName: null,
    certbotId: null
  }
});
const sizeChange = async (pageSize: number) => {
  pageData.searchModel.pageSize = pageSize;
  getPage();
};
const currentChange = async (pageNum: number) => {
  pageData.searchModel.pageNum = pageNum;
  getPage();
};
const getDomainListModel = (): any => {
  pageData.domainListModel = store.getDomainListModel;
  return pageData.domainListModel;
};
const applyCert = async () => {
  const result = await store.applyCert(pageData.domainListModel.id);
  if (result.code === 0) {
    successMessage("申请成功:请完成后续步骤");
  } else {
    warnMessage("申请失败:" + result.msg);
  }
};
const getPage = async () => {};

onBeforeMount(() => {
  if (!getDomainListModel()) {
    warnMessage("打开失败");
    router.go(-1);
  }
});
onMounted(() => {});
</script>

<style scoped></style>
