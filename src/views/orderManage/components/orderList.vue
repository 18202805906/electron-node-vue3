<template>
  <div>
    <h3 style="background: #fff; padding: 5px 0px">公司名称： {{ companyName }}</h3>
    <a-card class="page-control">
      <a-button type="primary" ghost @click="$router.replace('/orderManage')" style="margin-right: 10px">
        <template #icon>
          <ArrowLeftOutlined />
        </template>
        返回订单首页
      </a-button>
      <a-button type="primary" ghost @click="changAdd" style="margin-right: 10px">
        <template #icon>
          <plus-outlined />
        </template>
        新建
      </a-button>

      <a-upload name="file" v-model:fileList="fileList" :multiple="false" :action="action" @change="handleChange" :before-upload="beforeUpload" :show-upload-list="false">
        <a-button type="primary" ghost :loading="loading">
          <template #icon>
            <CloudUploadOutlined />
          </template>
          导入
        </a-button>
      </a-upload>
      <span class="fr text-right">
        <a-input placeholder="请输入型号" style="width: 200px" type="primary" v-model:value="params.machineModel" allow-clear />
        <a-input placeholder="请输入功率" style="width: 200px; margin: 0 10px" type="primary" v-model:value="params.power" allow-clear />
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
    <a-card style="margin-top: 4px">
      <a-table :dataSource="dataList" :columns="columns" size="small" row-key="id" :loading="tableLoading" :pagination="pagination">
        <template #action="{ record }">
          <a-button @click="handleEdit(record)" type="link" size="small">编辑</a-button>
          <a-divider type="vertical" class="divider-primary" />
          <a-button @click="handleDel(record)" type="link" size="small">删除</a-button>
          <a-divider type="vertical" class="divider-primary" />
          <a-button @click="handlePreview(record)" type="link" size="small">详情</a-button>
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
            <a-form-item has-feedback label="商标：" name="trademark">
              <a-input :disabled="disabled" :max="200" v-model:value="form.trademark" placeholder="请输入商标" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item has-feedback label="型号：" name="machineModel">
              <a-input :disabled="disabled" :max="200" v-model:value="form.machineModel" placeholder="请输入型号" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-item has-feedback label="功率：" name="power">
              <a-input :disabled="disabled" :max="200" v-model:value="form.power" placeholder="请输入功率" />
            </a-form-item>
          </a-col>

          <a-col :span="12">
            <a-form-item has-feedback label="机型：" name="model">
              <a-input :disabled="disabled" v-model:value="form.model" placeholder="请输入机型" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-item has-feedback label="数量：" name="nums">
              <a-input-number style="width: 100%" :disabled="disabled" :min="0" :max="1000000" v-model:value="form.nums" placeholder="请输入数量" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item has-feedback label="单价：" name="unitPrice">
              <a-input-number style="width: 100%" :disabled="disabled" :min="0" :max="1000000" v-model:value="form.unitPrice" placeholder="请输入单价" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-item has-feedback label="金额：" name="totalMoney">
              <a-input-number style="width: 100%" :disabled="disabled" :min="0" :max="100000000000" v-model:value="form.totalMoney" placeholder="请输入金额" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item has-feedback label="付款方式：" name="paymentType">
              <a-input :disabled="disabled" v-model:value="form.paymentType" placeholder="请输入付款方式" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-item has-feedback label="下单日期：" name="orderDate">
              <a-date-picker style="width: 100%" :disabled="disabled" v-model:value="form.orderDate" placeholder="请输入下单日期" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item has-feedback label="交货日期：" name="deliveryDate">
              <a-date-picker :disabled="disabled" style="width: 100%" v-model:value="form.deliveryDate" placeholder="请输入交货日期" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-item has-feedback label="面板：" name="panel">
              <a-input :disabled="disabled" :max="200" v-model:value="form.panel" placeholder="请输入面板" />
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
import { reactive, toRefs, ref, createVNode, defineComponent, onMounted, inject } from 'vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { Modal, message } from 'ant-design-vue';
import orderManagge from '@/api/ordrManage';
import { useRoute } from 'vue-router';
import config from '@/config';

