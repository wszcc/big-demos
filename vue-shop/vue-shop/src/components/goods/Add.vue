<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>添加商品</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-alert title="添加商品信息" type="info" center show-icon> </el-alert>
            <el-steps :active="parseInt(activeIndex)" finish-status="success" align-center>
                <el-step title="基本信息"></el-step>
                <el-step title="商品参数"></el-step>
                <el-step title="商品属性"></el-step>
                <el-step title="商品图片"></el-step>
                <el-step title="商品内容"></el-step>
                <el-step title="完成"></el-step>
            </el-steps>
            <el-form :model="addFrom" :rules="addFromRule" ref="addFromRef" label-width="100px" label-position='top'>
                <el-tabs :tab-position="'left'" v-model='activeIndex' :before-leave='beforeTbaLeave'
                @tab-click='tabClicked'>
                    <el-tab-pane label="基本信息" name='0'>
                        <el-form-item label='基本信息' prop='goods_name'>
                            <el-input v-model='addFrom.goods_name'></el-input>
                        </el-form-item>
                        <el-form-item label='商品价格' prop='goods_price'>
                            <el-input v-model='addFrom.goods_price'></el-input>
                        </el-form-item>
                        <el-form-item label='商品重量' prop='goods_weight'>
                            <el-input v-model='addFrom.goods_weight'></el-input>
                        </el-form-item>
                        <el-form-item label='商品数量' prop='goods_number'>
                            <el-input v-model='addFrom.goods_number'></el-input>
                        </el-form-item>
                        <el-form-item label='商品分类' prop='goods_cat'>
                            <el-cascader v-model="addFrom.goods_cat" :options="cateList" :props="cateProp"
                                @change="handleChange"></el-cascader>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品参数" name='1'>商品参数</el-tab-pane>
                    <el-tab-pane label="商品属性" name='2'>商品属性</el-tab-pane>
                    <el-tab-pane label="商品图片" name='3'>商品图片</el-tab-pane>
                    <el-tab-pane label="商品内容" name='4'>商品内容</el-tab-pane>
                </el-tabs>
            </el-form>
        </el-card>
    </div>
</template>
<script>
    export default {
        name: 'AddGoods',
        data() {
            return {
                activeIndex: '0',
                addFrom: {
                    goods_name: '',
                    goods_price: 0,
                    goods_weight: 0,
                    goods_number: 0,
                    goods_cat: []
                },
                addFromRule: {
                    goods_name: [
                        { required: true, message: '请输入名称', trigger: 'blur' },
                    ],
                    goods_price: [
                        { required: true, message: '请输入价格', trigger: 'blur' },
                    ],
                    goods_weight: [
                        { required: true, message: '请输入商品重量', trigger: 'blur' },
                    ],
                    goods_number: [
                        { required: true, message: '请输入商品数量', trigger: 'blur' },
                    ],
                    goods_cat: [
                        { required: true, message: '请输入商品分类', trigger: 'blur' },
                    ]
                },
                cateList: [],
                cateProp: {
                    expandTrigger: 'hover',
                    label: 'cat_name',
                    value: 'cat_id',
                    children: "children"
                }
            }
        },
        methods: {
            getCateList() {
                this.$http.get('categories')
                    .then(res => {
                        this.cateList = res.data.data
                    })
            },
            handleChange() {
                if (this.addFrom.goods_cat.length != 3) {
                    this.addFrom.goods_cat = []
                }
                //如果长度等于三就属于正常值，进行后面的操作

                console.log(this.addFrom.goods_cat)
            },
            beforeTbaLeave(activeName, oldActiveName) {
                if (  oldActiveName === '0'&& this.addFrom.goods_cat.length !== 3 ) {
                    alert('请完善信息！')
                    console.log(this.addFrom.goods_cat.length)
                    return false
                }
                // return false
            },

            tabClicked(){
                if(this.activeIndex='1'){
                    this.$http.get('categories/'+this.cateId+'/attributes',{
                        params:{sel:'many'}
                    }).then(res=>{
                        console.log(res)
                        // console.log(this.addFrom.goods_cat)
                    })
                }
                console.log(this.activeIndex)
            }
        },
        created() {
            this.getCateList()
        },
        computed: {
            cateId(){
                if(this.addFrom.goods_cat.length=3){
                    return this.addFrom.goods_cat[2]
                }
                return null
                // return this.addFrom.goods_cat[2]
            }
        },
    }
</script>
<style>
    div .el-step__title {
        font-size: 13px;
    }
</style>