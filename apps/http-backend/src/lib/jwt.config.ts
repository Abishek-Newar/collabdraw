import { randomUUID } from "crypto"
import { importJWK, SignJWT } from "jose"

export const jwk = await  importJWK({k:(process.env.JWT_SECRET || "123123"),alg: "HS256",kty: "oct"})
const generateToken = async(payload:any) =>{
    console.log(process.env.JWT_SECRET)

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