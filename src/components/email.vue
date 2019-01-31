<template >
  <div id="content" class="container" >
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="Adding" name="first"></el-tab-pane>
        <el-tab-pane label="New" name="second"></el-tab-pane>
        <el-tab-pane label="Confirmed" name="third"></el-tab-pane>
        <el-tab-pane label="History" name="four"></el-tab-pane>
      </el-tabs>

    <!--添加页面-->
    <div id="tab_content_add" v-show="switchFlag =='Adding'">
      <el-form ref="ruleForm"  :rules="rules" :model="ruleForm" label-width="80px" class="demo-ruleForm" style="margin-top: 20px">
        <el-form-item label="SR#:" prop="srNum" style="color: #FFF;margin-bottom: 22px">
           <el-input placeholder="Please enter a SR#." v-model="ruleForm.srNum" maxlength="30" clearable></el-input>
        </el-form-item>
        <el-form-item label="Question:" prop="question" style="margin-bottom: 22px">
          <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 3}" maxlength="256" placeholder="Please enter a question." v-model="ruleForm.question"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addInfo('ruleForm')" style="margin-left: 696px;">Add</el-button>
        </el-form-item>
      </el-form>
      <br/>
    </div>

    <!--确认页面-->
    <div id="tab_content_confirm" v-show="switchFlag == 'Confirmed'">
      <el-table :data="tableDataConfirm.slice((currentPageConfirm-1)*pageSizeConfirm,currentPageConfirm*pageSizeConfirm)" stripe border style="width: 100%;border:1px solid #d4d4d4;border-radius: 10px" :header-cell-style="{background:'#F5EDE6'}"  tooltip-effect="light">
        <el-table-column prop="sr_num" label="SR#" :show-overflow-tooltip="true" width="border-bottom: 1px solid #17a2b8; border-right: 1px solid #ebeef5;"></el-table-column>
        <el-table-column prop="question" label="Question" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="progress" label="Progress" ></el-table-column>
        <el-table-column prop="upt_date_time" label="Update Date" ></el-table-column>
        <el-table-column label="Operation">
          <template slot-scope="scope">
            <el-button  size="mini" type="text" @click="detailInfo(scope.$index, scope.row)">Detail</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination background
                     @size-change="handleSizeChangeConfirm"
                     @current-change="handleCurrentChangeConfirm"
                     :current-page="currentPageConfirm"
                     :page-sizes="[10, 50, 100, 200]"
                     :page-size="pageSizeConfirm"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="totalConfirm" style="margin-top: 8px">
      </el-pagination>
    </div>
    <!--New页面-->
    <div id="tab_content_new" v-show="switchFlag == 'New'">
      <el-table :data="tableDataNew.slice((currentPage-1)*pageSize,currentPage*pageSize)"  stripe border  style="border:1px solid #d4d4d4;border-radius: 10px"  :header-cell-style="{background:'#F5EDE6'}"  tooltip-effect="light">
        <el-table-column prop="sr_num" label="SR#"    :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="question" label="Question"  :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="progress" label="Progress"   :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="crt_date_time" label="Create Date"  :show-overflow-tooltip="true"></el-table-column>

        <el-table-column label="Operation" width="150">
          <template slot-scope="scope" >
            <el-button size="mini" type="text" @click="confirmTableDate(scope.$index, scope.row)">Confirm</el-button>
            <el-button size="mini" type="text" @click="handleDelete(scope.$index, scope.row)">Ignore</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination background
                     @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="currentPage"
                     :page-sizes="[10, 50, 100, 200]"
                     :page-size="pageSize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total"   style="margin-top: 8px">
      </el-pagination>
    </div>

    <!--关闭页面-->
    <div id="tab_content_close" v-show="switchFlag =='History'">
      <el-table :data="tableDataClose.slice((currentPageClosed-1)*pageSizeClosed,currentPageClosed*pageSizeClosed)" stripe  border style="width: 100%;border:1px solid #d4d4d4;border-radius: 10px" :header-cell-style="{background:'#F5EDE6'}"  tooltip-effect="light">
        <el-table-column prop="sr_num" label="SR#" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="question" label="Question" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="answer.answer" :show-overflow-tooltip="true" label="Answer" ></el-table-column>
        <el-table-column prop="progress" label="Progress"   ></el-table-column>
        <el-table-column prop="crt_date_time" label="Create Date" ></el-table-column>
      </el-table>
      <el-pagination background
                     @size-change="handleSizeChangeClose"
                     @current-change="handleCurrentChangeClose"
                     :current-page="currentPageClosed"
                     :page-sizes="[10, 50, 100, 200]"
                     :page-size="pageSizeClosed"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="totalClosed" style="margin-top: 8px">
      </el-pagination>
    </div>

    <!--confirm按钮弹出框-->
    <el-dialog title="Answer confirmation information" :visible.sync="dialogTableVisible" @close='closeDialogConfirm'>
        <!--<div  style="text-align: left" width="400px">-->
          <!--<label>SR#:</label>-->
          <!--<span>{{srNum}}</span>-->
        <!--</div>-->
        <!--<div  style="text-align: left" width="400px" class="demo-input-suffix">-->
          <!--<label>Question:</label>-->
          <!--<el-input type="textarea" v-model="question" readonly="true" :autosize="{ minRows: 1, maxRows: 3}"></el-input>-->
        <!--</div>-->
      <el-form ref="form"  label-width="80px">
        <el-form-item label="SR#:">
          <!--<label style="margin:23px 23px 23x 10px;margin-bottom: 22px;text-align: right; float: left;font-size: 14px;color: #606266; line-height: 40px;margin-left: 80px;">SR#:</label>-->
         <span style="display:block; width: 420px; text-align:left;margin-left: 14px" @click="selectOriMail"><a style="text-decoration: none; border-bottom: 1px solid #409EFF;">{{srNum}}</a></span>
        </el-form-item>
        <el-form-item label="Question:">
         <!--<label style="margin-left: -18px">Question:</label>-->
         <el-input type="textarea"   :readonly="true"  v-model="question" :autosize="{ minRows: 2, maxRows: 4}"></el-input>
        </el-form-item>
     </el-form>
       <br/>
       <el-table :data="similar_qa" stripe border  max-height="500" style="border:1px solid #d4d4d4;border-radius: 10px" :header-cell-style="{background:'#F5EDE6'}" tooltip-effect="light" @cell-click="onRowClick">
         <el-table-column width="55px">
            <template slot-scope="scope">
             <el-radio  :label="scope.$index" v-model="radio" @change.native="getTemplateRow(scope.$index,scope.row)">&nbsp</el-radio>
            </template>
         </el-table-column>
         <el-table-column property="id" label="id" v-if="show"></el-table-column>
         <el-table-column property="similarity" label="Similarity" width="150"></el-table-column>
         <el-table-column property="question" label="Question" width="200" :show-overflow-tooltip="true"></el-table-column>
         <el-table-column property="answer" label="Answer" :show-overflow-tooltip="true"></el-table-column>
       </el-table>
       <div style="margin-top: 10px">
         <el-form ref="form"  label-width="80px">
         <el-form-item label="Status:">
           <el-select v-model="statusValue" placeholder="Please select" style="width:280px;margin-right: 250px;">
             <el-option
               v-for="status in statuses"
               :key="status"
               :label="status"
               :value="status" >
             </el-option>
           </el-select>
         </el-form-item>
         <el-form-item label="Reason:">
           <el-select v-model="reasonValue" placeholder="Please select" style="width: 280px;margin-right: 250px;">
             <el-option
               v-for="reason in reasons"
               :key="reason"
               :label="reason"
               :value="reason" >
             </el-option>
           </el-select>
         </el-form-item>
         </el-form>
       </div>

       <div id="editAnswer" style="margin-top: 10px;width:450px;margin-left: -162px">
         <el-checkbox v-model="checked" label="No matching"  @change="chooseCheck" ></el-checkbox>
       </div>
       <div v-show="isShowEdit" >
          <label id="answerInput" style="margin-right: 20px">Answer:</label>
          <el-input  type="textarea" style="width:400px" v-model="editAnswer" ></el-input>
          <el-button type="primary" @click="addEditAnswers" :disabled="isDisabled">Study</el-button>
       </div>
       <br/>
       <el-button type="primary" @click="onSubmitConfirm" style="margin-left: 471px;" >Confirm</el-button>
     </el-dialog>

    <!--detail按钮弹出框-->
     <el-dialog title="Details of the answer" :visible.sync="dialogConfirmVisible" @keyup.enter.native="keyUpMessage" >
       <el-form  ref="form"  label-width="80px" style="margin-top: 20px;">
         <el-form-item label="SR#:" style="margin-bottom: 22px">
           <el-input type="textarea" :readonly="true" v-model="srNum"></el-input>
         </el-form-item>
         <el-form-item label="Question:" style="margin-bottom: 22px">
           <el-input type="textarea" :readonly="true" :autosize="{ minRows: 2, maxRows: 4}" v-model="userQuestion"></el-input>
         </el-form-item>
         <el-form-item label="Answer:" style="margin-bottom: 22px">
           <el-input type="textarea" :readonly="true"  :autosize="{ minRows: 3, maxRows: 5}" v-model="userAnswer" width="300px"></el-input>
         </el-form-item>
         <el-form-item>
           <el-button type="primary" @click="onSubmitOk" style="margin-left: 483px">OK</el-button>
         </el-form-item>
       </el-form>
    </el-dialog>
    <!--dialog comfrom 列表弹出框 -->
    <el-dialog title="" :visible.sync="dialogAnswerVisible" :show-close="false">
       <el-form  ref="form"  label-width="80px" style="margin-top: -22px;">
         <el-form-item label="Answer:">
           <el-input type="textarea" :readonly="true" :autosize="{ minRows: 3, maxRows: 5}" v-model="showAnswer"></el-input>
         </el-form-item>
       </el-form>
    </el-dialog>
    <!--dialog SR#选中弹出ori_mail框 -->
    <el-dialog title="" :visible.sync="dialogOriMailVisible" :show-close="false">
      <el-form  ref="form"  label-width="80px" style="margin-top: -22px;">
        <el-form-item label="Ori Mail:">
          <el-input type="textarea" :readonly="true" :autosize="{ minRows: 3, maxRows: 5}" v-model="showOriMail"></el-input>
        </el-form-item>
        <el-form-item label="">
          <a  style="margin-right:482px" href="javascript:void(0)" @click="downloadAttachments">{{attachName}}</a>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import global from './global'
  export default {
    inject:['reload'],
    name: 'email',
    data() {
      const validateSRNum= (rule, value, callback) => {
        if (this.ruleForm.srNum == null || this.ruleForm.srNum == "") {
          callback(new Error('SR# can not be empty.'))
        } else {
          callback()
        }
      }
      const validateQuestion= (rule, value, callback) => {
        if (value == null || value == "") {
          callback(new Error('Question can not be empty.'))
        } else {
          callback()
        }
      }

      return {
        dialogOriMailVisible:false,
        parameterDate:{},
        dialogAnswerVisible:false,
        isDisabled:true,
        globalProgress:global.progress,
        editAnswer:"",
        pageSize: 10,
        pageSizeConfirm:10,
        pageSizeClosed: 10,
        total: 0,
        totalConfirm:0,
        totalClosed:0,
        currentPage: 1,
        currentPageConfirm:1,
        currentPageClosed:1,
        show:false,
        userQuestion:"",
        userAnswer:"",
        checked:false,
        activeName:"first",
        srNum:'',
        question:'',
        arr:[],
        isShow:false,
        radio:0,
        similar_qa: [],
        tableDataNew:[],
        tableDataConfirm:[],
        tableDataClose:[],
        dialogTableVisible: false,
        dialogConfirmVisible:false,
        templateSelection:"",
        confirmSelection:"",
        switchFlag:"Adding",
        isShowEdit:false,
        ruleForm: {//存放数据的对象
          srNum: '',//SRNumber
          question:''//问题
        },
        rules:{
          srNum:[ {require:true,trigger:'blur',validator:validateSRNum}],
          question:[{require:true,trigger:'blur',validator:validateQuestion}]
        },
        timerConfirm:null,
        statuses: [],
        reasons:[],
        statusValue:"",//初始化状态字段
        reasonValue:"",//初始化理由字段
        showAnswer:"",
        showOriMail:"",
        attachName:""

      }
    },
    mounted: function () {

    },
    watch:{
        editAnswer(newval,oldval){
          if(newval==""){
            this.isDisabled = true;
          }else{
            if(newval != oldval){
              this.isDisabled = false;
            }else{
              this.isDisabled = true;
            }
          }

        }
    },
    methods: {
      setTimerConfirm:function(){
        this.timerConfirm =setInterval(()=>{
          this.queryConfirmInfo();
        },30000)
      },
      detailInfo(index, row){//選中一條detail事件
        this.dialogConfirmVisible = true;
        console.log("选中一行的详细信息："+index+row);
        this.confirmSelection = row;
        this.srNum=this.confirmSelection.sr_num;
        this.userQuestion=this.confirmSelection.question;
        this.userAnswer=this.confirmSelection.answer.answer;

      },
      onSubmitConfirm(){//答案Confirm事件
        console.log("id: "+this.id+" answer: "+this.answer+"radio:"+this.radio+" status:"+this.statusValue+" reason:"+this.reasonValue);
        if(this.radio ==="" && this.checked == false){//若是列表的未选中数据和勾选框未选中则弹出需勾选数据
          this.$notify.info({
            title: 'info',
            message: 'Please choose one answer.',
          });
          return ;
        }
        if(this.checked == true && this.editAnswer != "" ){
          this.parameterDate ={
            "id":"",
            "similarity":1,
            "question":this.question,
            "answer":this.editAnswer,
            "sr_num": this.srNum,
            "progress": "CONFIRMED",
            "status":this.statusValue,
            "reason":this.reasonValue
          }
        }else{
          this.parameterDate ={
            "id":this.id,
            "similarity":this.similarity,
            "question":this.question,
            "answer":this.answer,
            "sr_num": this.srNum,
            "progress": "CONFIRMED",
            "status":this.statusValue,
            "reason":this.reasonValue
          }
        }
        let self = this;
        this.axios.put("/als/mail/answer",this.parameterDate)
          .then(function (response) {
            console.log(response.data+"confirm");
            self.$notify({
              showClose: true,
              message: 'Congratulations,the answer has been confirmed.',
              type: 'success'
            });
            self.queryAddInfo.bind(this)();
            self.dialogTableVisible = false;
          })
          .catch(function (error) {
            self.$notify.error(error.response.data.message);
            console.log(error.response.data.message);
          });

      },
      keyUpMessage(){
        if(event.keyCode == 13) {
          this.onSubmitOk();
        }
      },
      onSubmitOk(){//答案OK事件
        console.log("id: "+this.id+" answer: "+this.answer);
        let self = this;
        this.axios.put("/als/mail/progress",{
          "sr_num": this.srNum,
          "progress": "CLOSED"
        })
          .then(function (response) {
            console.log(response.data+"detail");
            self.$notify({
              showClose: true,
              message: 'Congratulations,the answer is ok.',
              type: 'success'
            });
            self.queryConfirmInfo();
            self.dialogConfirmVisible = false;
          })
          .catch(function (error) {
            self.$notify.error(error.response.data.message);
            console.log(error.response.data.message);
          });

      },
      // handleEdit(index, row) {
      //   console.log(index, row);
      // },
      chooseCheck(val){
        this.radio="";
        this.checked =val;
        if(this.checked){
          this.isShowEdit = true;
          $("#editAnswer").css("margin-left","-156px");
          $("#answerInput").css("margin-left","-52px");
        }else{
          this.isShowEdit = false;
          $("#editAnswer").css("margin-left","-162px");
        }

      },
      handleClick(tab, event) {
        console.log(tab.$options.propsData.name);
         if(tab.$options.propsData.name =="first"){
           this.switchFlag = "Adding";
         }else if(tab.$options.propsData.name =="second"){
           this.ruleForm.srNum ="";
           this.ruleForm.question ="";
           this.switchFlag = "New";
           this.queryAddInfo.bind(this)();
           clearInterval(this.timerConfirm);
         }else if(tab.$options.propsData.name =="third"){
           this.switchFlag = "Confirmed";
           this.ruleForm.srNum ="";
           this.ruleForm.question ="";
           this.queryConfirmInfo();
           //定時涮新頁面Confirmed
           this.setTimerConfirm();

         }
         else{
           this.switchFlag = "History";
           this.ruleForm.srNum ="";
           this.ruleForm.question ="";
           this.queryClosedInfo();

           clearInterval(this.timerConfirm);


         }
      },
      addInfo(formName){//添加Adding信息
        this.$refs[formName].validate((valid) => {
            if (valid) {
              console.log('success submit!!');
              this.isShow = true;
              console.log("SRNumber:"+this.ruleForm.srNum + "question:"+this.ruleForm.question);
              console.log("/als/mail");
              let self = this;
              this.axios.post("/als/mail", {
                "sr_num": this.ruleForm.srNum,
                "question":this.ruleForm.question
              })
                .then(function (response) {
                  self.$notify.success('Adding success!');
                  console.log(response);
                  self.ruleForm.srNum ="";
                  self.ruleForm.question ="";
                })
                .catch(function (error) {
                  self.$notify.error(error.response.data.message);
                  console.log(error.response.data.message);
                });
            } else {
              console.log('error submit!!');
              return ;
            }
        });

      },
      getTemplateRow(index,row){ //获取选中数据
        this.templateSelection = row;
        this.id=this.templateSelection.id;
        this.similarity=this.templateSelection.similarity;
        this.answer=this.templateSelection.answer;
        console.log(this.templateSelection);
        this.checked = false;//为复选框未勾选
      },
      handleDelete:function(index,row){
        let self = this;
        console.log("index:"+row+"row:"+row);
        this.$confirm('This operation will ignore the added data. Do you want to continue?', 'Prompt', {
          confirmButtonText: 'Confirm',
          cancelButtonText: 'cancel',
          type: 'warning'
        }).then(() => {
          this.axios.delete("/als/mail?sr_num="+row.sr_num)
            .then(function (response) {
              console.log(response);
              self.$notify.success('Ignore success!');
              self.queryAddInfo.bind(this)();

            })
            .catch(function (error) {
              self.$notify.error(error.response.data.message);
              console.log(error.response.data.message);
            });

        }).catch(() => {
          this.$notify({
            type: 'info',
            message: 'Have been cancelled'
          });
        });
      },
      addEditAnswers(){ //添加用户自己的输入的答案
        let self = this;
        this.axios.put("/als/mail/similar_qa",{
          "sr_num": this.srNum,
          "question":this.question,
          "answer": this.editAnswer
          })
          .then(function (response) {
            self.similar_qa = response.data;
            console.log(response.data+"111confirm");
            self.$notify({
              showClose: true,
              message: 'Congratulations, the answer has been added successfully.',
              type: 'success'
            });
            self.editAnswer = "";//添加答案成功后清空輸入框内容
            self.radio=0;//添加OK后選中表格第一條數據
            self.isDisabled =true;
            self.checked = false;//成功之后不勾选
            self.isShowEdit = false;//影藏编辑框
            console.log("this.radio"+this.radio +" this.isDisabled"+this.isDisabled+" this.checked "+this.checked);
          })
          .catch(function (error) {
           self.$notify.error(error.response.data.message);
           console.log(error.response.data.message);
          });
      },
      confirmTableDate(index,row){
        this.dialogTableVisible = true
        this.srNum = row.sr_num;
        this.question = row.question;
        this.similar_qa =row.similar_qa;
        this.id =row.id;
        this.getTemplateRow(0,this.similar_qa[0]);

        //查询status和reason的下拉列表框的数据
        this.queryStatusAndReason();
        this.statusValue ="New";
        this.reasonValue ="Training approvals";
        this.radio=0;
        this.showOriMail = row.ori_mail;
        this.attachName  = row.attach_name;

      },
      queryAddInfo:function () {
        //初始化NEW页面数据

        this.axios.defaults.auth = {
          username: localStorage.token
        };
        let self = this;
        self.axios.get("/als/mail?progress="+this.globalProgress.NEW)
          .then(function (response) {
            self.tableDataNew = response.data;
            console.log(response.data+"111new");
            self.total = response.data.length;
          })
          .catch(function (error) {
            console.log(error.response.data.message);
          });
      },
      queryConfirmInfo(){//查詢
        this.axios.defaults.auth = {
          username: localStorage.token
        };
        let self = this;
        this.axios.get("/als/mail?progress="+this.globalProgress.CONFIRM)
          .then(function (response) {
            self.tableDataConfirm = response.data;
            console.log(response.data+"111confirm");
            self.totalConfirm = response.data.length;
          })
          .catch(function (error) {
            console.log(error);
          });
      },
      queryClosedInfo(){//查詢關閉的數據
        this.axios.defaults.auth = {
          username: localStorage.token
        };
        let self = this;
        this.axios.get("/als/mail?progress="+this.globalProgress.CLOSED)
          .then(function (response) {
            self.tableDataClose = response.data;
            console.log(self.tableDataClose+"111close");
            self.totalClosed = response.data.length;
          })
          .catch(function (error) {
            console.log(error);
          });
      },
      handleSizeChange(val){
        this.pageSize = val;;
      },
      handleCurrentChange(val){
        this.currentPage = val;
      },
      handleSizeChangeConfirm(val){
        this.pageSizeConfirm = val;;
      },
      handleCurrentChangeConfirm(val){
        this.currentPageConfirm = val;
      },
      handleSizeChangeClose(val){
        this.pageSizeClosed= val;;
      },
      handleCurrentChangeClose(val){
        this.currentPageClosed = val;
      },
      closeDialogConfirm(){//在關閉彈出框前清空數據
        this.checked =false;
        this.isShowEdit = false;
        this.editAnswer ="";
      },
      queryStatusAndReason:function () {
        //初始化弹窗Status和Resaon的字段下拉列表数据
        let self = this;
        self.axios.get("/als/combo_data")
          .then(function (response) {
            self.reasons = response.data.reasons;
            self.statuses = response.data.statuses
            console.log(response.data.reasons+"queryStatusAndReason");
          })
          .catch(function (error) {
            console.log(error.response.data.message);
          });
      },
      onRowClick (row, event, column) {
        console.log("row"+row+"column:"+column);
        if(column.cellIndex == 3){
          this.dialogAnswerVisible =true;
          this.showAnswer=row.answer;
        }
      },
      selectOriMail(){
        console.log("44444");
        this.dialogOriMailVisible = true;
      },
      downloadAttachments(){
        let self = this;
        self.axios({
          method:'get',
          url:"/rpa/mail/attach/"+self.srNum,
          responseType:'blob',
          headers: {
            'Content-Type': 'application/json;charset=UTF-8'
          }
        })
          .then(function (response) {
            console.log(response.data +"下载附件");
            if (!response) {
              return
            }
            let url = window.URL.createObjectURL(new Blob([response.data]))
            let link = document.createElement('a')
            link.style.display = 'none'
            link.href = url
            link.setAttribute('download', 'Original Message.eml')
            document.body.appendChild(link)
            link.click()
          })

      }
    }
  }


</script>
<style rel="stylesheet/scss" lang="css" scoped>
  @import "../styles/email.css";
</style>
<style>
  .el-dialog {
    border-radius: 15px;
  }
  .el-tooltip__popper.is-light {
    min-width: 50px;
    max-width: 500px;
    word-break: break-word;
  }
  .el-form-item__label2 {
    text-align: right;
    float: left;
    font-size: 14px;
    color: #606266;
    line-height: 40px;
    padding: 0 12px 0 0;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }
  .el-form-item {
    margin-bottom: 4px;
  }
  .el-select-dropdown__item {
    width: 248px;
    text-align: left;
  }
</style>
