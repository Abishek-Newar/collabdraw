import z from "zod"

export const signupValidator = z.object({
    name: z.string(),
    username: z.string(),
    email: z.string().email(),
    password: z.string().min(6)
})

export const signinValidator = z.object({
    email: z.string().email(),
    password: z.string().min(6)
})