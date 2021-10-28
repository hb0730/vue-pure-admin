<template>
  <div class="app-container">
    <el-form
      ref="searchForm"
      v-model="pageData.searchModel"
      :inline="true"
      label-position="left"
    >
      <el-form-item>
        <el-input
          v-model="pageData.searchModel.alisa"
          placeholder="提供商/别名"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="pageData.searchModel.email"
          placeholder="邮箱"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button plain size="medium" icon="fa fa-search">查询</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="2">
      <div class="avue-crud__menu">
        <div class="avue-crud__left">
          <AddNewButton @addNewHandler="addNewHandler"></AddNewButton>
          <EditButton @editHandler="editHandler"></EditButton>
          <RemoveButton @removeHandler="removeHandler"></RemoveButton>
        </div>
        <div class="avue-crud__right">
          <RefreshButton @refreshHandler="refreshHandler"></RefreshButton>
        </div>
      </div>
      <el-col :xs="10">
        <el-table
          style="width: 99.9%"
          ref="tableRef"
          border
          :fit="true"
          :header-cell-style="{ 'text-align': 'center' }"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            sortable
            resizable
            :show-overflow-tooltip="true"
            align="center"
            type="selection"
          ></el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <Info
      :show-dialog="pageData.showDialog"
      :data-info="pageData.modelInfo"
      :isUpdate="pageData.isUpdate"
      @cancel-data-scope="cancelDataScope"
    ></Info>
  </div>
</template>

<script setup lang="ts">
//@ts-ignore
import RefreshButton from "/@/views/components/table/refreshButton.vue";
//@ts-ignore
import AddNewButton from "/@/views/components/table/addNewButton.vue";
//@ts-ignore
import EditButton from "/@/views/components/table/editButton.vue";
//@ts-ignore
import RemoveButton from "/@/views/components/table/removeButton.vue";

//@ts-ignore
import Info from "../info/index.vue";
import { onBeforeMount, reactive, toRaw } from "vue";
import { dnsStore } from "/@/store/modules/dns/dns";
import { warnMessage } from "/@/utils/message";
import { Page } from "/@/api/model/resultModel";
import { DNSModel } from "/@/api/model/dnsModel";
const pageData = reactive({
  showDialog: false,
  isUpdate: false,
  providers: [],
  searchModel: {
    total: 0,
    pageNum: 1,
    pageSize: 10,
    alisa: "",
    email: ""
  },
  tableData: [],
  modelInfo: {
    id: 0,
    userId: 0,
    name: "",
    alisa: "",
    accountId: "",
    secret: "",
    endpoint: "",
    region: "",
    email: ""
  }
});
const initInfo = data => {
  if (data) {
    pageData.modelInfo = data;
  } else {
    pageData.modelInfo = {
      id: 0,
      userId: 0,
      name: "",
      alisa: "",
      accountId: "",
      secret: "",
      endpoint: "",
      region: "",
      email: ""
    };
  }
};
const getPage = async () => {
  const query = toRaw(pageData.searchModel);
  const result = await dnsStore().findPage(query);
  if (result.code === 0) {
    const resultData: Page<DNSModel> = result.data;
    pageData.searchModel.total = resultData.total;
    if (!resultData.records) {
      resultData.records = [];
    }
    pageData.tableData = resultData.records;
  } else {
    warnMessage("查询失败:" + result.msg);
  }
};
const addNewHandler = () => {
  initInfo(null);
  pageData.showDialog = true;
  pageData.isUpdate = false;
};
const editHandler = () => {};
const removeHandler = () => {};
const refreshHandler = () => {};
const handleSelectionChange = _ => {};
const cancelDataScope = () => {
  pageData.showDialog = false;
  initInfo(null);
  getPage();
};
onBeforeMount(() => {
  getPage();
});
</script>

<style scoped></style>
