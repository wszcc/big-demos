<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>角色管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-row>
                <el-col>
                    <el-button type='primary'>添加角色</el-button>
                </el-col>
            </el-row>
            <el-table :data='rolesList'>
                <el-table-column type='expand'>
                    <template slot-scope='scope'>
                        <el-row v-for='(item,index) in scope.row.children'
                            :class="{bodbut:true,bodtop:index===0,vcenter:true}">
                            <el-col :span='5'>
                                <el-tag closable @close='removeRightsById(scope.row,item.id)'>{{item.authName}}</el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <el-col :span='19'>
                                <el-row v-for='(item1,index1) in item.children' 
                                    :class='{bodtop:index1 != 0,vcenter:true}'>
                                    <el-col :span='6'>
                                        <el-tag closable @close='removeRightsById(scope.row,item1.id)' type='success'>{{item1.authName}}</el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <el-col :span='13'>
                                        <el-tag type='warning' v-for='(item2,index2) in item1.children'
                                            closable @close='removeRightsById(scope.row,item2.id)'>
                                            {{item2.authName}}
                                        </el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </template>
                </el-table-column>
                <el-table-column type='index'></el-table-column>
                <el-table-column label='角色名称' prop='roleName'></el-table-column>
                <el-table-column label='角色描述' prop='roleDesc'></el-table-column>
                <el-table-column label='操作'>
                    <template slot-scope='scope'>
                        <el-button size='mini' type="primary" icon="el-icon-edit">编辑</el-button>
                        <el-button size='mini' type="danger" icon="el-icon-delete">删除</el-button>
                        <el-button size='mini' type="warning" icon="el-icon-setting"
                        @click='showSetRightsDialog(scope.row,defKeys)'>分配权限</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-dialog title="分配权限" :visible.sync="showSetDialogValid" width="50%">
                <el-tree ref="treeRef" :data="getRightsInfo" :props="treeProps" show-checkbox node-key='id'
                default-expand-all :default-checked-keys='defKeys' @close='setRightsDialogClose'></el-tree>
                <span slot="footer" >
                    <el-button @click="showSetDialogValid = false">取 消</el-button>
                    <el-button type="primary" showSetDialogValid=false @click='allotRoles(rolesId)'>确 定</el-button>
                </span>
            </el-dialog>
           
        </el-card>
    </div>
</template>
<script>
    export default {
        name: 'roles',
        created() {
            this.getRolesList()
        },
        data() {
            return {
                rolesList: [],
                showSetDialogValid:false,
                getRightsInfo:[],
                treeProps:{
                    label:'authName',
                    children:'children'
                },
                defKeys:[],
                rolesId:''
            }
        },
        methods: {
            getRolesList() {
                this.$http.get('roles')
                    .then(res => {
                        this.rolesList = res.data.data
                    }).catch(err => {
                        return err
                    })
            },
            removeRightsById(role,rightId) {
                this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(res=>{
                    this.$http.delete('roles/'+role.id+'/rights/'+rightId)
                    .then(res=>{
                        role.children=res.data.data
                    }).catch(err=>{
                        return err
                    })
                }).catch(err=>{
                    return err
                })
            },
            showSetRightsDialog(node,arr){
                this.rolesId=node.id
                this.$http.get('rights/tree')
                .then(res=>{
                    this.getRightsInfo=res.data.data
                })
                this.getLiveKeys(node,arr)
                this.showSetDialogValid=true
            },
            getLiveKeys(node,arr){
                if(!node.children){
                    return arr.push(node.id)
                }
                node.children.forEach(item=>{
                    this.getLiveKeys(item,arr)
                })
            },
            setRightsDialogClose(){
                this.defKeys=[]
            },
            allotRoles(roleid){
                const rolesKeys=[
                    ...this.$refs.treeRef.getCheckedKeys(),
                    ...this.$refs.treeRef.getHalfCheckedKeys()
                ]
                const idStr=rolesKeys.join(',')
                this.$http.post('roles/'+roleid+'/rights',{
                    rids:idStr
                })
                this.getRolesList()
                this.showSetDialogValid=false
            }
        },
    }
</script>
<style>
    .el-tag {
        margin: 7px;
    }

    .bodtop {
        border-top: 1px solid #eeeeee;
    }

    .bodbut {
        border-bottom: 1px solid #eeeeee;
    }

    .vcenter {
        display: flex;
        align-items: center;
    }
</style>