<template>
    <div class="carManager">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 优惠券生成
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="el-icon-search" @click="refresh" class="sousuo">刷新</el-button>
            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable">
                <el-table-column type="selection" width="50" align="center" class-name="table"></el-table-column>
                <el-table-column type="index" width="50" align="center" label="序号" class-name="table"></el-table-column>
                <el-table-column prop="id" v-if="false"></el-table-column>
                <el-table-column prop="names" label="优惠券类型" class-name="table"></el-table-column>
                <el-table-column prop="name" label="优惠券名称" class-name="table"></el-table-column>

                <el-table-column prop="count" label="优惠券数量" class-name="table"></el-table-column>
                <el-table-column prop="remaincount" label="优惠券剩余数量" class-name="table"></el-table-column>

                <el-table-column prop="reductiontime" label="减免时长(小时)" class-name="table"></el-table-column>
                <el-table-column prop="reductionmoney" label="减免金额(元)" class-name="table"></el-table-column>

                <el-table-column prop="startdate" label="开始日期" class-name="table"></el-table-column>
                <el-table-column prop="enddate" label="结束日期" class-name="table"></el-table-column>
                <el-table-column prop="starttime" label="开始时间" class-name="table"></el-table-column>
                <el-table-column prop="endtime" label="结束时间" class-name="table"></el-table-column>
                <el-table-column label="操作" width="180" align="center" class-name="table">
                    <template slot-scope="scope">
                        <el-button type="text" class="red" @click="look(scope.$index, scope.row)">查看二维码</el-button>
                        <el-button type="text" class="red" @click="handleadd(scope.$index, scope.row)">续费</el-button>
                        <el-button type="text" class="red" @click="handleRevert(scope.$index, scope.row)">返还</el-button>
                        <el-button type="text" class="red" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- 充值弹出框 -->
        <el-dialog title="充值" :visible.sync="addnewVisible" width="30%">
            <el-form ref="addnewForm" :model="addnewForm" :rules="carFormRules" label-width="100px">
                <el-form-item :label="typenames" prop="count">
                    <el-input v-model="addnewForm.count" :placeholder="point" @blur="blur"></el-input>

                    <p class="point-p">{{pointNames}}</p>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
        <el-button @click="addnewVisible = false">取 消</el-button>
        <el-button type="primary" @click="addSure">确 定</el-button>
      </span>
        </el-dialog>
        <!-- 删除提示框 -->
        <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
        <el-button @click="delVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteRow">确 定</el-button>
      </span>
        </el-dialog>
        <!-- 返还提示款 -->
        <el-dialog title="提示" :visible.sync="revertVisible" width="300px" center>
            <div class="del-dialog-cnt">返还后不可恢复，是否确定返还？</div>
            <span slot="footer" class="dialog-footer">
        <el-button @click="revertVisible = false">取 消</el-button>
        <el-button type="primary" @click="revertRow">确 定</el-button>
      </span>
        </el-dialog>

        <div class="icon-er" v-show="addent">
            <div>
                <i class="el-icon-circle-close" style="background:white;float:right" @click="addenter()"></i>
            </div>

            <div id="qrcode"></div>
            <p class="icon-pp">{{name}}</p>
            <div>
                <el-button type="primary" @click="downs()" style="margin:20px 0px 0px 220px">下载图片</el-button>
            </div>
        </div>
    </div>
