<template>
  <div>
    <el-breadcrumb>
      <el-breadcrumb-item :to="{path: '/home'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- card视图区 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button @click="addGoodsBtn" type="primary">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- table表格 -->
      <table-tree
        class="el-table-top"
        :selection-type="false"
        :data="cateList"
        :columns="columns"
        border
      >
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">
          <i
            style="color:lightgreen"
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
          ></i>
          <i style="color:red" class="el-icon-error" v-else-if="scope.row.cat_deleted === true"></i>
        </template>
        <!-- 分类等级 -->
        <template slot="levels" slot-scope="scope">
          <el-tag type="primary" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag type="danger" v-else-if="scope.row.cat_level === 2">三级</el-tag>
        </template>
        <!-- 操作列 -->
        <template slot-scope="scope" slot="control">
          <el-button size="mini" type="primary" class="el-icon-edit">编辑</el-button>
          <el-button size="mini" type="danger" class="el-icon-delete">删除</el-button>
        </template>
      </table-tree>
      <!-- 分页功能 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="infoList.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="infoList.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 弹窗 -->
    <el-dialog @close="addCateDialogClose" title="添加商品" width="50%" :visible.sync="addCateDialogVisible">
      <el-form ref="addCateRef" :rules="addCateRules" label-width="100px" :model="addCateForm">
        <el-form-item prop="cat_name" label="分类名称" align="center">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="分类等级" align="center">
          <!-- 联动选择框 -->
          <el-cascader
            v-model="selectKeys"
            :options="parentCateList"
            expandTrigger="hover"
            :props="cascaderProps"
            clearable
            change-on-select
            @change="handleChange"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Cate",
  data() {
    return {
      infoList: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 添加商品对话框表单
      // 要求传的参数
      addCateForm: {
        cat_name: "",
        cat_level: 0,
        cat_pid: 0
      },
      // 监听选择项变化数组
      selectKeys: [],  
      // 定义父级分类列表数组
      parentCateList: [],
      // 级联选择框
      cascaderProps:{
          value:"cat_id",
          label:"cat_name",
          children:"children",
      },  
      // 添加商品对话框校验规则
      addCateRules: {
        cat_name: [
          { required: true, message: "分类名称不能为空!", triggle: "blur" }
        ]
      },
      // 是否显示添加商品对话框
      addCateDialogVisible: false,
      // 总数据条数
      total: 0,
      cateList: [],
      columns: [
        { label: "分类名称", prop: "cat_name" },
        { label: "是否有效", type: "template", template: "isok" },
        { label: "分类等级", type: "template", template: "levels" },
        { label: "操作", type: "template", template: "control" }
      ]
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: this.infoList
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.cateList = res.data.result
      // 为总数据条数保存
      this.total = res.data.total
    },
    // 分页函数处理
    handleSizeChange(newSize) {
      this.infoList.pagesize = newSize
      this.getCateList()
    },
    handleCurrentChange(newPagenum) {
      this.infoList.pagenum = newPagenum
      this.getCateList()
    },
    // 添加商品按钮
    addGoodsBtn() {
      // 点击添加商品按钮后调用接口请求数据
      this.getParentCateList()
      this.addCateDialogVisible = true
    },
    // 获取父级分类的列表数据
    async getParentCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: {
          type: 2
        }
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.parentCateList = res.data
    },
    // 级联选择框触发事件
    handleChange() {
        // console.log(this.selectKeys);
        if(this.selectKeys.length > 0) {
            this.addCateForm.cat_pid = this.selectKeys[this.selectKeys.length-1]
            this.addCateForm.cat_level = this.selectKeys.length
            return
        }else{
            this.addCateForm.cat_pid = 0
            this.addCateForm.cat_level = 0
        }
    },
    // 点击确定按钮触发事件
    addCate() {
        this.$refs.addCateRef.validate(async valid => {
            if(!valid) return this.$message.error("表单验证失败!")
            const {data:res} = await this.$http.post("categories",this.addCateForm)
            if(res.meta.status !== 201) return this.$message.error(res.meta.error)
            this.$message.success("添加表单成功!")
            this.getCateList()
            this.addCateDialogVisible = false
        })
    },
    // 关闭对话框后处理表单
    addCateDialogClose() {
        this.$refs.addCateRef.resetFields()
        this.selectKeys = []
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
    }
  }
}
</script>

<style lang="less" scoped>
.el-table-top {
  margin-top: 15px;
}

.el-cascader {
    width: 100%;
}
</style>