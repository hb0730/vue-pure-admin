<template>
  <el-dialog
    title="申请域名"
    :model-value="showDialog"
    width="500px"
    append-to-body
    center
    :before-close="cancelDataScope"
    :destroy-on-close="true"
  >
    <el-form
      label-position="right"
      label-width="auto"
      :model="dataInfo"
      ref="formRef"
      center
    >
      <el-form-item
        prop="domainId"
        label="顶级域名"
        :rules="[{ message: '请选择', required: true, trigger: 'change' }]"
      >
        <el-select
          style="width: 100%"
          v-model="dataInfo.domainId"
          placeholder="Select"
        >
          <el-option
            v-for="item in domainSelect"
            :key="item.id"
            :label="item.domain"
            :value="item.id"
            ><span style="float: left">{{ item.domain }}</span>
            <span
              style="
                float: right;
                color: var(--el-text-color-secondary);
                font-size: 13px;
              "
              >{{ getCAMangerInfo(item.id).name }}</span
            ></el-option
          >
        </el-select>
      </el-form-item>
      <el-form-item
        prop="domainList"
        label="子域名"
        :rules="[{ message: '请填写', required: true, trigger: 'blur' }]"
      >
        <el-input
          type="textarea"
          v-model="dataInfo.domainList"
          :rows="2"
          placeholder="多个请以英文逗号','隔开"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="submitDataScope">确 定</el-button>
        <el-button @click="cancelDataScope">取 消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { getCurrentInstance, onMounted, PropType, toRaw, toRef } from "vue";
import { SubDomainModel } from "/@/api/model/sub-domain";
import { DomainModel } from "/@/api/model/domain";
import { Result } from "/@/api/model/result";
import { subDomainStore } from "/@/store/modules/domain/sub-domain";
import { errorMessage, warnMessage } from "/@/utils/message";
import { CAManagerModel } from "/@/api/model/ca-manager";
const instance = getCurrentInstance();
const props = defineProps({
  showDialog: {
    require: true,
    default: false,
    type: Boolean
  },
  isUpdate: {
    require: true,
    default: false,
    type: Boolean
  },
  modelInfo: Object as PropType<SubDomainModel>,
  domainSelect: Array as PropType<Array<DomainModel>>,
  caManager: Array as PropType<CAManagerModel[]>
});
const emit = defineEmits<{
  (e: "cancelDataScope"): void;
}>();
const showDialog = toRef(props, "showDialog");
const dataInfo = toRef(props, "modelInfo");
const isUpdate = toRef(props, "isUpdate");
const camanager = toRef(props, "caManager");
const domainSelect = toRef(props, "domainSelect");
const cancelDataScope = () => {
  // @ts-expect-error
  instance.refs.formRef.resetFields();
  emit("cancelDataScope");
};
const submitDataScope = () => {
  // @ts-expect-error
  instance.refs.formRef.validate(async valid => {
    if (valid) {
      const value = toRaw(dataInfo.value);
      const result = await saveOrUpdate(value);
      if (result.code === 0) {
        cancelDataScope();
      } else {
        errorMessage(
          (isUpdate.value === true ? "修改" : "新增") + "失败:" + result.msg
        );
      }
    } else {
      warnMessage("表单校验失败，请检查");
    }
  });
};
const getCAMangerInfo = (domainId: number): any => {
  if (!camanager.value || !camanager.value.length) {
    return { name: "" };
  }
  const result: DomainModel = getDomainInfo(domainId);
  if (result.caManagerId) {
    const model = camanager.value.filter(
      (v: CAManagerModel) => v.id === result.caManagerId
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
const getDomainInfo = (id: number): any => {
  if (!id || !domainSelect.value || !domainSelect.value.length) {
    return { domain: "" };
  }
  const model = domainSelect.value.filter((v: DomainModel) => v.id === id);
  if (model.length > 0) {
    return model[0];
  } else {
    return { domain: "" };
  }
};
const saveOrUpdate = (data: SubDomainModel): Promise<Result<any>> => {
  if (isUpdate.value) {
    return subDomainStore().update(data, data.id);
  } else {
    return subDomainStore().save(data);
  }
};
onMounted(() => {});
</script>

<style scoped></style>
