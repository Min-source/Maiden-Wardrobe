import { get } from '../../utils/axios'
import { post } from '../../utils/axios'
import Vue from 'vue'
import ElementUI from 'element-ui'
import { from } from 'core-js/fn/array'
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
                // console.log(resp);
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
        
        //添加并修改
        addData(context,fromData){
            post("/customer/saveOrUpdate",fromData).then((resp)=>{
                console.log(resp);
                context.dispatch("findAll")
            })
        }
    },

}
export default customer