<template>
  <div class="app-container">
    <el-form
      ref="searchForm"
      :model="searchModel"
      :inline="true"
      label-position="left"
    >
      <el-form-item>
        <el-input
          v-model="searchModel.name"
          placeholder="名称"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="searchModel.addr" placeholder="ip地址" clearable>
        </el-input>
      </el-form-item>

      <el-form-item>
        <el-button plain size="medium" icon="fa fa-search">查询</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="2">
      <div class="avue-crud__menu">
        <div class="avue-crud__left">
          <AddNewButton @addNewHandler="addNewHandler"></AddNewButton>
          <EditButton @edit-handler="editHandler"></EditButton>
          <RemoveButton @remove-handler="removeHandler"></RemoveButton>
        </div>
        <div class="avue-crud__right">
          <RefreshButton @refreshHandler="refreshHandler"></RefreshButton>
        </div>
      </div>
      <el-col :xs="10">
        <el-table
          :data="pageData.tableData"
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
          <el-table-column
            prop="name"
            label="服务器名称"
            sortable
            resizable
            :show-overflow-tooltip="true"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="addr"
            label="服务器地址"
            sortable
            resizable
            :show-overflow-tooltip="true"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="port"
            label="服务器端口"
            sortable
            resizable
            :show-overflow-tooltip="true"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="username"
            label="服务器账号"
            sortable
            resizable
            :show-overflow-tooltip="true"
            align="center"
          ></el-table-column>
          <el-table-column
            label="操作"
            sortable
            resizable
            :show-overflow-tooltip="true"
            align="center"
          >
          </el-table-column>
        </el-table>
      </el-col>
      <el-pagination
        v-model:currentPage="searchModel.pageNum"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="searchModel.pageSize"
        layout="total,sizes, prev, pager, next, jumper"
        :total="searchModel.total"
        @size-change="sizeChange"
        @current-change="currentChange"
      ></el-pagination>
    </el-row>
  </div>
  <HostInfo
    :is-update="pageData.isUpdate"
    :form-data="pageData.formData"
    :show-dialog="pageData.showDialog"
    @cancel-data-scope="cancelDataScope"
  ></HostInfo>
</template>
<script setup lang="ts">
import { onBeforeMount, reactive, toRaw } from "vue";
//@ts-ignore
import RefreshButton from "/@/views/components/table/refreshButton.vue";
//@ts-ignore
import AddNewButton from "/@/views/components/table/addNewButton.vue";
//@ts-ignore
import EditButton from "/@/views/components/table/editButton.vue";
//@ts-ignore
import RemoveButton from "/@/views/components/table/removeButton.vue";
//@ts-ignore
import HostInfo from "../component/info/info.vue";
import { hostStore } from "/@/store/modules/host/host";
import { HostModel, HostQuery } from "/@/api/model/hostModel";
import { warnMessage } from "/@/utils/message";
import { Page } from "/@/api/model/resultModel";
const searchModel: HostQuery = reactive({
  total: 0,
  pageNum: 1,
  pageSize: 10
});
const pageData = reactive({
  tableData: [],
  selection: [],
  showDialog: false,
  formData: {
    id: 0,
    name: "",
    addr: "",
    username: "",
    port: 22,
    password: "",
    userId: 0
  },
  isUpdate: false
});
/**
 * 分页查询
 */
const getPage = async () => {
  const query = toRaw(searchModel);
  const result = await hostStore().findPage(query);
  if (result.code === 0) {
    const resultData: Page<HostModel> = result.data;
    searchModel.total = resultData.total;
    if (!resultData.records) {
      resultData.records = [];
    }
    pageData.tableData = resultData.records;
  } else {
    warnMessage("查询失败:" + result.msg);
  }
};
const handleSelectionChange = val => {
  pageData.selection = val;
};
const sizeChange = async (pageSize: number) => {
  searchModel.pageSize = pageSize;
  getPage();
};
const currentChange = async (pageNum: number) => {
  searchModel.pageNum = pageNum;
  getPage();
};
const initModel = (data?: HostModel) => {
  if (data) {
    pageData.formData = {
      id: data.id,
      name: data.name,
      addr: data.addr,
      username: data.username,
      password: data.password,
      port: data.port,
      userId: data.userId
    };
  } else {
    pageData.formData = {
      id: 0,
      name: "",
      addr: "",
      username: "",
      port: 22,
      password: "",
      userId: 0
    };
  }
};
const refreshHandler = () => {
  console.log("refresh");
};
const addNewHandler = () => {
  initModel(undefined);
  pageData.isUpdate = false;
  pageData.showDialog = true;
};
const editHandler = () => {
  console.log("edit");
};
const removeHandler = () => {
  console.log("remove");
};
const cancelDataScope = (data: boolean) => {
  pageData.showDialog = data;
  pageData.isUpdate = false;
  initModel(undefined);
};
onBeforeMount(() => {
  getPage();
});
</script>
<style lang="scss" scoped></style>
