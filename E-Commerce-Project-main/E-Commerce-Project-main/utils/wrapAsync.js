module.exports = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};

//to catch async errors automatically so we don't have to write try/catch in every route.
