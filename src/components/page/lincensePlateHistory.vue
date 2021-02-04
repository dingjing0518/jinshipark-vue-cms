<template>
  <div class="carManager">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 优惠券订单历史
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div style="margin-bottom:20px">
        <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>
       
          <el-date-picker
              v-model="valuetime"
              type="date"
              placeholder="选择日期">
          </el-date-picker>
       
          <el-date-picker
           style="margin:0px 10px 0px 10px"
              v-model="valuetimeA"
              type="date"
              placeholder="选择日期">
          </el-date-picker>
       

        <el-button type="primary" icon="el-icon-search" @click="search(1)">搜索</el-button>
      </div>
       
      <el-table
        :data="tableData"
        border
        class="table"
        ref="multipleTable"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="50" align="center" class-name="table"></el-table-column>
        <el-table-column type="index" width="50" align="center" label="序号" class-name="table"></el-table-column>
        <el-table-column prop="plate" label="车牌号" class-name="table"></el-table-column>
        <!-- 
        <el-table-column prop="jcoType" label="类型" class-name="table"></el-table-column>
        <el-table-column prop="jcoCarColor" label="颜色" class-name="table"></el-table-column>
        <el-table-column prop="jcoCarType" label="车类型" class-name="table"></el-table-column>-->
        <el-table-column prop="intime" label="进场时间" :formatter="dateFormatter" class-name="table"></el-table-column>
        <el-table-column prop="outtime" label="出场时间" :formatter="dateFormatterexpirationTime" class-name="table"></el-table-column>
        <el-table-column prop="parktime" label="停车时间" class-name="table"></el-table-column>
        <el-table-column prop="actualTime" label="实际支付时间" class-name="table"></el-table-column>
        <el-table-column prop="jcoParkingName" label="车场名称" class-name="table"></el-table-column>
        <el-table-column prop="jcoAreaName" label="区域名称"  class-name="table"></el-table-column>
         <el-table-column prop="orderid" label="订单号" class-name="table"></el-table-column>
        <el-table-column prop="createtime" label="创建时间" class-name="table"></el-table-column>
        <!-- 
        <el-table-column prop="jcoAgentName" label="代理商" class-name="table"></el-table-column>
        <el-table-column prop="jcoParkingName" label="停车场" class-name="table"></el-table-column>
        <el-table-column prop="jcoAreaName" label="区域名" class-name="table"></el-table-column>-->
        <!--
        <el-table-column prop="jcoCouponName" label="优惠券" class-name="table"></el-table-column>-->
        <!-- 
        <el-table-column label="操作" width="180" align="center" class-name="table">
          <template slot-scope="scope">
            <el-button
              type="text"
              icon="el-icon-edit"
              @click="handleEdit(scope.$index, scope.row)"
            >编辑</el-button>
            <el-button
              type="text"
              icon="el-icon-delete"
              class="red"
              @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>-->
      </el-table>
      <!-- 
      <div class="pagination">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="cur_page"
          :page-size="pagesize"
          :total="totalRecords"
          :page-sizes="[5, 10, 20, 40]"
          layout="total, sizes, prev, pager, next, jumper"
        ></el-pagination>
      </div>-->
    </div>
    <!-- 添加弹出框 -->
    <el-dialog title="添加" :visible.sync="addVisible" width="30%">
      <el-form ref="addForm" :model="addForm" :rules="carFormRules" label-width="100px">
        <el-form-item label="车牌号" prop="jcoPlate ">
          <el-input v-model="addForm.jcoPlate "></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="jcoType">
          <el-input v-model="addForm.jcoType"></el-input>
        </el-form-item>
        <el-form-item label="车颜色" prop="jcoCarColor">
          <el-input v-model="addForm.jcoCarColor"></el-input>
        </el-form-item>
         <!-- <el-form-item label="开始日期" prop="jcoInboundTime">
          <el-input v-model="addForm.jcoInboundTime"></el-input>
        </el-form-item>
         <el-form-item label="结束日期" prop="jcoDepartureTime">
          <el-input v-model="addForm.jcoDepartureTime"></el-input>
        </el-form-item> -->
          <el-form-item label="进场时间" prop="jcoInboundTime">
          <el-date-picker v-model="addForm.jcoInboundTime" type="datetime" placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="出场时间" prop="jcoDepartureTime">
          <el-date-picker v-model="addForm.jcoDepartureTime" type="datetime" placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="车类型" prop="jcoCarType">
          <el-input v-model="addForm.jcoCarType"></el-input>
        </el-form-item>
        <el-form-item label="代理人" prop="jcoOften">
          <el-input v-model="addForm.jcoOften"></el-input>
        </el-form-item>
        <el-form-item label="代理商" prop="jcoAgentName">
          <el-select v-model="addForm.jcoAgentName" placeholder="代理商">
            <el-option
              v-for="item in agent"
              :key="item.jcoAgentName"
              :label="item.jcoAgentName"
              :value="item.jcoAgentName"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="停车场" prop="jcoParkingName">
          <el-select v-model="addForm.jcoParkingName" placeholder="停车场">
            <el-option
              v-for="item in parking"
              :key="item.jcoParkingName"
              :label="item.jcoParkingName"
              :value="item.jcoParkingName"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="区域" prop="jcoAreaName">
          <el-select v-model="addForm.jcoAreaName" placeholder="区域">
            <el-option
              v-for="item in area"
              :key="item.jcoAreaName"
              :label="item.jcoAreaName"
              :value="item.jcoAreaName"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="优惠券" prop="jcoCouponName">
          <el-select v-model="addForm.jcoCouponName" placeholder="优惠券">
            <el-option
              v-for="item in coupon"
              :key="item.jcoCouponName"
              :label="item.jcoCouponName"
              :value="item.jcoCouponName"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveAdd">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改弹出框 -->
    <el-dialog title="修改用户权限" :visible.sync="editVisible" width="30%">
      <el-form ref="editForm" :model="editForm" label-width="100px">
        <el-form-item label="车牌号" prop="jcoPlate ">
          <el-input v-model="editForm.jcoPlate "></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="jcoType">
          <el-input v-model="editForm.jcoType"></el-input>
        </el-form-item>
        <el-form-item label="车颜色" prop="jcoCarColor">
          <el-input v-model="editForm.jcoCarColor"></el-input>
        </el-form-item>
         <!-- <el-form-item label="开始日期" prop="jcoInboundTime">
          <el-input v-model="editForm.jcoInboundTime"></el-input>
        </el-form-item>
         <el-form-item label="结束日期" prop="jcoDepartureTime">
          <el-input v-model="editForm.jcoDepartureTime"></el-input>
        </el-form-item> -->
         <el-form-item label="进场时间" prop="jcoInboundTime">
          <el-date-picker v-model="editForm.jcoInboundTime" type="datetime" placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="出场时间" prop="jcoDepartureTime">
          <el-date-picker v-model="editForm.jcoDepartureTime" type="datetime" placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="车类型" prop="jcoCarType">
          <el-input v-model="editForm.jcoCarType"></el-input>
        </el-form-item>
        <el-form-item label="代理人" prop="jcoOften">
          <el-input v-model="editForm.jcoOften"></el-input>
        </el-form-item>
        <el-form-item label="代理商" prop="jcoAgentName">
          <el-select v-model="editForm.jcoAgentName" placeholder="代理商">
            <el-option
              v-for="item in agent"
              :key="item.jcoAgentName"
              :label="item.jcoAgentName"
              :value="item.jcoAgentName"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="停车场" prop="jcoParkingName">
          <el-select v-model="editForm.jcoParkingName" placeholder="停车场">
            <el-option
              v-for="item in parking"
              :key="item.jcoParkingName"
              :label="item.jcoParkingName"
              :value="item.jcoParkingName"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="区域" prop="jcoAreaName">
          <el-select v-model="editForm.jcoAreaName" placeholder="区域">
            <el-option
              v-for="item in area"
              :key="item.jcoAreaName"
              :label="item.jcoAreaName"
              :value="item.jcoAreaName"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="优惠券" prop="jcoCouponName">
          <el-select v-model="editForm.jcoCouponName" placeholder="优惠券">
            <el-option
              v-for="item in coupon"
              :key="item.jcoCouponName"
              :label="item.jcoCouponName"
              :value="item.jcoCouponName"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveEdit">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加弹出框 结束-->
    <!-- 删除提示框 -->
    <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
      <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteRow">确 定</el-button>
      </span>
    </el-dialog>
     <el-pagination
        style="float:right"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="cur_page"
        :page-sizes="[50, 100, 150, 200]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalRecords">
    </el-pagination>
  </div>
