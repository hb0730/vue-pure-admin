import { ElMessageBox } from "element-plus";

const warnConfirm = (message: string): any => {
  return ElMessageBox.confirm(message, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  });
};

export { warnConfirm };
