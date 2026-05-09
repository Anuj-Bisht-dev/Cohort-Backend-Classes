class ApiResponse {
    static ok(res, message, data = null) {
        return res.status(200).json({
            message,
            data
        })
    }

    static created(res, message, data = null) {
        return res.staus(201).json({
            message,
            data
        });
    }

    static noContent(res) {
        return res.status(204).send();
    }

}

export { ApiResponse }