</template>

<script>
// import { fetchData } from '../../api/index';
import Validator from "async-validator";
export default {
  name: "carManager",
  data() {
    return {
      coupon: [],
      agent: [],
      area: [],
      parking: [],
      valuetimeA:"",
      valuetime:"",
      tableData: [],
      cur_page: 1,
      pagesize: 50,
      totalRecords: 0,
      totalPages: 0,
      multipleSelection: [],
      select_cate: "",
      select_word: "",
      del_list: [],
      is_search: false,
      editVisible: false,
      addVisible: false,
      delVisible: false,
      numberer :0,
      addForm: {
        jcoId:'',
        jcoPlate: "",
        jcoOrderId: "",
        jcoType: "",
        jcoCarColor: "",
        jcoCarType: "",
        jcoInboundTime:'',
        jcoDepartureTime:'',
        jcoOften: "",
        jcoAgentName: "",
        jcoParkingName: "",
        jcoAreaName: "",
        jcoCouponName: ""
      },
      editForm: {
        jcoId:'',
        jcoPlate: "",
        jcoOrderId: "",
        jcoType: "",
        jcoCarColor: "",
        jcoInboundTime:'',
        jcoDepartureTime:'',
        jcoCarType: "",
        jcoOften: "",
        jcoAgentName: "",
        jcoParkingName: "",
        jcoAreaName: "",
        jcoCouponName: ""
      },
      options: [],
      value: "",
      carFormRules: {},
      idx: -1,
      id: -1
    };
  },
  created() {
    var data=new Date()
    this.valuetimeA=data
     this.valuetime=data
    this.getData();
    this.getAgent();
    this.getArea();
    this.getParking();
    this.getCoupon();
  },
  computed: {
    data() {
      return this.tableData.filter(d => {
        let is_del = false;
        for (let i = 0; i < this.del_list.length; i++) {
          if (d.name === this.del_list[i].name) {
            is_del = true;
            break;
          }
        }
        if (!is_del) {
          if (
            d.address.indexOf(this.select_cate) > -1 &&
            (d.name.indexOf(this.select_word) > -1 ||
              d.address.indexOf(this.select_word) > -1)
          ) {
            return d;
          }
        }
      });
    }
  },
  methods: {
    //搜索
    search(value) {
      
      var date = new Date(this.valuetime);
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        if (month < 10) {
            month = "0" + month;
        }
        if (day < 10) {
            day = "0" + day;
        }
      var nowDate = year + "-" + month + "-" + day;
      this.valuetime=nowDate

      var date = new Date(this.valuetimeA);
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        if (month < 10) {
            month = "0" + month;
        }
        if (day < 10) {
            day = "0" + day;
        }
      var nowDateA = year + "-" + month + "-" + day;
      this.valuetimeA=nowDateA


      this.numberer = 1;
      if (value == 1) {
        this.cur_page = 1;
      }
      this.is_search = true;
      var res = this;
      // 搜索
      this.$axios({
        url: this.GLOBAL._SERVER_API_ +"couponOrderHistoryManager/searchCouponOrderHistory",
        method: "post",
        data: {
          keyWord: res.select_word,
          pageNum: res.cur_page,
          pageSize: res.pagesize,
          startTime:res.valuetime, 
          endTime:res.valuetimeA,
          shopId : Number(localStorage.getItem("shopid"))
        }
      })
        .then(function(response) {
          if (response.data.status === 200) {
            console.log(response.data.data);
            for(var i=0;i<response.data.data.rows.length;i++){
              if(response.data.data.rows[i].createtime){
                var date = new Date(response.data.data.rows[i].createtime);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
                var Y = date.getFullYear() + '-';
                var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
                var D = date.getDate() + ' ';
                var h = date.getHours() + ':';
                var m = date.getMinutes() + ':';
                var s = date.getSeconds();
                response.data.data.rows[i].createtime= Y + M + D +" "+ h + m + s;
              }
            }
            res.tableData = response.data.data.rows;
            res.totalRecords = response.data.data.records; //总条数

          }
          
        })
        .catch(function(error) {
          res.$message.error("查询失败: " + error);
          console.log(error);
        });
        this.getParking()
      this.getArea()
        
    },


    dateChangebirthdayC(val) {
      console.log(val);
      this.addForm.couponStarttime = val;
       this.editForm.couponStarttime = val;
    },
    dateChangebirthdayD(val) {
      console.log(val);
      this.editForm.couponEndtime = val;
    },
    dateFormatterexpirationTime(row, column) {
      let datetime = row.outtime;
      if (datetime) {
        datetime = new Date(datetime);
        let y = datetime.getFullYear() + "-";
        let mon = datetime.getMonth() + 1 + "-";
        let d = datetime.getDate();
        var h = datetime.getHours() + ':';
        var m = datetime.getMinutes() + ':';
        var s = datetime.getSeconds();
        return y + mon + d+" "+h+m+s;
      }
      return "";
    },
    dateFormatter(row, column) {
      let datetime = row.intime;
      if (datetime) {
        datetime = new Date(datetime);
        let y = datetime.getFullYear() + "-";
        let mon = datetime.getMonth() + 1 + "-";
        let d = datetime.getDate();
         var h = datetime.getHours() + ':';
        var m = datetime.getMinutes() + ':';
        var s = datetime.getSeconds();
        return y + mon + d+" "+h+m+s;
      }
      return "";
    },
    //每页显示个数改变
    handleSizeChange(val) {
      if (this.numberer == 0) {
        this.pagesize = val;
        console.log(val);
        this.getData();
      } else {
        this.pagesize = val;
        this.search(1);
      }
    },
    // 分页导航
    handleCurrentChange(val) {
      if (this.numberer == 0) {
          this.cur_page = val;
          this.getData(1);
      } else {
        this.cur_page = val;
        this.search(2);
      }
    },
    // 获取数据
    getData() {
      this.numberer = 0;
      var res = this;
      var dataTime = new Date()
      console.log(dataTime)
      var Y = dataTime.getFullYear() + '-';
      var M = (dataTime.getMonth() + 1 < 10 ? '0' + (dataTime.getMonth() + 1) : dataTime.getMonth() + 1) + '-';
      var D = dataTime.getDate();
    
      var timeStart= Y + M + D;
      var timeEnd = Y + M + D;
      console.log(timeStart,timeEnd)
       this.$axios({
         url: this.GLOBAL._SERVER_API_ +"couponOrderHistoryManager/searchCouponOrderHistory",
        method: "post",
        data: {
          keyWord: res.select_word,
          pageNum: res.cur_page,
          pageSize: res.pagesize,
          startTime:timeStart, 
          endTime:timeEnd,
          shopId : Number(localStorage.getItem("shopid"))
        }
      })
        .then(function(response) {
          if (response.data.status == 200) {
            console.log(response.data.data);
            for(var i=0;i<response.data.data.rows.length;i++){
              if(response.data.data.rows[i].createtime){
                var date = new Date(response.data.data.rows[i].createtime);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
                var Y = date.getFullYear() + '-';
                var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
                var D = date.getDate() + ' ';
                var h = date.getHours() + ':';
                var m = date.getMinutes() + ':';
                var s = date.getSeconds();
                response.data.data.rows[i].createtime= Y + M + D +" "+ h + m + s;
              }
            }
            res.tableData = response.data.data.rows;
            res.totalRecords = response.data.data.records; //总条数
            
          }
          
        })
        .catch(function(error) {
          res.$message.error("查询失败: " + error);
          console.log(error);
        });
    },
    getAgent() {
      this.agent.length = 0;
      var res = this;
      this.$axios({
        url:
          "http://yun.jinshipark.com:81/JinshiCouponGenerate/selectAllAgent",
        method: "post",
        data: {}
      })
        .then(function(response) {
          for (var i = 0; i < response.data.agentNameData.length; i++) {
            res.agent.push({
              jcoAgentName: response.data.agentNameData[i].username
            });
          }
        })
        .catch(function(error) {
          res.$message.error("查询失败: " + error);
        });
    },
    getArea() {
      this.area.length = 0;
      var res = this;
      this.$axios({
        url:
          "http://yun.jinshipark.com:81/JinshiCouponGenerate/selectAreaNameAll",
        method: "get",
        data: {}
      })
        .then(function(response) {
          for (var i = 0; i < response.data.areaNameData.length; i++) {
            res.area.push({
              jcoAreaName: response.data.areaNameData[i].areaName
            });
          }
        })
        .catch(function(error) {
          res.$message.error("查询失败: " + error);
        });
    },
    getParking() {
      this.parking.length = 0;
      var res = this;
      this.$axios({
        url:
          "http://yun.jinshipark.com:81/JinshiCouponGenerate/selectAllParkingName",
        method: "post",
        data: {}
      })
        .then(function(response) {
          for (var i = 0; i < response.data.parkingNameData.length; i++) {
            res.parking.push({
              jcoParkingName: response.data.parkingNameData[i].jpName
            });
          }
        })
        .catch(function(error) {
          res.$message.error("查询失败: " + error);
        });
    },
    getCoupon() {
      // this.area.length = 0;
      // var res = this;
      // this.$axios({
      //   url:
      //     "JinshiCouponOrder/selectCouponOrderAll?bcId="+localStorage.getItem('bcId')+"&pageNum="+res.cur_page+"&pageSize="+res.pagesize,
      //   method: "post",
      //   data: {}
      // })
      //   .then(function(response) {
      //        for(var i=0;i<response.data.BusinessNameData.length;i++){
      //           res.coupon.push({
      //               jcoCouponName:response.data.BusinessNameData[i].bcName
      //           })
      //       }
      //     console.log(response.data);
      //   })
      //   .catch(function(error) {
      //     res.$message.error("查询失败: " + error);
      //   });
    },
    formatter(row, column) {
      return row.address;
    },
    filterTag(value, row) {
      return row.tag === value;
    },
    //修改
    handleEdit(index, row) {
      this.idx = index;
      this.id = row.couponId;
      console.log(this.id);
      this.editForm = {
        jcoId:row.jcoId,
        jcoPlate: row.jcoPlate,
        jcoOrderId: row.jcoOrderId,
        jcoType: row.jcoType,
        jcoCarColor: row.jcoCarColor,
        jcoInboundTime:row.jcoInboundTime,
        jcoDepartureTime:row.jcoDepartureTime,
        jcoCarType: row.jcoCarType,
        jcoOften: row.jcoOften,
        jcoCouponName: row.jcoCouponName,
        jcoAgentName: row.jcoAgentName,
        jcoParkingName: row.jcoParkingName,
        jcoAreaName: row.jcoAreaName
      };
      this.editVisible = true;
    },
    // 保存编辑
    saveEdit() {
      var res = this;
      var setData = this.editForm;
      // if(this.editForm.password==this.editForm.passwordsure)
      this.$refs.editForm.validate(valid => {
        if (!valid) {
          res.$message.success("格式不正确");
        } else {
          this.$axios({
            url: "http://yun.jinshipark.com:81/JinshiCouponOrder/updateByPrimaryKey",
            method: "post",
            data:setData
          })
            .then(function(response) {
              if (response.status <= 200) {
                res.editVisible = false;
                res.$message.success("修改成功");
                res.$message.success(`修改第 ${res.idx + 1} 行成功`);
                if (res.tableData[res.idx].id === res.id) {
                  res.$set(res.tableData, res.idx, res.editForm);
                } else {
                  for (let i = 0; i < res.tableData.length; i++) {
                    if (res.tableData[i].id === res.id) {
                      res.$set(res.tableData, i, res.editForm);
                      return;
                    }
                  }
                }
                res.getData();
              }
            })
            .catch(function(error) {
              res.$message.success("修改失败！");
              console.log(error);
            });
        }

        // 验证通过后的处理...
      });
    },
    handleDelete(index, row) {
      this.idx = index;
      this.id = row.jcoId;
      console.log(this.id);
      this.delVisible = true;
    },
    delAll() {
      const length = this.multipleSelection.length;
      let str = "";
      this.del_list = this.del_list.concat(this.multipleSelection);
      for (let i = 0; i < length; i++) {
        str += this.multipleSelection[i].name + " ";
      }
      this.$message.success("删除了" + str);
      this.multipleSelection = [];
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 添加
    saveAdd() {
      console.log(this.addForm.passWord, this.addForm.passwordsure);
      if (this.addForm.passWord == this.addForm.passwordsure) {
        var res = this;
        res.addForm.rolename = res.value;
        var setData = this.addForm;
        this.$refs.addForm.validate(valid => {
          if (!valid) {
            res.$message.success("格式不正确");
          } else {
            this.$axios({
              url: "http://yun.jinshipark.com:81/JinshiCouponOrder/insert",
              method: "post",
              data: setData
            })
              .then(function(response) {
                if (response.status <= 200) {
                  if (response.data.code == 1) {
                    res.$message.error("用户名已存在");
                  } else {
                    res.addVisible = false;
                    res.$message.success("添加成功");
                    res.getData();
                  }
                }
              })
              .catch(function(error) {
                res.$message.error("添加失败！");
                console.log(error);
              });
          }
        });
      } else {
        alert("两次密码不一致");
      }
    },
    // 确定删除
    deleteRow() {
      var res = this;
      this.$axios({
        url: "http://yun.jinshipark.com:81/JinshiCouponOrder/deleteByPrimaryKey?id=" + res.id,
        method: "post",
        data: { id: res.id }
      })
        .then(function(response) {
          if (response.status <= 200) {
            res.$message.success("删除成功");
            res.delVisible = false;
            if (res.tableData[res.idx].id === res.id) {
              res.tableData.splice(res.idx, 1);
            } else {
              for (let i = 0; i < res.tableData.length; i++) {
                if (res.tableData[i].id === res.id) {
                  res.tableData.splice(i, 1);
                  return;
                }
              }
            }
          }
        })
        .catch(function(error) {
          res.$message.success("删除失败！");
          console.log(error);
        });
    }
  }
};
</script>

<style scoped>
.handle-box {
  margin-bottom: 20px;
}

.handle-select {
  width: 120px;
}

.handle-input {
  width: 300px;
  display: inline-block;
}
.del-dialog-cnt {
  font-size: 16px;
  text-align: center;
}
.table {
  width: 100%;
  font-size: 14px;
}
.red {
  color: #ff0000;
}
.mr10 {
  margin-right: 10px;
}
.outup {
  font-size: 12px;
  color: #fff;
  background-color: #409eff;
  display: inline-block;
  border-radius: 3px;
  padding: 8px 15px;
  margin-left: 5px;
}
.upload-demo {
  height: 30px;
  width: 100px;
  display: inline-block;
}
.inup {
  margin-top: 10px;
}
</style>
<style>
.el-upload--text {
  width: 60px;
  height: 30px;
  display: inline-block;
  border: 0;
  overflow: visible;
}
.el-table--border {
  border: 1px solid black;
}
.el-table--border,
.el-table--border th,
.el-table td,
.el-table th {
  border-right: 1px solid black;
  border-bottom-color: black;
  border-left-color: black;
}
.table {
  border-bottom-color: black !important;
  border-left-color: black !important;
}
</style>

