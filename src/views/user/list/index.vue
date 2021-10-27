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
          <AddNewButton @addNewHandler="addNew"></AddNewButton>
          <EditButton @editHandler="edit"></EditButton>
        </div>
        <div class="avue-crud__right">
          <RefreshButton @refreshHandler="getPage"></RefreshButton>
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
          >
          </el-table-column>
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
            <template #default="scope">
              <el-button
                title="修改"
                type="primary"
                icon="fa fa-pencil"
                size="mini"
                @click="editHandler(scope.row)"
              ></el-button>
              <el-button
                title="删除"
                type="danger"
                icon="fa fa-trash"
                size="mini"
                :disabled="true"
              ></el-button>
              <el-button
                title="重置密码"
                type="primary"
                icon="fa fa-key"
                size="mini"
                @click="rePassword(scope.row)"
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

    <UserInfo
      :showDialog="pageData.showDialog"
      :dataInfo="pageData.dataInfo"
      :isUpdate="pageData.isUpdate"
      @closeDialog="closeDialog"
    ></UserInfo>
  </div>
</template>
<script setup lang="ts">
import { onBeforeMount, reactive, toRaw } from "vue";
import { Page } from "/@/api/model/resultModel";
import { UserInfoModel } from "/@/api/model/userModel";
import { userStore } from "/@/store/modules/user/user";
import { successMessage, warnMessage } from "/@/utils/message";
//@ts-ignore
import UserInfo from "./component/userinfo.vue";
//@ts-ignore
import RefreshButton from "/@/views/components/table/refreshButton.vue";
//@ts-ignore
import AddNewButton from "/@/views/components/table/addNewButton.vue";
//@ts-ignore
import EditButton from "/@/views/components/table/editButton.vue";
import { warnConfirm } from "/@/utils/message/box";
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
const pageData = reactive({
  tableData: [],
  showDialog: false,
  isUpdate: false,
  dataInfo: {
    id: 0,
    username: "",
    nickName: "",
    email: "",
    isAdmin: 0
  },
  selection: []
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
    pageData.tableData = resultData.records;
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
  initUserInfo(undefined);
  pageData.showDialog = value;
  getPage();
};
const initUserInfo = async data => {
  if (data) {
    pageData.dataInfo = data;
  } else {
    pageData.dataInfo = {
      id: 0,
      username: "",
      nickName: "",
      email: "",
      isAdmin: 0
    };
  }
};
const handleSelectionChange = val => {
  pageData.selection = val;
};
const addNew = () => {
  initUserInfo(undefined);
  pageData.isUpdate = false;
  pageData.showDialog = true;
};
const edit = () => {
  if (pageData.selection.length <= 0) {
    warnMessage("请选择");
  } else if (pageData.selection.length > 1) {
    warnMessage("请选择(有且只有一个)");
  } else {
    initUserInfo(pageData.selection[0]);
    pageData.isUpdate = true;
    pageData.showDialog = true;
  }
};
const editHandler = data => {
  initUserInfo(data);
  pageData.isUpdate = true;
  pageData.showDialog = true;
};
const rePassword = async data => {
  if (data) {
    warnConfirm("是否重置")
      .then(async () => {
        const result = await userStore().rePassword(data.id);
        if (result.code === 0) {
          successMessage("重置成功");
        } else {
          warnMessage("重置失败:" + result.msg);
        }
      })
      .catch(() => {});
  } else {
    warnMessage("请选择");
  }
};
onBeforeMount(() => {
  getPage();
});
</script>
