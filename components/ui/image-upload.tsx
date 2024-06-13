"use client"

import React, { useCallback, useRef, useState } from "react"
import { UploadCloud } from "lucide-react"
import { useTranslations } from "next-intl"
import { Cropper, ReactCropperElement } from "react-cropper"
import { useDropzone } from "react-dropzone"

import { Button } from "./button"
import { Dialog, DialogContent } from "./dialog"
import { Input } from "./input"

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
  const dialogRef = useRef<HTMLDivElement>(null)
  const [activeAspectRatioBtn, setActiveAspectRatioBtn] =
    React.useState<string>("source")
  const [showDialog, setShowDialog] = useState<boolean>(false)
  const [image, setImage] = useState<string>("")

  const cropperRef = useRef<ReactCropperElement>(null)

  const aspectRatioSource = () => {
    cropperRef.current?.cropper.setAspectRatio(
      cropperRef.current?.cropper.getImageData().width /
        cropperRef.current?.cropper.getImageData().height
    )
    setActiveAspectRatioBtn("source")
  }
  const aspectRatioSquare = () => {
    cropperRef.current?.cropper.setAspectRatio(1)
    setActiveAspectRatioBtn("square")
  }
  const aspectRatioPortrait = () => {
    cropperRef.current?.cropper.setAspectRatio(1.3333)
    setActiveAspectRatioBtn("portrait")
  }
  const aspectRatioLandscape = () => {
    cropperRef.current?.cropper.setAspectRatio(1.7777)
    setActiveAspectRatioBtn("landscape")
  }
  const aspectRatioPortraitO = () => {
    cropperRef.current?.cropper.setAspectRatio(0.75)
    setActiveAspectRatioBtn("portraito")
  }
  const aspectRatioLandscape0 = () => {
    cropperRef.current?.cropper.setAspectRatio(0.5625)
    setActiveAspectRatioBtn("landscapeo")
  }

  const t = useTranslations("Components")

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length) {
      const image = event.target.files[0]
      handleImageUpload(image)
    }
  }

  const handleImageUpload = async (image: File) => {
    if (image) {
      setShowDialog(true)
      const reader = new FileReader()
      reader.onload = () => {
        const result = reader.result
        if (typeof result === "string") {
          setImage(reader.result as any)
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

  const handleUploadOriginal = () => {
    if (image) {
      onUploadComplete(image)
      setShowDialog(false)
    }
  }

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const image = acceptedFiles[0]
      handleImageUpload(image)
    }
  }, [])

  const onCrop = () => {
    const cropper = cropperRef.current?.cropper
  }

  const getCropData = () => {
    if (typeof cropperRef.current?.cropper !== "undefined") {
      setActiveAspectRatioBtn("source")
      onUploadComplete(
        cropperRef.current?.cropper.getCroppedCanvas().toDataURL()
      )
      setShowDialog(false)
    }
  }

  const { getRootProps, getInputProps } = useDropzone({ onDrop })

  return (
    <>
      <div className="space-y-3">
        <div {...getRootProps()} className="h-auto">
          <label
            htmlFor="dropzone-file"
            className="relative flex flex-col items-center justify-center p-6 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600 w-full visually-hidden-focusable h-full"
          >
            {/* {loading && (
            <div className="text-center max-w-md">
              <RadialProgress progress={progress} />
              <p className="text-sm font-semibold">Uploading Picture</p>
              <p className="text-xs text-gray-400">
                Do not refresh or perform any other action while the picture is
                being uploaded
              </p>
            </div>
          )} */}

            {!backgroundImage && (
              <div className="text-center">
                <div className="border p-2 rounded-md max-w-min mx-auto">
                  <UploadCloud />
                </div>

                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">{t("Drag an image")}</span>
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-400">
                  {t("Select a image or drag here to upload directly")}
                </p>
              </div>
            )}

            {backgroundImage && (
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
                  <p className="text-sm font-semibold">{t("Image Uploaded")}</p>
                  <p className="text-xs text-gray-400">
                    {t("Click here to upload another image")}
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
            disabled={backgroundImage !== null}
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
              size="sm"
            >
              {t("Remove")}
            </Button>
          </div>
        )}
      </div>
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent
          className="z-[9999999] max-h-[calc(100vh-10%)] h-[calc(100vh-10%)] max-w-[95%] sm:max-w-[70%] relative flex flex-col gap-4 p-4 sm:p-8"
          ref={dialogRef}
        >
          <Cropper
            ref={cropperRef}
            style={{
              width: "100%",
              height: "calc(100% - 56px)",
            }}
            initialAspectRatio={NaN}
            guides={false}
            crop={onCrop}
            autoCropArea={1}
            src={image}
            minCropBoxHeight={100}
            minCropBoxWidth={100}
            background={false}
            highlight={true}
            responsive={true}
          />
          <div className="flex items-center justify-between gap-4">
            <div className="p-1 flex gap-0 bg-secondary rounded-lg">
              <Button
                variant="secondary"
                className={`text-sm rounded-md border py-2 px-3 leading-none h-auto ${
                  activeAspectRatioBtn === "source"
                    ? "bg-white border-input shadow font-medium hover:bg-white"
                    : "bg-transparent border-transparent hover:bg-transparent"
                }`}
                onClick={aspectRatioSource}
              >
                {t("Source")}
              </Button>
              <Button
                variant="secondary"
                className={`text-sm rounded-md border py-2 px-3 leading-none h-auto ${
                  activeAspectRatioBtn === "square"
                    ? "bg-white border-input shadow font-medium hover:bg-white"
                    : "bg-transparent border-transparent hover:bg-transparent"
                }`}
                onClick={aspectRatioSquare}
              >
                1:1
              </Button>
              <Button
                variant="secondary"
                className={`text-sm rounded-md border py-2 px-3 leading-none h-auto ${
                  activeAspectRatioBtn === "portrait"
                    ? "bg-white border-input shadow font-medium hover:bg-white"
                    : "bg-transparent border-transparent hover:bg-transparent"
                }`}
                onClick={aspectRatioPortrait}
              >
                4:3
              </Button>
              <Button
                variant="secondary"
                className={`text-sm rounded-md border py-2 px-3 leading-none h-auto ${
                  activeAspectRatioBtn === "landscape"
                    ? "bg-white border-input shadow font-medium hover:bg-white"
                    : "bg-transparent border-transparent hover:bg-transparent"
                }`}
                onClick={aspectRatioLandscape}
              >
                16:9
              </Button>
              <Button
                variant="secondary"
                className={`text-sm rounded-md border py-2 px-3 leading-none h-auto ${
                  activeAspectRatioBtn === "portraito"
                    ? "bg-white border-input shadow font-medium hover:bg-white"
                    : "bg-transparent border-transparent hover:bg-transparent"
                }`}
                onClick={aspectRatioPortraitO}
              >
                3:4
              </Button>
              <Button
                variant="secondary"
                className={`text-sm rounded-md border py-2 px-3 leading-none h-auto ${
                  activeAspectRatioBtn === "landscapeo"
                    ? "bg-white border-input shadow font-medium hover:bg-white"
                    : "bg-transparent border-transparent hover:bg-transparent"
                }`}
                onClick={aspectRatioLandscape0}
              >
                9:16
              </Button>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleUploadOriginal} variant="secondary">
                {t("Upload original")}
              </Button>
              <Button onClick={getCropData} className="bg-black text-white">
                {t("Upload crop")}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default ImageUpload
