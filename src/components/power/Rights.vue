<template>
  <div>
    <!-- 头部面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 列表展示卡片视图 -->
    <el-card>
        <!-- 权限列表表格 -->
        <el-table :data="rightsList" stripe border>
          <el-table-column type="expand" align="center"></el-table-column>
            <el-table-column label="#" type="index" align="center"></el-table-column>
            <el-table-column label="权限名称" prop="authName" align="center"></el-table-column>
            <el-table-column label="路径" prop="path" align="center"></el-table-column>
            <el-table-column label="权限等级" prop="level" align="center">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.level == 0" type="primary">一级</el-tag>
                    <el-tag v-else-if="scope.row.level == 1" type="success">二级</el-tag>
                    <el-tag v-else-if="scope.row.level == 2" type="danger">三级</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="权限等级" prop="leve" align="center"></el-table-column>
            <el-table-column label="权限等级" prop="leve" align="center"></el-table-column>
        </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Rights",
  data() {
    return {
      rightsList: []
    }
  },
  created() {
    this.getRightsList()
  },
  methods: {
    async getRightsList() {
      const { data: res } = await this.$http.get("rights/list")
      if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.rightsList = res.data
    }
  }
}
</script>

<style>
</style>