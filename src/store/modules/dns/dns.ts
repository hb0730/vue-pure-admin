import { defineStore } from "pinia";
import { dnsAPI } from "/@/api/dns";
import { DNSModel, DNSProvider, DNSQuery } from "/@/api/model/dnsModel";
import { Page, Result } from "/@/api/model/resultModel";

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
    },
    /**
     * 查询列表
     * @param query 查询参数
     * @returns  列表
     */
    find(query?: DNSQuery): Promise<Result<Array<DNSModel>>> {
      return dnsAPI.find(query);
    },
    /**
     * 分页查询
     * @param query 查询参数
     * @returns  分页列表
     */
    findPage(query: DNSQuery): Promise<Result<Page<DNSModel>>> {
      return dnsAPI.findPage(query);
    },
    /**
     * 删除
     * @param ids id array
     * @returns 是否成功
     */
    deleteDNS(ids: number[]): Promise<Result<any>> {
      return dnsAPI.deleteDNS(ids);
    }
  }
});
