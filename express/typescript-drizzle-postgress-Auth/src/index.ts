import "dotenv/config";
import { createServer } from "node:http";
import ApiError from "./common/utils/api-error";
import { createExpressApp } from "./app";

const main = () => {
  try {
    const server = createServer(createExpressApp());
    const PORT: number = 5000;

    server.listen(PORT, () => {
      console.log(
        `HTTP server is running in ${process.env.PROCESS} enviornment with PORT: ${PORT}`
      );
    });
  } catch (error: any) {
    throw ApiError.unauthorized(error.message);
  }
};

main();
