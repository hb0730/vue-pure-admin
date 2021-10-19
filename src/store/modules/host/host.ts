import { defineStore } from "pinia";
import { HostAPI } from "/@/api/host";
import { HostModel, HostQuery } from "/@/api/model/hostModel";
import { Page, Result } from "/@/api/model/resultModel";

export const hostStore = defineStore({
  id: "host-store",
  actions: {
    /**
     *  分页查询
     * @param params 查询参数
     * @returns  查询结果
     */
    findPage(params: HostQuery): Promise<Result<Page<HostModel>>> {
      return HostAPI.findPage(params);
    }
  }
});
