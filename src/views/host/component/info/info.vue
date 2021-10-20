<template>
  <el-dialog
    title="服务器信息"
    :model-value="showDialog"
    width="500px"
    append-to-body
    center
    :before-close="cancelDataScope"
    :destroy-on-close="true"
  >
    <el-form :model="modelInfo" ref="formRef" center>
      <el-form-item
        :rules="[{ required: true, message: '请输入服务器名称' }]"
        prop="name"
        label="服务器名称"
      >
        <el-input
          clearable
          placeholder="请输入服务器名称"
          v-model="modelInfo.name"
        ></el-input>
      </el-form-item>
      <el-form-item
        :rules="[{ required: true, message: '请输入服务器地址' }]"
        prop="addr"
        label="服务器地址"
      >
        <el-input
          clearable
          placeholder="请输入服务器地址"
          v-model="modelInfo.addr"
        ></el-input>
      </el-form-item>
      <el-form-item
        :rules="[{ required: true, message: '请输入服务器端口' }]"
        prop="port"
        label="服务器端口"
      >
        <el-input-number
          style="width: 100%"
          clearable
          placeholder="请输入服务器端口"
          v-model="modelInfo.port"
          controls-position="right"
        ></el-input-number>
      </el-form-item>
      <el-form-item
        :rules="[{ required: true, message: '请输入服务器账号' }]"
        prop="username"
        label="服务器账号"
      >
        <el-input
          clearable
          placeholder="请输入服务器账号"
          v-model="modelInfo.username"
        ></el-input>
      </el-form-item>
      <el-form-item
        :rules="[{ required: true, message: '请输入服务器密码' }]"
        prop="password"
        label="服务器密码"
      >
        <el-input
          style="width: 69%; margin-right: 10px"
          show-password
          clearable
          placeholder="请输入服务器密码"
          v-model="modelInfo.password"
        >
        </el-input>
        <el-button type="success" @click="testConnection" :loading="isTest"
          >测试连接</el-button
        >
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
import { toRef, PropType, getCurrentInstance, ref } from "vue";
import { HostModel, HostTestModel } from "/@/api/model/hostModel";
import { hostStore } from "/@/store/modules/host/host";
import { successMessage, warnMessage } from "/@/utils/message";
const instance = getCurrentInstance();
const isTest = ref(false);
const emit = defineEmits<{
  (e: "cancelDataScope", env: Object): void;
}>();
const props = defineProps({
  showDialog: {
    type: Boolean,
    required: true
  },
  isUpdate: {
    type: Boolean,
    required: true,
    defaultValue: false
  },
  formData: {
    type: Object as PropType<HostModel>
  }
});
const showDialog = toRef(props, "showDialog");
// const isUpdate = toRef(props, "isUpdate");
const modelInfo = toRef(props, "formData");
const cancelDataScope = () => {
  // @ts-expect-error
  instance.refs.formRef.resetFields();
  emit("cancelDataScope", false);
};
const testConnection = async () => {
  // @ts-expect-error
  instance.refs.formRef.validate(async valid => {
    if (valid) {
      let value: HostTestModel = {
        addr: "",
        port: 22,
        username: "",
        password: ""
      };
      Object.assign(value, modelInfo.value);
      const result = await hostStore().testConnection(value);

      if (result.code === 0) {
        successMessage("连接成功");
      } else {
        warnMessage("连接失败:" + result.msg);
      }
    } else {
      warnMessage("表单校验失败，请检查");
    }
  });
};
const submitDataScope = () => {
  // @ts-expect-error
  instance.refs.formRef.validate(async valid => {
    if (valid) {
      let model: HostModel = {
        id: 0,
        name: "",
        addr: "",
        username: "",
        port: 22,
        password: "",
        userId: 0
      };
      Object.assign(model, modelInfo.value);
      const result = await hostStore().save(model);
      if (result.code === 0) {
        cancelDataScope();
      } else {
        warnMessage("新增失败:" + result.msg);
      }
    } else {
      warnMessage("表单校验失败，请检查");
    }
  });
};
</script>
