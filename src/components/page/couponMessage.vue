<template>
    <div class="carManager">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 优惠券管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="el-icon-search" @click="refresh" class="sousuo">刷新</el-button>
            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable"
                      @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="50" align="center" class-name="table"></el-table-column>
                <el-table-column type="index" width="50" align="center" label="序号" class-name="table"></el-table-column>
                <el-table-column prop="id" v-if="false"></el-table-column>
                <el-table-column prop="names" label="优惠券类型" class-name="table"></el-table-column>
                <el-table-column prop="couponname" label="减免券名称" class-name="table"></el-table-column>
                <el-table-column prop="starttime" label="开始日期" class-name="table"></el-table-column>
                <el-table-column prop="endtime" label="结束日期" class-name="table"></el-table-column>
                <el-table-column prop="count" label="减免券总数量" class-name="table"></el-table-column>
                <el-table-column prop="remaincount" label="减免券剩余量" class-name="table"></el-table-column>
                <!--                <el-table-column prop="jcgReliefAlltime" label="减免时长" class-name="table"></el-table-column>-->
                <!--                <el-table-column prop="jcgReliefAllmoney" label="减免金额" class-name="table"></el-table-column>-->
                <el-table-column label="操作" width="180" align="center" class-name="table">
                    <template slot-scope="scope">
                        <!--                        <el-button type="text" v-show="scope.row.isShow" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">生成-->
                        <!--                        </el-button>-->
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">生成
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>

        </div>
        <!-- 生成弹出框 -->
        <el-dialog title="生成优惠券" :visible.sync="editVisibleCoupon" width="30%">
            <el-form :model="addForm" :rules="addFormRules" ref="addForm" label-width="100px">
                <el-form-item label="优惠券名称" prop="couponname">
                    <el-input v-model="addForm.couponname" placeholder="请输入优惠券名称,此项由用户自定义，以便在优惠券生成模块区分。"></el-input>
                </el-form-item>
                <!--
                <el-form-item label="类型" prop="jcgType">
                  <el-input v-model="editForm.jcgType"></el-input>
                </el-form-item>-->
                <el-form-item label="优惠券数量" prop="count">
                    <el-input v-model="addForm.count" placeholder="请输入需要生成的优惠券数量，数量需要小于已有的优惠券数量"></el-input>
                </el-form-item>
                <span class="span_addserver" v-if="addserver!=''">{{addserver}}</span>
                <el-form-item label="优惠券类型" prop="coupontype">
                    <el-select v-model="addForm.coupontype" :disabled="flagNum">
                        <el-option v-for="item in couponType" :key="item.value" :label="item.label"
                                   :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="减免时长" prop="reductiontime">
                    <el-input v-model="addForm.reductiontime" placeholder="减免时长（小时）" :disabled="flagTime"></el-input>
                </el-form-item>
                <el-form-item label="减免金额" prop="reductionmoney">
                    <el-input v-model="addForm.reductionmoney" placeholder="减免金额（元）" :disabled="flagMoney"></el-input>
                </el-form-item>

                <el-form-item label="开始日期" prop="startdata">
                    <el-date-picker type="datetime" v-model="addForm.startdata"
                                    placeholder="生效时间，默认无失效日期" ></el-date-picker>
                </el-form-item>
                <el-form-item label="结束日期" prop="enddata">
                    <el-date-picker type="datetime" v-model="addForm.enddata"
                                    placeholder="生效时间，默认无失效日期" default-time="23:59:59"></el-date-picker>
                </el-form-item>
                <el-form-item label="开始时间" prop="starttime">
                    <el-time-picker v-model="addForm.starttime" value-format='HH:mm:ss'
                                    :picker-options="{selectableRange: '00:00:00 - 23:59:59'}"
                                    placeholder="任意时间点"></el-time-picker>
                </el-form-item>
                <el-form-item label="结束时间" prop="endtime">
                    <el-time-picker v-model="addForm.endtime" value-format='HH:mm:ss'
                                    :picker-options="{selectableRange: '00:00:00 - 23:59:59'}"
                                    placeholder="任意时间点"></el-time-picker>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
        <el-button @click="editVisibleCoupon = false">取 消</el-button>
        <el-button type="primary" @click="saveEdit">确 定</el-button>
      </span>
        </el-dialog>
    </div>
</template>

