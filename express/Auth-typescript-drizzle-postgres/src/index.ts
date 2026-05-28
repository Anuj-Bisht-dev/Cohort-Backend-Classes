import {createServer} from "node:http";
import { createExpressApplication } from "./app";

async function main() {
    try{ 
        const server = createServer(createExpressApplication());
        const PORT:number = 5000;

        server.listen(PORT, () => {
            console.log(`http server is runnning on ${PORT} port`);
        })
    }catch(error){
        console.log("Error strarted in http server");
        throw error;
    }   
}

main();
