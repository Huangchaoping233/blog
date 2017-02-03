var db = require('./db_base')
var DBBase = db.DBBase
var mongoose = db.mongoose
var Schema = mongoose.Schema
//创建book集合的数据结构
var LearnSchema = new Schema({
    title:String,
    content:String,
    date:String
})

var Learn = mongoose.model('learn',LearnSchema) //创建Learn模型

/**
 * 书籍模型
 */
class LearnDal extends DBBase{
    constructor(){
        super(Learn)
    }
    /**
     * 分页取数据
     * @param  {[type]}   page     当前页码
     * @param  {[type]}   filter   查询条件
     * @param  {Function} callback 回调函数
     * @return {[type]}            [description]
     */
    getDataByPage(page,filter,callback){
        var pageSize = global.pageSize //每页显示的数量
        this.model.count(filter) //统计记录数量
            .then(count=>{
                // console.log(count)
                var pageCount = Math.ceil(count/pageSize)
                if(page>pageCount){ //防止页码超出范围
                    page=pageCount
                }
                // 防止查询不到结果的时候page值变为0导致skip跳过的参数为负数
                if(page<=0){
                    page = 1
                }
                this.model.find(filter) //根据条件进行查询
                    .limit(pageSize)
                    .skip(pageSize*(page-1))
                    .sort({_id:-1})
                    .then(res=>{
                        //返回两个数据 总页数和查询结果
                        callback({pageCount:pageCount,res:res})
                    })
                    .catch(err=>{
                        console.log(err)
                    })
            })
    }
}

module.exports = {
    Learn:Learn,
    LearnDal:LearnDal
}
