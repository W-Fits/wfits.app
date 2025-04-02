import { ItemUpload } from "@/components/upload/item-upload";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export default async function UploadClothesPage() {
  const session = await getServerSession(authOptions);

  return session && (
    <ItemUpload session={session} />
  );
}