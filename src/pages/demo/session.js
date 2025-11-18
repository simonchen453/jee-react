
Vue.prototype.queryData = function(params) {
    return axios.post("/admin/session/list", params).catch(error=>{
        this.msgError("数据加载失败");
    })
}
Vue.prototype.suspendSession = function(id) {
    return axios.patch("/admin/session/suspend/" + id).catch(error => {
        this.msgError("数据加载失败");
    });
}
Vue.prototype.unsuspendSession = function(id) {
    return axios.patch("/admin/session/unsuspend/" + id).catch(error => {
        this.msgError("数据加载失败");
    });
}
Vue.prototype.killSession = function(id) {
    return axios.patch("/admin/session/kill/" + id).catch(error => {
        this.msgError("数据加载失败");
    });
}
