const validate = (requestsType) => {
    return async (req, res, next) => {
        const { error } = requestsType.validate(req.body);
        if (error) {
            return res.status(500).json ({
            message: 'Validate error',
            error: error.details[0]?.message
            });
        }
        next();
    };
};
export default validate;