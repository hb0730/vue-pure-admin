<template>
  <div class="app-container">
    <el-form
      ref="searchForm"
      :model="pageData.searchModel"
      :inline="true"
      label-position="left"
    >
      <el-form-item>
        <el-select
          style="width: 100%"
          v-model="pageData.searchModel.domainId"
          clearable
          placeholder="域名"
        >
          <el-option
            v-for="item in pageData.domainSelect"
            :key="item.id"
            :label="item.domain"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select
          style="width: 100%"
          v-model="pageData.searchModel.certbotId"
          clearable
          placeholder="机器人"
        >
          <el-option
            v-for="item in pageData.certbotSelect"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button plain size="medium" :icon="findIconReg('FA-search')"
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
            prop="domainId"
            label="顶级域名"
          >
            <template #default="scope">
              {{ getDomainInfo(scope.row.domainId).domain }}
            </template>
          </el-table-column>
          <el-table-column
            sortable
            resizable
            :show-overflow-tooltip="true"
            align="center"
            prop="domainId"
            label="机器人"
          >
            <template #default="scope">
              {{ getCertBotInfo(scope.row.domainId).name }}
            </template>
          </el-table-column>
          <el-table-column
            sortable
            resizable
            :show-overflow-tooltip="true"
            align="center"
            prop="domainList"
            label="子域"
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
              <el-button
                title="记录"
                type="warning"
                :icon="findIconReg('FA-list-alt')"
                size="mini"
                @click="handlerOpenRecord(scope.row)"
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
      :domain-select="pageData.domainSelect"
      :is-update="pageData.isUpdate"
      :show-dialog="pageData.showDialog"
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
//@ts-ignore
import Info from "../info/index.vue";
import { findIconReg } from "/@/components/ReIcon";

import { onMounted, reactive } from "vue";
import { caManagerStore } from "/@/store/modules/ca-manager";
import { domainStore } from "/@/store/modules/domain/domain";

import { warnMessage } from "/@/utils/message";
import { warnConfirm } from "/@/utils/message/box";
import { subDomainStore } from "/@/store/modules/domain/sub-domain";
import { Page } from "/@/api/model/result";
import { SubDomainModel } from "/@/api/model/sub-domain";
import { DomainModel } from "/@/api/model/domain";
import { CAManagerModel } from "/@/api/model/ca-manager";
import { certRecordStoreHook } from "/@/store/modules/certs/record";

const pageData = reactive({
  isUpdate: false,
  showDialog: false,
  certbotSelect: [],
  domainSelect: [],
  searchModel: {
    total: 0,
    pageNum: 1,
    pageSize: 10,
    domainId: null,
    certbotId: null
  },
  selection: [],
  tableData: [],
  modelInfo: {
    id: null,
    domainId: null,
    domainList: ""
  }
});
const domainSelect = async () => {
  const result = await domainStore().find();
  if (result.code === 0) {
    pageData.domainSelect = result.data;
  }
};
const certbotSelect = async () => {
  const result = await caManagerStore().find(null);
  if (result.code === 0) {
    pageData.certbotSelect = result.data;
  }
};

const getPage = async () => {
  const result = await subDomainStore().findPage(pageData.searchModel);
  if (result.code === 0) {
    const resultData: Page<SubDomainModel> = result.data;
    pageData.searchModel.total = resultData.total;
    if (!resultData.records) {
      resultData.records = [];
    }
    pageData.tableData = resultData.records;
  } else {
    warnMessage("查询失败:" + result.msg);
  }
};

const initModel = async (data?: any) => {
  if (data) {
    pageData.modelInfo = data;
  } else {
    pageData.modelInfo = {
      id: null,
      domainId: null,
      domainList: ""
    };
  }
};

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
        const result = await subDomainStore().deleteByIds(id);
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
const handlerDelete = async (data: any) => {
  warnConfirm("是否删除当前数据")
    .then(async () => {
      let id = [data.id];
      const result = await subDomainStore().deleteByIds(id);
      if (result.code === 0) {
        getPage();
      } else {
        warnMessage("删除失败:" + result.msg);
      }
    })
    .catch(() => {});
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
const getDomainInfo = (id: number): any => {
  if (!id || !pageData.domainSelect || !pageData.domainSelect.length) {
    return { domain: "" };
  }
  const model = pageData.domainSelect.filter((v: DomainModel) => v.id === id);
  if (model.length > 0) {
    return model[0];
  } else {
    return { domain: "" };
  }
};
const getCertBotInfo = (domainId: number): any => {
  if (!pageData.certbotSelect || !pageData.certbotSelect.length) {
    return { name: "" };
  }
  const result: DomainModel = getDomainInfo(domainId);
  if (result.certbotId) {
    const model = pageData.certbotSelect.filter(
      (v: CAManagerModel) => v.id === result.certbotId
    );
    if (model.length > 0) {
      return model[0];
    } else {
      return { name: "" };
    }
  } else {
    return { name: "" };
  }
};
const handlerOpenRecord = async (data: SubDomainModel) => {
  const certbotInfo = getCertBotInfo(data.domainId);
  const domainInfo = getDomainInfo(data.domainId);
  const certRecordModel = {
    id: data.id,
    domainId: data.domainId,
    domainName: domainInfo.domain,
    domainList: data.domainList,
    certbotName: certbotInfo.name,
    certbotId: certbotInfo.id
  };
  certRecordStoreHook().openRecord(certRecordModel);
};
onMounted(() => {
  domainSelect();
  certbotSelect();
  getPage();
});
</script>

<style scoped></style>
