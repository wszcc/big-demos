<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        </el-breadcrumb>  
        <el-card>
            <el-table :data='rightsList' stripe>
                <el-table-column type='index'></el-table-column>
                <el-table-column label='权限名称' prop='authName'></el-table-column>
                <el-table-column label='路径' prop='path'></el-table-column>
                <el-table-column label='权限等级' prop='level'>
                    <template slot-scope='scope'>
                       <el-tag v-if="scope.row.level==='0'">标签一</el-tag>
                       <el-tag v-else-if="scope.row.level==='1'" type='success'>标签二</el-tag>
                       <el-tag v-else type='warning'>标签三</el-tag>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>
<script>
export default {
    name:'rights',
    created(){
        this.getRightsList()
    },
    data() {
        return {
            rightsList:[]
        }
    },
    methods: {
        getRightsList(){
            this.$http.get('rights/list')
            .then(res=>{
                this.rightsList=res.data.data
            })
        }
    },
}
</script>
<style>

</style>