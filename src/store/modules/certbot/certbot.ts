import { defineStore } from "pinia";
import { certBotAPI } from "/@/api/cerbot";
import { CertbotModel, CertbotQuery } from "/@/api/model/certbot";
import { Page, Result } from "/@/api/model/resultModel";

export const certbotStore = defineStore({
  id: "certbot-store",
  actions: {
    /**
     * 分页查询
     * @param query 查询参数
     * @returns 分页列表
     */
    findPage(query: CertbotQuery): Promise<Result<Page<CertbotModel>>> {
      return certBotAPI.findPage(query);
    },
    /**
     * 列表查询
     * @param query 查询参数
     * @returns 列表
     */
    find(query: CertbotQuery): Promise<Result<Array<CertbotModel>>> {
      return certBotAPI.find(query);
    },
    /**
     * 保存
     * @param model 保存信息
     * @returns  是否成功
     */
    save(model: CertbotModel): Promise<Result<any>> {
      return certBotAPI.save(model);
    },
    /**
     * 根据id更新
     * @param model 更新信息
     * @param id id
     * @returns 是否成功
     */
    update(model: CertbotModel, id: number): Promise<Result<any>> {
      return certBotAPI.update(model, id);
    },
    /**
     * 根据id批量删除
     * @param ids id list
     * @returns  是否成功
     */
    deleteByIds(ids: number[]): Promise<Result<any>> {
      return certBotAPI.deleteByIds(ids);
    }
  }
});