<script>
    import Validator from "async-validator";

    export default {
        name: "carManager",
        data() {

            let addEnddata = (rule, value, callback) => {
                var date1 = new Date(this.addForm.startdata);
                var time1 = date1.getTime();

                var date2 = new Date(this.addForm.enddata);
                var time2 = date2.getTime();
                if (time1 > time2) {
                    callback(new Error("结束日期不能早与开始日期"));
                } else {
                    callback();
                }
            };
            let addEndTime = (rule, value, callback) => {
                var array = this.addForm.starttime.split(":");
                var total = array[0] * 3600 + array[1] * 60 + array[2];

                var array2 = this.addForm.endtime;
                var total2 = array2[0] * 3600 + array2[1] * 60 + array2[2];
                if (total > total2) {
                    callback(new Error("结束时间不能早与开始时间"));
                } else {
                    callback();
                }
            };
            let addreductiontime = (rule, value, callback) => {
                if (this.addForm.reductiontime === '' || this.addForm.reductiontime === undefined) {
                    callback(new Error("减免时长不能为空"));
                } else {
                    callback();
                }
            };
            let addreductionmoney = (rule, value, callback) => {
                if (this.addForm.reductionmoney === '' || this.addForm.reductionmoney === undefined) {
                    callback(new Error("减免金额不能为空"));
                } else {
                    callback();
                }
            };

            return {
                coupon: [],
                bc: [],
                agent: [],
                area: [],
                parking: [],
                tableData: [],
                cur_page: 1,
                pagesize: 20,
                totalRecords: 0,
                addserver: "",
                totalPages: 0,
                multipleSelection: [],
                select_cate: "",
                select_word: "",
                del_list: [],
                is_search: false,
                editVisibleCoupon: false,
                addVisible: false,
                delVisible: false,
                names: "",
                rowtime: "",
                money: "",
                remaincount: "",
                Alltime: "",
                AllMoney: "",
                couponStarttime: "",
                addForm: {
                    couponname: "",
                    count: "",
                    startdata: "",
                    coupontype: "",
                    enddata: "",
                    starttime: "",
                    endtime: "",
                    areaid: "",
                    shopid: "",
                    parkid: "",
                    couponId: "",
                    agentid: "",
                    areaname: "",
                    reductiontime: "", // 减免时长
                    reductionmoney: ""// 减免金额
                },
                addFormRules: {
                    couponname: [
                        {required: true, message: "请输入优惠券名称", trigger: "blur"},
                        {min: 1, max: 20, message: "名称应在20字节以内", trigger: "blur"}
                    ],
                    count: [
                        {required: true, message: "请输入优惠券数量", trigger: "blur"},
                        {pattern: /^[0-9]+$/, message: "请输入正确的数量"},

                    ],
                    enddata: [
                        {required: true, message: "请输入结束日期", trigger: "blur"},
                        {validator: addEnddata, trigger: "blur"}
                    ],
                    endtime: [
                        {required: true, message: "请输入结束时间", trigger: "blur"},
                        {validator: addEndTime, trigger: "blur"}
                    ],
                    reductiontime: [
                        {required: true, message: "请输入减免时长", trigger: "blur"},
                        {validator: addreductiontime, trigger: "blur"}
                    ],
                    reductionmoney: [
                        {required: true, message: "请输入减免金额", trigger: "blur"},
                        {validator: addreductionmoney, trigger: "blur"}
                    ]
                },
                options: [],
                value: "",
                carFormRules: {},
                idx: -1,
                id: -1,
                flagTime: true, // 减免时长开关
                flagNum: true,
                flagMoney: true, // 减免金额开关
                flagNum: true,//优惠券数量开关
                couponType: [
                    {
                        value: 0,
                        label: "全免券"
                    },
                    {
                        value: 1,
                        label: "减免时长"
                    },
                    {
                        value: 2,
                        label: "减免金额"
                    },
                    {
                        value: 3,
                        label: "当天有效全免券"
                    }
                ]
            };
        },
        created() {
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
            //刷新
            refresh() {
                this.getData();
            },
            // 获取数据
            getData() {
                var res = this;
                this.$axios({
                    url:
                        this.GLOBAL._SERVER_API_ + "shopCouponManager/list?shopId=" +
                        localStorage.getItem("shopid") +
                        "&parkingId=" +
                        localStorage.getItem("parkingId"),
                    method: "get"
                })
                    .then(function (response) {
                        if (response.data.status === 200) {
                            res.tableData = response.data.data;
                            console.log(response.data.data);
                            for (let i = 0; i < res.tableData.length; i++) {
                                res.tableData[i]["names"] = ""
                            }
                            for (let i = 0; i < res.tableData.length; i++) {
                                if (res.tableData[i].coupontype == 0) {
                                    res.tableData[i].names = "全免劵"
                                } else if (res.tableData[i].coupontype == 1) {
                                    res.tableData[i].names = "减免时长"
                                } else if (res.tableData[i].coupontype == 2) {
                                    res.tableData[i].names = "减免金额"
                                } else if (res.tableData[i].coupontype == 3) {
                                    res.tableData[i].names = "当天有效全免劵"
                                }
                            }
                            for (let i = 0; i < res.tableData.length; i++) {
                                var DateTime = new Date();
                                var endtime = new Date(res.tableData[i].endtime);
                                if (DateTime.getTime() > endtime.getTime()) {
                                    res.tableData[i].isShow = false;
                                } else {
                                    res.tableData[i].isShow = true;
                                }
                            }
                        }
                    })
                    .catch(function (error) {
                        res.$message.error("查询失败: " + error);
                        console.log(error);
                    });
            },
            //生成
            handleEdit(index, row) {
                this.addserver = '';
                this.rowtime = row;
                this.names = row.names;//优惠券类型名称
                this.remaincount = row.remaincount;//剩余优惠券数量
                if (row.coupontype === "1") {
                    this.flagTime = false;
                    this.flagTime = false;
                    this.flagMoney = true;
                } else if (row.coupontype === "2") {
                    this.flagTime = true;
                    this.flagMoney = false;
                } else if (row.coupontype === "3") {
                    this.flagTime = true;
                    this.flagMoney = true;
                } else if (row.coupontype === "0") {
                    this.flagTime = true;
                    this.flagMoney = true;
                }
                this.idx = index;
                this.id = row.id;
                this.editVisibleCoupon = true;
                this.addForm = {
                    couponname: "",
                    coupontype: Number(row.coupontype),
                    count: "",
                    agentid: row.agentid,
                    couponId: row.id,
                    areaid: row.areaid,
                    shopid: row.shopid,
                    parkid: row.parkid,
                    areaname: row.areaname,
                    startdata: "",
                    starttime: "00:00:00",
                    endtime: "23:59:59",
                    reductiontime: "", // 减免时长
                    reductionmoney: "",// 减免金额
                };
                console.log(row);
            },
            // 保存编辑
            saveEdit() {
                // 开始时间
                if (this.addForm.startdata === undefined || this.addForm.startdata === '') {
                    this.addForm.startdata = this.rowtime.starttime;
                } else {
                    var datetime = new Date(this.addForm.startdata);
                    var y1 = datetime.getFullYear() + "-";
                    var mon1 = datetime.getMonth() + 1 + "-";
                    var d1 = datetime.getDate();
                    var hS = datetime.getHours() + ":";
                    hS = hS < 10 ? "0" + hS : hS;
                    var minS = datetime.getMinutes() + ":";
                    minS = minS < 10 ? "0" + minS : minS;
                    var sS = datetime.getSeconds();
                    sS = sS < 10 ? "0" + sS : sS;
                    this.addForm.startdata = y1 + mon1 + d1 + " " + hS + minS + sS;
                }

                // 结束时间
                if (this.addForm.enddata === undefined || this.addForm.enddata === '') {
                    this.addForm.enddata = this.rowtime.endtime;
                } else {
                    var datetimeE = new Date(this.addForm.enddata);
                    var y2 = datetimeE.getFullYear() + "-";
                    var mon2 = datetimeE.getMonth() + 1 + "-";
                    var d2 = datetimeE.getDate();
                    var hE = datetimeE.getHours() + ":";
                    hE = hE < 10 ? "0" + hE : hE;
                    var minE = datetimeE.getMinutes() + ":";
                    minE = minE < 10 ? "0" + minE : minE;
                    var sE = datetimeE.getSeconds();
                    sE = sE < 10 ? "0" + sE : sE;
                    this.addForm.enddata = y2 + mon2 + d2 + " " + hE + minE + sE;
                }
                var res = this;
                var setData = this.addForm;
                var StartTime = new Date(this.rowtime.starttime);
                var EndTime = new Date(this.rowtime.endtime);
                var EndData = new Date(setData.startdata);
                var StartData = new Date(setData.enddata);
                console.log(this.rowtime.endtime);
                console.log(setData.enddata);
                console.log(EndTime >= EndData);
                console.log(EndTime);
                console.log(EndData);
                if (EndTime >= EndData && StartTime <= StartData) {
                    if (this.names === "减免金额") {
                        console.log(this.remaincount);
                        var addservered = Number(this.addForm.count) * Number(this.addForm.reductionmoney);
                        if (addservered > Number(this.remaincount)) {
                            this.addserver = "总金额不能大于剩余金额";
                        } else {
                            this.$axios({
                                url:
                                    this.GLOBAL._SERVER_API_ + "couponManager/save",
                                method: "post",
                                data: setData
                            })
                                .then(function (response) {
                                    if (response.data.status === 200) {
                                        res.editVisibleCoupon = false;
                                        res.$message.success("生成优惠券成功");
                                        res.addserver = "";
                                        if (res.tableData[res.idx].id === res.id) {
                                            res.$set(res.tableData, res.idx, res.addForm);
                                        } else {
                                            for (let i = 0; i < res.tableData.length; i++) {
                                                if (res.tableData[i].id === res.id) {
                                                    res.$set(res.tableData, i, res.addForm);
                                                    return;
                                                }
                                            }
                                        }
                                        res.getData();
                                    }
                                })
                                .catch(function (error) {
                                    res.$message.error("生成优惠券失败！");
                                    console.log(error);
                                });
                        }
                    } else if (this.names === "减免时长") {
                        var addservertime = Number(this.addForm.count) * Number(this.addForm.reductiontime);
                        console.log(addservertime);
                        console.log(this.remaincount);
                        if (addservertime > Number(this.remaincount)) {
                            this.addserver = "总时长不能大于剩余时长"
                        } else {
                            this.$axios({
                                url:
                                    this.GLOBAL._SERVER_API_ + "couponManager/save",
                                method: "post",
                                data: setData
                            })

                                .then(function (response) {
                                    if (response.data.status === 200) {
                                        res.editVisibleCoupon = false;
                                        res.$message.success("生成优惠券成功");
                                        res.addserver = ""
                                        if (res.tableData[res.idx].id === res.id) {
                                            res.$set(res.tableData, res.idx, res.addForm);
                                        } else {
                                            for (let i = 0; i < res.tableData.length; i++) {
                                                if (res.tableData[i].id === res.id) {
                                                    res.$set(res.tableData, i, res.addForm);
                                                    return;
                                                }
                                            }
                                        }
                                        res.getData();
                                    }
                                })
                                .catch(function (error) {
                                    res.$message.error("生成优惠券失败！");
                                    console.log(error);
                                });
                        }
                    } else {
                        if (Number(this.addForm.count) > Number(this.remaincount)) {
                            this.addserver = "数量不能大于减免券剩余量"
                        } else {
                            this.$axios({
                                url:
                                    this.GLOBAL._SERVER_API_ + "couponManager/save",
                                method: "post",
                                data: setData
                            })

                                .then(function (response) {
                                    if (response.status === 200) {
                                        res.editVisibleCoupon = false;
                                        res.$message.success("生成优惠券成功");
                                        res.addserver = ""
                                        console.log("123", response);
                                        if (res.tableData[res.idx].id === res.id) {
                                            res.$set(res.tableData, res.idx, res.addForm);
                                        } else {
                                            for (let i = 0; i < res.tableData.length; i++) {
                                                if (res.tableData[i].id === res.id) {
                                                    res.$set(res.tableData, i, res.addForm);
                                                    return;
                                                }
                                            }
                                        }
                                        res.getData();
                                    }
                                })
                                .catch(function (error) {
                                    res.$message.error("生成优惠券失败！");
                                    console.log(error);
                                });
                        }
                    }

                } else {
                    res.$message.error("输入的时间在有效时间内")
                }

            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            dateFormatterexpirationTime(row, column) {
                let datetime = row.endtime;
                if (datetime) {
                    datetime = new Date(datetime);
                    let y = datetime.getFullYear() + "-";
                    let mon = datetime.getMonth() + 1 + "-";
                    let d = datetime.getDate();
                    if (datetime.getHours() === 0) {
                        var h = '23:';
                    } else {
                        var h = datetime.getHours() + ':';
                    }
                    if (datetime.getMinutes() === 0) {
                        var m = '59:';
                    } else {
                        var m = datetime.getMinutes() + ':';
                    }
                    if (datetime.getSeconds() === 0) {
                        var s = '59';
                    } else {
                        var s = datetime.getSeconds();
                    }
                    return y + mon + d + " " + h + m + s;
                }
                return "";
            },
        }
    };
</script>

<style scoped>
    .span_addserver {
        display: block;
        position: relative;
        left: 100px;
        color: red;
        font-size: 12px;
    }

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

