<template>
  <div class="login-container">
    <div class="login-box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="" />
      </div>
      <!-- 登陆区域 -->
      <el-form
        label-width="0"
        class="login-form"
        :model="loginForm"
        :rules="loginFormRules"
        ref="loginFormRef"
      >
        <!-- 用户账号 -->
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            prefix-icon="iconfont icon-user"
          />
        </el-form-item>
        <!-- 用户密码 -->
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            prefix-icon="iconfont icon-3702mima"
          />
        </el-form-item>
        <!-- 登陆/重置按钮 -->
        <el-form-item class="login-form-btns">
          <el-button type="primary" @click="login">登陆</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import "../assets/fonts/iconfont.css";
export default {
  name: "Login",
  data() {
    return {
      loginForm: {
        username: "admin",
        password: "123456",
      },
      loginFormRules: {
        username: [{required:true,message:'请输入用户名',trigger:'blur'},{min:3,max:10,message:'请输入长度为3-10的字符',trigger:'blur'}],
        password: [{required:true,message:'请输入密码',trigger:'blur'},{min:6,max:15,message:'请输入长度为6-15的字符',trigger:'blur'}],
      },
    };
  },
  methods:{
      resetLoginForm(){
          this.$refs.loginFormRef.resetFields();
      },
      login(){
          this.$refs.loginFormRef.validate(async valite => {
              if(!valite) return; 
              const { data:res } = await this.$http.post('login',this.loginForm);
              if(res.meta.status !== 200) return this.$message.error('登录失败!');
              this.$message.success('登录成功!');
              //   将登陆成功后的token，保存到客户端中
              window.sessionStorage.setItem('token',res.data.token);
              this.$router.push('/home');
          })
      }
  }
};
</script>

<style lang="less" scoped>
.login-container {
  background-color: #2b4b6b;
  height: 100%;
}

.login-box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  .avatar_box {
    width: 130px;
    height: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
  .login-form {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 40px;
    box-sizing: border-box;
    .login-form-btns {
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>