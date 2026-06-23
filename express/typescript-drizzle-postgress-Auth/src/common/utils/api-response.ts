import { Response } from "express";

class ApiResponse {
  static ok(res: Response, message = "ok", data = null) {
    return res.status(200).json({
      message,
      data,
    });
  }

  static created(
    res: Response,
    message = "successfully created",
    data: any = null
  ) {
    return res.status(201).json({
      message,
      data,
    });
  }
}

export default ApiResponse;
