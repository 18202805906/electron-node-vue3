<template>
  <div>
    <a-card class="page-control">
      <a-button type="primary" ghost @click="changAdd">
        <template #icon>
          <plus-outlined />
        </template>
        新建
      </a-button>
      <span class="fr text-right">
        <a-input placeholder="请输入业务员" allow-clear style="width: 200px" type="primary" v-model:value="params.salesman" />
        <a-input placeholder="请输入地区" allow-clear style="width: 200px; margin: 0 10px" type="primary" v-model:value="params.area" />
        <a-input placeholder="请输入公司名称" allow-clear style="width: 200px" type="primary" v-model:value="params.companyName" />
        <a-input placeholder="请输入联系人" allow-clear style="width: 200px; margin: 0 10px" type="primary" v-model:value="params.contactPerson" />
        <a-space style="margin-left: 20px">
          <a-button type="primary" @click="search">
            <template #icon>
              <search-outlined />
            </template>
            搜索
          </a-button>
          <a-button type="primary" ghost @click="reset">
            <template #icon>
              <reload-outlined />
            </template>
            重置
          </a-button>
        </a-space>
      </span>
    </a-card>
    <a-card style="margin-top: 4px; overflow: scroll">
      <a-table :dataSource="dataList" :columns="columns" size="small" row-key="id" :loading="tableLoading" :pagination="pagination">
        <template #action="{ record }">
          <a-button @click="handleEdit(record)" type="link" size="small">编辑</a-button>
          <a-divider type="vertical" class="divider-primary" />
          <a-button @click="handleDel(record)" type="link" size="small">删除</a-button>
          <a-divider type="vertical" class="divider-primary" />
          <a-button @click="handlePreview(record)" type="link" size="small">详情</a-button>
          <a-divider type="vertical" class="divider-primary" />
          <a-button @click="handleRecord(record)" type="link" size="small">订单</a-button>
        </template>
      </a-table>
    </a-card>
    <a-modal
      :title="title"
      :keyboard="false"
      :maskClosable="false"
      v-model:visible="visible"
      :confirm-loading="confirmLoading"
      width="950px"
      @ok="handleOk"
      @cancel="handleCancel"
      :afterClose="() => ruleFormRef.resetFields()"
    >
      <a-form ref="ruleFormRef" :model="form" :rules="rules" :label-col="{ span: 5 }" :wrapper-col="{ span: 18 }">
        <a-row>
          <a-col :span="12">
            <a-form-item has-feedback label="业务员：" name="salesman">
              <a-input :disabled="disabled" :max="200" v-model:value="form.salesman" placeholder="请输入业务员名称" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item has-feedback label="地区：" name="area">
              <a-input :disabled="disabled" :max="20" v-model:value="form.area" placeholder="请输入地区" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-item has-feedback label="收货人：" name="consignee">
              <a-input :disabled="disabled" :max="200" v-model:value="form.consignee" placeholder="请输入收货人" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item has-feedback label="收货人手机：" name="consigneePhone">
              <a-input :disabled="disabled" :max="20" v-model:value="form.consigneePhone" placeholder="请输入收货人手机" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-item has-feedback label="联系人：" name="contactPerson">
              <a-input :disabled="disabled" :max="200" v-model:value="form.contactPerson" placeholder="请输入联系人" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item has-feedback label="联系人手机：" name="concatPhone">
              <a-input :disabled="disabled" v-model:value="form.concatPhone" placeholder="请输入联系人手机" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-item has-feedback label="公司名称：" name="companyName">
              <a-input :disabled="disabled" :max="200" v-model:value="form.companyName" placeholder="请输入公司名称" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item has-feedback label="电话：" name="telephone">
              <a-input :disabled="disabled" :max="200" v-model:value="form.telephone" placeholder="请输入电话" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-item has-feedback label="传真：" name="fox">
              <a-input :disabled="disabled" v-model:value="form.fox" placeholder="请输入传真" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item has-feedback label="发货货场：" name="deliveryAddress">
              <a-input :disabled="disabled" v-model:value="form.deliveryAddress" placeholder="请输入发货货场" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-item has-feedback label="地址：" name="address">
              <a-input :disabled="disabled" v-model:value="form.address" placeholder="请输入地址" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item has-feedback label="备注：" name="remark">
              <a-textarea :disabled="disabled" :auto-size="{ minRows: 3, maxRows: 6 }" v-model:value="form.remark" placeholder="请输入备注" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import { reactive, toRefs, ref, createVNode, defineComponent, inject } from 'vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { Modal, message } from 'ant-design-vue';
