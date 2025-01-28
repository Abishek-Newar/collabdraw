"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const crypto_1 = require("crypto");
const jose_1 = require("jose");
exports.env = {
    JWT_SECRET: process.env.JWT_SECRET || "1234123"
};
const generateToken = async (payload) => {
    const jwk = await (0, jose_1.importJWK)({ k: process.env.JWT_SECRET, alg: "HS256", kty: "oct" });
    const jwt = await new jose_1.SignJWT({
        ...payload,
        iat: Math.floor(Date.now() / 1000),
        jti: (0, crypto_1.randomUUID)()
    })
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime('20d')
        .sign(jwk);
    return jwt;
};
exports.default = generateToken;
