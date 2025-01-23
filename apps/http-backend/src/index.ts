import express, { Request, Response } from "express"
import bcrypt from "bcryptjs"
import { signinValidator, signupValidator } from "./lib/validators.js";
import {prisma} from "@repo/db/client";
import generateToken from "./lib/jwt.config.js";


const app = express()
app.use(express.json())
app.post("/signup",async(req: Request,res:Response)=>{
    const body = req.body;
    var salt = bcrypt.genSaltSync(10);
    try {
        const success = signupValidator.safeParse(body)
        if(!success.success){
            res.status(401).json({
                msg: "invalid inputs"
            });
            return;
        }
        
        const existingUser = await prisma.user.findFirst({
            where: {
                email:body.email
            }
        })
        console.log(existingUser)
        if(existingUser !== null){
            res.status(401).json({
                msg: "user already exist"
            })
            return;
        }

        const hashedPass = await bcrypt.hash(body.password,salt)

        const users = await prisma.user.create({
            data:{
                name: body.name,
                username: body.username,
                email: body.email,
                password: hashedPass
            }
        }) 

        const token= generateToken(users)

        res.json({
            token: token,
            user: {
                id: users.id,
                name: users.name,
                username: users.username,
                email: users.email
            }
        })

    } catch (error) {
        res.status(403).json({
            msg: "error while signing up"
        })
    }
});


app.post("/signin",async(req: Request,res: Response)=>{
    const body = req.body 
    try {
        const success = signinValidator.safeParse(body)

        if(!success.success){
            res.status(401).json({
                msg: "invalid inputs"
            })
            return;
        }
        
        const user = await prisma.user.findFirst({
            where:{
                OR:[
                    {email: body.login},
                    {username: body.login}
                ]
            }
        })
        if(user === null || !user){
             res.status(401).json({
                msg: "user not found"
            })
            return;
        }

        const check = await bcrypt.compare(body.password,user.password)

        if(!check){
             res.status(401).json({
                msg: "password invalid"
            })
            return;
        }

        const token = generateToken(user)

        res.json({
            token: token,
            user: {
                id: user.id,
                name: user.name,
                username :user.username,
                email: user.email
            }
        })
    } catch (error) {
        console.log(error)
        res.status(401).json({
            msg: "error while signin in"
        })
    }
})


app.post("createRoom",async(req,res)=>{
    
})

app.listen(3002,()=>{
    console.log("server connected")
})