</template>
<script>
    import QRCode from "qrcodejs2";
    import Validator from "async-validator";

    export default {
        components: {QRCode},
        name: "carManager",

        data() {
            let nameRule1 = (rule, value, callback) => {
                if (value > this.residuenumber) {
                    callback(new Error("优惠券数量应小于剩余数量"));
                    console.log("12");
                } else {
                    callback();
                }
            };
            return {
                countdown: 5,
                payTimeout: "5秒 后失效",
                addent: false,
                link: "", //需要生成二维码图片的字符串
                qrCodeSize: "50",
                shareUrl: "",
                title: "标题一",
                title2: "标题二",
                testa: null,
                key: true,
                tableData: [],
                delVisible: false,
                revertVisible: false,
                cur_page: 1,
                pagesize: 20,
                typenames: "",
                point: "",
                addnewVisible: false,
                totalRecords: 0,
                totalPages: 0,
                multipleSelection: [],
                select_cate: "",
                select_word: "",
                del_list: [],
                remaincount: "",
                options: [],
                value: "",
                codePark: "",
                hidden: false,
                codeArea: "",
                name: "",
                carFormRules: {
                    jcgCount: [],
                    jcgRemaincount: []
                },
                posinType: "",
                pointNames: "",
                idx: -1,
                id: "",
                revertId: "",
                addnewForm: {
                    id: "",
                    count: ""
                }
            };
        },

        created() {
            this.getData();
            console.log(this.timestampToTime(2132112783000));
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
            //删除功能
            handleDelete(index, row) {
                this.idx = index;
                this.id = row.id;
                console.log(row);
                this.delVisible = true;
            },
            // 返还功能
            handleRevert(index, row) {
                console.log(row);
                this.revertId = Number(row.id);
                this.revertVisible = true;

            },
            //确定删除功能
            deleteRow() {
                var res = this;
                console.log(res.id);
                this.$axios({
                    url: this.GLOBAL._SERVER_API_ + "couponManager/deleteByPrimaryKey",
                    method: "post",
                    data: {id: res.id}
                })
                    .then(function (response) {
                        if (response.data.status === 500) {
                            res.$message.error("删除失败: " + response.data.msg);
                        } else {
                            res.$message.success("删除成功");

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
                        res.delVisible = false;
                        res.getData();
                    })
                    .catch(function (error) {
                        res.$message.error("删除失败！");
                        console.log(error);
                    });
            },
            // 确定返还功能
            revertRow() {
                var res = this;
                console.log(res.revertId);
                this.$axios({
                    url: this.GLOBAL._SERVER_API_ + "couponManager/returnBack",
                    method: "post",
                    data: JSON.stringify({id: res.revertId}),
                    headers: {'Content-Type': 'application/json'},
                })
                    .then(function (response) {
                        if (response.data.status === 500) {
                            res.$message.error("返还失败: " + response.data.msg);
                        } else {
                            res.$message.success("返还成功");
                        }
                        res.revertVisible = false;
                        res.getData();

                    })
                    .catch(function (error) {
                        res.$message.error("返还失败");
                        console.log(error);
                    });
            },
            addenter() {
                this.addent = false;
            },
            //生成二维码
            qrcode() {
                let that = this;
                let qrcode = new QRCode("qrcode", {
                    width: 500,
                    height: 500, // 高度
                    text: this.link // 二维码内容
                    // render: 'canvas' ,   // 设置渲染方式（有两种方式 table和canvas，默认是canvas）
                    // background: '#f0f',   // 背景色
                    // foreground: '#ff0'    // 前景色
                });
            },
            //点击使用生成二维码
            look(index, row) {
                this.name = row.name;//优惠券名称
                var date = new Date();
                var date2 = new Date(row.enddate);

                var time1 = date.getTime();
                var time2 = date2.getTime();

                var DateTime = new Date();
                var TimeDate1 = DateTime.getTime();
                var TimeDate = DateTime.getTime();
                console.log(TimeDate);
                console.log(TimeDate1);
                if (time1 > time2) {
                    this.$message.error("二维码已过期");
                } else {
                    this.addent = true;
                    // 优惠券二维码
                    this.link = "http://syq.jinshipark.com/addPlote.html?id=" + row.id + "&type=" + row.type;
                    document.getElementById("qrcode").innerHTML = "";
                    this.$nextTick(function () {
                        //生成二维码
                        this.qrcode();
                    });
                }
            },
            //下载图片
            downs() {
                // //找到canvas标签
                let myCanvas = document
                    .getElementById("qrcode")
                    .getElementsByTagName("canvas");
                let img = document.getElementById("qrcode").getElementsByTagName("img");
                // // //创建一个a标签节点
                let a = document.createElement("a");
                // //设置a标签的href属性（将canvas变成png图片）
                let imgURL = myCanvas[0].toDataURL("image/jpg");
                let ua = navigator.userAgent;
                if (ua.indexOf("Trident") != -1 && ua.indexOf("Windows") != -1) {
                    // IE内核 并且  windows系统 情况下 才执行;
                    var bstr = atob(imgURL.split(",")[1]);
                    var n = bstr.length;
                    var u8arr = new Uint8Array(n);
                    while (n--) {
                        u8arr[n] = bstr.charCodeAt(n);
                    }
                    var blob = new Blob([u8arr]);
                    window.navigator.msSaveOrOpenBlob(blob, "下载" + "." + "png");
                } else if (ua.indexOf("Firefox") > -1) {
                    //火狐兼容下载
                    let blob = this.base64ToBlob(imgURL); //new Blob([content]);
                    let evt = document.createEvent("HTMLEvents");
                    evt.initEvent("click", true, true); //initEvent 不加后两个参数在FF下会报错  事件类型，是否冒泡，是否阻止浏览器的默认行为
                    a.download = " "; //下载图片名称，如果填内容识别不到，下载为未知文件，所以我这里就不填为空
                    a.href = URL.createObjectURL(blob);
                    a.dispatchEvent(
                        new MouseEvent("click", {
                            bubbles: true,
                            cancelable: true,
                            view: window
                        })
                    ); //兼容火狐
                } else {
                    //谷歌兼容下载
                    img.src = myCanvas[0].toDataURL("image/jpg");
                    // a.href = myCanvas[0].toDataURL('image/png').replace('image/png', 'image/octet-stream')
                    a.href = img.src;
                    //设置下载文件的名字
                    a.download = this.name;
                    //点击
                    a.click();
                }
            },
            base64ToBlob(code) {
                let parts = code.split(";base64,");
                let contentType = parts[0].split(":")[1];
                let raw = window.atob(parts[1]);
                let rawLength = raw.length;
                let uInt8Array = new Uint8Array(rawLength);
                for (let i = 0; i < rawLength; ++i) {
                    uInt8Array[i] = raw.charCodeAt(i);
                }
                return new Blob([uInt8Array], {type: contentType});
            },

            //续费
            handleadd(index, row) {
                this.posinType = row;
                this.idx = index;
                this.id = row.id;

                if (row.type === 0) {
                    this.typenames = "请输入续费的全免劵";
                    this.point = "输入的减免劵数量不能大于已有减免卷";
                } else if (row.type === 1) {
                    this.typenames = "请输入续费的减免时长";
                    this.point = "输入的减免时长不能大于已有减免时长";
                } else if (row.type === 2) {
                    this.typenames = "请输入续费的减免金额";
                    this.point = "输入的减免金额不能大于已有减免金额";
                } else if (row.type === 3) {
                    this.typenames = "请输入续费的当天全免劵";
                    this.point = "输入的减免劵数量不能大于已有减免卷";
                }
                var date = new Date();
                var date2 = new Date(row.enddate);
                var time1 = date.getTime();
                var time2 = date2.getTime();
                if (time1 > time2) {
                    this.$message.error("生成的优惠券已过期");
                } else {
                    var id = row.id;
                    var type = Number(row.type);

                    this.addnewForm = {
                        type: type,
                        id: id,
                        count: "",
                        reductiontime: "",
                        reductionmoney: ""
                    };
                    this.addnewVisible = true;
                    this.remaincount = row.remaincount;
                }
            },

            addSure() {
                this.addnewForm.count = Number(this.addnewForm.count);
                var res = this;
                var setData = this.addnewForm;
                if (res.addnewForm.count !== "") {
                    this.$axios({
                        url: this.GLOBAL._SERVER_API_ + "couponManager/updateCoupon",
                        method: "post",
                        data: setData
                    })
                        .then(function (response) {
                            console.log(response);
                            if (response.data.status === 500) {
                                res.$message.error("充值失败: " + response.data.msg);
                            } else {
                                res.$message.success("充值成功");
                            }
                            res.pointNames = "";
                            res.addnewForm.count = "";
                            res.hidden = false;
                            res.addnewVisible = false;
                            res.getData();
                        })
                        .catch(function (err) {
                            res.$message.error("充值失败: " + error);
                        });
                } else {
                    this.hidden = true;
                }

                // 验证通过后的处理...
            },
            close() {
                this.key = false;
            },
            //日期戳转换
            timestampToTime(timestamp) {
                var date = new Date(timestamp);
                var Y = date.getFullYear() + "-";
                var M =
                    (date.getMonth() + 1 < 10
                        ? "0" + (date.getMonth() + 1)
                        : date.getMonth() + 1) + "-";
                var D = date.getDate() + " ";
                var h = date.getHours() + ":";
                var m = date.getMinutes() + ":";
                var s = date.getSeconds();
                return Y + M + D;
            },
            //时间戳转换
            timestampToTimehms(timestamp) {
                var date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
                var Y = date.getFullYear() + "-";
                var M =
                    (date.getMonth() + 1 < 10
                        ? "0" + (date.getMonth() + 1)
                        : date.getMonth() + 1) + "-";
                var D = date.getDate() + " ";
                var h = date.getHours() > 10 ? date.getHours() : "0" + date.getHours();
                var m =
                    date.getMinutes() > 10 ? date.getMinutes() : "0" + date.getMinutes();
                var s =
                    date.getSeconds() > 10 ? date.getSeconds() : "0" + date.getSeconds();
                return Y + M + D + h + ":" + m + ":" + s;
            },
            //每页显示个数改变
            handleSizeChange(val) {
                this.pagesize = val;
                this.getData();
            },
            //失去焦点事件
            blur() {
                if (parseInt(this.addnewForm.count) <= parseInt(this.remaincount)) {
                    this.hidden = false;
                } else {
                    this.hidden = true;
                }
            },
            // 分页导航
            handleCurrentChange(val) {
                this.cur_page = val;
                this.getData();
            },
            // 获取数据
            getData() {
                var res = this;
                this.$axios({
                    url: this.GLOBAL._SERVER_API_ + "couponManager/list",
                    method: "post",
                    data: {
                        shopid: parseInt(localStorage.getItem("shopid")),
                        parkid: localStorage.getItem("parkingId")
                    }
                })
                    .then(function (response) {
                        if (response.data.status === 200) {
                            var adder = response.data.data;

                            for (let i = 0; i < adder.length; i++) {
                                adder[i]["names"] = "";
                            }
                            for (let i = 0; i < adder.length; i++) {
                                if (adder[i].type == 0) {
                                    adder[i].names = "全免劵";
                                } else if (adder[i].type == 1) {
                                    adder[i].names = "减免时长";
                                } else if (adder[i].type == 2) {
                                    adder[i].names = "减免金额";
                                } else if (adder[i].type == 3) {
                                    adder[i].names = "当天有效全免劵";
                                }
                            }

                            for (var i = 0; i < adder.length; i++) {
                                if (adder[i].enddate) {
                                    adder[i].enddate = res.timestampToTimehms(
                                        adder[i].enddate
                                    );
                                } else {
                                    adder[i].enddate = "";
                                }
                                if (adder[i].startdate) {
                                    adder[i].startdate = res.timestampToTimehms(
                                        adder[i].startdate
                                    );
                                } else {
                                    adder[i].startdate = "";
                                }
                            }
                            res.tableData = response.data.data;
                        }
                        ;
                    })
                    .catch(function (error) {
                        res.$message.error("查询失败: " + error);
                    });
            },

            formatter(row, column) {
                return row.address;
            },
            filterTag(value, row) {
                return row.tag === value;
            }
        }
    };
</script>

<style scoped>
    .icon-p {
        font-size: 12px;
        color: #f56c82;
    }

    .point-p {
        font-size: 12px;
        color: #f56c82;
    }

    .codeFoot {
        text-align: center;
        width: 100px;
        vertical-align: middle;
        margin: 0 auto;
    }

    .son {
        height: 100%;
        width: 100px;
        position: absolute;
        left: 50px;
    }

    .special {
        height: 350px;
        width: 300px;
        position: fixed;
        top: 35%;
        left: 45%;
        z-index: 99;
        background: white;
    }

    .son {
        height: 100px;
        width: 100px;
        left: 50px;
        position: absolute;
        top: 200px;
    }

    .btn {
        height: 30px;
        line-height: 30px;
        font-size: 20px;
        width: 100px;
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

    #qrCode > img {
        margin: 30px auto;
    }

    .icon-button {
        margin: 0 auto;
    }

    .icon-er {
        width: 500px;
        height: 600px;
        background: black;
        position: fixed;
        top: 25%;
        left: 35%;
        z-index: 99;
        background: white;
    }

    #qrcode > img {
        float: left;
        width: 450px;
        height: 450px;
        margin-top: 25px;
        margin-left: 25px;
    }

    .del-dialog-cnt {
        font-size: 16px;
        text-align: center;
    }

    .icon-pp {
        width: 176px;
        height: 22px;
        margin-top: 178px;
        text-align: center;
        padding-left: 175px;
        padding-top: 310px;
    }
</style>

