import { defineStore } from "pinia";
import { dnsAPI } from "/@/api/dns";
import { DNSModel, DNSProvider } from "/@/api/model/dnsModel";
import { Result } from "/@/api/model/resultModel";

export const dnsStore = defineStore({
  id: "dns-store",
  actions: {
    /**
     * 获取提供商列表
     * @returns 提供商列表
     */
    getProviders(): Promise<Result<DNSProvider[]>> {
      return dnsAPI.getProviders();
    },
    /**
     *  保存
     * @param model 参数
     * @returns 是否成功
     */
    save(model: DNSModel): Promise<Result<any>> {
      return dnsAPI.save(model);
    },
    /**
     * 根据id修改
     * @param model 需要修改的参数
     * @param id  id
     * @returns  是否成功
     */
    update(model: DNSModel, id: number): Promise<Result<any>> {
      return dnsAPI.updateById(model, id);
    }
  }
});
