import axios from 'axios';

import Cookie from 'js-cookie';
import appConfig from '@/config';
import auth from '@/api/auth';
import { logout } from '@/router';
import { getToken } from '@/utils/token';
const env = process.env;
const IS_PRODUCTION = env.NODE_ENV === 'production';
const baseURL = IS_PRODUCTION ? env.VUE_APP_API_HOST : env.VUE_APP_API_ROOT;
import { message } from 'ant-design-vue';
// HTTP状态码
const HTTP_CODE = {
  400: '请求参数错误',
  401: '未授权, 请重新登录',
  403: '服务器拒绝本次访问',
  404: '请求错误,未找到该资源',
  405: '请求方法未允许',
  408: '请求超时',
  409: '请求发生冲突',
  410: '请求的资源已删除',
  413: '请求体过大，服务器无法处理',
  414: '请求url过长',
  415: '不支持的媒体类型',
  429: '请求次数超过限制',
  500: '服务器端内部错误',
  501: '服务器不支持该请求中使用的方法',
  502: '网络错误',
  503: '服务不可用',
  504: '网关超时',
  505: 'HTTP版本不受支持'
};
let reqCache = new Map(); // 请求暂存列表，列表中的请求会被取消
const request = axios.create({
  timeout: 30000,
  baseURL,
  // responseType: 'json',
  withCredentials: true, // 是否允许带cookie
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  }
});
// axios request拦截器
request.interceptors.request.use(
  (config) => {
    // 设置cancelToken对象，阻止重复请求。当上个请求未完成时，相同的请求不会进行
    //  config.cancelToken = new axios.CancelToken((cancel) => _addRequest(reqCache, config, cancel));
    // 处理token
    const token = getToken();
    if (!token) return config;
    config.headers['GatewayAuth'] = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);
request.interceptors.response.use(
  ({ config, data }) => {
    // 跳过拦截器
    if (config.isNotIntercept) {
      return Promise.resolve(data);
    }
    // 相同请求不得在短时间内重复发送
    // removeRequest(config);
    if (data.success) {
      // if (['post', 'delete', 'put'].includes(config?.method as string) && !config.isNotTips) {
      //   data.message && message.success(data.message);
      // }
      return Promise.resolve(data);
    } else {
      if (data.errCode === 'TOKEN_1002' || data.errCode === 'TOKEN_1001') {
        message.destroy();
        message.error('登录失效，请重新登录');
        logout();
      } else {
        const msg = data.errMessage || '请求失败'; // 返回接口返回提示信息
        message.error(msg);
        return Promise.reject(msg);
      }
    }
  },
  (error) => {
    message.destroy();
    if (axios.isCancel(error)) return Promise.reject(error);
    if (error.response) {
      if (error.response.status === 401) {
        // if (error.response.status === 401 || error.response.data.errCode === 'TOKEN_1002' || error.response.data.errCode === 'TOKEN_1001') {
        message.destroy();
        message.error('登录失效，请重新登录');

        logout();
      } else {
        const tips = error.response.data.errMessage || HTTP_CODE[error.response.status];
        tips && message.error(tips);
      }
      return Promise.reject(error);
    } else {
      message.error('请求超时, 请刷新重试');
      return Promise.reject(new Error('请求超时, 请刷新重试'));
    }
  }
);
export default request;

export const get = (url, params = {}, config = {}) => request({ method: 'get', url, params, ...config });
export const post = (url, data = {}, config = {}) => request({ method: 'post', url, data, ...config });
// 如果接口不能使用json，需要使用qs序列化
// export const post = (url, data = {}, config = {}) => request({ method: 'post', url, data: Qs.stringify({ ...data,token:getToken() }, { allowDots: true }), ...config });
export const put = (url, data = {}, config = {}) => request({ method: 'put', url, data, ...config });
export const patch = (url, data = {}, config = {}) => request({ method: 'patch', url, data, ...config });
export const del = (url, data = {}, config = {}) => request({ method: 'delete', url, data, ...config });
/**
 * 刷新token
 * @param {string} refreshToken
 */
function _handleRefreshToken(refreshToken) {
  return new Promise((resolve, reject) => {
    auth
      .refreshToken({ refresh_token: refreshToken })
      .then((res) => {
        Cookie.set(appConfig.tokenKey, res.data.access_token);
        Cookie.set(appConfig.refreshTokenKey, res.data.refresh_token);
        // Cookie.set(appConfig.tokenExpiresKey, Date.now() + res.data.expires_in * 1000 - appConfig.refreshAheadTime);
        resolve();
      })
      .catch(reject);
  });
}
/**
 * 添加请求到暂存列表
 * @param {object} reqList - 请求缓存列表
 * @param {object} config 当前请求配置
 * @param {function} cancel - 请求中断函数
 */
function _addRequest(reqList, config, cancel) {
  const key = _generateKey(config);
  reqList.has(key) ? cancel('请求被取消,config:', config) : reqList.set(key, true);
}
/**
 * 从暂存列表删除请求，即释放拦截
 * @param {object} reqList 全部请求列表
 * @param {object} config 当前请求配置
 * @param {number} time 阻止时间
 */
function _removeRequest(reqList, config, time = 500) {
  const key = _generateKey(config);
  setTimeout(() => reqList.delete(key), time);
}
/**
 * 生成存储的key
 * @param {object} config
 */
function _generateKey({ method, url, params }) {
  const paramsStr = JSON.stringify(params);
  return `${method}-${url}-${paramsStr}`;
}
