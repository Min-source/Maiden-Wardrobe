import { get } from '../../utils/axios'
import { post } from '../../utils/axios'
import Vue from 'vue'
import ElementUI from 'element-ui'
Vue.use(ElementUI)
const category = {
    namespaced: true,
    state: {
        tableData: [],
        total: 0,
        listQuery: {
            page: 1,
            limit: 5
        },
        imageUrl:"",
    },
    getters: {},
    mutations: {
        resetTabledata(state, data) {
            state.tableData = data;
        }
    },
    actions: {
        // 分页查询
        fetchData(context) {
            let params = {
                page: context.state.listQuery.page - 1,
                pageSize: context.state.listQuery.limit
            }
            post("/category/query", params).then((resp) => {
                context.state.total = resp.data.total;
                context.commit('resetTabledata', resp.data.list);
            })
        },
        //添加或修改
        addData(context, formData) {
            //将保存的图片地址赋给表单
            context.state.tableData.icon=context.state.imageUrl
            post("/category/saveOrUpdate", formData).then((resp) => {
                // console.log(resp);
                if (resp.status == 200) {
                    ElementUI.Message({
                        showClose: true,
                        message: "保存成功",
                        type: "success",
                    });
                    context.dispatch("fetchData")
                } else {
                    ElementUI.Message({
                        showClose: true,
                        message: "保存失败",
                        type: "error",
                    });
                }
            })
        },
        //删除
        deleteData(context, id) {
            get("/category/deleteById?id=" + id).then((resp) => {
                // console.log(resp);
                if (resp.status == 200) {
                    ElementUI.Message({
                        showClose: true,
                        message: resp.statusText,
                        type: "success",
                    });
                    context.dispatch("fetchData")
                } else {
                    ElementUI.Message({
                        showClose: true,
                        message: resp.statusText,
                        type: "error",
                    });
                }
            })
        },
        //批量删除
        batchDelete(context, ids) {
            post("/category/batchDelete?ids=" + ids).then((resp) => {
                // console.log(resp);
                if (resp.status == 200) {
                    ElementUI.Message({
                        showClose: true,
                        message: resp.statusText,
                        type: "success",
                    });
                    context.dispatch("fetchData")
                } else {
                    ElementUI.Message({
                        showClose: true,
                        message: resp.statusText,
                        type: "error",
                    });
                }
            })
        },
        //保存图片url,上传方法
        handleAvatarSuccess(context,resp) {
            var imgurl='http://121.199.29.84/8888/group1/'
            // 图片地址为 【服务器地址/groupName/id】
            console.log(resp);
            context.state.imageUrl = imgurl + resp.data.id
            console.log(context.state.imageUrl);
        },

    },
}
export default category