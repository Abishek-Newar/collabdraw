import { prisma } from "@repo/db/client"
import { importJWK, jwtVerify } from "jose"
import {WebSocket, WebSocketServer} from "ws"

const wss = new WebSocketServer({port: 3001})


interface User  {
    ws: WebSocket,
    rooms: string[],
    userId: string
}

const users:User[] = []


async function checkUser(token:string):Promise<string | null>{
    const jwk = await  importJWK({k:(process.env.JWT_SECRET || "123123"),alg: "HS256",kty: "oct"})

    const { payload, protectedHeader } = await jwtVerify(token, jwk)
    if(payload.id){
        return payload.id as string
    }else{
        return null
    }
}
wss.on("connection",async function connection(ws,request){
    ws.send("connected to server")
    const url = request.url

    if(!url){
        return;
    }

    const queryParams = new URLSearchParams(url.split("?")[1])
    const token = queryParams.get('token') || ""
    const userId = await checkUser(token)

    if(!userId){
        ws.close()
        return null 
    }

    users.push({
        userId,
        rooms: [],
        ws
    })
    ws.on('message',async function message(data){
        const parsedData = JSON.parse(data as unknown as string)

        if(parsedData.type === "join_room"){
            const user = users.find(x=>x.ws === ws)
            user?.rooms.push(parsedData.roomId)
        }

        if(parsedData.type === "leave_room"){
            const user = users.find(x=>x.ws === ws)
            if(!user){
                return
            }
            user.rooms = user?.rooms.filter(x=>x === parsedData.roomId)
        }

        if(parsedData.type === "chat"){
            const roomId = parsedData.roomId;
            const message = parsedData.message;


            await prisma.chat.create({
                roomId,
                message: message,
                userId
            })
            users.forEach(user=>{
                if(user.rooms.includes(roomId)){
                    user.ws.send(JSON.stringify({
                        type: "chat",
                        message: message,
                        roomId
                    }))
                }
            })
        }
    })
})