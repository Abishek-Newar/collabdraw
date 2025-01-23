"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const client_1 = require("@prisma/client");
exports.prisma = new client_1.PrismaClient();
// const prismaClientSingleton = () =>{
//     return new PrismaClient()
// }
// declare global{
//     var prisma: undefined | ReturnType<typeof prismaClientSingleton>
// }
// const prisma = globalThis.prisma ?? prismaClientSingleton()
// console.log(prisma.user)
// export default prisma
// if(process.env.NODE_ENV !=='production') globalThis.prisma = prisma
