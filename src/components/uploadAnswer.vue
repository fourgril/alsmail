<template style="background-color: #DCE6EA;">
  <div id="contents" class="containers" >
    <el-row :gutter="20" style="margin-right: 1px">
      <el-col :span="22" style="margin-top: 20px">
        <div class="grid-content bg-purple" style="margin-left: 700px">
          <el-upload
          ref="uploadExcel"
          :action=url
          :limit=limitNum
          name="qa_file"
          :auto-upload="true" accept=".xlsx"
          :before-upload="beforeUploadFile"
          :on-change="fileChange"
          :on-exceed="exceedFile"
          :on-success="handleSuccess"
          :on-error="handleError"
          :file-list="fileList" :show-file-list="false" :on-progress="fileProgress">
         <button><i class="el-icon-upload2 ">Upload</i></button>
        </el-upload>
        </div>
      </el-col>
      <el-col :span="1" style="margin-top: 20px">
        <div class="grid-content bg-purple-light" >
          <button><i class="el-icon-circle-plus-outline"  @click="addInfoDialog">Add</i></button>
      </div>
      </el-col>
    </el-row>
    <el-table :data="trainDate.slice((currentPageTrain-1)*pageSizeTrain,currentPageTrain*pageSizeTrain)"  stripe border  style="border:1px solid #d4d4d4;border-radius: 10px;margin-top:10px"  :header-cell-style="{background:'#F5EDE6'}"
               tooltip-effect="light" type="index" >
      <el-table-column prop="id" label="id" v-if="isShowId"></el-table-column>
      <el-table-column prop="question" label="Question"  :show-overflow-tooltip="true">
        <template slot-scope="scope" >
         <span v-if="!editFlag[scope.$index]">{{scope.row.question}}</span>
          <el-input v-if="editFlag[scope.$index]" v-model="scope.row.question"  class="edit-cell"></el-input>
        </template>
      </el-table-column>

      <el-table-column prop="answer" label="Answer"   :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span v-if="!editFlag[scope.$index]">{{scope.row.answer}}</span>
          <el-input v-if="editFlag[scope.$index]" v-model="scope.row.answer"  class="edit-cell"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="upt_date_time" label="Update Date"  :show-overflow-tooltip="true"></el-table-column>
      <el-table-column label="Operation" width="150">
        <template slot-scope="scope" >
          <i class="el-icon-edit-outline" v-if="!editFlag[scope.$index]" @click="editInfo(scope.$index, scope.row)"></i>
          &nbsp
          <i class="el-icon-setting" v-if="editFlag[scope.$index]" @click="saveInfo(scope.$index, scope.row)"></i>
          <i class="el-icon-delete"  @click="deleteInfo(scope.$index, scope.row)"></i>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background @size-change="handleSizeChangeTrain"
                   @current-change="handleCurrentChangeTrain"
                   :current-page="currentPageTrain"
                   :page-sizes="[10, 50, 100, 200]"
                   :page-size="pageSizeTrain"
                   layout="total, sizes, prev, pager, next, jumper"
                   :total="totalTrain" style="margin-top: 8px">
    </el-pagination>


  <el-dialog title="Add question and answer" :visible.sync="dialogAddVisible"  >
    <el-form  ref="form"  :rules="rules" :model="form" label-width="80px" style="margin-top: 20px;">
      <el-form-item label="Question:" prop="question" style="margin-bottom: 22px">
        <el-input type="textarea" v-model="form.question"></el-input>
      </el-form-item>
      <el-form-item label="Answer:" prop="answer" style="margin-bottom: 22px">
        <el-input type="textarea"  :autosize="{ minRows: 3, maxRows: 5}"  width="300px" v-model="form.answer"></el-input>
      </el-form-item>
      <el-form-item style="margin-bottom: 22px">
        <el-button type="primary" style="margin-left: 483px" @click="addInfo('form')" >OK</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>

  </div>
</template>

