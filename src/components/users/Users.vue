<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>活动管理</el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
      <el-breadcrumb-item>活动详情</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="infoList.query"
            clearable
            @clear="getUserList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>
      <!-- 用户列表表格 -->
      <el-table :data="userList" stripe border>
        <el-table-column
          label="#"
          type="index"
          align="center"
        ></el-table-column>
        <el-table-column
          label="姓名"
          prop="username"
          align="center"
        ></el-table-column>
        <el-table-column
          label="邮箱"
          prop="email"
          align="center"
        ></el-table-column>
        <el-table-column
          label="手机号码"
          prop="mobile"
          align="center"
        ></el-table-column>
        <el-table-column
          label="角色"
          prop="role_name"
          align="center"
        ></el-table-column>
        <el-table-column label="状态" prop="mg_state" align="center">
          <template slot-scope="scope">
            <el-switch
              @change="userStateChange(scope.row)"
              v-model="scope.row.mg_state"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
            ></el-button>
            <el-tooltip
              class="item"
              effect="dark"
              content="设置"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="infoList.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="infoList.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!--  对话框 -->
    <el-dialog title="提示" :visible.sync="addDialogVisible" width="50%">
      <!-- 表单 -->
      <el-form
        :model="addRuleForm"
        :rules="addRules"
        ref="addRuleFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addRuleForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addRuleForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addRuleForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile">
          <el-input v-model="addRuleForm.mobile"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addDialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Users",
  data() {
    // 验证邮箱
    var emailValid = (rule, value, cb) => {
      // 邮箱校验正则
      const emailRgex = /^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/
      // 邮箱是否符合正则
      if (emailRgex.test(value)) {
        return cb()
      }
      cb(new Error("请输入正确的邮箱格式!"))
    }
    // 验证手机号码
    var mobileValid = (rule, value, cb) => {
      // 手机号码校验正则
      const mobileRgex = /^((1[3|4|5|7|8][0-9]{1})+\d{8})$/
      // 手机号码是否符合正则
      if (mobileRgex.test(value)) {
        return cb()
      }
      cb(new Error("请输入正确的手机号码格式!"))
    }
    return {
      infoList: {
        query: "",
        pagesize: 2,
        pagenum: 1,
      },
      userList: [],
      total: 0,
      addDialogVisible: false,
      // 表单数据绑定
      addRuleForm: {
        username: "",
        email: "",
        mobile: "",
        password: "",
      },
      // 表单验证规则
      addRules: {
        username: [
          { required: true, message: "用户名不能为空!", trigger: "blur" },
          { min: 3, max: 10, message: "请输入3-10字符", trigger: "blur" },
        ],
        email: [
          { required: true, message: "邮箱不能为空!", trigger: "blur" },
          { validator: emailValid, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "手机号码不能为空!", trigger: "blur" },
          { validator: mobileValid, trigger: "blur" },
        ],
        password: [
          { required: true, message: "密码不能为空!", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "密码长度为6-15位的数字",
            trigger: "blur",
          },
        ],
      },
    }
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http("users", {
        params: this.infoList,
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.userList = res.data.users
      this.total = res.data.total
      console.log(res.data)
    },
    handleSizeChange(newSize) {
      this.infoList.pagesize = newSize
      this.getUserList()
    },
    handleCurrentChange(newPage) {
      this.infoList.pagenum = newPage
      this.getUserList()
    },
    // 点击switch按钮时动态改变状态
    async userStateChange(userInfo) {
      console.log(userInfo)
      const { data: res } = await this.$http.put(
        `users/${userInfo.id}/state/${userInfo.mg_state}`
      )
      // if(res.meta.status == 200) return this.$message.success(res.meta.msg);
      if (res.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state
        return this.$message.error(res.meta.msg)
      }
      this.$message.success("更新用户状态成功!")
    },
  },
  created() {
    this.getUserList()
  },
}
</script>

<style lang="less" scoped>
.el-table {
  margin-top: 15px;
  font-size: 14px;
}
</style>