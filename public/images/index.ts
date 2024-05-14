import BigPicture from "./bigPicture.png"
import NoResponse from "./noresponse.png"

// import templateImages from "./template-images/*.png"

const templateImages = (require as any).context(
  "./template-images/", // Search directory
  false, // Include subdirectories
  /\.png$/ // RegExp for matching files
)

export const LocalImages = {
  noresponse: NoResponse,
  bigPicture: BigPicture,
}

export const templateImage = {}
templateImages.keys().forEach((key) => {
  const templateName = key.split("/").pop().split(".")[0]
  templateImage[templateName] = templateImages(key)
})
