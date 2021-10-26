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
const props = defineProps({
  hostId: {
    type: Number,
    required: true
  }
});

const hostId = toRef(props, "hostId");

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

const openTerminal = options => {
  term.onData(data => {
    client.sendClientData(data);
  });
  let fit = new FitAddon();
  term.loadAddon(fit);
  term.open(document.getElementById("terminal"));
  fit.fit();
  onTerminalResize();
  client._;
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

onMounted(() => {
  openTerminal({ id: getUUidV4NoDash() });
});
const onTerminalResize = () => {
  const rows: number = document.querySelector(".console").scrollHeight / 16 - 5;
  const cols: number = document.querySelector(".console").scrollWidth / 9;
  term.resize(parseInt(cols), parseInt(rows));
};
onBeforeUnmount(() => {
  client.close();
});
</script>

<style scoped></style>
