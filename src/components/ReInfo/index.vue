<script setup lang="ts">
import { ref, PropType, getCurrentInstance, watch, nextTick, toRef } from "vue";
import { useRoute } from "vue-router";

export interface ContextProps {
  userName: string;
  passWord: string;
  verify: number | null;
  svg: any;
  telephone?: number;
  dynamicText?: string;
}

const props = defineProps({
  ruleForm: {
    type: Object as PropType<ContextProps>
  }
});

const emit = defineEmits<{
  (e: "onBehavior", evt: Object): void;
  (e: "refreshVerify"): void;
}>();

const instance = getCurrentInstance();

const model = toRef(props, "ruleForm");
let tips = ref<string>("注册");
let tipsFalse = ref<string>("登录");

const route = useRoute();
watch(
  route,
  async ({ path }): Promise<void> => {
    await nextTick();
    path.includes("register")
      ? (tips.value = "登录") && (tipsFalse.value = "注册")
      : (tips.value = "注册") && (tipsFalse.value = "登录");
  },
  { immediate: true }
);

const rules = ref<any>({
  userName: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  passWord: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 6, message: "密码长度必须不小于6位", trigger: "blur" }
  ],
  verify: [
    { required: true, message: "请输入验证码", trigger: "blur" },
    { type: "number", message: "验证码必须是数字类型", trigger: "blur" }
  ]
});

// 点击登录或注册
const onBehavior = (evt: Object): void => {
  // @ts-expect-error
  instance.refs.ruleForm.validate((valid: boolean) => {
    if (valid) {
      emit("onBehavior", evt);
    } else {
      return false;
    }
  });
};
// 表单重置
const resetForm = (): void => {
  // @ts-expect-error
  instance.refs.ruleForm.resetFields();
};
</script>

<template>
  <div class="info">
    <el-form :model="model" :rules="rules" ref="ruleForm" class="rule-form">
      <el-form-item prop="userName">
        <el-input
          clearable
          v-model="model.userName"
          placeholder="请输入用户名"
          prefix-icon="el-icon-user"
        ></el-input>
      </el-form-item>
      <el-form-item prop="passWord">
        <el-input
          clearable
          type="password"
          show-password
          v-model="model.passWord"
          placeholder="请输入密码"
          prefix-icon="el-icon-lock"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click.prevent="onBehavior">{{
          tipsFalse
        }}</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style lang="scss" scoped>
.info {
  width: 30vw;
  height: 48vh;
  background: url("../../assets/login.png") no-repeat center;
  background-size: cover;
  position: absolute;
  border-radius: 20px;
  right: 100px;
  top: 30vh;
  display: flex;
  justify-content: center;
  align-items: center;
  @media screen and (max-width: 750px) {
    width: 88vw;
    right: 25px;
    top: 22vh;
  }

  .rule-form {
    width: 80%;

    .verify {
      position: absolute;
      margin: -10px 0 0 -120px;

      &:hover {
        cursor: pointer;
      }
    }

    .tips {
      color: #409eff;
      float: right;

      &:hover {
        cursor: pointer;
      }
    }
  }

  .secret {
    color: #409eff;

    &:hover {
      cursor: pointer;
    }
  }
}
</style>
