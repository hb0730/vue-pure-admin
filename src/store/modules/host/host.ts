import { defineStore } from "pinia";
import { HostAPI } from "/@/api/host";
import {
  HostFileModel,
  HostModel,
  HostQuery,
  HostTestModel
} from "/@/api/model/hostModel";
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
    },
    /**
     * 修改
     * @param model 修改参数
     * @returns  是否成功
     */
    update(model: HostModel): Promise<Result<any>> {
      return HostAPI.update(model);
    },
    /**
     * 删除
     * @param id id集合
     * @returns 是否成功
     */
    deleteHost(id: number[]): Promise<Result<any>> {
      return HostAPI.deleteHost(id);
    },
    /**
     * server file list
     * @param id id
     * @param hostId host id
     * @returns  文件列表
     */
    fileList(
      id: string,
      hostId: number,
      path?: string
    ): Promise<Result<HostFileModel>> {
      return HostAPI.listFiles(id, hostId, path);
    },
    /**
     * 关闭
     * @param id id
     * @returns  是否成功
     */
    fileClose(id: string): Promise<Result<any>> {
      return HostAPI.fileClose(id);
    }
  }
});
