<template>
  <div class="category-container">
    <!-- 按钮 -->
    <el-row style="margin: 10px">
      <el-button type="primary" size="small" @click="handleAdd()"
        >添加</el-button
      >
      <el-button type="danger" size="small" @click="selectDeleteHandler()"
        >批量删除</el-button
      >
    </el-row>
    <!-- 模态框 -->
    <el-dialog title="保存栏目信息" :visible.sync="dialogVisible" width="30%">
      <el-form label-width="80px" :model="formData">
        <el-form-item label="栏目名称">
          <el-input v-model="formData.name"></el-input>
        </el-form-item>
        <el-form-item label="栏目图标" prop="icon">
          <!-- 上传图片 只需修改文件服务器地址action -->
          <el-upload
            class="avatar-uploader"
            action="http://47.106.244.1:5588/file/upload"
            :show-file-list="true"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="父栏目">
          <el-input v-model="formData.parentId"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitWaiter(formData)"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 表格 -->
    <el-table
      :data="tableData"
      stripe
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="80"> </el-table-column>
      <el-table-column prop="id" label="序号" width="180"> </el-table-column>
      <el-table-column prop="name" label="栏目名称" width="180">
      </el-table-column>
      <el-table-column prop="icon" label="栏目图标"> </el-table-column>
      <el-table-column prop="parentId" label="父栏目" width="180">
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            @click="handleDelete(scope.row.id)"
            >删除</el-button
          >
          <el-button type="text" size="small" @click="handleUpdate(scope.row)"
            >修改</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <template>
      <pagination
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @pagination="fetchData"
      />
    </template>
  </div>
</template>
<script>
import Pagination from "@/components/Pagination";
import { mapState } from "vuex";
import { mapGetters } from "vuex";
import { mapActions } from "vuex";
import qs from "qs";
export default {
  data() {
    return {
      dialogVisible: false,
      formData: {
        name: "",
        icon: "",
        parentId: "",
      },
      ids: [],
    };
  },
  components: { Pagination },
  created() {
    this.fetchData();
  },
  computed: {
    ...mapState("category", ["tableData", "total", "listQuery", "imageUrl"]),
  },
  methods: {
    ...mapActions("category", [
      "fetchData",
      "addData",
      "deleteData",
      "batchDelete",
      "handleAvatarSuccess",
    ]),
    //图片上传
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    //添加
    handleAdd(){
      this.formData={};
      this.dialogVisible = true;
    },
    //模态框提交
    submitWaiter(formData) {
      this.dialogVisible = false;
      this.addData(formData);
    },
    // 删除
    handleDelete(id) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.deleteData(id);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 修改
    handleUpdate(row) {
      this.dialogVisible = true;
      this.formData = row;
    },
    //当复选按钮发生变化
    handleSelectionChange(val) {
      this.ids = val.map((item) => item.id);
    },
    //批量删除
    selectDeleteHandler() {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.batchDelete(this.ids);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
};
</script>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>