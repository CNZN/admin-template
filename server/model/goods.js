const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/0928', { useNewUrlParser: true, useUnifiedTopology: true })

const Schema = mongoose.Schema

const goodsSchema = new Schema({
    title: String,
    desc: String,
    price:String,
    img:String,
    p : {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Login'
    }
})

const Goods = mongoose.model('Goods', goodsSchema, 'goods')
// const city = new City({
//     name: '北京',
//     index: 'B'
// })
// city.save().then(mon => {
//     console.log(mon)
// })
// City.findOneAndDelete('5f6ad14c48460458a45335e2').then(res => {
//     console.log(res)
// })
module.exports = Goods
