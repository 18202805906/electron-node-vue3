import { post } from '../utils/request';
const prefix = '/stats';
export default {
  // 统计热销功放
  countRanking: () => post(`${prefix}/count-ranking`),
  // 统计购买人购买数量
  personRanking: () => post(`${prefix}/person-ranking`)
};
