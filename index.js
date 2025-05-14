//expressi import edek
const express = require('express');
const { readFile } = require('./src/helpers/readfile');
const { v4: uuidv4 } = require('uuid');
const { writeFile } = require('./src/helpers/writefile');
const app = express();
//corsu import etmek
const cors=require("cors")

//muhafizeci,jsondan ayirib bize vere bilecek
app.use(express.json());

//herkes mudaxile etmesi ucun
app.use(cors())

//funksiyanin parametrlerini callback olaraq get adli method gonderecek o parametrleri ora
//"/blogs",dan sonraki hisse controllerdi

//butun elementleri bize qaytaran routing
app.get("/blogs",(req,res)=>{
    try {
        res.status(200).json({
        message:"Blogs List successfull",
        blogs:readFile()
    })
    } catch (error) {
        res.status(500).json({
        message:"Blogs List Error",
    })
    }
    
})

//blogda olan fln idli element
app.get("/blogs/:id",(req,res)=>{
    try {
        const id=req.params.id;
        const blogs=readFile();
        const blog=blogs.find((blog)=>blog.id==id);
        if(!blog){
            //menim kodumda problem olanda 404
            return res.status(404).json({
                message:"Blog not found"
            })
        }
        res.status(200).json({
            message:"Blog found",
            //tapilmis blogu qaytarir
            blog
        })
    } catch (error) {
        //serve problem olanda 500 verir
        res.status(500).json({
            message:"Blog not found"
        })
    }
})

//element elave ede bilmek ucun routing
app.post("/blogs",(req,res)=>{
    try {
        const newdata=req.body;
        const newBlog={
            id:uuidv4(),
            ...newdata
        }
        const blogs=readFile()
        blogs.push(newBlog);
        writeFile(blogs);
        res.status(201).json({
            message:"Blog created successfully",
            blog:newBlog
        })
    } catch (error) {
        console.log("Blog create error",error)
        res.status(500).json({
            message:"Blog create error"
        })
    }

})

//element deyisdire bilmek ucun 
app.patch("/blog/:id",(req,res)=>{
    try {
        //destraction yaziram
        const {id}=req.params;
        const{title,body}=req.body;

        //nullish operator ile title,body yoxlayacam
        //1)datani gedir getirir
        const blogs=readFile();
        const index=blogs.findIndex(blog=>blog.id===id)
        if(index===-1){
            return res.status(404).json({
                message:"Blog not found"
            })
        }
        //bodyden gelen title varsa o zaman bu title ver yoxdusa kohne title saxla
        blogs[index].title=title ? title:blogs[index].title;
        blogs[index].body=body ? body:blogs[index].body;
        writeFile(blogs);
        res.status(200).json({
            message:"Blog updated successfully",
            blog:blogs[index]
            })
    } catch (error) {
        console.log("blog update error",error);
        res.status(500).json({
            message:"Blog update error"
        })
    }
})

//element sile bilmek ucun
app.delete("/blog/:id",(req,res)=>{
    try {
        //paramsdan gelen id gotururem
        const{id}=req.params;
        const blogs=readFile();
        const index=blogs.findIndex(blog=>blog.id===id);
        if(index===-1){
            return res.status(404).json({
                message:"Blog not found"
            })
        }
        //bu indeksden basla birini sil
        blogs.splice(index,1)
        writeFile(blogs);
        res.status(200).json({
            message:"Blog deleted successfully"
        })
    } catch (error) {
        console.log("Blog delete error",error);
        res.status(500).json({
            message:"Blog delete error"
        })
    }
})



app.listen("8080",()=>{
    console.log("Server is running on:https://localhost:8080/");
})

//deplay edenden sonra bu apiye kenardan mudaxile ede bilmek ucun corse access vermek lazimdi
//apini qlobala cixartmaq