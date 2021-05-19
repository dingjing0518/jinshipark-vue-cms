<template>
    <div class="carManager">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 每日汇总
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div style="margin-bottom:20px">
                <el-date-picker
                        v-model="valuetime"
                        type="date"
                        placeholder="选择日期" :picker-options="pickerBeginOption">
                </el-date-picker>

                <el-date-picker
                        style="margin:0px 10px 0px 10px"
                        v-model="valuetimeA"
                        type="date"
                        placeholder="选择日期":picker-options="pickerBeginOption">
                </el-date-picker>


                <el-button type="primary" icon="el-icon-search" @click="search(1)">搜索</el-button>
            </div>

            <el-table
                    :data="tableData"
                    border
                    class="table"
                    ref="multipleTable">
                <el-table-column type="selection" width="50" align="center" class-name="table"></el-table-column>
                <el-table-column type="index" width="50" align="center" label="序号" class-name="table"></el-table-column>
                <el-table-column prop="date" label="日期" class-name="table"></el-table-column>
                <el-table-column prop="carNum" label="车辆数" class-name="table"></el-table-column>
                <el-table-column prop="parkingCost" label="应收金额" class-name="table"></el-table-column>
                <el-table-column prop="realCost" label="实收金额" class-name="table"></el-table-column>
                <el-table-column prop="refundMoney" label="退款金额" class-name="table"></el-table-column>
            </el-table>
        </div>
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
    export default {
        name: "carManager",
        data() {
            return {
                coupon: [],
                pickerBeginOption: {
                    disabledDate: (time) => {
                        return time.getTime() >= new Date(this.dateFormatString(new Date())).getTime();
                    }
                }, // 日期设置对象
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
                refundStatus: "",
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
            this.valuetime = this.startDateFormatString(new Date());
            this.valuetimeA = this.endDateFormatString(new Date());
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
                return year + "-" + month + "-" + day + " 00:00:00";
            },
            //搜索
            search(value) {
                this.valuetime = this.dateFormatterString(new Date(this.valuetime));
                this.valuetimeA = this.dateFormatterString(new Date(this.valuetimeA));
                this.numberer = 1;
                this.is_search = true;
                var res = this;
                console.log(res.valuetime);
                console.log(res.valuetimeA);
                // 搜索
                this.$axios({
                    url: this.GLOBAL._SERVER_API_ + "dailySummary",
                    method: "post",
                    data: {
                        pageNum: res.cur_page,
                        pageSize: res.pagesize,
                        startTime: res.valuetime,
                        endTime: res.valuetimeA,
                        parkId: Number(localStorage.getItem("parkingId"))
                    }
                })
                    .then(function (response) {
                        if (response.data.status === 200) {
                            console.log(response.data.data);
                            res.tableData = response.data.data.rows;
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
                this.numberer = 0;
                var res = this;
                var timeStart = this.startDateFormatString(new Date());
                var timeEnd = this.endDateFormatString(new Date());
                console.log(timeStart);
                console.log(timeEnd);
                this.$axios({
                    url: this.GLOBAL._SERVER_API_ + "dailySummary",
                    method: "post",
                    data: {
                        pageNum: res.cur_page,
                        pageSize: res.pagesize,
                        startTime: timeStart,
                        endTime: timeEnd,
                        parkId: Number(localStorage.getItem("parkingId"))
                    }
                })
                    .then(function (response) {
                        if (response.data.status == 200) {
                            console.log(response.data.data);
                            res.tableData = response.data.data.rows;
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
            startDateFormatString(date) {
                var year = date.getFullYear();
                var month = date.getMonth() + 1;
                var day = date.getDate()-1;
                if (month < 10) {
                    month = "0" + month;
                }
                if (day < 10) {
                    day = "0" + day;
                }
                return year + "-" + month + "-" + day;
            },
            endDateFormatString(date) {
                var year = date.getFullYear();
                var month = date.getMonth() + 1;
                var day = date.getDate()-1;
                if (month < 10) {
                    month = "0" + month;
                }
                if (day < 10) {
                    day = "0" + day;
                }
                return year + "-" + month + "-" + day;
            },
            dateFormatterString(date) {
                let y = date.getFullYear();
                let mon = date.getMonth() + 1;
                let d = date.getDate();
                mon = mon < 10 ? '0' + mon : mon;
                d = d < 10 ? '0' + d : d;
                return y + '-' + mon + '-' + d;
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
        width: 400px;
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

