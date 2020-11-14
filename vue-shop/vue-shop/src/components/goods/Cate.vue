<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-row>
                <el-button type='primary' @click='addOrderDialog'>添加分类</el-button>
            </el-row>
            <!-- 表格 -->
            <tree-table class="treeTable" :data='cateList' :columns='columns' :selection-type='false'
                :expand-type='false' show-index index-text='#' :show-row-hover='false'>
                <template slot="isOk" slot-scope='scope'>
                    <i class="el-icon-success" v-if='scope.row.cat_deleted===true'
                        style="color:lightgreen;font-size: 20px;"></i>
                    <i class="el-icon-error" v-else style="color:red;font-size: 20px;"></i>
                </template>
                <template slot="sort" slot-scope='scope'>
                    <el-tag v-if='scope.row.cat_level===0'>一级</el-tag>
                    <el-tag type='success' v-else-if='scope.row.cat_level===1'>二级</el-tag>
                    <el-tag type='warning' v-else>三级</el-tag>
                </template>
                <template slot="option" slot-scope='scope'>
                    <el-button size='mini' type="primary" icon="el-icon-edit">编辑</el-button>
                    <el-button size='mini' type="danger" icon="el-icon-delete">删除</el-button>
                </template>
            </tree-table>
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum" :page-sizes="[3, 4, 5, 6]" :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
            <el-dialog @close='cateDialogClose' title="添加分类" :visible.sync="addOrderDialogVisible" width="50%">
                <el-form :model="addCateFrom" :rules="addCateFromRules" ref="addCateFromRef" label-width="100px">
                    <el-form-item label="分类名称" prop="cat_name">
                        <el-input v-model="addCateFrom.cat_name"></el-input>
                    </el-form-item>
                    <el-form-item label="父级分类">
                        <el-cascader v-model="selectKeys" :options="parentCateList"
                         :props="{ expandTrigger: 'hover' ,value:'cat_id',label:'cat_name',children:'children'}"
                            @change="parentCateChange" clearable change-on-select>
                        </el-cascader>
                    </el-form-item>
                </el-form>
                <span slot="footer">
                    <el-button @click="addOrderDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addCate">确 定</el-button>
                </span>
            </el-dialog>
        </el-card>
    </div>
</template>
<script>
    export default {
        name: 'Cate',
        data() {
            return {
                queryInfo: {
                    type: 3,
                    pagenum: 1,
                    pagesize: 3
                },
                cateList: [],
                total: 0,
                columns: [
                    { label: '分类名称', prop: 'cat_name' },
                    { label: '是否有效', type: 'template', template: 'isOk' },
                    { label: '排序', type: 'template', template: 'sort' },
                    { label: '操作', type: 'template', template: 'option' }
                ],
                addOrderDialogVisible: false,
                // 添加分类的表单数据源
                addCateFrom: {
                    cat_name: '',
                    cat_pid: 0,
                    cat_level: 0
                },
                // 添加表单的规则
                addCateFromRules: {
                    cat_name: [
                        { required: true, message: '请输入活动名称', trigger: 'blur' }
                    ],
                },
                parentCateList: [],
                selectKeys:[]
            }
        },
        methods: {
            getCateList() {
                this.$http.get('categories', {
                    params: this.queryInfo
                }).then(res => {
                    this.cateList = res.data.data.result
                    // console.log(this.cateList)
                    this.total = res.data.data.total
                })
            },
            handleSizeChange(newSize) {
                this.queryInfo.pagesize = newSize
                this.getCateList()
            },
            handleCurrentChange(newNum) {
                this.queryInfo.pagenum = newNum
                this.getCateList()
            },
            addOrderDialog() {
                this.getParentCateList()
                this.addOrderDialogVisible = true
            },
            getParentCateList() {
                this.$http.get('categories', { params: { type: 2 } })
                    .then(res => {
                        this.parentCateList = res.data.data
                    })
            },
            parentCateChange(){
                console.log(this.selectKeys)
                if(this.parentCateList.length>0){
                    this.addCateFrom.cat_pid=this.selectKeys[this.selectKeys.length-1]
                    this.addCateFrom.cat_level=this.selectKeys.length
                }else{
                    this.addCateFrom.cat_pid=0
                    this.addCateFrom.cat_level=0
                }
            },
            addCate(){
                this.$http.post('categories',this.addCateFrom)
                .then(res=>{
                    this.getCateList()
                    this.addOrderDialogVisible=false
                })
            },
            cateDialogClose(){
                this.$refs.addCateFromRef.resetFields()
                this.selectKeys=[]
                this.addCateFrom.cat_pid=0
                this.addCateFrom.cat_level=0
            }
        },
        created() {
            this.getCateList()
        }
    }
</script>
<style>
    .treeTable {
        margin-top: 25px;
    }
    .el-cascader{
        width: 100%;
    }
</style>