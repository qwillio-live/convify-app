"use server"

import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function signUp({ email, password }) {

  // Check if a user with the given email already exists
  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  })

  if (existingUser) {
    // return a failure message if user exists
    return { error: "User with that email already exists! Try logging in instead." }
  }

  const passwordHash = await bcrypt.hash(password, 10) // Hash the password with a salt of 10 rounds of hashing (recommended by bcrypt)
  // console.log("Password hash:", passwordHash)

  // Create the user in the database with the hashed password
  await prisma.user.create({
    data: {
      email,
      passwordHash,
    },
  })

  // Return a success message
  return { message: "Successfully created new user!" };
}