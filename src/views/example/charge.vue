<template>
  <div class="app-container">
    <div class="filter-container">
      <span class="filter-container-span">
        <el-date-picker v-model="listQuery.importance" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
      </span>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>

      <el-button class="filter-item" style="margin-left: 10px;" type="primary" @click="handleCreate">
        <svg-icon icon-class="money" />充值
      </el-button>
    </div>

    <el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;" @sort-change="sortChange">
      <el-table-column label="ID" prop="id" sortable="custom" align="center" width="80" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="充值时间">
        <template slot-scope="{row}">
          <span>{{ row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单号">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.li }}</span>
        </template>
      </el-table-column>
      <el-table-column label="充值金额" align="center">
        <template slot-scope="{row}">
          <span>{{ row.money }}</span>
        </template>
      </el-table-column>
      <el-table-column label="充值方式">
        <template slot-scope="{row}">
          <span>{{ row.chargetype }}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog title="充值" :visible.sync="dialogFormVisible">
      <div :style="{position:'relative'}">
        <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="120px" style="width: 600px; margin-left:50px;">
          <el-form-item label="充值金额" prop="type">
            <el-select v-model="temp.type" class="filter-item" placeholder="选择充值金额">
              <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
            </el-select>
          </el-form-item>
          <el-form-item label="充值方式" prop="title">
            <div class="Cashier_payMethods__34x8v">
              <div :class="{'Button_wxpayButton__1A6H2':true,'Button__payButtonBase__yFEKK':true,'Button_wxpayButton__1A6H2_selected':select_type == '1'}" style="margin-right: 20px;" @click="changeSelectType('1')">微信</div>
              <div :class="{'Button_alipayButton__31mqc':true,'Button__payButtonBase__yFEKK':true,'Button_alipayButton__31mqc_selected':select_type == '2'}" @click="changeSelectType('2')">支付宝</div>
            </div>
          </el-form-item>
        </el-form>
        <div :style="{zIndex:10, position:'absolute',right:'220px','top':'-25px',padding:'5px',border:'1px solid #ececec',width:'182px',height:'185px'}" >
          <div :style="{position:'relative'}" v-if="step1 == 1">
            <img src="~/@/assets/img/efg.png" />
            <div :style="{position:'absolute',top:'58px','left':'58px'}" >
              <img src='~/@/assets/img/wechatpay-logo.svg' />
            </div>
          </div>
          <div :style="{position:'relative'}"  v-if="step1 == 2">
            <img src="~/@/assets/img/abc.png" />
            <div :style="{position:'absolute',top:'58px','left':'58px'}" >
              <img src='~/@/assets/img/alipay-logo.svg' />
            </div>
          </div>
          <div v-if="step == 3" :style="{width:'100%',height:'100%',backgroundColor:'rgba(125,121,121,0.3)',top:'0px',left:'0px',position:'absolute','fontSize':'40px',color:'#4a4545',textAlign:'center',lineHeight:'180px'}">
            <i class="el-icon-loading"/>
          </div>
          <p :style="{textAlign:'center'}">扫描上方二维码</p>
        </div>

      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确认</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  fetchChargeList,
  fetchPv,
  createArticle,
  updateArticle
} from "@/api/article";
import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination

const calendarTypeOptions = [
  { key: "500", display_name: "500" },
  { key: "1000", display_name: "1000" },
  { key: "1500", display_name: "1500" },
  { key: "2000", display_name: "2000" }
];

// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name;
  return acc;
}, {});

