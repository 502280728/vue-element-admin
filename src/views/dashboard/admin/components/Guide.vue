<template>
  <el-table :data="list" style="width: 100%;padding-top: 15px;" :show-header="false">
    <el-table-column label="Order_No">
      <template slot-scope="scope">
        {{ scope.row.order_no | orderNoFilter }}
      </template>
    </el-table-column>
    <!-- <el-table-column label="Price" width="195" align="center">
      <template slot-scope="{row}">
         {{ row.timestamp | timestamptostring }}
      </template>
    </el-table-column> -->
    <!-- <el-table-column label="Status" width="100" align="center">
      <template slot-scope="{row}">
        <el-tag :type="row.status | statusFilter">
          {{ row.timestamp | timestamptostring }}
        </el-tag>
      </template>
    </el-table-column> -->
  </el-table>
</template>

<script>
import { transactionList } from '@/api/remote-search'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        success: 'success',
        pending: 'danger'
      }
      return statusMap[status]
    },
    orderNoFilter(str) {
      return str.substring(0, 30)
    }
  },
  data() {
    return {
      list: null
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      transactionList().then(response => {
        this.list = response.data.items.slice(0, 4)
      })
    }
  }
}
</script>
