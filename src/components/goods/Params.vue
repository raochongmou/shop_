<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 注意提示 -->
      <el-alert title="注意:只允许为第三级分类设置相关参数!" type="warning" :closable="false"></el-alert>

      <el-row class="cat-sel">
        <el-col>
          <span>选择商品分类:</span>
          <!-- 级联选择框 -->
          <el-cascader
            v-model="selectCateKeys"
            :options="cateList"
            expandTrigger="hover"
            :props="cateProps"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- 选项卡 -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="many">
            <el-button type="primary" :disabled="isBtnDisabled">用户管理</el-button>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
            <el-button type="primary" :disabled="isBtnDisabled">配置管理</el-button>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Params",
  data() {
    return {
      cateList: [],
      //级联选择框数据绑定keys
      selectCateKeys: [],
      //级联选择框props
      cateProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children"
      },
      //选项卡默认激活状态
      activeName: "many"
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get("categories")
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.cateList = res.data
    },
    // 级联选择框触发事件处理函数
    async handleChange() {
      if (this.selectCateKeys.length !== 3) {
        this.selectCateKeys = []
        return
      }
      const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,{
          params:{
              sel: this.activeName
          }
      })
      if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
      console.log(res.data);
    },
    // 选项卡点击事件处理函数
    handleClick() {
    }
  },
  computed: {
      //是否启用/禁用相关按钮
      isBtnDisabled() {
          if(this.selectCateKeys.length !== 3) {
              return true
          }
          return false
      },
      //获取三级分类参数id
      cateId() {
          if(this.selectCateKeys.length === 3) {
              return this.selectCateKeys[2]
          }
          return null
      }
  }
}
</script>

<style lang="less" scoped>
.cat-sel {
  margin: 15px 0px;
}
</style>