<template>
  <div>
    <!-- 头部面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>角色权限</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 列表展示卡片视图 -->
    <el-card>
      <!-- 添加角色按钮 -->
      <el-row class="row-add-roles">
        <el-col>
          <el-button type="primary" @click="addRoles">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表表格 -->
      <el-table :data="rolesList" stripe border>
        <el-table-column type="expand" align="center">
          <template slot-scope="scope">
            <!-- 一级权限 -->
            <el-row
              :class="['bdBorder',index === 0 ? 'tdBorder' : '','vcenter']"
              v-for="(item1,index) in scope.row.children"
              :key="item1.id"
            >
              <el-col :span="5">
                <el-tag type="primary" closable
                      @close="deleteRightById(scope.row,item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <!-- 二级权限 -->
                <el-row
                  :class="[indey === 0 ? '' : 'tdBorder','vcenter']"
                  v-for="(item2,indey) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag type="success" closable
                      @close="deleteRightById(scope.row,item2.id)">{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <!-- 三级权限 -->
                    <el-tag 
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      type="danger"
                      closable
                      @close="deleteRightById(scope.row,item3.id)"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column label="#" type="index" align="center"></el-table-column>
        <el-table-column label="角色名称" prop="roleName" align="center"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc" align="center" width="260px"></el-table-column>
        <el-table-column label="操作" align="center" width="300px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              class="el-icon-edit"
              @click="showEditRole(scope.row.id)"
            >编辑</el-button>
            <el-button
              type="danger"
              size="mini"
              class="el-icon-delete"
              @click="deleteRole(scope.row.id)"
            >删除</el-button>
            <el-button 
            type="success" 
            size="mini" 
            @click="setRoleRight(scope.row)"
            class="el-icon-setting"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 点击添加后的对话框显示 -->
    <el-dialog title="添加角色" @close="addDialogClose" :visible.sync="addDialogVisible" width="50%">
      <el-form
        label-width="100px"
        class="demo-ruleForm"
        :model="addRolesForm"
        :rules="addRolesRules"
        ref="addRolesFormRef"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRolesForm.roleName" ref="roleNameRef"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRolesForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 添加时 确定和取消 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 点击修改后的对话框显示 -->
    <el-dialog title="修改角色" @close="editDialogClose" :visible.sync="editDialogVisible" width="50%">
      <el-form
        label-width="100px"
        class="demo-ruleForm"
        :model="editRolesForm"
        :rules="editRolesRules"
        ref="editRolesFormRef"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRolesForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRolesForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 添加时 确定和取消 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRole">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 点击分配角色后的对话框显示 -->
    <el-dialog title="分配角色" @close="setRightDialogClose" :visible.sync="setRightDialogVisible" width="50%">
      <el-tree ref="treeRef" :default-checked-keys="keysList" default-expand-all :data="rightsList" :props="treeProps" show-checkbox node-key="id"></el-tree>
      <!-- 添加时 确定和取消 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRoleRightConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Roles",
  data() {
    return {
      // 显示隐藏对话框
      addDialogVisible: false,
      editDialogVisible: false,
      // 设置权限对话框显示隐藏
      setRightDialogVisible:false,
      // 角色列表数组  
      rolesList: [],
      // 权限列表
      rightsList:[],
      // 树形控件
      treeProps:{
          label:"authName",
          children:"children"
      },
      // 存取树的行内id
      roleIds:'',  
      // 默认选中key
      keysList:[],  
      // 角色表单
      addRolesForm: {
        roleName: "",
        roleDesc: ""
      },
      // 修改的角色表单
      editRolesForm: [],
      // 添加表单角色验证规则
      addRolesRules: {
        roleName: [
          { required: true, message: "角色名称不能为空!", triggle: "blur" }
        ]
      },
      // 修改表单角色验证规则
      editRolesRules: {
        roleName: [
          { required: true, message: "角色名称不能为空!", triggle: "blur" }
        ]
      }
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    async getRolesList() {
      const { data: res } = await this.$http.get("roles")
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.rolesList = res.data
    },
    // 添加角色按钮
    addRoles() {
      this.addDialogVisible = true
    },
    // 添加角色确认按钮
    addRole() {
      this.$refs.addRolesFormRef.validate(async valid => {
        if (!valid) return this.$message.error("验证不通过,请重新输入信息!")
        // 便利数组中对象的roleName属性
        const datalist = this.rolesList.map(item => {
          return item.roleName
        })
        // 判断datalist数组中包不包含输入的值
        if (datalist.indexOf(this.$refs.roleNameRef.value) !== -1) {
          this.$message.warning("请勿重复添加角色名称!")
        } else {
          const { data: res } = await this.$http.post(
            "roles",
            this.addRolesForm
          )
          //   如果状态码不等于201，证明发送请求失败，通过后台返回的错误消息来提示用户
          if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
          // 请求发送成功后,提示用户
          this.$message.success("添加角色成功!")
          //   添加成功后关闭相应对话框
          this.addDialogVisible = false
          //   添加成功后要重新获取列表数据刷新列表
          this.getRolesList()
        }
      })
    },
    // 关闭对话框后重置表单验证
    addDialogClose() {
      this.$refs.addRolesFormRef.resetFields()
    },
    editDialogClose() {
      this.$refs.editRolesFormRef.resetFields()
    },
    // 删除角色
    async deleteRole(id) {
      const confirmResults = await this.$comfirm(
        "您确定要删除此角色?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "denger"
        }
      ).catch(err => err)
      if (confirmResults !== "confirm")
        return this.$message.info("您取消了删除操作!")
      const { data: res } = await this.$http.delete("roles/" + id)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success("删除角色成功!")
      this.getRolesList()
    },
    // 编辑角色
    async showEditRole(id) {
      const { data: res } = await this.$http.get("roles/" + id)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.editDialogVisible = true
      this.editRolesForm = res.data
    },
    // 点击确定时发送请求
    async editRole() {
      const { data: res } = await this.$http.put(
        "roles/" + this.editRolesForm.roleId,
        {
          roleName: this.editRolesForm.roleName,
          roleDesc: this.editRolesForm.roleDesc
        }
      )
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.editDialogVisible = !this.editDialogVisible
      this.getRolesList()
    },
    // 通过ID来删除权限
    async deleteRightById(roleId,rightId){
        const confirmResults = await this.$comfirm("确认删除吗?","提示",{
            confirmButtonText:"确定",
            cancelButtonText:"取消",
            type:"danger"
        }).catch(err => err)
        if(confirmResults !== "confirm") return this.$message.info("取消了删除!")
        const {data:res} =  await this.$http.delete(`roles/${roleId.id}/rights/${rightId}`)
        if(res.meta.status !== 200) return this.$message.error("删除失败!")
        this.$message.success("删除角色权限成功!")
        // bug解决删除后整个页面刷新回初始化界面
        roleId.children = res.data
    },
    /**
     * 角色权限分配区域
     */
    async setRoleRight(role) {
        this.roleIds = role.id;
        const {data:res} = await this.$http.get("rights/tree")
        this.rightsList = res.data
        this.getLeafKeys(role,this.keysList)
        this.setRightDialogVisible = true
    },
    async setRoleRightConfirm() {
        const keys = [
            ...this.$refs.treeRef.getCheckedKeys(),
            ...this.$refs.treeRef.getHalfCheckedKeys()
        ]
        // console.log(keys);
        const strKeys = keys.join(',');
        const {data:res} = await this.$http.post(`roles/${this.roleIds}/rights`,{rids: strKeys})
        if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success("分配角色权限成功!")
        this.getRolesList()
        this.setRightDialogVisible = false
    },
    // 通过递归获取获取角色权限下所有三级权限的id
    getLeafKeys(node,arr) {
        if(!node.children) {
            return arr.push(node.id)
        }
        // 如果没有children属性,就再次调用getLeafKeys函数
        node.children.forEach(item => {
            this.getLeafKeys(item,arr)
        })
    },
    // 关闭分配权限对话框
    setRightDialogClose(){
        this.keysList = []
    }
  }
}
</script>

<style lang="less" scoped>
.row-add-roles {
  margin-bottom: 15px;
}

.el-tag {
  margin: 7px;
}

.bdBorder {
  border-bottom: 1px solid #eee;
}

.tdBorder {
  border-top: 1px solid #eee;
}

.vcenter {
    display: flex;
    align-items: center;
}
</style>