<template>
  <div id="login">
    <img src="../assets/login.jpg" alt="" :style="bg">
    <div id="divForm" style="padding-top:60px;margin-left: 45px">
    <el-form class="form" ref="ruleForm"  :rules="rules" :model="ruleForm"  >
      <el-form-item >
        <span><font color="black" size="3">Login Page</font></span>
      </el-form-item>
      <el-form-item  prop="username" >

        <el-input type="text"  placeholder="Username"  style="width: 227px" v-model="ruleForm.username">
          <template slot="prepend"><i class="el-icon-third-yonghu4"></i></template>
        </el-input>
      </el-form-item>
      <el-form-item  prop="password">
        <el-input  type="password"  placeholder="Password"  style="width: 227px"  v-model="ruleForm.password">
          <template slot="prepend"><i class="el-icon-third-password"></i></template>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button  style="width: 224px" type="primary" @click="handleSubmit('ruleForm')">Login</el-button>
      </el-form-item>
    </el-form>
    </div>

  </div>
</template>

<script>

  export default {
    name: 'login',
    data () {
      return {
        ruleForm: {
          username: "",
          password: ""
        },
        rules: {
          username: [
            { required: true, message: 'Please enter your username.', trigger: 'blur' }
          ],
          password: [
            { required: true, message: 'Please fill in the password.', trigger: 'blur' },
            { type: 'string', min: 6, message: 'Password length cannot be less than 6 digits.', trigger: 'blur' }
          ]
        },
        bg: {
          width: `${window.innerWidth}px`,
          height: `${window.innerHeight}px`,
          position: "absolute",
        }
      }
    },
    methods: {
      handleSubmit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {

            this.axios.defaults.auth = {
              username: this.ruleForm.username,
              password: this.ruleForm.password,
            }

            this.axios.get("/als/login").then(response => {
              this.$notify.success("Login success!");
              let data = response.data;
              this.$store.commit('set_token', data);
              this.$router.push('/email');
              console.log(response);
            }).catch(error => {
              this.$notify.error(error.message);
              console.log(error.message);
            })
          } else {
            this.$notify.error('Form validation failed!');
          }
        })
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #login{
    text-align: left;
    margin-top: -192px;
    box-shadow: 0 0 black;
  }
  .bg {
    position: absolute;
  }
  .form{
    margin-top: 150px;
    margin-left: 510px;
    text-align: center;
    border: 1px solid #dddee1;
    border-color: #e9eaec;
    width:280px;
    background: #fff;
    border-radius: 4px;
    position: relative;
  }

</style>
<style>
  .el-form-item__error{
    margin-left: 27px;
  }
</style>
