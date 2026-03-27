const paginationMiddleware = (model) => {
    return async (req, res, next) => {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        try {
            const total = await model.countDocuments();
            const results = {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
                data: await model.find().skip(skip).limit(limit).lean()
            };
            res.paginatedResults = results;
            next();
        } catch (error) {
            res.status(500).json({ message: "Pagination error", error: error.message });
        }
    };
};

module.exports = { paginationMiddleware };
