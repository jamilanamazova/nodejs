const fs=require("fs")

const readFile=()=>{
    try {
        const data=fs.readFileSync("db.json");
        return JSON.parse(data);
    } catch (error) {
        console.log("Blog data not found",error);
        return [];
    }
    
}

module.exports={readFile}