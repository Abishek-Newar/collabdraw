import { randomUUID } from "crypto"
import { importJWK, SignJWT } from "jose"

export const env ={
    JWT_SECRET: process.env.JWT_SECRET || "1234123"
}


const generateToken = async(payload:any) =>{
    const jwk = await  importJWK({k:process.env.JWT_SECRET,alg: "HS256",kty: "oct"})

    const jwt = await new SignJWT({
        ...payload,
        iat: Math.floor(Date.now()/1000),
        jti: randomUUID()
    })
    .setProtectedHeader({alg: "HS256"})
    .setExpirationTime('20d')
    .sign(jwk)

    return jwt
}

export default generateToken