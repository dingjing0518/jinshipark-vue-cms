<template>
    <div class="carManager">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 每年汇总
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div style="margin-bottom:20px">
                <el-date-picker
                        v-model="valuetime"
                        type="year"
                        placeholder="选择年份" :picker-options="pickerBeginOption">
                </el-date-picker>

                <el-date-picker
                        style="margin:0px 10px 0px 10px"
                        v-model="valuetimeA"
                        type="year"
                        placeholder="选择年份"  :picker-options="pickerBeginOption">
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
                <el-table-column prop="scanPayMoney" label="扫码付费金额" class-name="table"></el-table-column>
                <el-table-column prop="prePayMoney" label="预付费用金额" class-name="table"></el-table-column>
                <el-table-column prop="manualMoney" label="人工收费金额" class-name="table"></el-table-column>
                <el-table-column prop="serviceFee" label="支付手续费" class-name="table"></el-table-column>
                <el-table-column prop="refundMoney" label="退款金额" class-name="table"></el-table-column>
                <el-table-column prop="refundServiceFee" label="退款手续费" class-name="table"></el-table-column>
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
                        return time.getTime() > new Date().getTime();
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
            this.valuetime = this.initDateFormatString(new Date());
            this.valuetimeA = this.initDateFormatString(new Date());
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
                let valuetime = this.dateFormatterString(new Date(this.valuetime));
                let valuetimeA = this.dateFormatterString(new Date(this.valuetimeA));
                this.numberer = 1;
                this.is_search = true;
                var res = this;
                console.log(valuetime);
                console.log(valuetimeA);
                // 搜索
                this.$axios({
                    url: this.GLOBAL._SERVER_API_ + "annuallySummary",
                    method: "post",
                    data: {
                        pageNum: res.cur_page,
                        pageSize: res.pagesize,
                        startTime: valuetime,
                        endTime: valuetimeA,
                        parkId: Number(localStorage.getItem("parkingId"))
                    }
                })
                    .then(function (response) {
                        if (response.data.status === 200) {
                            if (response.data.status == 200) {
                                console.log(response.data.data);
                                res.tableData = response.data.data.rows;
                                res.totalRecords = response.data.data.records; //总条数
                            }
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
                let res = this;
                let timeStart = this.dateFormatterString(new Date());
                let timeEnd = this.dateFormatterString(new Date());
                console.log(timeStart);
                console.log(timeEnd);
                this.$axios({
                    url: this.GLOBAL._SERVER_API_ + "annuallySummary",
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
            initDateFormatString(date) {
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
            dateFormatterString(date) {
                let y = date.getFullYear();
                return y;
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

