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
          v-model="searchModel.nickName"
          placeholder="用户昵称"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="searchModel.username"
          placeholder="用户账号"
          clearable
        >
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="searchModel.email"
          placeholder="邮箱"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          plain
          size="medium"
          icon="fa fa-search"
          @click="searchHandler"
          >查询</el-button
        >
      </el-form-item>
    </el-form>
    <el-row :gutter="2">
      <div class="avue-crud__menu">
        <div class="avue-crud__left">
          <button
            type="button"
            class="el-button filter-item el-button--success el-button--mini"
            @click="addNew"
          >
            <i class="fa fa-plus"></i> <span>新增</span>
          </button>
          <button
            type="button"
            class="el-button filter-item el-button--primary el-button--mini"
          >
            <i class="fa fa-edit">
              <span>修改</span>
            </i>
          </button>
        </div>
        <div class="avue-crud__right">
          <button
            type="button"
            class="
              el-button el-tooltip
              el-button--default el-button--small
              is-circle
            "
            aria-describedby="el-tooltip-2497"
            tabindex="0"
            title="刷新"
          >
            <i class="el-icon-refresh"></i>
          </button>
        </div>
      </div>
      <el-col :xs="10">
        <el-table
          :data="tableData.data"
          style="width: 99.9%"
          ref="tableRef"
          border
          :fit="true"
          :header-cell-style="{ 'text-align': 'center' }"
        >
          <el-table-column
            sortable
            resizable
            :show-overflow-tooltip="true"
            align="center"
            type="selection"
          ></el-table-column>
          <el-table-column
            prop="username"
            label="用户账号"
            sortable
            resizable
            :show-overflow-tooltip="true"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="nickName"
            label="用户昵称"
            sortable
            resizable
            :show-overflow-tooltip="true"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="email"
            label="邮箱"
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
            <template v-slot="">
              <el-button
                title="修改"
                type="primary"
                icon="fa fa-pencil"
                size="mini"
              ></el-button>
              <el-button
                title="删除"
                type="danger"
                icon="fa fa-trash"
                size="mini"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          v-model:currentPage="searchModel.pageNum"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="searchModel.pageSize"
          layout="total,sizes, prev, pager, next, jumper"
          :total="searchModel.total"
          @size-change="sizeChange"
          @current-change="currentChange"
        ></el-pagination>
      </el-col>
    </el-row>

    <userinfo
      :showDialog="showDialog"
      :dataInfo="dataInfo"
      :isUpdate="isUpdate"
      @closeDialog="closeDialog"
    ></userinfo>
  </div>
</template>
<script setup lang="ts">
import { onBeforeMount, reactive, ref, toRaw } from "vue";
import { Page } from "/@/api/model/resultModel";
import { UserInfoModel } from "/@/api/model/userModel";
import { userStore } from "/@/store/modules/user/user";
import { warnMessage } from "/@/utils/message";
import userinfo from "./component/userinfo.vue";
export interface searchInfo {
  nickName: string;
  username: string;
  email: string;
  total: number;
  pageNum: number;
  pageSize: number;
}
export interface userInfoModel {
  id: number;
  username: string;
  nickName: string;
  email: string;
  isAdmin: number;
}
const searchModel: searchInfo = reactive({
  nickName: "",
  username: "",
  email: "",
  total: 0,
  pageNum: 1,
  pageSize: 10
});
const tableData = reactive({ data: [] });
const showDialog = ref(false);
const isUpdate = ref(false);
const dataInfo: userInfoModel = reactive({
  id: 0,
  username: "",
  nickName: "",
  email: "",
  isAdmin: 0
});

const getPage = async () => {
  const query = toRaw(searchModel);
  const result = await userStore().findPage(query);
  if (result.code === 0) {
    const resultData: Page<UserInfoModel> = result.data;
    searchModel.total = resultData.total;
    if (!resultData.records) {
      resultData.records = [];
    }
    tableData.data = resultData.records;
  } else {
    warnMessage("查询失败:" + result.msg);
  }
};
const sizeChange = async (pageSize: number) => {
  searchModel.pageSize = pageSize;
  getPage();
};
const currentChange = async (pageNum: number) => {
  searchModel.pageNum = pageNum;
  getPage();
};

const searchHandler = async () => {
  getPage();
};
const closeDialog = value => {
  initUserInfo();
  showDialog.value = value;
  getPage();
};
const initUserInfo = async () => {
  dataInfo.id = 0;
  dataInfo.username = "";
  dataInfo.nickName = "";
  dataInfo.email = "";
  dataInfo.isAdmin = 0;
};
const addNew = () => {
  initUserInfo();
  isUpdate.value = false;
  showDialog.value = true;
};
onBeforeMount(() => {
  getPage();
});
</script>