<script>



  export default {
    name: 'upload',
    data() {
      const validateQuestion= (rule, value, callback) => {
        if (this.form.question == null || this.form.question  == "") {
          callback(new Error('Question can not be empty.'))
        } else {
          callback()
        }
      }
      const validateAnswer= (rule, value, callback) => {
        if (value == null || value == "") {
          callback(new Error('Answer can not be empty.'))
        } else {
          callback()
        }
      }
      return {
        videoFlag:false,
        videoUploadPercent:0,
        url:"/als/qas",
        formLabelWidth: '109px',
        limitNum: 1,
        fileList: [],
        trainDate:[],
        pageSizeTrain: 10,
        currentPageTrain:1,
        totalTrain:0,
        dialogAddVisible:false,
        isShowId:false,
        question:"",
        answer:"",
        form: {
          question:'',
          answer: ''
        },
        rules:{
          question:[{require:true,trigger:'blur',validator:validateQuestion}],
          answer:[ {require:true,trigger:'blur',validator:validateAnswer}]

        },
        isUpload:true,
        questionEdit:"",
        editFlag:[],
        loading:null,
      }
    },
    mounted: function () {
      console.log(this.axios.defaults.baseURL+"api request");
      this.queryTrainInfo();
    },
    methods: {
      // 文件超出个数限制时的钩子
      exceedFile(files, fileList) {
        this.$notify.warning({
          title: 'Warning',
          message: `Only selected ${this.limitNum} file, currently selected ${files.length + fileList.length} file`
        });
      },
      fileChange(file, fileList) {
        console.log('change')
        console.log(file)
        this.form.file = file.raw
        console.log(this.form.file)
        console.log(fileList)
      },
      // 上传文件之前的钩子, 参数为上传的文件,若返回 false 或者返回 Promise 且被 reject，则停止上传
      beforeUploadFile(file) {
        console.log('before upload')
        console.log(file)
        let extension = file.name.substring(file.name.lastIndexOf('.')+1)
        //let size = file.size / 1024 / 1024
        if(extension !== 'xlsx') {
          this.$notify.warning({
            title: 'warning',
            message: 'Files that can upload only suffix is.Xlsx'
          });
        }
        // if(size > 10) {
        //   this.$notify.warning({
        //     title: '警告',
        //     message: `文件大小不得超过10M`
        //   });
        // }
      },
      fileProgress(){//文件上传时打开loading
        this.loading  = this.$loading({
          lock: true,
          text: 'Uploading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
      },
      // 文件上传成功时的钩子
      handleSuccess(res, file, fileList) {
        this.$notify.success({
          title: 'success',
          message: 'Successful file upload'
        });
        this.loading.close();
        this.queryTrainInfo();
      },
      // 文件上传失败时的钩子
      handleError(err, file, fileList) {
        console.log(err+"error")
        this.$notify.error({
          title: 'error',
          message: 'File upload failed'
        });
      },

      queryTrainInfo(){
        let self = this;
        this.axios.get("/als/qa")
          .then(function (response) {
             self.trainDate = response.data;
             console.log(self.trainDate+"trainDate  query");
             self.totalTrain = response.data.length;
          })
          .catch(function (error) {
            console.log(error);
          });
      },
      handleSizeChangeTrain(val){
        this.pageSizeTrain= val;;
      },
      handleCurrentChangeTrain(val){
        this.currentPageTrain = val;
      },
      addInfoDialog(){
        this.dialogAddVisible = true;
        console.log("打開添加頁面：");
      },
      addInfo(form){
        this.$refs[form].validate((valid) => {
          if (valid) {
            console.log('Add Success');
            console.log("question:"+this.form.question + "answer:"+this.form.answer);
            console.log("/als/mail");
            let self = this;
            this.axios.post("/als/qa", {
              "question": this.form.question,
              "answer":this.form.answer
            })
              .then(function (response) {
                self.$notify.success('Adding success!');
                console.log(response);
                self.form.question ="";
                self.form.answer ="";
                self.dialogAddVisible = false;
                self.queryTrainInfo();
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
      editInfo(index, row){
        this.editFlag[index] = true;
        this.$set(this.editFlag,row,true)
      },
      saveInfo(index, row){
        this.selectionInfo = row;
        console.log(this.selectionInfo+"info");
        let self = this;
        this.axios.put("/als/qa", {
            "id":this.selectionInfo.id,
            "question": this.selectionInfo.question,
            "answer":this.selectionInfo.answer
          })
            .then(function (response) {
              self.$notify.success('Editing success!');
              console.log(response);
              self.editFlag[index] = false;
              self.queryTrainInfo();
            })
            .catch(function (error) {
              //self.$notify.error(error.response.data.message);
             // console.log(error.response.data.message);
            });
      },
      deleteInfo(index, row){
        console.log(row+"info");
        let self = this;
        this.axios.delete("/als/qa?id="+row.id)
          .then(function (response) {
            self.$notify.success('Delete success!');
            console.log(response);
            self.queryTrainInfo();
          })
          .catch(function (error) {
            self.$notify.error(error.response.data.message);
            console.log(error.response.data.message);
          });
      }

    }
  }

</script>
<style rel="stylesheet/scss" lang="css" scoped>
#contents {
  width: 900px;
  height:674px;
}
.containers{
  padding-right: 28px;
  padding-left: 28px;
  margin-right: auto;
  margin-left: 193px;
  background-color: #b0b8bb;
  border-top-right-radius: 18px;
  border-bottom-right-radius: 18px;
}
</style>
<style>
  .el-upload__tip{
    font-size: 12px;
    color: #FFF;
    margin-top: 7px;
    width: 222px;
    margin-left: 12px;
  }
  .el-upload-list {
    width: 300px;
  }
  .el-pagination__jump {
    margin-left: 215px;
  }
  .el-tooltip__popper.is-light {
    min-width: 50px;
    max-width: 500px;
    word-break: break-word;
  }

</style>
