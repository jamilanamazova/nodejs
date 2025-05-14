const fs=require("fs");
//hansi file elave edilecek
const writeFile=(data)=>{
    //2 bosluga nezeren ayirsin demekdir
    const stringData=JSON.stringify(data,null,2)
    fs.writeFileSync("db.json",stringData)
}

module.exports={writeFile}