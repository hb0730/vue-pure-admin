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
          v-model="pageData.searchModel.domain"
          placeholder="域名"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-select
          style="width: 100%"
          v-model="pageData.searchModel.dnsId"
          clearable
          placeholder="请选择"
        >
          <el-option
            v-for="item in pageData.dnsList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
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
            prop="domain"
            label="域名"
          >
          </el-table-column>
          <el-table-column
            sortable
            resizable
            :show-overflow-tooltip="true"
            align="center"
            prop="dnsId"
            label="dns供应商"
          >
            <template #default="scope">
              {{ showDnsName(scope.row).name }}
            </template>
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
    <Info
      :model-info="pageData.domainInfo"
      :is-update="pageData.isUpdate"
      :show-dialog="pageData.showDialog"
      :dns-select="pageData.dnsList"
      @cancel-data-scope="cancelDataScope"
    ></Info>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, toRaw } from "vue";
import { dnsStore } from "/@/store/modules/dns/dns";
import AddNewButton from "/@/views/components/table/addNewButton.vue";
import EditButton from "/@/views/components/table/editButton.vue";
import RemoveButton from "/@/views/components/table/removeButton.vue";
import RefreshButton from "/@/views/components/table/refreshButton.vue";
import Info from "../info/index.vue";
import { domainStore } from "/@/store/modules/domain/domain";
import { DomainModel } from "/@/api/model/domain";
import { warnMessage } from "/@/utils/message";
import { Page } from "/@/api/model/resultModel";
import { DNSModel } from "/@/api/model/dnsModel";
import { warnConfirm } from "/@/utils/message/box";

const pageData = reactive({
  searchModel: {
    total: 0,
    pageNum: 1,
    pageSize: 10,
    domain: null,
    dnsId: null
  },
  domainInfo: {
    id: null,
    dnsId: null,
    dnsName: null,
    domain: null
  },
  isUpdate: false,
  showDialog: false,
  dnsList: [],
  tableData: [],
  selection: []
});
const dnsList = async () => {
  const result = await dnsStore().find(null);
  if (result.code == 0) {
    pageData.dnsList = result.data;
  }
};
const initDomainInfo = (data: any) => {
  if (data) {
    pageData.domainInfo = data;
  } else {
    pageData.domainInfo = {
      id: null,
      dnsId: null,
      dnsName: null,
      domain: null
    };
  }
};
const addNewHandler = () => {
  initDomainInfo(null);
  pageData.isUpdate = false;
  pageData.showDialog = true;
};
const editHandler = () => {
  if (pageData.selection.length <= 0) {
    warnMessage("请选择");
  } else if (pageData.selection.length > 1) {
    warnMessage("请选择(有且只有一个)");
  } else {
    initDomainInfo(pageData.selection[0]);
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
        const result = await domainStore().deleteDomain(id);
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
const handleSelectionChange = val => {
  pageData.selection = val;
};
const handlerEdit = data => {
  initDomainInfo(data);
  pageData.isUpdate = true;
  pageData.showDialog = true;
};
const handlerDelete = (data: DomainModel) => {
  warnConfirm("是否删除当前数据")
    .then(async () => {
      let id = [data.id];
      const result = await domainStore().deleteDomain(id);
      if (result.code === 0) {
        getPage();
      } else {
        warnMessage("删除失败:" + result.msg);
      }
    })
    .catch(() => {});
};
const cancelDataScope = () => {
  initDomainInfo(null);
  pageData.isUpdate = false;
  pageData.showDialog = false;
  getPage();
};
const getPage = async () => {
  const query = toRaw(pageData.searchModel);
  const result = await domainStore().findPage(query);
  if (result.code === 0) {
    const resultData: Page<DomainModel> = result.data;
    pageData.searchModel.total = resultData.total;
    if (!resultData.records) {
      resultData.records = [];
    }
    pageData.tableData = resultData.records;
  } else {
    warnMessage("查询失败:" + result.msg);
  }
};
const showDnsName = (data: DomainModel) => {
  return pageData.dnsList.filter(
    (value: DNSModel) => value.id === data.dnsId
  )[0];
};
onMounted(() => {
  dnsList();
  getPage();
});
</script>

<style scoped></style>
