<template>
  <div class="app-container">

    <router-link tag="button" to="/city/create">添加</router-link>

    <el-table :data="tableData" style="width: 100%">

      <el-table-column type="index" label="序号" width="50" />

      <el-table-column prop="username" label="姓名" width="180" />

      <el-table-column prop="password" label="索引" />

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" >编辑</el-button>
          <!-- @click="handleEdit(scope.row._id)" -->
          <el-button size="mini" type="danger" @click="handleDelete(scope.row._id)">删除</el-button>
        </template>
      </el-table-column>

    </el-table>

    <!-- 分页 -->
    <el-pagination
      background
      layout="prev, pager, next"
      :page-size="pagesize"
      :current-page="currentPage"
      :total="total"
      @current-change="changePage"
    />
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'CityList',
  components: {},
  data() {
    return {
      currentPage: 1, // 当前页
      pagesize: 3, // 每页信息
      total: 0, // 总消息
      tableData: null // 承接信息的变量
    }
  },
  created() {
    this.getCitys()
  },
  methods: {
    getCitys() {
      axios
        .get(`/getuserInfo?page=${this.currentPage}&pagesize=${this.pagesize}`)
        .then((res) => {
          this.tableData = res.data.list
          this.total = res.data.total
        })
    },
    // handleEdit(id) {
    //   this.$router.push({
    //     path: '/city/edit/' + id
    //   })
    // },
    handleDelete(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          axios.delete('/deluser/' + id).then((res) => {
            console.log(res)
            this.$message({
              type: 'success',
              message: res.data.msg
            })
            this.getCitys()
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    changePage(page) {
      this.currentPage = page
      this.getCitys()
    }
  }
}
</script>

<style scoped></style>
