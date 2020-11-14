<template>
    <el-container>
        <el-header>
            <div>
                <img src='../assets/img/profile.jpg' alt="">
                <span>电商后台管理系统</span>
            </div>
            <button @click='exit'>退出</button>
        </el-header>
        <el-container>
            <el-aside :width="isCollapse ? '64px' : '200px'">
                <div class="toggle-button" @click='toggleBtn'>| | |</div>
                <el-menu background-color="#3C4447" text-color="#fff" active-text-color="#2A8CF8" unique-opened
                :collapse='isCollapse' :collapse-transition='false' router :default-active='isActive'>
                    <el-submenu :index="item.id+'1'" v-for='item in menulist'>
                        <template slot="title">
                            <i :class="iconfontlist[item.id]"></i>
                            <span>{{item.authName}}</span>
                        </template>
                        <el-menu-item :index="'/'+subitem.path" v-for='subitem in item.children'
                        @click="activeClick('/'+subitem.path)">
                            <template slot="title">
                                <i class="el-icon-location"></i>
                                <span>{{subitem.authName}}</span>
                            </template>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>
<script>
    export default {
        name: 'home',
        data() {
            return {
                menulist:[],
                iconfontlist:{
                    '125':'iconfont icon-ProfileHili',
                    '103':'iconfont icon-lock',
                    '101':'iconfont icon-goods',
                    '102':'iconfont icon-icon_orderfrom_gree',
                    '145':'iconfont icon-Ioniconsmdinformationcircle',
                },
                isCollapse:false,
                isActive:''
            }
        },
        created(){
            this.getMenuList()
        },
        methods: {
            exit() {
                window.sessionStorage.clear()
                this.$router.push('/login')
            },
            getMenuList(){
                this.$http.get('menus')
                .then(res=>{
                    this.menulist=res.data.data
                })
            },
            toggleBtn(){
                this.isCollapse=!this.isCollapse
            },
            activeClick(activepath){
                this.isActive=activepath
            }
        },
    }
</script>
<style>
    .el-header button {
        font-size: 14px;
        width: 80px;
        height: 40px;
        background-color: #CECECF;
        border-radius: 10px;
        border: 1px solid transparent;
    }

    .el-container {
        width: 100%;
        height: 100%;
    }

    .el-header {
        color: white;
        background-color: #313138;
        display: flex;
        justify-content: space-between;
        font-size: 20px;
        align-items: center;
    }

    .el-aside {
        background-color: #3C4447;
    }
    .el-aside .el-menu{
        border-right: none;
    }
    .el-main {
        background-color: #eee;
    }

    .el-header img {
        width: 50px;
        height: 50px;
        border-radius: 50%;
    }

    .el-header div {
        display: flex;
        align-items: center;
    }

    .el-header div span {
        margin-left: 20px;
    }
    .iconfont{
        font-size: 20px;
        margin: 8px;
    }
    .toggle-button{
        color: white;
        text-align: center;
        background-color:#4a5064;
        cursor: pointer;
        font-size: 10px;
        line-height: 24px;
    }
</style>