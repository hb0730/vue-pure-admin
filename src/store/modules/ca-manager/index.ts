import { defineStore } from "pinia";
import { caManagerAPI } from "../../../api/ca-manager";
import { CAManagerModel, CAManagerQuery } from "../../../api/model/ca-manager";
import { Page, Result } from "/@/api/model/result";

export const caManagerStore = defineStore({
  id: "ca-manager-store",
  actions: {
    /**
     * 分页查询
     * @param query 查询参数
     * @returns 分页列表
     */
    findPage(query: CAManagerQuery): Promise<Result<Page<CAManagerModel>>> {
      return caManagerAPI.findPage(query);
    },
    /**
     * 列表查询
     * @param query 查询参数
     * @returns 列表
     */
    find(query: CAManagerQuery): Promise<Result<Array<CAManagerModel>>> {
      return caManagerAPI.find(query);
    },
    /**
     * 保存
     * @param model 保存信息
     * @returns  是否成功
     */
    save(model: CAManagerModel): Promise<Result<any>> {
      return caManagerAPI.save(model);
    },
    /**
     * 根据id更新
     * @param model 更新信息
     * @param id id
     * @returns 是否成功
     */
    update(model: CAManagerModel, id: number): Promise<Result<any>> {
      return caManagerAPI.update(model, id);
    },
    /**
     * 根据id批量删除
     * @param ids id list
     * @returns  是否成功
     */
    deleteByIds(ids: number[]): Promise<Result<any>> {
      return caManagerAPI.deleteByIds(ids);
    }
  }
});
