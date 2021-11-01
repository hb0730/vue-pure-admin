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
            label="供应商名称"
          >
          </el-table-column>
          <el-table-column
            sortable
            resizable
            :show-overflow-tooltip="true"
            align="center"
            prop="alias"
            label="供应商代码"
          ></el-table-column>
          <el-table-column
            sortable
            resizable
            :show-overflow-tooltip="true"
            align="center"
            prop="accountId"
            label="DNS账号"
          ></el-table-column>
          <el-table-column
            sortable
            resizable
            :show-overflow-tooltip="true"
            align="center"
            prop="email"
            label="邮箱"
          ></el-table-column>
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
                icon="fa fa-pencil"
                @click="handlerEdit(scope.row)"
                size="mini"
              ></el-button>
              <el-button
                title="删除"
                type="danger"
                icon="fa fa-trash"
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
import { onMounted, reactive, toRaw } from "vue";
import { dnsStore } from "/@/store/modules/dns/dns";
import { warnMessage } from "/@/utils/message";
import { Page } from "/@/api/model/resultModel";
import { DNSModel } from "/@/api/model/dnsModel";
import { warnConfirm } from "/@/utils/message/box";
const pageData = reactive({
  showDialog: false,
  isUpdate: false,
  selection: [],
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
    alias: "",
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
      alias: "",
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
const handleSelectionChange = val => {
  pageData.selection = val;
};
const sizeChange = async (pageSize: number) => {
  pageData.searchModel.pageSize = pageSize;
  getPage();
};
const currentChange = async (pageNum: number) => {
  pageData.searchModel.pageNum = pageNum;
  getPage();
};

const addNewHandler = () => {
  initInfo(null);
  pageData.showDialog = true;
  pageData.isUpdate = false;
};
const editHandler = () => {
  if (pageData.selection.length <= 0) {
    warnMessage("请选择");
  } else if (pageData.selection.length > 1) {
    warnMessage("请选择(有且只有一个)");
  } else {
    initInfo(pageData.selection[0]);
    pageData.isUpdate = true;
    pageData.showDialog = true;
  }
};
const removeHandler = () => {
  if (pageData.selection.length <= 0) {
    warnMessage("请选择");
  } else {
    warnConfirm("是否删除当前选中的数据")
      .then(async () => {
        let id = [];
        pageData.selection.forEach(value => {
          id.push(value.id);
        });
        const result = await dnsStore().deleteDNS(id);
        if (result.code === 0) {
          getPage();
        } else {
          warnMessage("删除失败:" + result.msg);
        }
      })
      .catch(() => {});
  }
};
const refreshHandler = () => {
  getPage();
};
const cancelDataScope = () => {
  pageData.showDialog = false;
  initInfo(null);
  getPage();
};
const handlerEdit = data => {
  initInfo(data);
  pageData.isUpdate = true;
  pageData.showDialog = true;
};
const handlerDelete = (data: DNSModel) => {
  warnConfirm("是否删除当前数据")
    .then(async () => {
      let id = [data.id];
      const result = await dnsStore().deleteDNS(id);
      if (result.code === 0) {
        getPage();
      } else {
        warnMessage("删除失败:" + result.msg);
      }
    })
    .catch(() => {});
};
onMounted(() => {
  getPage();
});
</script>

<style scoped></style>
