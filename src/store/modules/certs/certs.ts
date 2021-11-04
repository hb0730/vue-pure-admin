import { defineStore } from "pinia";
import { certAPI } from "/@/api/certs";
import { CertModel, CertQuery } from "/@/api/model/certs";
import { Page, Result } from "/@/api/model/result";

export const certStore = defineStore({
  id: "cert-store",
  actions: {
    /**
     * 分页查询
     * @param query 查询参数
     * @returns 分页列表
     */
    findPage(query?: CertQuery): Promise<Result<Page<CertModel>>> {
      return certAPI.findPage(query);
    },
    /**
     * 保存
     * @param model 保存参数
     * @returns 是否成功
     */
    save(model: CertModel): Promise<Result<any>> {
      return certAPI.save(model);
    },
    /**
     * 根据id修改
     * @param model 修改参数
     * @param id  id
     * @returns  是否成功
     */
    update(model: CertModel, id: number): Promise<Result<any>> {
      return certAPI.update(model, id);
    },
    /**
     * 根据id批量删除
     * @param ids id list
     * @returns  是否成功
     */
    deleteByIds(ids: number[]): Promise<Result<any>> {
      return certAPI.deleteByIds(ids);
    }
  }
});
