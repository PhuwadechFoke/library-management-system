import { createUploadthing } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  userProfileUploader: f({ image: { maxFileSize: "4MB" } })
    .middleware(async () => {
      // TODO: ใส่ auth เช็ค user จริงทีหลังได้ ตอนนี้ return object ว่างไปก่อน
      return { userId: "temp-user" };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("file url", file.url, metadata);
      return { uploadedBy: metadata.userId };
    }),

  categoryImageUploader: f({ image: { maxFileSize: "4MB" } })
    .middleware(async () => {
      return { userId: "temp-user" };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("file url", file.url, metadata);
      return { uploadedBy: metadata.userId };
    }),

  bookImageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 5 } })
    .middleware(async () => {
      return { userId: "temp-user" };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("file url", file.url, metadata);
      return { uploadedBy: metadata.userId };
    }),

  bannerImageUploader: f({ image: { maxFileSize: "8MB", maxFileCount: 4 } })
    .middleware(async () => {
      return { userId: "temp-user" };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("file url", file.url, metadata);
      return { uploadedBy: metadata.userId };
    }),
};