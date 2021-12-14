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
            prop="name"
            label="名称"
            sortable
            resizable
            :show-overflow-tooltip="true"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="hostId"
            label="主机"
            sortable
            resizable
            :show-overflow-tooltip="true"
            align="center"
          >
            <template #default="scope">
              {{ showHost(scope.row.hostId).name }}
            </template>
          </el-table-column>
          <el-table-column
            prop="subDomainId"
            label="子域"
            sortable
            resizable
            :show-overflow-tooltip="true"
            align="center"
          >
            <template #default="scope">
              {{ showSubDomain(scope.row.subDomainId).domainList }}
            </template>
          </el-table-column>
          <el-table-column
            prop="domain"
            label="监听域名"
            sortable
            resizable
            :show-overflow-tooltip="true"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="cron"
            label="表达式"
            sortable
            resizable
            :show-overflow-tooltip="true"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="enabled"
            label="状态"
            sortable
            resizable
            :show-overflow-tooltip="true"
            align="center"
          >
            <template #default="scope">
              {{ showEnabledName(scope.row.enabled) }}
            </template>
          </el-table-column>
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
                :icon="findIcon('edit')"
                @click="handlerEdit(scope.row)"
                size="mini"
              ></el-button>
              <el-button
                title="删除"
                type="danger"
                :icon="findIcon('trash')"
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
      :is-update="pageData.isUpdate"
      :show-dialog="pageData.showDialog"
      :model-info="pageData.modelInfo"
      :enableds="pageData.enableds"
      :sub-domains="pageData.subDomains"
      :hosts="pageData.hosts"
      @cancel-data-scope="cancelDataScope"
    ></Info>
  </div>
</template>

<script setup lang="ts">
//@ts-ignore
import AddNewButton from "/@/views/components/table/addNewButton.vue";
//@ts-ignore
import EditButton from "/@/views/components/table/editButton.vue";
//@ts-ignore
import RemoveButton from "/@/views/components/table/removeButton.vue";
//@ts-ignore
import RefreshButton from "/@/views/components/table/refreshButton.vue";
import { findIconReg } from "/@/components/ReIcon";
import { findIcon } from "/@/components/fontawesome";
//@ts-ignore
import Info from "./info.vue";
import { onMounted, reactive, unref } from "vue";
import { domainJobStore } from "/@/store/modules/job/domain-job";
import { Page, Result } from "/@/api/model/result";
import { DomainJobModel } from "/@/api/model/job";
import { warnMessage } from "/@/utils/message";
import { hostStore } from "/@/store/modules/host/host";
import { HostModel } from "/@/api/model/host";
import { subDomainStore } from "/@/store/modules/domain/sub-domain";
import { SubDomainModel } from "/@/api/model/sub-domain";
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
  caTypes: [],
  enableds: [
    { name: "启用", value: 1 },
    { name: "禁用", value: 0 }
  ],
  hosts: [],
  subDomains: [],
  modelInfo: {
    id: 0,
    userId: 0,
    name: "",
    subDomainId: null,
    domain: "",
    hostId: null,
    remoteAddr: "",
    script: "",
    cron: "",
    enabled: 0
  }
});

const searchModel = async () => {};
const addNewHandler = async () => {
  initModel(null);
  pageData.showDialog = true;
  pageData.isUpdate = false;
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
        const result = await domainJobStore().deleteById(id);
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
  pageData.searchModel.pageNum = 1;
  getPage();
};
const handleSelectionChange = async val => {
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
const initModel = async (data: DomainJobModel) => {
  if (data) {
    pageData.modelInfo = data;
  } else {
    pageData.modelInfo = {
      id: 0,
      userId: 0,
      name: "",
      subDomainId: null,
      domain: "",
      hostId: null,
      remoteAddr: "",
      script: "",
      cron: "",
      enabled: 0
    };
  }
};
const cancelDataScope = async () => {
  pageData.isUpdate = false;
  pageData.showDialog = false;
  getPage();
};
const handlerEdit = data => {
  initModel(data);
  pageData.isUpdate = true;
  pageData.showDialog = true;
};
const handlerDelete = (data: DomainJobModel) => {
  warnConfirm("是否删除当前数据")
    .then(async () => {
      let id = [data.id];
      const result = await domainJobStore().deleteById(id);
      if (result.code === 0) {
        getPage();
      } else {
        warnMessage("删除失败:" + result.msg);
      }
    })
    .catch(() => {});
};
const getPage = async () => {
  const searchModel = unref(pageData.searchModel);
  const result = await domainJobStore().findPage(searchModel);
  if (result.code === 0) {
    const resultData: Page<DomainJobModel> = result.data;
    pageData.searchModel.total = resultData.total;
    if (!resultData.records) {
      resultData.records = [];
    }
    pageData.tableData = resultData.records;
  } else {
    warnMessage("查询失败:" + result.msg);
  }
};
const getSubDomains = async () => {
  const result: Result<SubDomainModel[]> = await subDomainStore().find();
  if (result.code == 0) {
    pageData.subDomains = result.data;
  } else {
    warnMessage("查询失败:" + result.msg);
  }
};
const getHosts = async () => {
  const result: Result<HostModel[]> = await hostStore().find();
  if (result.code == 0) {
    pageData.hosts = result.data;
  } else {
    warnMessage("查询失败:" + result.msg);
  }
};
const showEnabledName = (value: number): string => {
  const result = pageData.enableds.filter(v => v.value == value);
  if (result.length > 0) {
    return result[0].name;
  } else {
    return "";
  }
};
const showHost = (id: number): { name: string; id: number } => {
  const result = pageData.hosts.filter(v => v.id === id);
  if (result.length > 0) {
    return result[0];
  } else {
    return { name: "", id: 0 };
  }
};
const showSubDomain = (id: number): { domainList: string; id: number } => {
  const result = pageData.subDomains.filter(v => v.id == id);
  if (result.length > 0) {
    return result[0];
  } else {
    return { domainList: "", id: 0 };
  }
};
onMounted(() => {
  getHosts();
  getSubDomains();
  getPage();
});
</script>

<style scoped></style>
