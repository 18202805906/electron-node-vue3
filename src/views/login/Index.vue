<template>
  <div class="login-page">
    <login-background></login-background>
    <a-card class="login-form" style="background: none; border: none">
      <img class="logo" src="~@/assets/logo.png" />
      <h3 class="title">{{ appTitle }}</h3>
      <a-form :model="loginInfo" :rules="rules" :wrapperCol="{ span: 24 }" ref="loginFormRef" class="form" @keydown.enter="handleLogin">
        <a-form-item has-feedback name="username">
          <a-input auto-complete="off" placeholder="账号" type="text" v-model:value="loginInfo.username">
            <template #prefix><UserOutlined /></template>
          </a-input>
        </a-form-item>
        <a-form-item has-feedback name="password">
          <a-input auto-complete="off" placeholder="密码" type="password" v-model:value="loginInfo.password">
            <template #prefix>
              <LockOutlined />
            </template>
          </a-input>
        </a-form-item>
        <a-form-item name="code">
          <div class="r-nw-sb-c">
            <a-input style="width: 55%" auto-complete="off" placeholder="验证码" v-model:value="loginInfo.captchaValue"> </a-input>
            <div v-html="codeSrc" v-if="codeSrc" width="35%;" height="32px" @click="changeCode()"></div>
          </div>
        </a-form-item>
        <a-form-item style="width: 100%">
          <a-button class="login" block :loading="loading" @click.prevent="handleLogin" type="primary">登 录</a-button>
        </a-form-item>
      </a-form>
    </a-card>
    <div class="version">
      版本号: <span> V{{ version }}</span>
    </div>
  </div>
</template>

<script>
import { set } from 'js-cookie';
import AuthApi from '@/api/auth';
import { setStorage } from '@/utils/storage';
import LoginBackground from './components/LoginBackground.vue';
import menu from '../../../mock/common/menu.json';
import { defineComponent, onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import config from '../../config/index.js';
import { message } from 'ant-design-vue';
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue';
import { remote } from 'electron';

export default defineComponent({
  components: {
    LoginBackground,
    UserOutlined,
    LockOutlined
  },
  setup() {
    let loginInfo = reactive({
      username: 'admin',
      password: '123456',
      captchaValue: ''
    });
    const rules = {
      username: [{ type: 'string', required: true, trigger: 'blur', message: '请输入用户名' }],
      password: [{ type: 'string', required: true, trigger: 'blur', message: '请输入密码' }],
      captchaValue: [{ type: 'string', required: true, trigger: 'blur', message: '请输入验证码' }]
    };
    let loading = ref(false);
    let codeSrc = ref('');
    const appTitle = config.appTitle;
    const version = config.appVersion;
    const router = useRouter();
    const loginFormRef = ref();
    // 储存菜单及用户信息
    function getMenuList() {
      // 存储返回的菜单
      setStorage('rawMenu', menu);
      router.replace({
        path: '/home'
      });
    }
    // 验证码
    const changeCode = () => {
      AuthApi.captcha().then((res) => {
        codeSrc.value = res.data.captchaImg;
        loginInfo.captchaKey = res.data.captchaKey;
      });
    };
    // 登录
    const handleLogin = () => {
      loginFormRef.value.validate().then(() => {
        loading.value = true;
        let { username, captchaValue, captchaKey, password } = loginInfo;
        AuthApi.login({
          username,
          password,
          captchaValue,
          captchaKey
        })
          .then((res) => {
            message.success('登录成功！');
            set(config.tokenKey, res.data.accessToken);
            setStorage('userinfo', { username: res.data.name });
            loading.value = false;
            getMenuList();
          })
          .catch(() => {
            loading.value = false;
            changeCode();
          });
      });
    };
    onMounted(() => {
      const win = remote.getCurrentWindow();
      win.setSize(350, 500);
      win.center();
    });
    // 获取验证码
    changeCode();
    return {
      codeSrc,
      loginInfo,
      loading,
      appTitle,
      version,
      loginFormRef,
      handleLogin,
      changeCode,
      rules
    };
  }
});
</script>
<style lang="less" scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  position: relative;
}
.login-form {
  width: 360px;
  text-align: center;
  border-radius: 6px;
  margin-top: -5%;
}
.version {
  position: absolute;
  bottom: 10px;
  font-size: 13px;
  z-index: 2;

  // span {
  //   color: @link-color;
  // }
}
.logo {
  width: 60px;
  margin: 18px 0;
}
.title {
  margin-bottom: 20px;
  font-size: 22px;
  color: #777;
}
</style>
