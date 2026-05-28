import {createServer} from "node:http";

async function main() {
    try{ 
        const server = createServer()
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