import { useRouter } from 'vue-router';
import orderManagge from '@/api/ordrManage';
const columnsArr = [
  {
    title: '地区',
    dataIndex: 'area',
    ellipsis: true,
    key: 'area'
  },
  {
    title: '业务员',
    dataIndex: 'salesman',
    ellipsis: true,
    key: 'salesman'
  },
  {
    title: '公司名称',
    dataIndex: 'companyName',
    ellipsis: true,
    key: 'companyName'
  },
  {
    title: '公司名称',
    dataIndex: 'companyName',
    ellipsis: true,
    key: 'companyName'
  },
  {
    title: '联系人',
    dataIndex: 'contactPerson',
    ellipsis: true,
    key: 'contactPerson'
  },
  {
    title: '联系人手机',
    dataIndex: 'concatPhone',
    ellipsis: true,
    key: 'concatPhone'
  },
  {
    title: '发货场地',
    dataIndex: 'deliveryAddress',
    ellipsis: true,
    key: 'deliveryAddress'
  },
  {
    title: '地址',
    dataIndex: 'address',
    ellipsis: true,
    key: 'address'
  },
  {
    title: '备注',
    dataIndex: 'remark',
    ellipsis: true,
    key: 'remark'
  },
  {
    title: '更新时间',
    dataIndex: 'updateTime',
    ellipsis: true,
    key: 'updateTime'
  },
  {
    title: '操作',
    width: '280px',
    align: 'center',
    key: 'action',
    slots: { customRender: 'action' }
  }
];

