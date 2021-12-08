<template>
  <div class="app-container">
    <el-form
      ref="searchForm"
      :model="pageData.searchModel"
      :inline="true"
      label-position="left"
    >
      <el-form-item>
        <el-input
          v-model="pageData.searchModel.name"
          placeholder="名称"
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
        <el-button
          plain
          size="medium"
          @click="searchModel"
          :icon="findIconReg('FA-search')"
          >查询</el-button
        >
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
            sortable
            resizable
            :show-overflow-tooltip="true"
            align="center"
            prop="name"
            label="名称"
          >
          </el-table-column>
          <el-table-column
            sortable
            resizable
            :show-overflow-tooltip="true"
            align="center"
            prop="email"
            label="邮箱"
          >
          </el-table-column>
          <el-table-column
            sortable
            resizable
            :show-overflow-tooltip="true"
            align="center"
            prop="directoryUrl"
            label="申请地址"
          >
          </el-table-column>
          <el-table-column
            label="操作"
            sortable
            resizable
            :show-overflow-tooltip="true"
            align="center"
          >
            <template #default="scope"
              ><el-button
                title="修改"
                type="primary"
                :icon="findIconReg('FA-edit')"
                @click="handlerEdit(scope.row)"
                size="mini"
              ></el-button>
              <el-button
                title="删除"
                type="danger"
                :icon="findIconReg('FA-trash')"
                size="mini"
                @click="handlerDelete(scope.row)"
              ></el-button>
            </template>
          </el-table-column>
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
    <Info
      :model-info="pageData.modelInfo"
      :is-update="pageData.isUpdate"
      :show-dialog="pageData.showDialog"
      @cancel-data-scope="cancelDataScope"
    ></Info>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, toRaw } from "vue";
//@ts-ignore
import AddNewButton from "/@/views/components/table/addNewButton.vue";
//@ts-ignore
import EditButton from "/@/views/components/table/editButton.vue";
//@ts-ignore
import RemoveButton from "/@/views/components/table/removeButton.vue";
//@ts-ignore
import RefreshButton from "/@/views/components/table/refreshButton.vue";
//@ts-ignore
import Info from "../info/index.vue";
import { findIconReg } from "/@/components/ReIcon";
import { caManagerStore } from "/@/store/modules/ca-manager";
import { CAManagerModel } from "/@/api/model/ca-manager";
import { Page } from "/@/api/model/result";
import { warnMessage } from "/@/utils/message";
import { warnConfirm } from "/@/utils/message/box";
const pageData = reactive({
  showDialog: false,
  isUpdate: false,
  searchModel: {
    total: 0,
    pageNum: 1,
    pageSize: 10,
    name: "",
    email: ""
  },
  tableData: [],
  selection: [],
  modelInfo: {
    id: 0,
    name: "",
    email: "",
    directoryUrl: ""
  }
});

const addNewHandler = async () => {
  initModel(null);
  pageData.isUpdate = false;
  pageData.showDialog = true;
};
const editHandler = async () => {
  if (pageData.selection.length <= 0) {
    warnMessage("请选择");
  } else if (pageData.selection.length > 1) {
    warnMessage("请选择(有且只有一个)");
  } else {
    initModel(pageData.selection[0]);
    pageData.isUpdate = true;
    pageData.showDialog = true;
  }
};
const removeHandler = async () => {
  if (pageData.selection.length <= 0) {
    warnMessage("请选择");
  } else {
    warnConfirm("是否删除当前选中的数据")
      .then(async () => {
        let id = [];
        pageData.selection.forEach(value => {
          id.push(value.id);
        });
        const result = await caManagerStore().deleteByIds(id);
        if (result.code === 0) {
          getPage();
        } else {
          warnMessage("删除失败:" + result.msg);
        }
      })
      .catch(() => {});
  }
};
const refreshHandler = async () => {
  getPage();
};
const handleSelectionChange = async val => {
  pageData.selection = val;
};
const handlerEdit = async data => {
  initModel(data);
  pageData.isUpdate = true;
  pageData.showDialog = true;
};
const handlerDelete = async (data: CAManagerModel) => {
  warnConfirm("是否删除当前数据")
    .then(async () => {
      let id = [data.id];
      const result = await caManagerStore().deleteByIds(id);
      if (result.code === 0) {
        getPage();
      } else {
        warnMessage("删除失败:" + result.msg);
      }
    })
    .catch(() => {});
};

const getPage = async () => {
  const query = toRaw(pageData.searchModel);
  const result = await caManagerStore().findPage(query);
  if (result.code === 0) {
    const resultData: Page<CAManagerModel> = result.data;
    pageData.searchModel.total = resultData.total;
    if (!resultData.records) {
      resultData.records = [];
    }
    pageData.tableData = resultData.records;
  } else {
    warnMessage("查询失败:" + result.msg);
  }
};
const initModel = async data => {
  if (data) {
    pageData.modelInfo = data;
  } else {
    pageData.modelInfo = { id: 0, name: "", email: "", directoryUrl: "" };
  }
};
const sizeChange = async (pageSize: number) => {
  pageData.searchModel.pageSize = pageSize;
  getPage();
};
const currentChange = async (pageNum: number) => {
  pageData.searchModel.pageNum = pageNum;
  getPage();
};
const cancelDataScope = async () => {
  initModel(null);
  pageData.isUpdate = false;
  pageData.showDialog = false;
  getPage();
};
const searchModel = async () => {
  pageData.searchModel.pageNum = 0;
  getPage();
};
onMounted(() => {
  getPage();
});
</script>

<style scoped></style>
