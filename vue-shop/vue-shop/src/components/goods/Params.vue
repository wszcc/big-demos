<template>


    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>参数列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-alert closable show-icon title="注意，只允许为第三方分类设置相关参数！" type="warning">
            </el-alert>
            <el-row class="rowStyle">
                <span>选择商品分类：</span>
                <el-cascader v-model="selectCateList" :options="cateList"
                    :props="{ expandTrigger: 'hover' ,value:'cat_id',label:'cat_name',children:'children'}"
                    @change="handleChange"></el-cascader>
            </el-row>
            <el-tabs v-model="activeName" @tab-click="handleTabClick">
                <el-tab-pane label="动态参数" name="many">
                    <el-button size='mini' type='primary' :disabled='isBtnDisabled' @click='addPropFormVisible=true'>
                        添加参数</el-button>
                    <el-table :data="manyTableData" style="width: 100%">
                        <el-table-column type='expand' width="180">
                            <template slot-scope='scope'>
                                <el-tag v-for='(item,index) in scope.row.attr_vals' key='index' closable>
                                    {{item}}
                                </el-tag>
                                <el-input class="input-new-tag" v-if="scope.row.inputVisible"
                                    v-model="scope.row.inputValue" ref="saveTagInputRef" size="small"
                                    @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm(scope.row)">
                                </el-input>
                                <el-button v-else class="button-new-tag" size="small"
                                    @click="showInput(scope.row.inputVisible)">+New Tag
                                </el-button>
                            </template>
                        </el-table-column>
                        <el-table-column type='index' width="180">
                        </el-table-column>
                        <el-table-column prop="attr_name" label="参数名称" width="180">
                        </el-table-column>
                        <el-table-column label="操作" width="180">
                            <template slot-scope='scope'>
                                <el-button @click='showEditDialog(scope.row.attr_id)' size='mini' type="primary"
                                    icon="el-icon-edit">编辑</el-button>
                                <el-button @click='removeParams(scope.row.attr_id)' size='mini' type="danger"
                                    icon="el-icon-delete">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="静态属性" name="only">
                    <el-button size='mini' type='primary' :disabled='isBtnDisabled' @click='addPropFormVisible=true'>
                        添加属性</el-button>
                    <el-table :data="onlyTableData" style="width: 100%">
                        <el-table-column type='expand' width="180">
                            <template slot-scope='scope'>
                                <el-tag v-for='(item,index) in scope.row.attr_vals' key='index' closable>
                                    {{item}}
                                </el-tag>
                                <el-input class="input-new-tag" v-if="scope.row.inputVisible"
                                    v-model="scope.row.inputValue" ref="saveTagInputRef" size="small"
                                    @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm(scope.row)">
                                </el-input>
                                <el-button v-else class="button-new-tag" size="small"
                                    @click="showInput(scope.row.inputVisible)">+New Tag
                                </el-button>
                            </template>
                        </el-table-column>
                        <el-table-column type='index' width="180">
                        </el-table-column>
                        <el-table-column prop="attr_name" label="属性名称" width="180">
                        </el-table-column>
                        <el-table-column label="操作" width="180">
                            <template slot-scope='scope'>
                                <el-button @click='showEditDialog(scope.row.attr_id)' size='mini' type="primary"
                                    icon="el-icon-edit">编辑</el-button>
                                <el-button @click='removeParams(scope.row.attr_id)' size='mini' type="danger"
                                    icon="el-icon-delete">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </el-card>
        <el-dialog :title="'添加'+titleText" :visible.sync="addPropFormVisible" width="50%" @close='addPropFromClose'>
            <el-form :model="addPropFrom" :rules="addPropFromRules" ref="addPropFromRef" label-width="100px">
                <el-form-item :label="titleText" prop="attr_name">
                    <el-input v-model="addPropFrom.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addPropFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="addFrom">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog :title="'修改'+titleText" :visible.sync="editPropFormVisible" width="50%" @close='editPropFromClose'>
            <el-form :model="editPropFrom" :rules="editPropFromRules" ref="editPropFromRef" label-width="100px">
                <el-form-item :label="titleText" prop="attr_name">
                    <el-input v-model="editPropFrom.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editPropFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="editFrom">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
    export default {
        name: 'Params',
        data() {
            return {
                cateList: [],
                //级联选择框选中的id
                selectCateList: [],
                activeName: 'many',
                manyTableData: [],
                onlyTableData: [],
                //控制添加属性表单对话框的显示
                addPropFormVisible: false,
                addPropFrom: {
                    attr_name: ''
                },
                addPropFromRules: {
                    attr_name: [
                        { required: true, message: '请输入属性名称', trigger: 'blur' }
                    ],
                },
                editPropFormVisible: false,
                //修改对话框的数据源
                editPropFrom: {
                    attr_name: ''
                },
                editPropFromRules: {
                    attr_name: [
                        { required: true, message: '请输入属性名称', trigger: 'blur' }
                    ],
                },
            }
        },
        methods: {
            getCateList() {
                this.$http.get('categories')
                    .then(res => {
                        this.cateList = res.data.data
                        // console.log(this.cateList)
                    })
            },
            handleChange() {
                this.getParamsDate()
            },
            handleTabClick() {
                this.getParamsDate()
            },
            getParamsDate() {
                if (this.selectCateList.length != 3) {
                    this.selectCateList = []
                    this.manyTableData=[]
                    this.onlyTableData=[]
                }
                this.$http.get('categories/' + this.cateId + '/attributes',
                    { params: { sel: this.activeName } })
                    .then(res => {
                        if (this.activeName === 'many') {
                            this.manyTableData = res.data.data
                        } else {
                            this.onlyTableData = res.data.data
                        }
                        res.data.data.forEach(item => {
                            item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
                            item.inputVisible = false
                            item.inputValue = ''
                        })
                    })

            },
            addPropFromClose() {
                this.$refs.addPropFromRef.resetFields()
            },
            addFrom() {
                this.$http.post('categories/' + this.cateId + '/attributes', {
                    attr_name: this.addPropFrom.attr_name,
                    attr_sel: this.activeName
                })
                    .then(res => {
                        this.getParamsDate()
                        this.addPropFormVisible = false
                    })
            },
            editPropFromClose() {
                this.$refs.editPropFromRef.resetFields()
            },
            editFrom() {
                this.$http.put('categories/' + this.cateId + '/attributes/' + this.editPropFrom.attr_id, {
                    attr_name: this.editPropFrom.attr_name,
                    attr_sel: this.activeName
                }).then(res => {
                    this.getParamsDate()
                    this.editPropFormVisible = false
                })
            },
            showEditDialog(attr_id) {
                this.$http.get('categories/' + this.cateId + '/attributes/' + attr_id,
                    { params: { attr_sel: this.activeName } })
                    .then(res => {
                        // console.log(res)
                        this.editPropFrom = res.data.data
                    })
                this.editPropFormVisible = true
                // console.log('hello')
            },
            removeParams(attr_id) {
                this.$confirm('此操作将永久删除该属性, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(res => {
                    this.$http.delete('categories/' + this.cateId + '/attributes/' + attr_id)
                        .then(res => {
                            this.getParamsDate()
                        })
                })
            },
            handleInputConfirm(scope) {
                if(scope.inputValue.trim().length===0){
                    scope.inputValue=''
                    scope.inputVisible=false
                    return 
                }
                //输入的是合法的字符串，那么就要进行后面的处理
                scope.attr_vals.push(scope.inputValue)
                scope.inputValue=''
                scope.inputVisible=false
                this.$http.put('categories/' + this.cateId + '/attributes/' + scope.attr_id,{
                    attr_name:scope.attr_name,
                    attr_sel:scope.attr_sel,
                    attr_vals:scope.attr_vals.join(' ')      
              })
            },
            showInput(inputVisible) {
                this.$nextTick(_ => {
                    this.$refs.saveTagInputRef.$refs.input.focus();
                })
                inputVisible = true
            }
        },
        created() {
            this.getCateList()
        },
        computed: {
            isBtnDisabled() {
                if (this.selectCateList.length != 3) {
                    return true
                }
                return false
            },
            cateId() {
                if (this.selectCateList.length != 3) {
                    return null
                }
                return this.selectCateList[2]
            },
            titleText() {
                if (this.activeName === 'many') {
                    return '动态参数'
                }
                return '静态属性'
            }
        },
    }
</script>
<style>
    .rowStyle {
        margin: 15px;
    }

    .el-cascader {
        width: 30%;
    }

    .input-new-tag {
        width: 120px;
    }
    .el-table{
        width: 100%;
    }
</style>