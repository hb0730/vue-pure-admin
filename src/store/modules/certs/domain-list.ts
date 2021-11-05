import { defineStore } from "pinia";
import { domainListAPI } from "/@/api/domain-list";
import { DomainListModel, DomainListQuery } from "/@/api/model/domain-list";
import { Page, Result } from "/@/api/model/result";

export const domainListStore = defineStore({
  id: "domainList-store",
  actions: {
    /**
     * 分页查询
     * @param query 查询参数
     * @returns 分页列表
     */
    findPage(query?: DomainListQuery): Promise<Result<Page<DomainListModel>>> {
      return domainListAPI.findPage(query);
    },
    /**
     * 保存
     * @param model 保存参数
     * @returns 是否成功
     */
    save(model: DomainListModel): Promise<Result<any>> {
      return domainListAPI.save(model);
    },
    /**
     * 根据id修改
     * @param model 修改参数
     * @param id  id
     * @returns  是否成功
     */
    update(model: DomainListModel, id: number): Promise<Result<any>> {
      return domainListAPI.update(model, id);
    },
    /**
     * 根据id批量删除
     * @param ids id list
     * @returns  是否成功
     */
    deleteByIds(ids: number[]): Promise<Result<any>> {
      return domainListAPI.deleteByIds(ids);
    }
  }
});
