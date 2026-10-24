
export const errorHandler = (err, req, res, next)=>{
    res.status(err.cause || 500 ).json({
        message : err.message || "Internal server error",
        stack : err.stack
    })
}