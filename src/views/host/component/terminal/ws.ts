export function WSSHClient() {}
WSSHClient.prototype._generateEndpoint = function (params) {
  let protocol = "";
  if (window.location.protocol == "https:") {
    protocol = "wss://";
  } else {
    protocol = "ws://";
  }
  const endpoint = protocol + "127.0.0.1:8080/api/ws/host/ping" + params;
  return endpoint;
};
WSSHClient.prototype.connect = function (options) {
  const endpoint = this._generateEndpoint(options.params);

  if (window.WebSocket) {
    //如果支持websocket
    this._connection = new WebSocket(endpoint);
  } else {
    //否则报错
    options.onError("WebSocket Not Supported");
    return;
  }

  this._connection.onopen = function () {
    options.onConnect();
  };

  this._connection.onmessage = function (evt) {
    const data = evt.data.toString();
    options.onData(data);
  };

  this._connection.onclose = function (evt) {
    options.onClose(evt);
  };
};
WSSHClient.prototype.send = function (data) {
  this._connection.send(JSON.stringify(data));
};

WSSHClient.prototype.sendInitData = function (options) {
  //连接参数
  this._connection.send(JSON.stringify(options));
};

WSSHClient.prototype.sendClientData = function (data) {
  //发送指令
  this._connection.send(data);
};

WSSHClient.prototype.close = function () {
  //手动关闭
  this._connection.close();
};

export const client = new WSSHClient();
