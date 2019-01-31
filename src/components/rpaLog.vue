<template style="background-color: #DCE6EA;">
  <div id="contents" class="contents"  >
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="Emphasis" name="first"></el-tab-pane>
      <el-tab-pane label="Details" name="second"></el-tab-pane>
    </el-tabs>
    <div id="tab_content" v-show="switchFlag =='Emphasis'">
      <el-row :gutter="20" style="margin-right: 1px;margin-bottom: 46px"></el-row>
      <el-table :data="rpaDate.slice((currentPageTrain-1)*pageSizeTrain,currentPageTrain*pageSizeTrain)"   border  style="border:1px solid #d4d4d4;border-radius: 10px;margin-top:10px;"  :header-cell-style="{background:'#F5EDE6'}"
                 tooltip-effect="light" type="index" :row-class-name="tableRowClassName" >
        <el-table-column prop="id" label="id" v-if="isShowId"></el-table-column>
        <el-table-column prop="rpa_name" label="RPA Name"  ></el-table-column>
        <el-table-column prop="comments" label="Comments"  :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="err_level" label="Error Level" :filters="[{text: 'DEBUG', value: 'DEBUG'},
         {text: 'WARN', value: 'WARN'},{text: 'ERROR', value: 'ERROR'}]" :filter-method="filterHandler"></el-table-column>
        <el-table-column prop="crt_date_time" label="Create Date"  :show-overflow-tooltip="true"></el-table-column>
      </el-table>
      <el-pagination background @size-change="handleSizeChangeTrain"
                     @current-change="handleCurrentChangeTrain"
                     :current-page="currentPageTrain"
                     :page-sizes="[10, 50, 100, 200]"
                     :page-size="pageSizeTrain"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="totalTrain" style="margin-top: 8px">
      </el-pagination>
    </div>
    <div id="tab_log" v-show="switchFlag =='Details'">
      <el-form ref="form"  label-width="80px">
        <el-form-item label="File Name:">
          <el-select v-model="fileNameValue" placeholder="Please select" style="width: 280px;margin-right: 438px;" @change="currentSel">
            <el-option v-for="item in fileDate" :key="item" :label="item" :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="margin-left: 22px;" v-if="isShow">
          <el-input type="textarea" :readonly="true" :rows="25" v-model="content" ></el-input>
        </el-form-item>
      </el-form>
    </div>
  </div>

</template>

<script>



  export default {
    name: 'rpaLog',
    data() {

      return {
        rpaDate:[],
        pageSizeTrain: 10,
        currentPageTrain:1,
        totalTrain:0,
        dialogAddVisible:false,
        isShowId:false,
        switchFlag:"Emphasis",
        activeName:"first",
        fileDate:[],
        fileNameValue:"",
        content:"",
        isShow:false
      }
    },
    mounted: function () {
      console.log("RPALOG rquest");
      this.queryRPALogInfo();
    },
    methods: {
      queryRPALogInfo(){
        let self = this;
        this.axios.get("rpa/log/list?level=")
          .then(function (response) {
             self.rpaDate = response.data;
             console.log(self.rpaDate+"rpaDate  query");
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
      tableRowClassName({row, rowIndex}) {
        if (row.err_level.toLowerCase() === "error") {
          return 'error-row';
        } else if (row.err_level.toLowerCase() === "warn") {
          return 'warning-row';
        }else{
          return 'debug-row';
        }
        return '';
      },
      filterHandler(value, row, column) {
        const property = column['property'];
        return row[property] === value;
      },
      handleClick(tab){
        if(tab.$options.propsData.name =="first"){
          this.switchFlag = "Emphasis";
          this.queryRPALogInfo();
        }else if(tab.$options.propsData.name =="second"){
          this.switchFlag = "Details";
          this.queryFileName();
        }
      },
      queryFileName:function () {
        //初始化fileName的字段下拉列表数据
        let self = this;
        self.axios.get("/rpa/logs/files")
          .then(function (response) {
            self.fileDate = response.data;
            console.log(response.data+"queryFileName");
          })
          .catch(function (error) {
            console.log(error.response.data.message);
          });
      },
      currentSel(selVal){
        // this.selVal = selVal;
        // this.dialogVisible = true;
        console.log(selVal);
        //初始化fileName的字段下拉列表数据
        if(selVal){
          this.isShow =true;
        }
        let self = this;
        self.axios.get("/rpa/logs/details?file_name="+selVal)
          .then(function (response) {
            self.content = response.data;
            console.log(response.data+"log对应的内容");
          })
          .catch(function (error) {
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
.contents{
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
  .el-table .warning-row {
    background: #E6A23C;
  }
  .el-table .error-row {
    background: #F56C6C;
  }
  .el-table .debug-row{
    background: #909399;
  }
  .el-table__column-filter-trigger {
    display: inline-block;
    line-height: 5px !important;
    cursor: pointer;
    margin-left: 100px;
    border: 1px solid;
  }
  .el-table-filter {
    border: 1px solid #d4d4d4;
  }
  .el-select-dropdown__item {
    width: 248px;
    text-align: left;
  }
  .el-tooltip__popper.is-light {
    min-width: 50px;
    max-width: 500px;
    word-break: break-word;
  }

</style>