export default {
  name: "ComplexTable",
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "info",
        deleted: "danger"
      };
      return statusMap[status];
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type];
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: "+id"
      },
      importanceOptions: ["部门1", "部门2", "部门3"],
      calendarTypeOptions,
      sortOptions: [
        { label: "ID Ascending", key: "+id" },
        { label: "ID Descending", key: "-id" }
      ],
      statusOptions: ["published", "draft", "deleted"],
      showReviewer: false,
      temp: {
        id: undefined,
        importance: 1,
        remark: "",
        timestamp: new Date(),
        title: "",
        type: "",
        status: "published",
        select_type: "1"
      },
      select_type:"1",
      step1:1,
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "Edit",
        create: "Create"
      },
      step:undefined,
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [
          { required: true, message: "请选择充值金额", trigger: "change" }
        ],
        timestamp: [
          {
            type: "date",
            required: true,
            message: "timestamp is required",
            trigger: "change"
          }
        ],
        title: [
          { required: true, message: "请选择充值方式", trigger: "blur" }
        ]
      },
      downloadLoading: false
    };
  },
  created() {
    this.getList();
  },
  methods: {
    changeSelectType(select_type) {
      this.select_type = select_type
      this.step = 3
      const self = this
      setTimeout(()=>{
        self.step = select_type
        self.step1 = select_type
      },500)
    },
    getList() {
      this.listLoading = true;
      fetchChargeList(this.listQuery).then(response => {
        this.list = response.data.items;
        this.total = response.data.total;

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false;
        }, 1.5 * 1000);
      });
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: "操作Success",
        type: "success"
      });
      row.status = status;
    },
    sortChange(data) {
      const { prop, order } = data;
      if (prop === "id") {
        this.sortByID(order);
      }
    },
    sortByID(order) {
      if (order === "ascending") {
        this.listQuery.sort = "+id";
      } else {
        this.listQuery.sort = "-id";
      }
      this.handleFilter();
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        importance: 1,
        remark: "",
        timestamp: new Date(),
        title: "",
        status: "published",
        type: ""
      };
    },
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    createData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.temp.id = parseInt(Math.random() * 100) + 1024; // mock a id
          this.temp.author = "vue-element-admin";
          createArticle(this.temp).then(() => {
            this.list.unshift(this.temp);
            this.dialogFormVisible = false;
            this.$notify({
              title: "Success",
              message: "Created Successfully",
              type: "success",
              duration: 2000
            });
          });
        }
      });
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row); // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp);
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    updateData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.temp);
          tempData.timestamp = +new Date(tempData.timestamp); // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateArticle(tempData).then(() => {
            const index = this.list.findIndex(v => v.id === this.temp.id);
            this.list.splice(index, 1, this.temp);
            this.dialogFormVisible = false;
            this.$notify({
              title: "Success",
              message: "Update Successfully",
              type: "success",
              duration: 2000
            });
          });
        }
      });
    },
    handleDelete(row, index) {
      this.$notify({
        title: "Success",
        message: "Delete Successfully",
        type: "success",
        duration: 2000
      });
      this.list.splice(index, 1);
    },
    handleFetchPv(pv) {
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData;
        this.dialogPvVisible = true;
      });
    },
    handleDownload() {
      this.downloadLoading = true;
      import("@/vendor/Export2Excel").then(excel => {
        const tHeader = ["timestamp", "title", "type", "importance", "status"];
        const filterVal = [
          "timestamp",
          "title",
          "type",
          "importance",
          "status"
        ];
        const data = this.formatJson(filterVal);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: "table-list"
        });
        this.downloadLoading = false;
      });
    },
    formatJson(filterVal) {
      return this.list.map(v =>
        filterVal.map(j => {
          if (j === "timestamp") {
            return parseTime(v[j]);
          } else {
            return v[j];
          }
        })
      );
    },
    getSortClass: function (key) {
      const sort = this.listQuery.sort;
      return sort === `+${key}` ? "ascending" : "descending";
    }
  }
};
</script>

<style scoped>
.filter-container-span {
  display: inline-block;
  float: left;
  margin-right: 10px;
}