const columnsArr = [
  {
    title: '型号',
    dataIndex: 'machineModel',
    ellipsis: true,
    key: 'machineModel'
  },
  {
    title: '商标',
    dataIndex: 'trademark',
    ellipsis: true,
    key: 'trademark'
  },
  {
    title: '功率',
    dataIndex: 'power',
    key: 'power'
  },
  {
    title: '面板',
    dataIndex: 'panel',
    ellipsis: true,
    key: 'panel'
  },
  {
    title: '机型',
    dataIndex: 'model',
    ellipsis: true,
    key: 'model'
  },
  {
    title: '数量',
    dataIndex: 'nums',
    ellipsis: true,
    key: 'nums'
  },
  {
    title: '单价',
    dataIndex: 'unitPrice',
    ellipsis: true,
    key: 'unitPrice'
  },
  {
    title: '金额',
    dataIndex: 'totalMoney',
    ellipsis: true,
    key: 'totalMoney'
  },
  {
    title: '付款方式',
    dataIndex: 'paymentType',
    ellipsis: true,
    key: 'paymentType'
  },
  {
    title: '下单日期',
    dataIndex: 'orderDate',
    ellipsis: true,
    key: 'orderDate'
  },
  {
    title: '交货日期',
    dataIndex: 'deliveryDate',
    ellipsis: true,
    key: 'deliveryDate'
  },
  {
    title: '操作',
    width: '200px',
    align: 'center',
    key: 'action',
    slots: { customRender: 'action' }
  }
];
export default defineComponent({
  name: 'orderManage',
  setup() {
    const route = useRoute();
    let companyName = ref('');
    let upLoadState = reactive({
      action: `${config.apiHost}/order/importExcel`,
      fileList: []
    });
    let loading = ref(false);
    const $pagination = inject('$pagination');
    const rulesObj = {
      // deliveryDate: [{ required: true, trigger: 'bulr', message: '请输入交货日期' }],
      // orderDate: [{ required: true, trigger: 'bulr', message: '请输入下单日期' }],
      machineModel: [{ required: true, trigger: 'change', message: '请输入型号' }],
      power: [{ required: true, trigger: 'change', message: '请输入功率' }],
      panel: [{ required: true, trigger: 'change', message: '请输入面板' }]
    };
    let columns = ref(columnsArr);
    let tableLoading = ref(false);

    let pagination = reactive({
      ...$pagination,
      showTotal: (total) => `共 ${total} 条`,
      onShowSizeChange: (current, pageSize) => {
        params.pageSize = pageSize;
        params.current = current;
        searchMethods.getData();
      },
      onChange: (val) => {
        params.current = val;
        searchMethods.getData(params.current);
      }
    });
    let params = reactive({
      machineModel: '',
      power: '',
      orderId: '',
      current: 1,
      pageSize: 10
    });
    let form = reactive({
      id: '',
      orderId: '',
      trademark: '',
      machineModel: '',
      power: '',
      model: '',
      nums: '',
      unitPrice: '',
      totalMoney: '',
      paymentType: '',
      deliveryDate: undefined,
      panel: '',
      orderDate: undefined,
      remark: ''
    });
    const state = reactive({
      dataList: [],
      title: '新建订单',
      visible: false,
      confirmLoading: false,
      disabled: false,
      ruleFormRef: ref(),
      rules: rulesObj
    });
    const uploadMethods = {
      beforeUpload: (file) => {
        const isJpgOrPng = file.type === 'application/vnd.ms-excel' || file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        if (!isJpgOrPng) {
          message.error('仅支持扩展名： .xls, .xlsx格式的文件导入');
        }
        const isLtM = file.size / 1024 / 1024 < 10;
        if (!isLtM) {
          message.error('文件超过10M！');
        }
        upLoadState.action = `${config.apiHost}/order/importExcel/` + params.orderId;
        return isJpgOrPng && isLtM;
      },
      handleChange: (info) => {
        if (info.file.status === 'uploading') {
          loading.value = true;
          return;
        }
        if (info.file.status === 'done') {
          // Get this url from response in real world.
          upLoadState.fileList = [];
          //刷新表格
          searchMethods.getData();
          message.success(info.file.response.message);
          loading.value = false;
        }
        if (info.file.status === 'error') {
          upLoadState.fileList = [];
          message.error(info.file.response.errMessage);
          loading.value = false;
        }
      }
    };
    // 获取数据
    const searchMethods = {
      // 搜索
      search: () => {
        params.current = 1;
        searchMethods.getData();
      },
      // 重置
      reset: () => {
        params.machineModel = '';
        params.power = '';
      },
      getData: () => {
        tableLoading.value = true;
        orderManagge
          .orderListPage(params)
          .then((res) => {
            if (res.code == 200) {
              pagination.total = res.data.total;
              pagination.current = res.data.current;
              pagination.pageSize = res.data.pageSize;
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
        state.title = '修改';
        state.disabled = false;
        orderManagge.findOrderList(row.id).then((res) => {
          Object.assign(form, { ...res.data });
        });
      },
      // 查看
      handlePreview: (row) => {
        state.visible = true;
        state.title = '详情';
        state.disabled = true;
        //Object.assign(form, { ...row });
        orderManagge.findOrderList(row.id).then((res) => {
          Object.assign(form, { ...res.data });
        });
      },
      // 删除
      handleDel: (row) => {
        Modal.confirm({
          title: '提示',
          content: '您确定要删除该条数据吗？',
          icon: createVNode(ExclamationCircleOutlined),
          okText: '确认',
          cancelText: '取消',
          onOk() {
            orderManagge.deleteOrderList(row.id).then((res) => {
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
          if (form.id && !state.disabled) {
            orderManagge
              .updateOrderList(form)
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
              .addOrderList(form)
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
    onMounted(() => {
      params.orderId = form.orderId = route.params.id;
      companyName.value = route.params.companyName;
      //获取数据
      searchMethods.getData();
    });

    return {
      columns,
      companyName,
      pagination,
      params,
      form,
      tableLoading,
      loading,
      ...toRefs(state),
      ...searchMethods,
      ...tableMethods,
      ...modalMethods,
      ...toRefs(upLoadState),
      ...uploadMethods
    };
  }
});
</script>

<style lang="less" scoped>
/deep/ .ant-upload-list {
  display: none;
}
</style>
