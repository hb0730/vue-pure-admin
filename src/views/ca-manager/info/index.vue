<template>
  <el-dialog
    title="证书机器人"
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
        prop="caCode"
        label="证书类型"
        :rules="[{ message: '请选择', required: true, trigger: 'change' }]"
      >
        <el-select
          style="width: 100%"
          v-model="dataInfo.caCode"
          clearable
          placeholder="请选择"
          @change="caTypeChange"
        >
          <el-option
            v-for="item in caTypes"
            :key="item.code"
            :value="item.code"
            :label="item.code"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="申请地址">
        <el-input
          disabled
          v-model="pageData.currentCAType.directoryURL"
        ></el-input>
      </el-form-item>
      <el-form-item
        prop="name"
        label="机器人名称"
        :rules="[{ message: '请输入', required: true, trigger: 'blur' }]"
      >
        <el-input v-model="dataInfo.name"></el-input>
      </el-form-item>
      <el-form-item
        prop="email"
        label="机器人邮箱"
        :rules="[{ message: '请输入', required: true, trigger: 'blur' }]"
      >
        <el-input v-model="dataInfo.email"></el-input>
      </el-form-item>
      <el-form-item
        v-if="dataInfo.caCode == 'zeroSSL'"
        :rules="[
          {
            required: dataInfo.caCode == 'zeroSSL',
            message: '请输入',
            trigger: 'blur'
          }
        ]"
        prop="kid"
        label="kid"
      >
        <el-input v-model="dataInfo.kid"></el-input>
      </el-form-item>
      <el-form-item
        v-if="dataInfo.caCode == 'zeroSSL'"
        prop="hmacKey"
        label="hmacKey"
        :rules="[
          {
            required: dataInfo.caCode == 'zeroSSL',
            message: '请输入',
            trigger: 'blur'
          }
        ]"
      >
        <el-input v-model="dataInfo.hmacKey"></el-input>
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
import {
  getCurrentInstance,
  onMounted,
  PropType,
  reactive,
  toRef,
  unref
} from "vue";
import { CAManagerModel, CAType } from "/@/api/model/ca-manager";
import { Result } from "/@/api/model/result";
import { caManagerStore } from "/@/store/modules/ca-manager";
import { errorMessage, warnMessage } from "/@/utils/message";
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
  modelInfo: Object as PropType<CAManagerModel>,
  caTypes: {
    require: true,
    default: () => [],
    type: Array as PropType<CAType[]>
  }
});
const emit = defineEmits<{
  (e: "cancelDataScope"): void;
}>();
const pageData = reactive({
  currentCAType: {
    code: null,
    directoryURL: null
  }
});
const showDialog = toRef(props, "showDialog");
const dataInfo = toRef(props, "modelInfo");
const isUpdate = toRef(props, "isUpdate");
const caTypes = toRef(props, "caTypes");
const cancelDataScope = () => {
  // @ts-expect-error
  instance.refs.formRef.resetFields();
  emit("cancelDataScope");
};
const caTypeChange = async (data: string) => {
  const result = unref(caTypes);
  const types = result.filter(v => v.code == data);
  if (types.length > 0) {
    pageData.currentCAType = result[0];
  } else {
    pageData.currentCAType = { code: null, directoryURL: null };
  }
};
const submitDataScope = () => {
  // @ts-expect-error
  instance.refs.formRef.validate(async valid => {
    if (valid) {
      const value = unref(dataInfo);
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
const saveOrUpdate = (data: CAManagerModel): Promise<Result<any>> => {
  if (isUpdate.value) {
    return caManagerStore().update(data, data.id);
  } else {
    return caManagerStore().save(data);
  }
};
onMounted(() => {
  caTypeChange(dataInfo.value.caCode);
});
</script>

<style scoped></style>
