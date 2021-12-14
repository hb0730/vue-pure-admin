import { defineStore } from "pinia";
import { DomainJobAPI } from "/@/api/job";
import { DomainJobModel, DomainJobQuery } from "/@/api/model/job";
import { Page, Result } from "/@/api/model/result";

export const domainJobStore = defineStore({
  id: "domain-job-store",
  actions: {
    /**
     * 分页查询
     * @param query 查询参数
     * @returns 分页列表
     */
    findPage(query: DomainJobQuery): Promise<Result<Page<DomainJobModel>>> {
      return DomainJobAPI.findPage(query);
    },
    /**
     *新增
     * @param model 新增参数
     * @returns 是否成功
     */
    save(model: DomainJobModel): Promise<Result<any>> {
      return DomainJobAPI.save(model);
    },
    /**
     * 根据id修改
     * @param model 修改参数
     * @param id id
     * @returns 是否成功
     */
    updateById(model: DomainJobModel, id: number): Promise<Result<any>> {
      return DomainJobAPI.updateById(model, id);
    },
    /**
     * 根据id删除
     * @param ids id 集合
     * @returns  是否成功
     */
    deleteById(ids: number[]): Promise<Result<any>> {
      return DomainJobAPI.deleteById(ids);
    }
  }
});
