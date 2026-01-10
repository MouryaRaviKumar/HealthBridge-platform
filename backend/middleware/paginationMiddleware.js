const { model } = require("mongoose")

const paginate = (model) =>{
    return async(req,res,next)=>{
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const results = await model.find().limit(limit).skip(startIndex).exec();
        res.paginatedResults = results;
        next();
    }
}
module.exports = paginate;