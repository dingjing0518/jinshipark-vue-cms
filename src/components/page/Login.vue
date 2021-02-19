<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">金石停车 商户管理后台</div>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="ms-content">
                <el-form-item prop="loginName">
                    <el-input v-model="ruleForm.loginName" placeholder="loginName" @blur="bur">
                        <!-- <el-button slot="prepend" icon="el-icon-lx-people"></el-button> -->
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" placeholder="password" v-model="ruleForm.password"
                              @keyup.enter.native="userMessage()">
                        <!-- <el-button slot="prepend" icon="el-icon-lx-lock"></el-button> -->
                    </el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="userMessage()">登录</el-button>
                </div>
                <div class="icon-div">
                    <p class="login-tips">
                        <el-checkbox v-model="checkeders"></el-checkbox>
                        记住用户名
                    </p>
                    <p class="nee" style="margin-left:42%">
                        <el-checkbox v-model="checked">
                        </el-checkbox>
                        记住密码
                    </p>
                </div>
            </el-form>
        </div>
    </div>
</template>
<script>
    import md5 from 'js-md5';

    export default {
        data: function () {
            return {
                checked: "",
                checkeders: '',
                applyGood: [],
                ruleForm: {
                    loginName: '',
                    password: ''
                },
                rules: {
                    loginName: [{
                        required: true,
                        message: '请输入用户名',
                        trigger: 'blur'
                    }],
                    password: [{
                        required: true,
                        message: '请输入密码',
                        trigger: 'blur'
                    }]
                }
            }
        },
        created() {
            if (Boolean(localStorage.getItem("cd"))) {
                this.checkeders = true
            } else {
                this.checkeders = false
            }

            if (Boolean(localStorage.getItem("dd"))) {
                this.checked = true
            } else {
                this.checked = false
            }
            this.ruleForm.loginName = window.localStorage.getItem("checkedersid")
            if (this.ruleForm.loginName != null) {
                this.bur()
            }
        },
        methods: {
            bur() {
                var flag = false;
                var nde = JSON.parse(window.localStorage.getItem('applyParams'));
                console.log(nde);
                if (nde == null) {
                    return;
                }
                for (var i = 0; i < nde.length; i++) {
                    if (this.ruleForm.loginName == nde[i].loginName) {
                        this.ruleForm.password = nde[i].password;
                        this.checked = true;
                        this.checkeders = true;
                        flag = true;
                    }
                }
                if (!flag) {
                    this.ruleForm.password = '';
                }

            },
            userMessage(formName) {
                var res = this;
                this.$axios({
                    // url: this.GLOBAL._SERVER_API_ + 'user/login?loginName=' + res.ruleForm.loginName + '&password=' + md5(res.ruleForm.password).toUpperCase(),
                    url: this.GLOBAL._SERVER_API_ + 'user/login',
                    method: "post",
                    data: {
                        loginName: res.ruleForm.loginName,
                        password: md5(res.ruleForm.password).toUpperCase()
                    }
                }).then(function (response) {
                    if (response.data.status == 200) {
                        localStorage.setItem('ms_loginName', res.ruleForm.loginName);
                        localStorage.setItem('userId', response.data.data.id);
                        localStorage.setItem('parkingId', response.data.data.parkid);
                        localStorage.setItem("password", res.ruleForm.password);
                        localStorage.setItem("roleName", response.data.data.roleName);
                        if (res.checked == true) {
                            var flag = false;
                            localStorage.setItem('cd', true);
                            if (window.localStorage.getItem('applyParams')) {

                                res.applyGood = JSON.parse(window.localStorage.getItem('applyParams'));
                                for (var i = 0; i < res.applyGood.length; i++) {
                                    if (res.ruleForm.loginName === res.applyGood[i].loginName) {
                                        flag = true;
                                    }
                                }

                            }
                            if(!flag){
                                res.applyGood.push({
                                    loginName: res.ruleForm.loginName,
                                    password: res.ruleForm.password,
                                })
                            }

                            localStorage.setItem('applyParams', JSON.stringify(res.applyGood))
                        } else {
                            localStorage.removeItem("cd");
                            //没有填写记住密码
                        }
                        if (res.checkeders == true) {
                            localStorage.setItem('dd', true);
                            localStorage.setItem('checkedersid', res.ruleForm.loginName)
                        } else {
                            //没有记住用户名
                            localStorage.removeItem("dd");
                        }
                        res.$router.push('/lincensePlate');
                    } else {
                        alert(response.data.msg)
                    }
                }).catch(function (error) {
                    res.$message.error('系统错误: ' + error);
                    console.log(error);
                });
            }
        }
    }
</script>

<style scoped>
    .login-wrap {
        position: relative;
        width: 100%;
        height: 100%;
        background-image: url(../../assets/img/login-bg.jpg);
        background-size: 100%;
    }

    .ms-title {
        width: 100%;
        line-height: 50px;
        text-align: center;
        font-size: 20px;
        /* color: #fff; */
        border-bottom: 1px solid #ddd;
    }

    .icon-div {
        display: flex;
        align-content: space-between;
        font-size: 12px;
        line-height: 30px;
        color: #ffffff;
    }

    .nee {
        word-spacing: 5px;
    }

    .ms-login {
        position: absolute;
        left: 50%;
        top: 50%;
        width: 350px;
        margin: -190px 0 0 -175px;
        border-radius: 5px;
        background: rgba(255, 255, 255, 0.3);
        overflow: hidden;
    }

    .ms-content {
        padding: 30px 30px;
    }

    .login-btn {
        text-align: center;
    }

    .login-btn button {
        width: 100%;
        height: 36px;
        margin-bottom: 10px;
    }

    .login-tips {
        font-size: 12px;
        line-height: 30px;
        color: #fff;
    }
</style>
