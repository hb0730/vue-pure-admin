import { defineStore } from "pinia";
import { HostAPI } from "/@/api/host";
import { HostModel, HostQuery, HostTestModel } from "/@/api/model/hostModel";
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
    },
    /**
     * 测试连接
     * @param model 连接参数
     * @returns  是否成功
     */
    testConnection(model: HostTestModel): Promise<Result<any>> {
      return HostAPI.testConnection(model);
    },
    /**
     * 新增
     * @param model 新增参数
     * @returns 是否成功
     */
    save(model: HostModel): Promise<Result<any>> {
      return HostAPI.save(model);
    }
  }
});
