import { http } from "/@/utils/http";
import {
  EnclosureHttpRequestConfig,
  RequestMethods
} from "/@/utils/http/types";
import { cookies } from "/@/utils/storage/cookie";
import { ElLoading } from "element-plus";

class BaseRequest {
  /**
   * @description  post 请求
   * @param method 请求类型
   * @param url  请求地址
   * @param params  请求参数
   * @returns Promise
   */
  public post<T>(url: string, params: any): Promise<T> {
    return this.request<T>("post", url, params);
  }
  /**
   * @description  put 请求
   * @param method 请求类型
   * @param url  请求地址
   * @param params  请求参数
   * @returns Promise
   */
  public put<T>(url: string, params: any): Promise<T> {
    return this.request<T>("put", url, params);
  }
  /**
   *
   * @param url 请求地址
   * @param params  请求参数
   * @returns  响应
   */
  public delete<T>(url: string, params: any): Promise<T> {
    return this.request<T>("delete", url, params);
  }
  /**
   * get请求
   * @param url 请求地址
   * @param params  请求参数
   * @returns 响应参数
   */
  public get<T>(url: string, params: any): Promise<T> {
    return this.request<T>("get", url, params);
  }
  /**
   * @description 请求
   * @param method 请求类型
   * @param url  请求地址
   * @param params  请求参数配置
   * @returns  Promise
   */
  public request<T>(
    method: RequestMethods,
    url: string,
    params: any
  ): Promise<T> {
    const instance = ElLoading.service({
      lock: true,
      text: "Loading",
      background: "rgba(0, 0, 0, 0.7)"
    });
    return http
      .request<T>(method, url, params, {
        timeout: 30000,
        beforeRequestCallback: function (request: EnclosureHttpRequestConfig) {
          const token = cookies.get("token");
          if (token) {
            request.headers = {
              ...request.headers,
              Authorization: "Bearer " + token
            };
          }
        }
      })
      .then(value => {
        instance.close();
        return value;
      })
      .catch(error => {
        instance.close();
        return error;
      });
  }
  /**
   * @description 请求
   * @param method 请求类型
   * @param url  请求地址
   * @param params  请求参数配置
   * @returns  Promise
   */
  public requestNoLoading<T>(
    method: RequestMethods,
    url: string,
    params: any
  ): Promise<T> {
    return http.request<T>(method, url, params, {
      timeout: 30000,
      beforeRequestCallback: function (request: EnclosureHttpRequestConfig) {
        const token = cookies.get("token");
        if (token) {
          request.headers = {
            ...request.headers,
            Authorization: "Bearer " + token
          };
        }
      }
    });
  }
}
export default BaseRequest;
