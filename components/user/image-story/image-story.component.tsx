// 'use client'
// import Stories from 'react-insta-stories';
// import { ImageStorySizes } from './useImageStoryThemePresets';
// import hexoid from 'hexoid';
// import { ImageStorySettnigs } from './image-story.settings';

// export const ImageStoryGen = ({
//     size,
//     containerBackground,
//     align,
//     gap,
//     paddingLeft,
//     paddingTop,
//     paddingRight,
//     paddingBottom,
//     marginLeft,
//     marginTop,
//     marginRight,
//     marginBottom,
//     settingTabs,
//     items,
// }) => {
//     return (
//         <div
//             className="relative w-full"
//             style={{
//                 width: "100%",
//                 background: `${containerBackground}`,
//                 display: "flex",
//                 flexDirection: "column",
//                 justifyContent: "center",
//                 alignItems: "center",
//                 minWidth: "100%",
//                 paddingTop: `${marginTop}px`,
//                 paddingBottom: `${marginBottom}px`,
//             }}
//         >
//             <ImageStoryItems images={items} aspectRatio={''} />
//         </div>
//     )
// }

// export const ImageStory = ({ images, aspectRatio }) => {
//     return <ImageStoryItems images={images} aspectRatio={aspectRatio} />
// }

// export const ImageStoryItems = ({ images, aspectRatio }) => {
//     return (
//         <Stories
//             stories={images.map(image => image.src)}
//             defaultInterval={1500}
//             width={432}
//             height={768}
//         />)
// }
// export const ImageStoryDefaultProps ={
//     size: ImageStorySizes.medium,
//     containerBackground: "transparent",
//     align: "center",
//     gap: 30,
//     paddingLeft: "16",
//     paddingTop: "20",
//     paddingRight: "16",
//     paddingBottom: "20",
//     marginLeft: 0,
//     marginTop: 20,
//     marginRight: 0,
//     marginBottom: 20,
//     settingTabs: ["content"],
//     items: [ {
//         id: `logo-bar-item-${hexoid(6)()}`,
//         src: ""
//       },],
// }
// ImageStory.craft = {
//     props: ImageStory,
//     related: {
//       settings: ImageStorySettnigs,
//     },
//   }
  