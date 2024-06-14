const express =require('express');
const app=express();
const dotenv =require('dotenv').config()
const port = process.env.port
const mongoose=require('mongoose');
mongoose.connect(process.env.db).then(()=>{
    console.log('connected succefully')
}).catch((err)=>{
    console.log(` connection failed ${err}`);
})
app.use(express.json())
// create a schema
const date = new Date()
const userModel=new mongoose.Schema({
    name:{type:String,required:[true,'kindly provide your name']},
    email:{type:String,unique:true,required:[true,'kindly provide your email']},
    stack:{type:String},
    dateOfBirth:{type:Number,required:true},
    sex:{type:String,required:true,enum:['MALE','FEMALE']},
    age:{type:Number}
},{timestamps:true})
const mymodel= mongoose.model('secondmongoDB',userModel)
app.get("/",(req,res)=>{
    res.status(200).json("WELCOME TO MONGO DB API")
});
app.post('/createuser',async(req, res)=>{
try {

    const{name,email,stack,dateOfBirth,sex}=req.body
    let fullName = name.split(" ")
    let removeSpace =fullName.filter((space)=>space !=="")
    let firstLetter = removeSpace[0].slice(0,1).toUpperCase()
    let remainingLetters = removeSpace[0].slice(1).toLowerCase()
    let totalName = firstLetter+remainingLetters
    let firstLetter2 = removeSpace[1].slice(0,1).toUpperCase()
    let remainingLetters2 = removeSpace[1].slice(1).toLowerCase()
    let totalNamw2 =firstLetter2+remainingLetters2
    const data ={name:totalName+" "+totalNamw2,email:email.toLowerCase(),stack,dateOfBirth,sex:sex.toUpperCase(),age:date.getFullYear()-dateOfBirth}
    const createUser=await mymodel.create(data)
    res.status(200).json({
        message:`user created`,
        data:createUser
    })
} catch (error) {
    res.status(500).json(error.message)
}
});
app.get('/allstudents',async(req,res)=>{
    try {
       const getAllStudent = await mymodel.find()
        res.status(200).json({
            message:`kindly find ${getAllStudent.length} student`,
            data:getAllStudent
        })
        
    } catch (error) {
        res.status(500).json(error.message)
        
    }
})
app.get('/getone/:id',async(req,res)=>{
    try {
        let myId=req.params.id
        const getOneId=await mymodel.find(myId)
        res.status(200).json({
            message:`student with the ID found`,myId,
            data:getOneId
        })
    } catch (error) {
        res.status(500).json(error.message)
    }
})
app.put('/updateuser/:id',async(req, res)=>{
    try {
        let id = req.params.id
    const updateClient = await mymodel.findByIdAndUpdate(id,req.body,{new:true})
    res.status(200).json({
        message:`student updated successfully`,updateClient,
        data:updateClient
    })
    } catch (error) {
        res.status(500).json(error.message)
    }
})
// app.delete('/deletestudent/:id',async(req, res)=>{
//     try {
//         let id = req.params.id
//         const deleteStudent = await mymodel.findByIdAndDelete(id,req.body)
//         res.status(200).json({
//             message:`user deleted sucessfully ${id}`,deleteStudent
//         })

//     } catch (error) {
//         res.status(500).json(error.message)
//     }
// })
app.listen(port,()=>{
    console .log(` my app is running on port ${port}`)
});