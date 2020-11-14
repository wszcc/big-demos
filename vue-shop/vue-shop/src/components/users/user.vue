<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-row :gutter='20'>
                <el-col :span='9'>
                    <el-input placeholder="请输入内容" v-model='userlistobj.query' clearable @clear='getUsersList'>
                        <el-button slot="append" icon="el-icon-search" @click='getUsersList'></el-button>
                    </el-input>
                </el-col>
                <el-col :span='4'>
                    <el-button type='primary' @click="disdialog">添加用户</el-button>
                </el-col>
            </el-row>
            <el-table :data='listusers' stripe>
                <el-table-column type='index'></el-table-column>
                <el-table-column label='姓名' prop='username'></el-table-column>
                <el-table-column label='邮箱' prop='email'></el-table-column>
                <el-table-column label='电话' prop='mobile'></el-table-column>
                <el-table-column label='角色' prop='role_name'></el-table-column>
                <el-table-column label='状态' prop='mg_state'>
                    <template slot-scope='scope'>
                        <el-switch v-model='scope.row.mg_state' @change='usersStateChange(scope.row)'></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label='操作'>
                    <template slot-scope='scope'>
                        <el-button type="primary" icon="el-icon-edit" circle @click='showEditDialog(scope.row.id)'>
                        </el-button>
                        <el-button type="danger" icon="el-icon-delete" circle @click='removeUserById(scope.row.id)'>
                        </el-button>
                        <el-tooltip effect="dark" content="分配用户" placement="top" :enterable='false'>
                            <el-button type="warning" icon="el-icon-setting" circle @click='disAlotDialog(scope.row)'></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="userlistobj.pagenum" :page-sizes="[3, 6, 8, 10]" :page-size="userlistobj.pagesize"
                layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </el-card>
        <el-dialog title="提示" :visible.sync="adddialogVisible" width="50%" @close='addFormClose'>
            <span>
                <el-form ref="addFormref" :model="addForm" label-width="100px" :rules='addFormrules'>
                    <el-form-item label="用户名" prop='username'>
                        <el-input v-model="addForm.username"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop='password'>
                        <el-input v-model="addForm.password"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" prop='email'>
                        <el-input v-model="addForm.email"></el-input>
                    </el-form-item>
                    <el-form-item label="手机" prop='phone'>
                        <el-input v-model="addForm.phone"></el-input>
                    </el-form-item>
                </el-form>
            </span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="adddialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addUser">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="编辑用户" :visible.sync="showDialogValid" width="50%">
            <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
                <el-form-item label="用户名">
                    <el-input v-model="editForm.username" disabled></el-input>
                </el-form-item>
                <el-form-item label="邮箱">
                    <el-input v-model="editForm.email" prop='email'></el-input>
                </el-form-item>
                <el-form-item label="电话">
                    <el-input v-model="editForm.mobile" prop='phone'></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="showDialogValid = false">取 消</el-button>
                <el-button type="primary" @click="ediUserInfo">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="分配用户" :visible.sync="disAlotDialogVasild" width="50%">
         <div>
            <p>当前用户：{{roleDialogInfo.username}}</p>
            <p>当前的角色：{{roleDialogInfo.role_name}}</p>
            <p>
                <el-select v-model="theSelectRole" placeholder="请选择">
                    <el-option
                      v-for="item in rolesList"
                      :key="item.id"
                      :label="item.roleName"
                      :value="item.id">
                    </el-option>
                  </el-select>
            </p>
         </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="disAlotDialogVasild = false">取 消</el-button>
                <el-button type="primary" @click="getRolesAlot">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
    export default {
        name: 'user',
        data() {
            let checkPhone = (rules, value, callback) => {
                const phoneRules = /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/
                if (phoneRules.test(value)) {
                    return callback()
                }
                callback(new Error('请输入正确的手机号！'))
            }
            let checkEmail = (rules, value, callback) => {
                const emailRules = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/
                if (emailRules.test(value)) {
                    return callback()
                }
                callback(new Error('请输入正确的邮箱！'))
            }
            return {
                userlistobj: {
                    query: '',
                    pagenum: 1,
                    pagesize: 3
                },
                listusers: [],
                total: 0,
                adddialogVisible: false,
                addForm: {
                    username: '',
                    passowrd: '',
                    email: '',
                    phone: ''
                },
                addFormrules: {
                    username: [
                        { required: true, message: '请输入用户名', trigger: 'blur' },
                        { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' },
                        { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                    ],
                    email: [
                        { required: true, message: '请输入邮箱', trigger: 'blur' },
                        { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' },
                        { validator: checkEmail, tirgger: 'blur' }
                    ],
                    phone: [
                        { required: true, message: '请输入电话', trigger: 'blur' },
                        { min: 1, max: 11, message: '长度在 1 到 11 个字符', trigger: 'blur' },
                        { validator: checkPhone, tirgger: 'blur' }
                    ],
                },
                showDialogValid: false,
                editForm: {},
                editFormRules: {
                    email: [
                        { required: true, message: '请输入邮箱', trigger: 'blur' },
                        { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' },
                        { validator: checkEmail, tirgger: 'blur' }
                    ],
                    phone: [
                        { required: true, message: '请输入电话', trigger: 'blur' },
                        { min: 1, max: 11, message: '长度在 1 到 11 个字符', trigger: 'blur' },
                        { validator: checkPhone, tirgger: 'blur' }
                    ],
                },
                disAlotDialogVasild:false,
                roleDialogInfo:{},
                rolesList:[],
                theSelectRole:''
            }
        },
        created() {
            this.getUsersList()
        },
        methods: {
            getUsersList() {
                this.$http.get('users', {
                    params: this.userlistobj
                }).then(res => {
                    this.total = res.data.data.total
                    this.listusers = res.data.data.users
                })
            },
            handleSizeChange(newsize) {
                this.userlistobj.pagesize = newsize
                this.getUsersList()
            },
            handleCurrentChange(newpage) {
                this.userlistobj.pagenum = newpage
                this.getUsersList()
            },
            usersStateChange(userinfo) {
                console.log(userinfo)
                // this.$http.put('users/${userinfo.id}/state/${userinfo.mg_state}')
                this.$http.put('users/' + userinfo.id + '/state/' + userinfo.mg_state)
                    .then(res => {
                        console.log(res)
                    })
            },
            disdialog() {
                this.adddialogVisible = true
            },
            addFormClose() {
                this.addForm.username = ''
                this.addForm.password = ''
                this.addForm.email = ''
                this.addForm.phone = ''
            },
            addUser() {
                this.$http.post('users', this.addForm)
                    .then(res => {
                        alert('添加用户成功！')
                        this.adddialogVisible = false
                        this.getUsersList()
                    })
            },
            showEditDialog(userId) {
                this.$http.get('users/' + userId)
                    .then(res => {
                        this.editForm = res.data.data
                    }).catch(err => {
                        orm
                        alert(err.toString())
                    })
                this.showDialogValid = true
            },
            ediUserInfo() {
                this.$http.put('users/' + this.editForm.id, {
                    email: this.editForm.email,
                    mobile: this.editForm.mobile
                }).then(res => {
                    this.showDialogValid = false
                    this.getUsersList()
                })
            },
            removeUserById(userId) {
                this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(res => {
                    this.$http.delete('users/' + userId)
                    alert('删除成功！')
                    this.getUsersList()
                }).catch(err => {
                    alert('取消操作！')
                })
            },
            disAlotDialog(roleinfo) {
                this.roleDialogInfo=roleinfo
                this.$http.get('roles')
                .then(res=>{
                    // console.log(res)
                    this.rolesList=res.data.data
                })
                this.disAlotDialogVasild=true
            },
            getRolesAlot(){
                this.$http.put('users/'+this.roleDialogInfo.id+'/role',{
                    rid:this.theSelectRole
                })
                .then(res=>{
                    this.disAlotDialogVasild=false
                })
                this.theSelectRole=''
            }
        },
    }
</script>
<style>
    .el-pagination {
        margin-top: 25px;
    }
</style>