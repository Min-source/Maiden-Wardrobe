<template>
  <div class="customer-container">
    <!-- 按钮 -->
    <el-row style="margin: 10px; position: relative">
      <el-button type="primary" size="small" @click="dialogVisible = true"
        >添加</el-button
      >
      <el-button type="danger" size="small" @click="selectDeleteHandler()"
        >批量删除</el-button
      >
      <el-input
        placeholder="请输入内容"
        v-model="query_id"
        clearable
        size="small"
        style="width: 150px; position: absolute; right: 220px"
      ></el-input>
      <el-button
        icon="el-icon-search"
        round
        size="small"
        style="position: absolute; right: 200px"
        @click="handleFindById(query_id)"
      ></el-button>
    </el-row>
    <!-- 模态框 -->
    <el-dialog title="保存顾客信息" :visible.sync="dialogVisible" width="30%">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="序号" prop="id">
          <el-input v-model="ruleForm.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="ruleForm.username"></el-input>
        </el-form-item>
        <el-form-item label="真实姓名" prop="realname">
          <el-input v-model="ruleForm.realname"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            type="password"
            v-model="ruleForm.password"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input
            type="password"
            v-model="ruleForm.checkPass"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="用户类型" prop="type">
          <el-input type="text" disabled value="customer"></el-input>
        </el-form-item>
        <el-form-item label="联系方式" prop="telephone">
          <el-input v-model="ruleForm.telephone"></el-input>
        </el-form-item>
        <el-form-item label="微信名" prop="wxid">
          <el-input v-model="ruleForm.wxid"></el-input>
          （可选）
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch
            v-model="ruleForm.status"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-value="启用"
            inactive-value="禁用"
          ></el-switch>
          {{ ruleForm.status }}
        </el-form-item>
        <el-form-item label="头像" prop="imgPhoto">
          <!-- 上传头像 -->
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetForm('ruleForm')">重置</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')"
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
      <el-table-column prop="id" label="序号" width="100"> </el-table-column>
      <el-table-column prop="username" label="用户名" width="120">
      </el-table-column>
      <el-table-column prop="realname" label="真实姓名" width="120">
      </el-table-column>
      <el-table-column prop="password" label="密码" width="100">
      </el-table-column>
      <el-table-column prop="type" label="用户类型" width="120">
      </el-table-column>
      <el-table-column prop="telephone" label="手机号" width="120">
      </el-table-column>
      <el-table-column prop="wxid" label="微信号" width="120">
      </el-table-column>
      <el-table-column prop="status" label="状态"> </el-table-column>
      <el-table-column prop="imgPhoto" label="头像" width="350">
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
  </div>
</template>
<script>
import { mapState } from "vuex";
import { mapGetters } from "vuex";
import { mapActions } from "vuex";
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    var validateTel = (rule, value, callback) => {
      var pattern = /^[1]+[3,8]+\d{9}$/g;
      var res = pattern.test(value);
      if (!res) {
        callback(new Error("请输入正确格式"));
      } else {
        callback();
      }
    };
    return {
      query_id: "",
      dialogVisible: false,
      ids: [],
      ruleForm: {
        username: "",
        realname: "",
        password: "",
        checkPass: "",
        type: "customer",
        telephone: "",
        wxid: "",
        status: "",
        imgPhoto: "",
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        realname: [
          { required: true, message: "请输入真实姓名", trigger: "blur" },
        ],
        password: [
          { min: 4, max: 6, message: "长度在 4 到 6 个字符", trigger: "blur" },
        ],
        checkPass: [{ validator: validatePass, trigger: "blur" }],
        telephone: [{ validator: validateTel, trigger: "blur" }],
        status: [{ required: true, message: "请选择状态", trigger: "change" }],
      },
    };
  },
  created() {
    this.findAll();
  },
  computed: {
    ...mapState("customer", ["tableData"]),
  },
  methods: {
    ...mapActions("customer", [
      "findAll",
      "findById",
      "addData",
      "deleteData",
      "batchDelete",
    ]),
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
    //根据用户id查询
    handleFindById(query_id) {
      this.findById(query_id);
    },
    //删除
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
    //修改
    handleUpdate(row) {
      this.dialogVisible = true;
      this.ruleForm = row;
    },
    //模态框重置
    resetForm(ruleForm) {
      this.$refs[ruleForm].resetFields();
    },
    //模态框提交
    submitForm(ruleForm) {
      this.$refs[ruleForm].validate((valid) => {
        if (valid) {
          this.$message({
            message: "添加成功",
            type: "success",
          });
          this.addData(this.ruleForm);
          this.dialogVisible = false;
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
};
</script>
<style></style>