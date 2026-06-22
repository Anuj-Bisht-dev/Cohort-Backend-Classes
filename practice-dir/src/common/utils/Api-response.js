class ApiResponse {

    static ok(res, message, data = null) {
        return res.status(200).json({
            message,
            data
        })
    }

    static created(res, message, data = null) {
        return res.status(201).json({
            message,
            data
        });
    }

}

export default ApiResponse;