//查询字典类型列表
Vue.prototype.queryData = function(params) {
    return axios.post("/admin/dict/list", params).catch(error=>{
        this.msgError("数据加载失败");
    })
}
//加载字典类型详细信息
Vue.prototype.getDict = function(id) {
    return axios.get("/admin/dict/detail/" + id).catch(error=>{
        this.msgError("数据加载失败");
    })
}
//更新字典类型信息
Vue.prototype.updateDict = function(params) {
    return axios.patch("/admin/dict/edit", params).catch(error=>{
        this.msgError("数据更新失败");
    });
}
//创建字典类型
Vue.prototype.addDict = function(params) {
    return axios.post("/admin/dict/create", params).catch(error=>{
        this.msgError("数据创建失败");
    });
}
//删除字典类型
Vue.prototype.delDict = function(ids) {
    return axios.delete("/admin/dict/delete?ids=" + ids).catch(error => {
        this.msgError("数据删除失败");
    });
}
Vue.prototype.activeDict = function(id) {
    return axios.patch("/admin/dict/active/"+id).catch(error=>{
        this.msgError("数据创建失败");
    });
}
Vue.prototype.inactiveDict = function(id) {
    return axios.patch("/admin/dict/inactive/"+id).catch(error=>{
        this.msgError("数据创建失败");
    });
}