export default defineComponent({
  name: 'orderManage',
  setup() {
    let validatePhone = (rule, value) => {
      if (value === '') {
        return Promise.reject('请输入手机号');
      } else if (!/^(?:(?:\+|00)86)?1[3-9]\d{9}$/.test(value)) {
        return Promise.reject('请输入正确的手机号');
      } else {
        return Promise.resolve();
      }
    };
    let validateFox = (rule, value) => {
      if (value != '' && !/^(?:\d{3,4}-)?\d{7,8}(?:-\d{1,6})?$/.test(value)) {
        return Promise.reject('请输入正确的传真号');
      } else {
        return Promise.resolve();
      }
    };
    const router = useRouter();
    const $pagination = inject('$pagination');
    const rulesObj = {
      companyName: [{ required: true, trigger: 'change', message: '请输入公司名称' }],
      salesman: [{ required: true, trigger: 'change', message: '请输入业务员名称' }],
      contactPerson: [{ required: true, trigger: 'change', message: '请输入联系人' }],
      concatPhone: [{ validator: validatePhone, trigger: 'change', required: true }],
      consigneePhone: [{ validator: validatePhone, trigger: 'change', required: true }],
      fox: [{ validator: validateFox, trigger: 'change' }],
      address: [{ required: true, trigger: 'change', message: '请输入地址' }]
    };
    let columns = ref(columnsArr);
    let tableLoading = ref(false);

    let pagination = reactive({
      ...$pagination,
      showTotal: (total) => `共 ${total} 条`,
      showSizeChange: (current, pageSize) => {
        params.pageSize = pageSize;
        params.current = current;
        searchMethods.getData();
      },
      change: (val) => {
        params.current = val;
        searchMethods.getData(params.current);
      }
    });
    let params = reactive({
      companyName: '',
      contactPerson: '',
      salesman: '',
      area: '',
      current: 1,
      pageSize: 10
    });
    let form = reactive({
      id: '',
      companyName: '',
      concatPhone: '',
      contactPerson: '',
      address: '',
      remark: '',
      consigneePhone: '',
      consignee: '',
      telephone: '',
      deliveryAddress: '',
      fox: '',
      salesman: '',
      areaL: ''
    });
    const state = reactive({
      dataList: [],
      title: '新建收货信息',
      visible: false,
      confirmLoading: false,
      disabled: false,
      ruleFormRef: ref(),
      rules: rulesObj
    });
    // 获取数据
    const searchMethods = {
      // 搜索
      search: () => {
        params.current = 1;
        searchMethods.getData();
      },
      // 重置
      reset: () => {
        params.companyName = '';
        params.contactPerson = '';
        params.salesman = '';
        params.area = '';
      },
      //获取数据
      getData: () => {
        tableLoading.value = true;
        orderManagge
          .orderPage(params)
          .then((res) => {
            if (res.code == 200) {
              pagination.total = res.data.total;
              pagination.current = res.data.current;
              pagination.pageSize = res.data.size;
              state.dataList = res.data.records;
            }
            tableLoading.value = false;
          })
          .finally(() => {
            tableLoading.value = false;
          });
      }
    };
    const tableMethods = {
      // 编辑
      handleEdit: (row) => {
        state.visible = true;
        state.title = '修改' + row.companyName;
        state.disabled = false;
        orderManagge.findOrder(row.id).then((res) => {
          Object.assign(form, { ...res.data });
        });
      },
      // 查看
      handlePreview: (row) => {
        state.visible = true;
        state.title = '详情';
        state.disabled = true;
        //Object.assign(form, { ...row });
        orderManagge.findOrder(row.id).then((res) => {
          Object.assign(form, { ...res.data });
        });
      },
      // 查看订单记录
      handleRecord: (row) => {
        router.push({
          path: '/orderList/' + row.id + '/' + row.companyName
        });
      },
      // 删除
      handleDel: (row) => {
        Modal.confirm({
          title: '提示',
          content: '您确定要删除吗？',
          icon: createVNode(ExclamationCircleOutlined),
          okText: '确认',
          cancelText: '取消',
          onOk() {
            orderManagge.deleteOrder(row.id).then((res) => {
              message.success(res.message);
              state.visible = false;
              searchMethods.getData();
            });
          }
        });
      }
    };
    const modalMethods = {
      // 新建
      changAdd: () => {
        state.visible = true;
        state.disabled = false;
      },
      // 确认
      handleOk: () => {
        state.ruleFormRef.validate().then(() => {
          state.confirmLoading = true;
          if (form.id && !state.disabled) {
            orderManagge
              .updateOrder(form)
              .then((res) => {
                message.success(res.message);
                modalMethods.handleCancel();
                searchMethods.getData();
              })
              .finally(() => {
                state.confirmLoading = false;
              });
          } else if (!form.id) {
            orderManagge
              .addOrder(form)
              .then((res) => {
                message.success(res.message);
                modalMethods.handleCancel();
                searchMethods.getData();
              })
              .finally(() => {
                state.confirmLoading = false;
              });
          } else {
            modalMethods.handleCancel();
            state.confirmLoading = false;
          }
        });
      },
      // 取消
      handleCancel: () => {
        state.visible = false;
        setTimeout(() => {
          form.value = {};
        }, 1000);
      }
    };
    searchMethods.getData();
    return {
      columns,
      pagination,
      params,
      form,
      tableLoading,
      ...toRefs(state),
      ...searchMethods,
      ...tableMethods,
      ...modalMethods
    };
  }
});
</script>

<style></style>
