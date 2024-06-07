"use client"

import React, { useCallback, useState } from "react"
// import { IoCloudUploadOutline } from "react-icons/io5";
import { UploadCloud } from "lucide-react"
import { useDropzone } from "react-dropzone"

import { Button } from "./button"
import { Input } from "./input"
import RadialProgress from "./radial-progress"

// import { uploadImageToCloudinary } from "@/lib/api";
// import { AxiosProgressEvent } from "axios";

// const apiKey = process.env.NEXT_PUBLIC_API_KEY;
// const uploadPreset = process.env.NEXT_PUBLIC_UPLOAD_PRESET;

interface ImageUploadProps {
  onUploadComplete: (url: string) => void
  backgroundImage?: string
  removeSelectedImage: () => void
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onUploadComplete,
  backgroundImage,
  removeSelectedImage,
}) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [progress, setProgress] = useState<number>(0)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length) {
      const image = event.target.files[0]
      setSelectedImage(image)
      handleImageUpload(image)
    }
  }

  const handleImageUpload = async (image: File) => {
    if (image) {
      const reader = new FileReader()
      reader.onload = () => {
        const result = reader.result
        if (typeof result === "string") {
          onUploadComplete(result)
        } else {
          console.error(
            "Expected result to be a string, but got:",
            typeof result
          )
        }
      }
      reader.readAsDataURL(image)
    }
  }

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const image = acceptedFiles[0]
      setSelectedImage(image)
      handleImageUpload(image)
    }
  }, [])

  const { getRootProps, getInputProps } = useDropzone({ onDrop })

  return (
    <div className="space-y-3">
      <div {...getRootProps()} className="h-auto">
        <label
          htmlFor="dropzone-file"
          className="relative flex flex-col items-center justify-center p-6 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600 w-full visually-hidden-focusable h-full"
        >
          {loading && (
            <div className="text-center max-w-md">
              <RadialProgress progress={progress} />
              <p className="text-sm font-semibold">Uploading Picture</p>
              <p className="text-xs text-gray-400">
                Do not refresh or perform any other action while the picture is
                being uploaded
              </p>
            </div>
          )}

          {!loading && !backgroundImage && (
            <div className="text-center">
              <div className="border p-2 rounded-md max-w-min mx-auto">
                {/* <IoCloudUploadOutline size="1.6em" /> */}
                <UploadCloud />
              </div>

              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Drag an image</span>
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-400">
                Select a image or drag here to upload directly
              </p>
            </div>
          )}

          {backgroundImage && !loading && (
            <div className="text-center space-y-2">
              {backgroundImage && (
                <div
                  style={{
                    backgroundImage: backgroundImage,
                    width: "100%",
                    height: "140px",
                    margin: "0 auto",
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                  }}
                ></div>
              )}
              <div className="space-y-1">
                <p className="text-sm font-semibold">Image Uploaded</p>
                <p className="text-xs text-gray-400">
                  Click here to upload another image
                </p>
              </div>
            </div>
          )}
        </label>

        <Input
          {...getInputProps()}
          id="dropzone-file"
          accept="image/png, image/jpeg"
          type="file"
          className="hidden"
          disabled={loading || backgroundImage !== null}
          onChange={handleImageChange}
        />
      </div>

      {backgroundImage && (
        <div className="flex items-center justify-between w-full h-10">
          <div></div>

          <Button
            onClick={removeSelectedImage}
            type="button"
            variant="secondary"
          >
            Remove
          </Button>
        </div>
      )}
    </div>
  )
}

export default ImageUpload
