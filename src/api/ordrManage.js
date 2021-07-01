import { get, post, del } from '../utils/request';
const prefix = '/order';
export default {
  // 分页查询下单信息
  orderPage: (params) => post(`${prefix}/orderPage`, params),
  // 删除下单信息
  deleteOrder: (id) => del(`${prefix}/deleteOrder/${id}`),
  // 新增下单信息
  addOrder: (params) => post(`${prefix}/addOrder`, params),
  // 删除下单信息
  updateOrder: (params) => post(`${prefix}/updateOrder`, params),
  // 查找单条下单信息
  findOrder: (id) => get(`${prefix}/findOrder/${id}`),

  // 分页查询订单列表信息
  orderListPage: (params) => post(`${prefix}/orderListPage`, params),
  // 删除订单列表信息
  deleteOrderList: (id) => del(`${prefix}/deleteOrderList/${id}`),
  // 新增订单列表信息
  addOrderList: (params) => post(`${prefix}/addOrderList`, params),
  // 删除订单列表信息
  updateOrderList: (params) => post(`${prefix}/updateOrderList`, params),
  // 查找单条订单列表信息
  findOrderList: (id) => get(`${prefix}/findOrderList/${id}`)
};
