import { ElMessage } from "element-plus";

// 消息
const Message = (message: string): any => {
  return ElMessage({
    showClose: false,
    message
  });
};

// 成功
const successMessage = (message: string): any => {
  return ElMessage({
    showClose: false,
    message,
    type: "success"
  });
};

// 警告
const warnMessage = (message: string): any => {
  return ElMessage({
    showClose: false,
    message,
    type: "warning"
  });
};

// 失败
const errorMessage = (message: string): any => {
  return ElMessage({
    showClose: false,
    message,
    type: "error"
  });
};

export { Message, successMessage, warnMessage, errorMessage };
