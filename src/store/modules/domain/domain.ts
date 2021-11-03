import { defineStore } from "pinia";
import { domainAPI } from "/@/api/domain";
import { DomainModel, DomainQuery } from "/@/api/model/domain";
import { Page, Result } from "/@/api/model/result";

export const domainStore = defineStore({
  id: "domain-store",
  actions: {
    /**
     * 保存
     * @param model 参数
     * @returns 是否成功
     */
    save(model: DomainModel): Promise<Result<any>> {
      return domainAPI.save(model);
    },
    /**
     * 根据id修改
     * @param model 参数
     * @param id  id
     * @returns  是否成功
     */
    update(model: DomainModel, id: number): Promise<Result<any>> {
      return domainAPI.update(model, id);
    },
    /**
     * 分页查询
     * @param query 查询参数
     * @returns 分页列表
     */
    findPage(query: DomainQuery): Promise<Result<Page<DomainModel>>> {
      return domainAPI.findPage(query);
    },
    /**
     * 删除
     * @param ids id list
     * @returns  是否成功
     */
    deleteDomain(ids: number[]): Promise<Result<any>> {
      return domainAPI.deleteDomain(ids);
    }
  }
});
