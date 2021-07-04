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
          <el-input placeholder="请输入内容" v-model="infoList.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表表格 -->
      <el-table :data="userList" stripe border>
        <el-table-column label="#" type="index" align="center"></el-table-column>
        <el-table-column label="姓名" prop="username" align="center"></el-table-column>
        <el-table-column label="邮箱" prop="email" align="center"></el-table-column>
        <el-table-column label="手机号码" prop="mobile" align="center"></el-table-column>
        <el-table-column label="角色" prop="role_name" align="center"></el-table-column>
        <el-table-column label="状态" prop="mg_state" align="center">
          <template slot-scope="scope">
            <el-switch @change="userStateChange(scope.row)" v-model="scope.row.mg_state"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              @click="showEditDialog(scope.row.id)"
              size="mini"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              @click="deleteUser(scope.row.id)"
              size="mini"
            ></el-button>
            <el-tooltip class="item" effect="dark" content="设置" placement="top" :enterable="false">
              <el-button type="warning" @click="setUserRightBtn(scope.row)" icon="el-icon-setting" size="mini"></el-button>
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
      ></el-pagination>
    </el-card>
    <!--  添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" @close="addDialogClose" width="50%">
      <!-- 表单 -->
      <el-form
        :model="addForm"
        :rules="addRules"
        ref="addFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!--  修改用户对话框 -->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" @close="editDialogClose" width="50%">
      <!-- 表单 -->
      <el-form
        :model="editForm"
        :rules="editRules"
        ref="editFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
    <!--  分配用户权限对话框 -->
    <el-dialog 
    title="分配用户权限" 
    :visible.sync="setUserDialogVisible" 
    @close="setUserDialogClose" 
    width="50%">
      <el-row>
        <el-col>
          <p>当前的用户:{{userInfo.username}}</p>
          <p>当前的角色:{{userInfo.role_name}}</p>
          <p>分配所有角色:
            <el-select v-model="selectData" placeholder="请选择">
              <el-option 
              v-for="item in rolesUserList"
              :key="item.id"
              :value="item.id"
              :label="item.roleName">
              </el-option>
            </el-select>
          </p>
        </el-col>
      </el-row>
      
      <span slot="footer" class="dialog-footer">
        <el-button @click="setUserDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setUser">确 定</el-button>
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
        pagenum: 1
      },
      userList: [],
      // 用户角色列表
      rolesUserList: [],
      // 分配所有用户列表绑定数组
      selectData: "",
      total: 0,
      addDialogVisible: false,
      editDialogVisible: false,
      // 设置用户权限对话框显隐藏
      setUserDialogVisible:false,
      // 用户权限数组
      userInfo:[],
      // 表单数据绑定
      addForm: {
        username: "",
        email: "",
        mobile: "",
        password: ""
      },
      // 存放修改时的表单对象(请求时)
      editForm: {},
      // 添加时的表单验证规则
      addRules: {
        username: [
          { required: true, message: "用户名不能为空!", trigger: "blur" },
          { min: 3, max: 10, message: "请输入3-10字符", trigger: "blur" }
        ],
        email: [
          { required: true, message: "邮箱不能为空!", trigger: "blur" },
          { validator: emailValid, trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "手机号码不能为空!", trigger: "blur" },
          { validator: mobileValid, trigger: "blur" }
        ],
        password: [
          { required: true, message: "密码不能为空!", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "密码长度为6-15位的数字",
            trigger: "blur"
          }
        ]
      },
      // 修改时的表单验证规则
      editRules: {
        email: [
          { required: true, message: "邮箱不能为空!", trigger: "blur" },
          { validator: emailValid, trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "手机号码不能为空!", trigger: "blur" },
          { validator: mobileValid, trigger: "blur" }
        ]
      }
    }
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http("users", {
        params: this.infoList
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.userList = res.data.users
      this.total = res.data.total
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
    // 添加用户--关闭对话框时重置表单验证
    addDialogClose() {
      this.$refs.addFormRef.resetFields()
    },
    // 修改用户--关闭对话框时重置表单验证
    editDialogClose() {
      this.$refs.editFormRef.resetFields()
    },
    // 修改对话框
    async showEditDialog(id) {
      this.editDialogVisible = true
      const { data: res } = await this.$http.get("users/" + id)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.editForm = res.data
    },
    // 添加时确认按钮
    addUser() {
      this.$refs.addFormRef.validate(async val => {
        if (!val) return this.$message.error("添加用户失败!")
        const { data: res } = await this.$http.post("users", this.addForm)
        if (res.meta.status !== 201) return this.$message.error("添加用户失败!")
        // this.$message.success(res.meta.msg);
        this.$message.success("添加用户成功!")
        this.addDialogVisible = false
        this.getUserList()
      })
    },
    // 修改时确认按钮
    editUser() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return this.$message.error("修改操作失败!请输入正确的格式:")
        const { data: res } = await this.$http.put(
          "users/" + this.editForm.id,
          {
            mobile: this.editForm.mobile,
            email: this.editForm.email
          }
        )
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.editDialogVisible = !this.editDialogVisible
        // 关闭修改对话框后重新调用获取列表接口
        this.getUserList()
      })
    },
    // 删除按钮
    async deleteUser(id) {
       const confirmResults = await this.$comfirm("此操作将删除该用户!", "提示!", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).catch(err => err)
      if(confirmResults !== 'confirm') return this.$message({type:'info',message:'已取消删除!'})
      // 用户点击确认后 删除接口调用
      const {data:res} = await this.$http.delete('users/' + id)
      if(res.meta.status !== 200) return this.$message.error(res.meta,msg)
      this.$message.success(res.meta.msg)
      this.getUserList()
    },
    // 触发设置按钮
    async setUserRightBtn(userInfo) {
      this.userInfo = userInfo
      const {data:res} = await this.$http.get("roles")
      this.rolesUserList = res.data
      console.log(this.rolesUserList);
      
      this.setUserDialogVisible = true
    },
    // 分配用户角色对话框确定按钮
    async setUser() {
      if(!this.rolesUserList) {
        return this.$message.error("请选择要分配的角色")
      }
      const {data:res} = await this.$http.put(`users/${this.userInfo.id}/role`,{
        rid: this.rolesUserList
      })
      if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success("分配角色成功!")
      this.setUserDialogVisible = false
    },
    // 关闭分配用户角色对话框触发事件
    setUserDialogClose() {
      this.rolesUserList = "",
      this.userInfo = {}
    }
  },
  created() {
    this.getUserList()
  }
}
</script>

<style lang="less" scoped>
.el-table {
  margin-top: 15px;
  font-size: 14px;
}
</style>