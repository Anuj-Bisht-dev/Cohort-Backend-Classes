import { Response } from "express";

class ApiResponse {
  static ok(res: Response, message: string = "ok", data: any = null) {
    return res.status(200).json({
      message,
      data,
    });
  }

  static created(
    res: Response,
    message: string = "successfully created",
    data: any = null
  ) {
    return res.status(201).json({
      message,
      data,
    });
  }
}

export default ApiResponse;
