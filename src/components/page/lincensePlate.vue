<template>
    <div class="carManager">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 在场记录
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div style="margin-bottom:20px">
                <el-input v-model="select_word" placeholder="筛选车牌" class="handle-input mr10"></el-input>
                <el-select placeholder="订单状态" v-model="lpOrderState" class="handle-input mr10">
                    <el-option value="未付款">未付款</el-option>
                    <el-option value="待支付">待支付</el-option>
                    <el-option value="支付成功">支付成功</el-option>
                </el-select>
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
                <el-table-column prop="lpLincensePlateIdCar" label="车牌号" class-name="table"></el-table-column>
                <!--
                <el-table-column prop="jcoType" label="类型" class-name="table"></el-table-column>
                <el-table-column prop="jcoCarColor" label="颜色" class-name="table"></el-table-column>
                <el-table-column prop="jcoCarType" label="车类型" class-name="table"></el-table-column>-->
                <el-table-column prop="lpInboundTime" label="进场时间" class-name="table"></el-table-column>
                <el-table-column prop="lpDepartureTime" label="出场时间" class-name="table"></el-table-column>
                <el-table-column prop="lpParkingOften" label="停车时间" class-name="table"></el-table-column>
                <el-table-column prop="lpOrderState" label="订单状态" class-name="table"></el-table-column>
                <el-table-column prop="lpParkingCost" label="停车费用" class-name="table"></el-table-column>
                <el-table-column prop="lpParkingRealCost" label="实收费用" class-name="table"></el-table-column>
                <el-table-column prop="lpOrderId" label="订单号" class-name="table"></el-table-column>
                <el-table-column prop="lpCreateTime" label="创建时间" class-name="table"></el-table-column>
                <!--
                <el-table-column prop="jcoAgentName" label="代理商" class-name="table"></el-table-column>
                <el-table-column prop="jcoParkingName" label="停车场" class-name="table"></el-table-column>
                <el-table-column prop="jcoAreaName" label="区域名" class-name="table"></el-table-column>-->
                <!--
                <el-table-column prop="jcoCouponName" label="优惠券" class-name="table"></el-table-column>-->
<!--                <el-table-column label="操作" width="180" align="center" class-name="table">-->
<!--                    <template slot-scope="scope">-->
<!--                        <el-button type="text" v-if="scope.row.paymentid!=null" icon="el-icon-back" class="red"-->
<!--                                   @click="handleRefund(scope.$index, scope.row)">退款-->
<!--                        </el-button>-->
<!--                        &lt;!&ndash;                    <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)">删除</el-button>&ndash;&gt;-->
<!--                    </template>-->
<!--                </el-table-column>-->
            </el-table>
        </div>
        <!-- 退款提示框 -->
        <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
            <div class="del-dialog-cnt">退款不可恢复，是否确定退款？</div>
            <span slot="footer" class="dialog-footer">
        <el-button @click="delVisible = false">取 消</el-button>
        <el-button type="primary" @click="refundRow">确 定</el-button>
      </span>
        </el-dialog>
        <el-pagination
                style="float:right"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="cur_page"
                :page-sizes="[10, 30, 50, 100]"
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
                valuetimeA: "",
                valuetime: "",
                tableData: [],
                cur_page: 1,
                pagesize: 10,
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
                lpOrderState:"",
                numberer: 0,
                addForm: {
                    jcoId: '',
                    jcoPlate: "",
                    jcoOrderId: "",
                    jcoType: "",
                    jcoCarColor: "",
                    jcoCarType: "",
                    jcoInboundTime: '',
                    jcoDepartureTime: '',
                    jcoOften: "",
                    jcoAgentName: "",
                    jcoParkingName: "",
                    jcoAreaName: "",
                    jcoCouponName: ""
                },
                editForm: {
                    jcoId: '',
                    jcoPlate: "",
                    jcoOrderId: "",
                    jcoType: "",
                    jcoCarColor: "",
                    jcoInboundTime: '',
                    jcoDepartureTime: '',
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
            var data = new Date();
            this.valuetimeA = data;
            this.valuetime = data;
            this.getData();
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
                this.valuetime = this.dateFormatString(new Date(this.valuetime));
                this.valuetimeA = this.dateFormatString(new Date(this.valuetimeA));
                this.numberer = 1;
                if (value == 1) {
                    this.cur_page = 1;
                }
                this.is_search = true;
                var res = this;
                // 搜索
                this.$axios({
                    url: this.GLOBAL._SERVER_API_ + "lincensePlate/searchLincensePlate",
                    method: "post",
                    data: {
                        keyWord: res.select_word,
                        pageNum: res.cur_page,
                        pageSize: res.pagesize,
                        startTime: res.valuetime,
                        endTime: res.valuetimeA,
                        parkId: Number(localStorage.getItem("parkingId")),
                        lpOrderState:res.lpOrderState
                    }
                })
                    .then(function (response) {
                        if (response.data.status === 200) {
                            console.log(response.data.data);
                            for (var i = 0; i < response.data.data.rows.length; i++) {
                                if (response.data.data.rows[i].createtime) {
                                    var date = new Date(response.data.data.rows[i].createtime);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
                                    var Y = date.getFullYear() + '-';
                                    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
                                    var D = date.getDate() + ' ';
                                    var h = date.getHours() + ':';
                                    var m = date.getMinutes() + ':';
                                    var s = date.getSeconds();
                                    response.data.data.rows[i].createtime = Y + M + D + " " + h + m + s;
                                }
                            }
                            res.tableData = response.data.data.rows;
                            res.totalRecords = response.data.data.records; //总条数

                        }

                    })
                    .catch(function (error) {
                        res.$message.error("查询失败: " + error);
                        console.log(error);
                    });

            },
            dateFormatString(date) {
                var year = date.getFullYear();
                var month = date.getMonth() + 1;
                var day = date.getDate();
                if (month < 10) {
                    month = "0" + month;
                }
                if (day < 10) {
                    day = "0" + day;
                }
                return year + "-" + month + "-" + day;
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
                    return y + mon + d + " " + h + m + s;
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
                var dataTime = new Date();
                var timeStart = this.dateFormatString(dataTime);
                var timeEnd = this.dateFormatString(dataTime);
                this.$axios({
                    url: this.GLOBAL._SERVER_API_ + "lincensePlate/searchLincensePlate",
                    method: "post",
                    data: {
                        keyWord: res.select_word,
                        pageNum: res.cur_page,
                        pageSize: res.pagesize,
                        startTime: timeStart,
                        endTime: timeEnd,
                        parkId: Number(localStorage.getItem("parkingId")),
                        lpOrderState:res.lpOrderState
                    }
                })
                    .then(function (response) {
                        if (response.data.status == 200) {
                            res.tableData = response.data.data.rows;
                            res.totalRecords = response.data.data.records; //总条数

                        }

                    })
                    .catch(function (error) {
                        res.$message.error("查询失败: " + error);
                        console.log(error);
                    });
            },
            // 确定退款
            refundRow() {
                var res = this;
                this.$axios({
                    url: "http://yun.jinshipark.com:81/JinshiCouponOrder/deleteByPrimaryKey?id=" + res.id,
                    method: "post",
                    data: {id: res.id}
                })
                    .then(function (response) {
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
                    .catch(function (error) {
                        res.$message.success("删除失败！");
                        console.log(error);
                    });
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            //退款功能
            handleRefund(index, row) {
                this.idx = index;
                this.id = row.id;
                console.log(row);
                this.delVisible = true;
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

