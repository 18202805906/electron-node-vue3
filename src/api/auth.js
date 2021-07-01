import { get, post } from '../utils/request';
export default {
  // 登录
  login: (params) => post('/login', params),
  // 验证码
  captcha: () => get('/login/captcha')
};
