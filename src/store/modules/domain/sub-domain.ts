import { defineStore } from "pinia";
import { subDomainAPI } from "/@/api/sub-domain";
import { SubDomainModel, SubDomainQuery } from "/@/api/model/sub-domain";
import { Page, Result } from "/@/api/model/result";

export const subDomainStore = defineStore({
  id: "domainList-store",
  actions: {
    /**
     * 分页查询
     * @param query 查询参数
     * @returns 分页列表
     */
    findPage(query?: SubDomainQuery): Promise<Result<Page<SubDomainModel>>> {
      return subDomainAPI.findPage(query);
    },
    /**
     * 列表查询
     * @param query 查询参数
     * @returns 列表
     */
    find(query?: SubDomainQuery): Promise<Result<SubDomainModel[]>> {
      return subDomainAPI.find(query);
    },
    /**
     * 保存
     * @param model 保存参数
     * @returns 是否成功
     */
    save(model: SubDomainModel): Promise<Result<any>> {
      return subDomainAPI.save(model);
    },
    /**
     * 根据id修改
     * @param model 修改参数
     * @param id  id
     * @returns  是否成功
     */
    update(model: SubDomainModel, id: number): Promise<Result<any>> {
      return subDomainAPI.update(model, id);
    },
    /**
     * 根据id批量删除
     * @param ids id list
     * @returns  是否成功
     */
    deleteByIds(ids: number[]): Promise<Result<any>> {
      return subDomainAPI.deleteByIds(ids);
    }
  }
});
