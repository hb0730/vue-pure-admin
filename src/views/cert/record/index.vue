<template>
  <div class="app-container">
    <el-form>
      <el-row justify="space-between">
        <el-col :span="6">
          <el-form-item label="域名">
            <el-input disabled v-model="certModel.domainName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="子域">
            <el-input disabled v-model="certModel.domainList"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="申请地址">
            <el-input disabled v-model="certModel.certbotName"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-row>
      <div class="avue-crud__menu">
        <div class="avue-crud__left">
          <el-button type="success" size="mini">申请</el-button>
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
import { computed, onBeforeMount, onMounted, reactive } from "vue-demi";
import router from "/@/router";
import { certRecordStoreHook } from "/@/store/modules/certs/record";
import { warnMessage } from "/@/utils/message";
const store = certRecordStoreHook();
const certModel = computed(() => {
  return store.getCertModel;
});
const pageData = reactive({
  tableData: [],
  searchModel: {
    pageNum: 1,
    pageSize: 10,
    total: 0
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

const getPage = async () => {};

onBeforeMount(() => {
  if (!certModel) {
    warnMessage("打开失败");
    router.go(-1);
  }
});
onMounted(() => {});
</script>

<style scoped></style>
