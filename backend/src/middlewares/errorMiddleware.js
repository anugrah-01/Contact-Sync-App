export const errorMiddleware = (error, req, res) => {
    console.error("Error:", error.message);
    res.status(error.statusCode || 500).json({
        message: error.message 
    });
};