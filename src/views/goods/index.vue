<template>
  <div class="app-container">
    <el-table :data="tableData" style="width: 100%">

      <el-table-column label="电影名" width="180">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p>电影名: {{ scope.row.title }}</p>
            <p>电影描述: {{ scope.row.desc }}</p>
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium">{{ scope.row.title }}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>

      <el-table-column label="产品价格" width="180">
        <template slot-scope="scope">
          <!-- <i class="el-icon-time"></i> -->
          <span v-if="scope.row.price" style="margin-left: 10px">{{ scope.row.price }}</span>
        </template>
      </el-table-column>

      <el-table-column label="图片" width="180">
        <template slot-scope="scope">
          <img
            :src="scope.row.img"
            alt=""
            style="width:50px;height:50px"
          >
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)"
          >编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>

    </el-table>
    <div class="block">
      <span class="demonstration" />
      <el-pagination
        :current-page.sync="currentPage"
        :page-sizes="[3, 4, 5, 6]"
        :page-size="pagesize"
        layout="sizes, prev, pager, next"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'MovieList',
  data() {
    return {
      currentPage: 1,
      total: null, // 总条数
      pagesize: 3, // 每页显示
      tableData: [
        
      ]
    }
  },
  created() {
    this.getgoodsInfo()
  },
  methods: {
    // 编辑
    handleEdit(index, row) {
      console.log(index, row);
    },
    handleDelete(index, row) {
      console.log(index, row);
      if (row._id) {
        var id = row._id
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            axios.delete('/delgoods/' + id).then((res) => {
              // console.log(res);
              this.$message({
                type: 'success',
                message: res.data.msg
              })
              this.getgoodsInfo()
            })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
      }
    },
    //
    getgoodsInfo() {
      axios
        .get(`/getgoodsInfo?page=${this.currentPage}&pagesize=${this.pagesize}`)
        .then((mon) => {
          console.log(mon)
          if (mon.data.list) {
            this.tableData = mon.data.list
            this.total = mon.data.total
          }
        })
    },
    // 分页
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.pagesize = val
      this.getgoodsInfo()
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.currentPage = val
      this.getgoodsInfo()
    }
  }
}
</script>

<style scoped>
</style>
