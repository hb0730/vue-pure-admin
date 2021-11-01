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
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive } from "vue";
import { dnsStore } from "/@/store/modules/dns/dns";

const pageData = reactive({
  searchModel: {
    domain: "",
    dnsId: null
  },
  dnsList: []
});
const dnsList = async () => {
  const result = await dnsStore().find(null);
  if (result.code == 0) {
    pageData.dnsList = result.data;
  }
};

onMounted(() => {
  dnsList();
});
</script>

<style scoped></style>
