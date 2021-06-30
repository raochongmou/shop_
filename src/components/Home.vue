<template>
  <!-- 主页布局 -->
  <el-container>
    <!-- 头部 -->
    <el-header>
      <span>电商管理系统</span>
      <el-button size="mini" type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 内容区 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse?'64px':'200px'">
        <div class="taggle-button" @click="taggleMenu">|||</div>
        <el-menu
          :default-active="activePath"
          :collapse-transition="false"
          :collapse="isCollapse"
          :unique-opened="true"
          :router="true"
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409eff"
        >
          <el-submenu
            :index="item.id + ''"
            v-for="item in menusList"
            :key="item.id"
          >
            <template slot="title">
              <i :class="iconList[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <el-menu-item
              :index="'/' + itemMenu.path"
              v-for="itemMenu in item.children"
              :key="itemMenu.id"
              @click="btnMenu('/' + itemMenu.path)"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ itemMenu.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 主体内容区区 -->
      <el-main>
          <router-view/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      menusList: [],
      // 字体图标
      iconList: {
        125: "iconfont icon-user",
        103: "iconfont icon-tijikongjian",
        101: "iconfont icon-shangpin",
        102: "iconfont icon-danju",
        145: "iconfont icon-baobiao",
      },
      // 是否折叠
      isCollapse:false,
      //存取菜单跳转路径
      activePath:''
    }
  },
  created() {
    this.getMenuList();
    this.activePath = window.sessionStorage.getItem('activePath');
  },
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push("/login")
    },
    async getMenuList() {
      const { data: res } = await this.$http.get("menus")
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.menusList = res.data
      console.log(this.menusList)
    },
    // 点击三条竖线折叠侧边菜单栏
    taggleMenu(){
        this.isCollapse = !this.isCollapse;
    },
    // 点击二级菜单跳转相应菜单路径下
    btnMenu(activePath){
        window.sessionStorage.setItem('activePath',activePath);
        this.activePath = activePath;
    }
  },
}
</script>

<style lang="less" scoped>
.el-container {
  height: 100%;
}

.el-header {
  background-color: #373d4e;
  display: flex;
  justify-content: space-between;
  align-items: center;
  span {
    color: #aaa;
  }
}

.el-aside {
  background-color: #333744;
  .el-main {
    background-color: #eaedf1;
  }
}

.el-menu {
  border: none;
}

.iconfont {
  margin-right: 10px;
}

.taggle-button {
    background-color: #4a5064;
    text-align: center;
    color: #fff;
    line-height: 24px;
    font-size: 14px;
    letter-spacing: 0.2em;
    cursor: pointer;
}
</style>