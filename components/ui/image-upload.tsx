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
            className="dark:hover:bg-bray-800 visually-hidden-focusable bg-card relative flex h-full w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
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
                <div className="mx-auto max-w-min">
                  <UploadCloud className="size-5" />
                </div>

                <p className="mt-2 text-xs font-medium text-[#7B7D80]">
                  <span className="font-semibold">{t("Drag an image")}</span>
                </p>
                <p className="text-muted-foreground text-xs">
                  {t("Select a image or drag here to upload directly")}
                </p>
              </div>
            )}

            {backgroundImage && (
              <div className="space-y-2 text-center">
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
          <div className="flex h-10 w-full items-center justify-between">
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
          className="relative z-[9999999] flex h-[calc(100vh-10%)] max-h-[calc(100vh-10%)] max-w-[95%] flex-col gap-4 p-4 sm:max-w-[70%] sm:p-8"
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
            <div className="bg-secondary flex gap-0 rounded-lg p-1">
              <Button
                variant="secondary"
                className={`h-auto rounded-md border px-3 py-2 text-sm leading-none ${
                  activeAspectRatioBtn === "source"
                    ? "border-input bg-white font-medium shadow hover:bg-white"
                    : "border-transparent bg-transparent hover:bg-transparent"
                }`}
                onClick={aspectRatioSource}
              >
                {t("Source")}
              </Button>
              <Button
                variant="secondary"
                className={`h-auto rounded-md border px-3 py-2 text-sm leading-none ${
                  activeAspectRatioBtn === "square"
                    ? "border-input bg-white font-medium shadow hover:bg-white"
                    : "border-transparent bg-transparent hover:bg-transparent"
                }`}
                onClick={aspectRatioSquare}
              >
                1:1
              </Button>
              <Button
                variant="secondary"
                className={`h-auto rounded-md border px-3 py-2 text-sm leading-none ${
                  activeAspectRatioBtn === "portrait"
                    ? "border-input bg-white font-medium shadow hover:bg-white"
                    : "border-transparent bg-transparent hover:bg-transparent"
                }`}
                onClick={aspectRatioPortrait}
              >
                4:3
              </Button>
              <Button
                variant="secondary"
                className={`h-auto rounded-md border px-3 py-2 text-sm leading-none ${
                  activeAspectRatioBtn === "landscape"
                    ? "border-input bg-white font-medium shadow hover:bg-white"
                    : "border-transparent bg-transparent hover:bg-transparent"
                }`}
                onClick={aspectRatioLandscape}
              >
                16:9
              </Button>
              <Button
                variant="secondary"
                className={`h-auto rounded-md border px-3 py-2 text-sm leading-none ${
                  activeAspectRatioBtn === "portraito"
                    ? "border-input bg-white font-medium shadow hover:bg-white"
                    : "border-transparent bg-transparent hover:bg-transparent"
                }`}
                onClick={aspectRatioPortraitO}
              >
                3:4
              </Button>
              <Button
                variant="secondary"
                className={`h-auto rounded-md border px-3 py-2 text-sm leading-none ${
                  activeAspectRatioBtn === "landscapeo"
                    ? "border-input bg-white font-medium shadow hover:bg-white"
                    : "border-transparent bg-transparent hover:bg-transparent"
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
