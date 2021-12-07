<template>
  <div class="app-container">
    <el-form>
      <el-row justify="space-between">
        <el-col :span="6">
          <el-form-item label="域名">
            <el-input
              disabled
              v-model="pageData.domainListModel.domainName"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="子域">
            <el-input
              disabled
              v-model="pageData.domainListModel.domainList"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="申请地址">
            <el-input
              disabled
              v-model="pageData.domainListModel.certbotName"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-row>
      <div class="avue-crud__menu">
        <div class="avue-crud__left">
          <el-button type="success" @click="applyCert" size="mini"
            >申请</el-button
          >
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
        >
          <el-table-column
            prop="id"
            label="序号"
            sortable
            resizable
            :show-overflow-tooltip="true"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="orderURL"
            label="申请地址"
            sortable
            resizable
            :show-overflow-tooltip="true"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="createTime"
            label="申请时间"
            sortable
            resizable
            :show-overflow-tooltip="true"
            align="center"
          >
            <template #default="scope">
              {{ convertDate(scope.row.createTime) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="status"
            label="申请状态"
            sortable
            resizable
            :show-overflow-tooltip="true"
            align="center"
          >
            <template #default="scope">
              {{ showStatusName(scope.row.status) }}
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
                title="详情"
                :icon="findIconReg('FA-expeditedssl fab')"
                @click="showDnsRecord(scope.row)"
                type="primary"
                size="mini"
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
      :dns-records="pageData.currentInfoModel.dnsRecords"
      :cert-record-id="pageData.currentInfoModel.certRecordId"
      :status="pageData.currentInfoModel.status"
      @cancel-data-scope="cancelDataScope"
    ></Info>
  </div>
</template>

<script setup lang="ts">
import dayjs from "dayjs";
import { onBeforeMount, onMounted, reactive } from "vue";
import { CertRecordModel } from "/@/api/model/cert-records";
import { Page } from "/@/api/model/result";
import router from "/@/router";
import { certRecordStoreHook } from "/@/store/modules/certs/record";
import { successMessage, warnMessage } from "/@/utils/message";
//@ts-ignore
import RefreshButton from "/@/views/components/table/refreshButton.vue";
import { findIconReg } from "/@/components/ReIcon";
import Info from "./info.vue";

const store = certRecordStoreHook();
const pageData = reactive({
  tableData: [],
  searchModel: {
    pageNum: 1,
    pageSize: 10,
    total: 0,
    subDomainId: 0
  },
  showDialog: false,
  currentInfoModel: {
    certRecordId: 0,
    dnsRecords: [],
    status: 0
  },
  domainListModel: {
    id: null,
    domainId: null,
    domainName: null,
    domainList: null,
    certbotName: null,
    certbotId: null
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
const getDomainListModel = (): any => {
  pageData.domainListModel = store.getDomainListModel;
  return pageData.domainListModel;
};
const applyCert = async () => {
  const result = await store.applyCert(pageData.domainListModel.id);
  if (result.code === 0) {
    successMessage("申请成功:请完成后续步骤");
  } else {
    warnMessage("申请失败:" + result.msg);
  }
};
const refreshHandler = async () => {
  getPage();
};
const getPage = async () => {
  pageData.searchModel.subDomainId = pageData.domainListModel.id;
  const result = await store.findPage(pageData.searchModel);
  if (result.code === 0) {
    const resultData: Page<CertRecordModel> = result.data;
    pageData.searchModel.total = resultData.total;
    if (!resultData.records) {
      resultData.records = [];
    }
    pageData.tableData = resultData.records;
  } else {
    warnMessage("查询失败:" + result.msg);
  }
};
const convertDate = (date?: string): string => {
  if (!date) {
    return "";
  }
  return dayjs(date).format("YYYY-MM-DD HH:mm:ss");
};
const showStatusName = (status: number): string => {
  switch (status) {
    case 0:
      return "已申请";
    case 1:
      return "已完成";
    default:
      break;
  }
};
const showDnsRecord = (data: CertRecordModel): void => {
  pageData.currentInfoModel.certRecordId = data.id;
  pageData.currentInfoModel.dnsRecords = data.dnsRecord;
  pageData.currentInfoModel.status = data.status;
  pageData.showDialog = true;
};
const cancelDataScope = () => {
  pageData.currentInfoModel.certRecordId = 0;
  pageData.currentInfoModel.dnsRecords = [];
  pageData.currentInfoModel.status = null;
  pageData.showDialog = false;
  getPage();
};
onBeforeMount(() => {
  if (!getDomainListModel()) {
    warnMessage("打开失败");
    router.go(-1);
  }
});
onMounted(() => {
  getPage();
});
</script>

<style scoped></style>
