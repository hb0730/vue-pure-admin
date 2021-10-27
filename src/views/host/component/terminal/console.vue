<template>
  <div class="console" id="terminal"></div>
</template>

<script setup lang="ts">
import "xterm/css/xterm.css";
import { onBeforeUnmount, onMounted, toRef } from "vue";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import { client } from "./ws";
import { getUUidV4NoDash } from "/@/utils/uuid";
import { encode } from "/@/utils/crypto/base64";
import { emitter } from "/@/utils/mitt";
const props = defineProps({
  hostId: {
    type: Number,
    required: true
  }
});
enum TypeEnum {
  CMD = "cmd",
  RESIZE = "resize"
}
class Message {
  type: string;
  cmd?: any;
  cols?: number;
  rows?: number;
  constructor(type: string, cmd?: any, cols?: number, rows?: number) {
    this.type = type;
    this.cmd = cmd;
    this.cols = cols;
    this.rows = rows;
  }
}

const hostId = toRef(props, "hostId");

const fit: FitAddon = new FitAddon();
const term: Terminal = new Terminal({
  rendererType: "canvas", //渲染类型
  convertEol: true, //启用时，光标将设置为下一行的开头
  scrollback: 500, //终端中的回滚量
  disableStdin: false, //是否应禁用输入。
  cursorStyle: "underline", //光标样式
  cursorBlink: true, //光标闪烁
  tabStopWidth: 8, //制表宽度
  theme: {
    foreground: "#58a6ff", //字体,LightGreen,Orange,SlateBlue,Magenta Purple Red Violet White Yellow
    background: "#2B2B2B", //背景色
    // foreground: "#7e9192", //字体
    // background: "#002833", //背景色
    cursor: "Orange" //设置光标
  }
});

const connection = options => {
  //在页面上显示连接中...
  term.write("Connecting... \r\n");
  //执行连接操作
  client.connect({
    params:
      "?id=" +
      options.id +
      "&hostId=" +
      hostId.value +
      "&cols=" +
      term.cols +
      "&rows=" +
      term.rows,
    onError: function (error) {
      //连接失败回调
      term.write("Error: " + error + "\r\n");
    },
    onConnect: function () {
      // //连接成功回调
      // client.sendInitData({ id: options.id, hostId: hostId.value });
      reseizeTerminal();
    },
    onClose: function (_) {
      //连接关闭回调
      term.write("\rconnection closed");
    },
    onData: function (data) {
      //收到数据时回调
      term.write(data);
    }
  });
};

const openTerminal = options => {
  term.onData(data => {
    client.send(new Message(TypeEnum.CMD, encode(data), 0, 0));
  });
  term.loadAddon(fit);
  term.open(document.getElementById("terminal"));
  connection(options);
};
const reseizeTerminal = () => {
  fit.fit();
  client.send(new Message(TypeEnum.RESIZE, null, term.cols, term.rows));
};
onMounted(() => {
  openTerminal({ id: getUUidV4NoDash() });
});
window.onresize = () => {
  reseizeTerminal();
};
emitter.on("reConnection", () => {
  client.close();
  connection({ id: getUUidV4NoDash() });
});

onBeforeUnmount(() => {
  client.close();
});
</script>

<style scoped></style>
