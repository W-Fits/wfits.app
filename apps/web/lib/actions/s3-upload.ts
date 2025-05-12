"use server";

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { randomUUID } from "crypto"
import { env } from "@/lib/env"

const s3 = new S3Client({
  region: env.AWS_DEFAULT_REGION,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
})


export async function s3Upload(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  const fileExtension = file.name.split(".").pop()
  const key = `posts/${randomUUID()}.${fileExtension}`

  const uploadParams = {
    Bucket: "wfits-bucket",
    Key: key,
    Body: buffer,
    ContentType: "image/png"
  }

  await s3.send(new PutObjectCommand(uploadParams))

  return `https://wfits-bucket.s3.amazonaws.com/${key}`
}