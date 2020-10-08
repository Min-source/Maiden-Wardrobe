import { get } from '../../utils/axios'
import { post } from '../../utils/axios'
import Vue from 'vue'
import ElementUI from 'element-ui'
Vue.use(ElementUI)
const customer = {
    namespaced: true,
    state: {
        tableData: [],
    },
    getters: {},
    mutations: {
        resetTabledata(state, data) {
            state.tableData = data;
        }
    },
    actions: {
        //加载顾客信息
        findAll(context) {
            get("/customer/findAll").then((resp) => {
                console.log(resp);
                context.commit("resetTabledata", resp.data);
            })
        },
        //根据id查询
        findById(context, id) {
            get("/customer/findCustomerById?id=" + id).then((resp) => {
                ElementUI.MessageBox.alert("用户名：" + resp.data.username + "，真实姓名：" + resp.data.realname + "，手机号：" + resp.data.telephone + "，微信号：" + resp.data.wxid + "，状态:" + resp.data.status, '显示查询顾客信息', {
                    confirmButtonText: '确定',
                });
            })
        },
        //删除
        deleteData(context, id) {
            get("customer/deleteById?id=" + id).then((resp) => {
                if (resp.status == 200) {
                    ElementUI.Message({
                        showClose: true,
                        message: resp.statusText,
                        type: "success",
                    });
                    context.dispatch("findAll")
                } else {
                    ElementUI.Message({
                        showClose: true,
                        message: resp.statusText,
                        type: "error",
                    });
                }
            })
        },
        //添加并修改
        addData(context, fromData) {
            post("/customer/saveOrUpdate", fromData).then((resp) => {
                // console.log(resp);
                context.dispatch("findAll")
            })
        },
        //批量删除
        batchDelete(context, ids) {
            post("/customer/batchDelete?ids=" + ids).then((resp) => {
                // console.log(resp);
                if (resp.status == 200) {
                    ElementUI.Message({
                        showClose: true,
                        message: resp.statusText,
                        type: "success",
                    });
                    context.dispatch("findAll")
                } else {
                    ElementUI.Message({
                        showClose: true,
                        message: resp.statusText,
                        type: "error",
                    });
                }
            })
        },
    },

}
export default customer