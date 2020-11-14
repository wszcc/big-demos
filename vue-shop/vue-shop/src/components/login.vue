<template>
    <div class="login">
        <div class="login-box">
            <!-- 头像区域 -->
            <div class="profile">
                <img src="../assets/img/profile.jpg" alt="">
            </div>
            <div class="submit-box">
                <form action="get">
                    <span>账号:</span><input type="text" v-model='form.username'>
                    <span>密码:</span><input type="password" v-model='form.password' >
                </form>
                <div class="btns">
                    <button @click='login'>提交</button>
                    <button @click='reset'>清空</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'login',
        data() {
            return {
                form: {
                    username: 'admin',
                    password: '123456'
                }
            }
        },
        methods: {
            reset(){
                this.form.username=''
                this.form.password=''
            },
            login(){
                this.$http.post('login',this.form)
                .then(res=>{
                    if(res.data.meta.status!==200)
                    return alert(res.data.meta.msg)
                    alert(res.data.meta.msg)
                    window.sessionStorage.setItem('token',res.data.data.token)
                    this.$router.push('/home')
                }) 
           
            }
        },
    }
</script>
<style>
    .login {
        width: 100%;
        height: 100%;
        background-color: aquamarine;
    }

    .login .login-box {
        width: 450px;
        height: 300px;
        background-color: white;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        border-radius: 15px;
    }

    .profile {
        width: 130px;
        height: 130px;
        border: 1px solid #eee;
        border-radius: 50%;
        padding: 4px;
        box-shadow: 0 0 10px #dddddd;
        background-color: white;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -150%);
    }

    .profile img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
    }

    .submit-box {
        width: 400px;
        height: 150px;
        position: absolute;
        left: 50%;
        left: 50%;
        transform: translate(-50%, 130px);
    }

    .submit-box input {
        margin: 5px;
        margin-left: 40px;
        border: 3px solid #eee;
        width: 300px;
        height: 30px;
        border-radius: 10px;
    }

    .submit-box button {
        margin: 3px;
        margin-top: 9px;
        width: 80px;
        height: 40px;
    }

    .submit-box span {
        font-size: 20px;
    }

    .submit-box button:nth-of-type(1) {
        background-color: #01BAF0;
        border-radius: 10px;
        border: 1px solid transparent;
    }

    .submit-box button:nth-of-type(2) {
        background-color: #CECECF;
        border-radius: 10px;
        border: 1px solid transparent;
    }

    .btns {
        position: absolute;
        left: 200px;
        display: flex;
    }
</style>