.Button_wxpayButton__1A6H2 {
  padding-left: 36px;
  background-color: #00c800;
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAACm0lEQVRIS+WWS4hPcRTHP1+ZKGLCJNJIKQuaohnk0WyEhZpsPbLwKikpomQ3IY+axshCWXiXolCUDZKiGRZYeSyUx0gyIfI6OtP96/rNfc78a5Szu/f+fudzz/md3/ccMUimQeLy74PNbCiwEFgMLAAmAuMBf/8BeAp0AteA65J+ZmUzN2IzGw6sBbYDkwsezUugDeiQ9DVpTybYzGYCZ4FpBYHhMs/CGkl3wg+pYDNbARwHhvUTWtn2DVgn6WTcTyLYzFqA80DNAKGV7b+AFklXKi/6gM3Mz/ExMKJK0IfAAeCcpO9Z4MvAsipAbwD7JV11X2Y2Flgpqd2f/4rYzJqAewOA+hW66BFK6vVjZkP8jIE9gMObJHWGYL8CWwKwAW+ACRk/9AU4ARyS9KSyzswagSPA7NjeNklbQ/B9wK9Q3DwKF4pWYGOQpffAUaBd0tsYcEwU4XrAI45bl6TGENwDjEqIbJWk02a2BNgJjATOAMckfYoBHeJi42kdl5KhHkm1IdirziUwtLuS5madfVQfHUFak7b8kFQTgj1ddSmAOZWCiX+PqnVvFGmY1iRX7yTVhWC/As0p4FOSVgdp3RCdvVdrUbslqTkE74ocJTlx6auX1G1m84DDwKyitNi63ZJaQ3B91N7SpLIL8EpeFGpAwR/wGpoq6UWSZPq921TQUdllByV5e+07gZjZaOABMKWs15z1z4EGSZ8Twf7SzGYANwEXgmpYt08vcVXL6scNwKUSU0faDz4DlkvyLvXH8iaQ6cCjfobsGu/Nf7Okj6GPPPBSoLetReYNPU8kfMa6AOwLoywT8baoifsUuSPS5/nRlDkppnJ+hq+A24ALhHerTMuL2Jt2rUMlvc5zVuZ77nhbxlmZtf8f+DeBltIf4kptWQAAAABJRU5ErkJggg==);
  background-repeat: no-repeat;
  background-size: 30px 30px;
  background-position: 7px 5px;
}

.Button_alipayButton__31mqc {
  padding-left: 34px;
  background-color: #00aced;
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAACpUlEQVRIS82XS4iNYRjHf//cJopSQinlVszGpaRYjEtCLgk7C5fMSkiNjZVigzIuC7OZZIPIAlHGUEMWhpQyRi7lFqEQuY3x6JneM858837Od75MM0+dznn73uf5fe9zfY/oJVEvcek7YDMbAGwD1gETAV/nkTbgEXAMqJXk607pcuIAvQAszEP6h85lYGkxPAmuAfb+Z2jB3A5J+wqLJPg+MCUD+DpwLezbBIzOoNMiqTIN/DNjTLdIOuxGzOw2MCMDuE3SwDSwZTDgW/KAkdTp4aSrk2DPys2Rl2mV9DyceBYwNLLnSKiKv5lcBvgTcCNitE7S+QCuBSZE9swBhnUpoTLArtcOfEsYrpF0NICbgGmJ50Oge3Mqx9VurwVYkiH2LyW1m9lI4BXQL6lTLjgDkzfAmACuBupiSuWAvc15bb8A+gPDQ8L4d7EckLQ9uL4BWJAX7NntWblb0tukETMbD8wHlgNVQKWkZ2Y2HfC6jg6fLCfeD+wENgCzgQrgPXAPaJLkXugQM6uQ9D38PgOsSotNKfBXYBRwNs1lwIMQx3pJn4teYgSwMnzmAZ2dyveUAt8EtgLNJbLKgXMl3YntMzOvYa+GFcBibzKlwLeANcDTWEkEyEdgtaRGdzVwEmgFDkp6HckJP3mVJB+PHRJrmT4oxgFrgT0R+FWgWtITMxsEnAaWBXs/gBOAZ7nnQ6qk9eorwdhYYFGI+QegQdLdkEiTgFPA1Ih1r4pGfwHgkqRuwycJLh6L3rF2ARclfQkwr2UvGffGRmBwiTzwxw+BQ8Dxgp2Yqx02OWHsF/Au9GzPWndvHmmWNDMtxj159fHB4v0hmlx+o+yJy945r21Jv6PgEMfC9XZ9mLN5r7ceosdAfcnrbZ7A5dXpO/8k8p6gXL0/mZkDLijGOG0AAAAASUVORK5CYII=);
  background-repeat: no-repeat;
  background-size: 30px 30px;
  background-position: 7px 5px;
}
.Button__payButtonBase__yFEKK {
  display: inline-block;
  display: inline-block;
  width: 120px;
  text-align: right;
  padding-right: 30px;
  border-radius: 5px;
  cursor: pointer;
}
.Button_alipayButton__31mqc_selected {
  box-shadow: 0 0 5px 0 #00aced;
}
.Button_wxpayButton__1A6H2_selected {
  box-shadow: 0 0 5px 0 #00c800;
}
</style>>
