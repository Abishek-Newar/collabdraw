import express from "express"
import bcrypt from "bcrypt"
import { signinValidator, signupValidator } from "../lib/validators.js";
import prisma from "@repo/db/client";
import generateToken from "../lib/jwt.config.js";

const userRouter = express.Router()

userRouter.post("/signup",async(req,res)=>{
    const body = req.body;
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

        if(!existingUser || existingUser == null){
            res.status(401).json({
                msg: "user already exist"
            })
            return;
        }

        const hashedPass = await bcrypt.hash(body.password,10)
        //@ts-ignore
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


userRouter.post("/signin",async(req,res)=>{
    const body = req.body 
    try {
        const success = signinValidator.safeParse(body)

        if(!success.success){
            res.status(401).json({
                msg: "invalid inputs"
            })
            return;
        }
        //@ts-ignore
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

        const check = await bcrypt.compare(user.password,body.password)

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


userRouter.post("createRoom",async(req,res)=>{
    
})


export default userRouter