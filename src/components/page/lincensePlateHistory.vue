<template>
    <div class="carManager">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 在场记录历史
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div style="margin-bottom:20px">
                <el-input v-model="select_word" placeholder="筛选车牌" class="handle-input mr10"></el-input>
                <el-select placeholder="订单状态" v-model="lpOrderState" class="handle-input mr10">
                    <el-option value="请选择">请选择</el-option>
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
                <el-table-column prop="refundValue" label="退款状态" align="center" class-name="table"></el-table-column>
                <el-table-column prop="refundmoney" label="退款金额" align="center" class-name="table"></el-table-column>
                <el-table-column label="操作" width="180" align="center" class-name="table">
                    <template slot-scope="scope">
                        <el-button type="text" v-if="scope.row.paymentid!=null&&scope.row.refundstatus==0"
                                   icon="el-icon-back" class="red"
                                   @click="handleRefund(scope.$index, scope.row)">退款
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- 退款提示框 -->
        <!--        <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>-->
        <!--            <div class="del-dialog-cnt">退款不可恢复，是否确定退款？</div>-->
        <!--            <span slot="footer" class="dialog-footer">-->
        <!--        <el-button @click="delVisible = false">取 消</el-button>-->
        <!--        <el-button type="primary" @click="refundRow">确 定</el-button>-->
        <!--      </span>-->
        <!--        </el-dialog>-->
        <!-- 退款提示框 -->
        <el-dialog title="退款" :visible.sync="refundVisible" width="30%">
            <el-form :model="refundForm" ref="refundForm" label-width="100px">
                <el-form-item label="订单号" prop="lp_order_id">
                    <el-input v-model="refundForm.lp_order_id" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="车牌号" prop="lpLincensePlateIdCar">
                    <el-input v-model="refundForm.lpLincensePlateIdCar" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="实付金额" prop="lpParkingRealCost">
                    <el-input v-model="refundForm.lpParkingRealCost" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="退款金额" prop="refundCost">
                    <el-input v-model="refundForm.refundCost" placeholder="退款金额不能大于实付金额"></el-input>
                </el-form-item>
                <span class="span_addserver" v-if="refundserver!=''">{{refundserver}}</span>
            </el-form>
            <span slot="footer" class="dialog-footer">
        <el-button @click="refundVisible = false">取 消</el-button>
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
                refundVisible: false,
                lpOrderState: "",
                numberer: 0,
                lp_order_id: "",
                refundserver: "",
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
                refundForm: {
                    lp_order_id: "",
                    lpLincensePlateIdCar: "",
                    lpParkingRealCost: "",
                    refundCost: ""
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
                let lpOrderState;
                if (this.lpOrderState === '请选择') {
                    lpOrderState = '';
                } else {
                    lpOrderState = this.lpOrderState;
                }
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
                    url: this.GLOBAL._SERVER_API_ + "lincensePlateHistory/searchLincensePlateHistory",
                    method: "post",
                    data: {
                        keyWord: res.select_word,
                        pageNum: res.cur_page,
                        pageSize: res.pagesize,
                        startTime: res.valuetime,
                        endTime: res.valuetimeA,
                        parkId: Number(localStorage.getItem("parkingId")),
                        lpOrderState: lpOrderState
                    }
                })
                    .then(function (response) {
                        if (response.data.status === 200) {
                            console.log(response.data.data);
                            res.tableData = response.data.data.rows;
                            for (let i = 0; i < res.tableData.length; i++) {
                                if (res.tableData[i].refundstatus == 0) {
                                    res.tableData[i].refundValue = "未退款"
                                } else if (res.tableData[i].refundstatus == 1) {
                                    res.tableData[i].refundValue = "已退款"
                                } else if (res.tableData[i].refundstatus == 2) {
                                    res.tableData[i].refundValue = "退款中"
                                }
                            }
                            res.totalRecords = response.data.data.records; //总条数
                        }

                    })
                    .catch(function (error) {
                        res.$message.error("查询失败: " + error);
                        console.log(error);
                    });

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
                let lpOrderState;
                if (this.lpOrderState === '请选择') {
                    lpOrderState = '';
                } else {
                    lpOrderState = this.lpOrderState;
                }
                this.numberer = 0;
                var res = this;
                var dataTime = new Date();
                var timeStart = this.dateFormatString(dataTime);
                var timeEnd = this.dateFormatString(dataTime);
                this.$axios({
                    url: this.GLOBAL._SERVER_API_ + "lincensePlateHistory/searchLincensePlateHistory",
                    method: "post",
                    data: {
                        keyWord: res.select_word,
                        pageNum: res.cur_page,
                        pageSize: res.pagesize,
                        startTime: timeStart,
                        endTime: timeEnd,
                        parkId: Number(localStorage.getItem("parkingId")),
                        lpOrderState: lpOrderState
                    }
                })
                    .then(function (response) {
                        if (response.data.status == 200) {
                            console.log(response.data.data);
                            res.tableData = response.data.data.rows;
                            for (let i = 0; i < res.tableData.length; i++) {
                                if (res.tableData[i].refundstatus == 0) {
                                    res.tableData[i].refundValue = "未退款"
                                } else if (res.tableData[i].refundstatus == 1) {
                                    res.tableData[i].refundValue = "已退款"
                                } else if (res.tableData[i].refundstatus == 2) {
                                    res.tableData[i].refundValue = "退款中"
                                }
                            }
                            res.totalRecords = response.data.data.records; //总条数

                        }

                    })
                    .catch(function (error) {
                        res.$message.error("查询失败: " + error);
                        console.log(error);
                    });
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            // 确定退款
            refundRow() {
                console.log(this.refundForm.lp_order_id);
                console.log(this.refundForm.lpParkingRealCost);
                console.log(this.refundForm.refundCost);
                if (this.refundForm.refundCost === "" || this.refundForm.refundCost === undefined) {
                    this.refundserver = "退款金额不能为空";
                    return;
                }
                if (Number(this.refundForm.lpParkingRealCost) < Number(this.refundForm.refundCost)) {
                    this.refundserver = "退款金额不能大于实付金额";
                    return;
                }
                var res = this;
                console.log(res);
                this.$axios({
                    url: "http://hfzf.jinshipark.com/hfzf-api/adapay/refund",
                    method: "post",
                    data: {
                        order_no: res.refundForm.lp_order_id,
                        pay_amt: res.refundForm.refundCost
                    }
                })
                    .then(function (response) {
                        if (response.data.status === 200) {
                            res.$message.success("退款处理中");
                        } else {
                            res.$message.error("退款失败: " + response.data.msg);
                        }
                        res.refundVisible = false;
                        res.search(2);
                    })
                    .catch(function (error) {
                        // res.$message.success("退款失败！");
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
            //退款功能
            handleRefund(index, row) {
                this.refundserver = "";
                console.log(row);
                this.refundVisible = true;
                this.refundForm = {
                    lp_order_id: row.lpOrderId,
                    lpLincensePlateIdCar: row.lpLincensePlateIdCar,
                    lpParkingRealCost: row.lpParkingRealCost,
                    refundCost: ""
                }
            }
        }
    };
</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }

    .span_addserver {
        display: block;
        position: relative;
        left: 100px;
        color: red;
        font-size: 12px;
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

