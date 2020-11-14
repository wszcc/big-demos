<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-row :gutter='20'>
                <el-col :span='8'>
                    <el-input placeholder="请输入内容" v-model='queryInfo.query' clearable @clear='getDoodsList'>
                        <el-button @click='getDoodsList' slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                </el-col>
                <el-col :span='4'>
                    <el-button type='primary' @click='addGoods'>添加商品</el-button>
                </el-col>
            </el-row>
            <el-table class="table-margin" :data='goodList' stripe>
                <el-table-column type='index'></el-table-column>
                <el-table-column width='500' label='商品名称' prop='goods_name'></el-table-column>
                <el-table-column width='120' label='商品价格(元)' prop='goods_price'></el-table-column>
                <el-table-column width='120' label='商品重量' prop='goods_weight'></el-table-column>
                <el-table-column width='200' label='创建时间' prop='upd_time'>
                    <template slot-scope='scope'>
                        {{scope.row.upd_time|dateFormat}}
                    </template>
                </el-table-column>
                <el-table-column label='操作'>
                    <template slot-scope='scope'>
                        <el-button size='mini' type="primary" icon="el-icon-edit"></el-button>
                        <el-button @click='removeGoodsById(scope.row.goods_id)' size='mini' type="danger"
                            icon="el-icon-delete"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum" :page-sizes="[3, 5, 10, 15]" :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </el-card>
    </div>
</template>
<script>
    export default {
        name: 'list',
        data() {
            return {
                queryInfo: {
                    pagenum: 1,
                    pagesize: 10,
                    query: ''
                },
                goodList: [],
                total: 0
            }
        },
        methods: {
            getDoodsList() {
                this.$http.get('goods', { params: this.queryInfo })
                    .then(res => {
                        this.goodList = res.data.data.goods
                        this.total = res.data.data.total
                        
                    })
            },
            handleSizeChange(newSize) {
                this.queryInfo.pagesize = newSize
                this.getDoodsList()
            },
            handleCurrentChange(newPage) {
                this.queryInfo.pagenum = newPage
                this.getDoodsList()
            },
            removeGoodsById(goodsId) {
                this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(res=>{
                    this.$http.delete('goods/'+goodsId)
                    .then(res=>{
                        this.getDoodsList()
                    })
                })
            },
            addGoods(){
                this.$router.push('/goods/add')
            }
        },
        created() {
            this.getDoodsList()
        },
    }
</script>
<style>
    .table-margin {
        margin-top: 15px;
    }
</style>