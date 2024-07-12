import React, { useCallback, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"
import { throttle } from 'lodash';
import { useNode } from "@/lib/craftjs"
import { Controller } from "../settings/controller.component"
import { LoaderSettings } from "./user-loader.settings"
import { StyleProperty } from "../types/style.types"
import { useAppSelector } from "@/lib/state/flows-state/hooks"
import { getBackgroundForPreset, getHoverBackgroundForPreset } from "./useLoaderThemePresets"
import { useTranslations } from "next-intl";
import { RootState } from "@/lib/state/flows-state/store";

const ButtonTextLimit = {
    small: 100,
    // small: 22,
    // medium: 30,
    // large: 40,
    // full: 82,

    medium: 100,
    large: 100,
    full: 100,
}
export const LoaderComponentGen = ({
    disabled,
    fontFamily,
    enableRedirect,
    size,
    buttonSize,
    color,
    text,
    marginLeft,
    width: width,
    height: height,
    marginRight,
    marginTop,
    containerBackground,
    marginBottom,
    background,
    backgroundHover,
    colorHover,
    icon,
    paddingLeft,
    paddingTop,
    paddingRight,
    paddingBottom,
    radius,
    flexDirection,
    alignItems,
    justifyContent,
    gap,
    border,
    borderColor,
    borderHoverColor,
    nextScreen,
    alt,
    src,
    right,
    left,
    top,
    bottom,
    align,
    time,
    ...props
}) => {
    const primaryColor = useAppSelector((state) => state.theme?.general?.primaryColor);
    const [showLoader, setShowLoader] = React.useState(true);

    const restartLoader = () => {
        setShowLoader(true);
        const timer = setTimeout(() => {
            setShowLoader(false);
        }, time * 1000);
        return () => clearTimeout(timer);
    };

    useEffect(() => {
        restartLoader();
    }, [time]);

    return (
        <div
            className=""
            style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
            }}
        >
            <div className="relative w-full"
                style={{
                    background: `${containerBackground}`,
                    display: "inline-flex",
                    justifyContent: "center",
                    boxSizing: 'border-box',
                    minWidth: '100%',
                    maxWidth: '100%',
                    paddingTop: `${props.marginTop}px`,
                    paddingBottom: `${props.marginBottom}px`,
                    paddingLeft: `${props.marginLeft}px`,
                    paddingRight: `${props.marginRight}px`,
                }}>
                <div
                    className={cn(
                        `relative flex flex-row justify-${align} w-full border border-transparent`
                    )}
                >
                    {src ? (
                        <UserLogo
                            alt={alt}
                            marginTop={marginTop}
                            marginBottom={marginBottom}
                            marginLeft={marginLeft}
                            marginRight={marginRight}
                            top={top}
                            left={left}
                            right={right}
                            bottom={bottom}
                            background={background}
                            radius={radius}
                            align={align}
                            width={width}
                            height={height}
                            src={src}
                            {...props}
                        />
                    ) : (
                        <div className="flex items-center justify-center w-full h-full">
                            {showLoader ? (
                                <div className="relative">
                                    <div className="w-40 h-40 border-2 border-gray-300 rounded-full"></div>
                                    <div className={`loader absolute top-0 left-0 w-40 h-40 border-2 border-t-2 border-transparent rounded-full animate-spin`} style={{ borderTopColor: primaryColor }}></div>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center w-40 h-40 rounded-full border-2" style={{
                                    borderRadius: `${radius}px`,
                                    backgroundColor: background,
                                    borderColor: primaryColor,
                                    marginLeft: `${left}px`,
                                    marginRight: `${right}px`,
                                    marginTop: `${top}px`,
                                    marginBottom: `${bottom}px`,
                                }}>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke={primaryColor}
                                        strokeWidth="1"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="w-16 h-16 animate-tick"
                                    >
                                        <path d="M20 6L9 17l-5-5" />
                                    </svg>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
            <style jsx>{`
                @keyframes tick {
                    0% {
                        stroke-dasharray: 0, 24;
                    }
                    100% {
                        stroke-dasharray: 24, 0;
                    }
                }
                .animate-tick {
                    animation: tick 1s ease-in-out forwards;
                }
            `}</style>
        </div>
    )
}

export const UserLogo = ({
    alt,
    marginTop,
    marginBottom,
    marginLeft,
    marginRight,
    background,
    top,
    left,
    bottom,
    right,
    radius,
    align,
    width = '85%',
    height,
    src,
    ...props
}) => {
    return (
        <>
            <img
                alt={alt}
                src={src}
                style={{
                    width: width == 'medium' ? '85%' : width,
                    maxWidth: '400px',
                    height: height,
                    borderRadius: `${radius}px`,
                    backgroundColor: background,
                    marginLeft: `${left}px`,
                    marginRight: `${right}px`,
                    marginTop: `${top}px`,
                    marginBottom: `${bottom}px`,
                }}
            />
        </>
    )
}


export const LoaderComponent = ({
    alt,
    align,
    src,
    fontFamily,
    disabled,
    borderHoverColor,
    enableRedirect,
    size,
    buttonSize,
    color,
    text,
    marginLeft,
    width,
    height: height,
    marginRight,
    marginTop,
    marginBottom,
    containerBackground,
    background,
    backgroundHover,
    colorHover,
    icon,
    top,
    left,
    right,
    time,
    bottom,
    paddingLeft,
    paddingTop,
    paddingRight,
    paddingBottom,
    radius,
    flexDirection,
    alignItems,
    justifyContent,
    gap,
    border,
    borderColor,
    buttonAction,
    nextScreen,
    ...props
}) => {
    const {
        actions: { setProp },
        connectors: { connect, drag },
        isHovered,
    } = useNode((state) => ({
        selected: state.events.selected,
        isHovered: state.events.hovered,
    }));
    const t = useTranslations("Components");
    const ref = useRef<HTMLDivElement>(null);
    const [displayController, setDisplayController] = React.useState(false);
    const primaryFont = useAppSelector((state) => state.theme?.text?.primaryFont);
    const primaryColor = useAppSelector((state) => state.theme?.general?.primaryColor);
    const screensLength = useAppSelector((state: RootState) => state?.screen?.screens?.length ?? 0);
    const selectedScreen = useAppSelector((state: RootState) => state.screen?.selectedScreen ?? 0);

    const nextScreenName = useAppSelector((state: RootState) => state?.screen?.screens[((selectedScreen + 1 < screensLength) ? selectedScreen + 1 : 0)]?.screenName) || "";

    const [showLoader, setShowLoader] = React.useState(true);

    const restartLoader = () => {
        setShowLoader(true);
        const timer = setTimeout(() => {
            setShowLoader(false);
        }, time * 1000);
        return () => clearTimeout(timer);
    };

    useEffect(() => {
        restartLoader();
    }, [time]);

    useEffect(() => {
        if (buttonAction === "next-screen") {
            setProp((props) => (props.nextScreen = nextScreenName), 1000);
        }
    }, [nextScreenName, buttonAction]);

    useEffect(() => {
        if (fontFamily.globalStyled && !fontFamily.isCustomized) {
            setProp((props) => (props.fontFamily.value = primaryFont), 200);
        }
    },
        [primaryFont]);

    useEffect(() => {
        if (primaryColor) {
            const backgroundPrimaryColor = getBackgroundForPreset(primaryColor, props.preset);
            const hoverBackgroundPrimaryColor = getHoverBackgroundForPreset(primaryColor, props.preset);

            if (background.globalStyled && !background.isCustomized) {
                setProp((props) => (props.background.value = backgroundPrimaryColor), 200);
            }
            if (color.globalStyled && !color.isCustomized) {
                setProp((props) => (props.color.value = primaryColor), 200);
            }
            if (borderColor.globalStyled && !borderColor.isCustomized) {
                setProp((props) => (props.borderColor.value = primaryColor), 200);
            }

            // hover colors
            if (backgroundHover.globalStyled && !backgroundHover.isCustomized) {
                setProp((props) => (props.backgroundHover.value = hoverBackgroundPrimaryColor), 200);
            }
            if (borderHoverColor.globalStyled && !borderHoverColor.isCustomized) {
                setProp((props) => (props.borderHoverColor.value = primaryColor), 200);
            }
            if (colorHover.globalStyled && !colorHover.isCustomized) {
                setProp((props) => (props.colorHover.value = primaryColor), 200);
            }
        }
    }, [primaryColor]);

    const maxLength = ButtonTextLimit[size];
    const handleTextChange = (e) => {
        const value = e.target.innerText;
        if (value.length <= maxLength) {
            setProp((props) => (props.text = value));
        } else {
            if (ref.current) {
                e.target.innerText = text || ''; // Restore the previous text
                const selection = window.getSelection();
                const range = document.createRange();
                range.selectNodeContents(ref.current);
                range.collapse(false); // Move cursor to the end
                selection?.removeAllRanges();
                selection?.addRange(range);
            }
        }
    };

    useEffect(() => {
        const currentRef = ref.current;
        if (currentRef) {
            currentRef.addEventListener('input', handleTextChange);
        }
        return () => {
            if (currentRef) {
                currentRef.removeEventListener('input', handleTextChange);
            }
        };
    }, [text, maxLength]);

    const throttledSetProp = useCallback(
        throttle((property, value) => {
            setProp((prop) => { prop[property] = value }, 0);
        }, 200), // Throttle to 50ms to 200ms
        [setProp]
    );

    return (
        <div
            ref={(ref: any) => connect(drag(ref))}
            className=""
            style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
            }}
            onMouseOver={() => setDisplayController(true)}
            onMouseOut={() => setDisplayController(false)}
        >
            {displayController && <Controller nameOfComponent={t("Loader")} />}
            <div className="relative w-full"
                style={{
                    background: `${containerBackground}`,
                    display: "inline-flex",
                    justifyContent: "center",
                    boxSizing: 'border-box',
                    minWidth: '100%',
                    maxWidth: '100%',
                    paddingTop: `${props.marginTop}px`,
                    paddingBottom: `${props.marginBottom}px`,
                    paddingLeft: `${props.marginLeft}px`,
                    paddingRight: `${props.marginRight}px`,
                }}>
                <div
                    ref={(ref: any) => connect(drag(ref))}
                    className={cn(
                        `relative flex flex-row justify-${align} w-full border border-transparent`
                    )}
                >
                    {src ? (
                        <UserLogo
                            alt={alt}
                            marginTop={marginTop}
                            marginBottom={marginBottom}
                            marginLeft={marginLeft}
                            marginRight={marginRight}
                            top={top}
                            left={left}
                            right={right}
                            bottom={bottom}
                            background={background}
                            radius={radius}
                            align={align}
                            width={width}
                            height={height}
                            src={src}
                            {...props}
                        />
                    ) : (
                        <div className="flex items-center justify-center w-full h-full">
                            {showLoader ? (
                                <div className="relative">
                                    <div className="w-40 h-40 border-2 border-gray-300 rounded-full"></div>
                                    <div className={`loader absolute top-0 left-0 w-40 h-40 border-2 border-t-2 border-transparent rounded-full animate-spin`} style={{ borderTopColor: primaryColor }}></div>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center w-40 h-40 rounded-full border-2" style={{
                                    borderRadius: `${radius}px`,
                                    backgroundColor: background,
                                    borderColor: primaryColor,
                                    marginLeft: `${left}px`,
                                    marginRight: `${right}px`,
                                    marginTop: `${top}px`,
                                    marginBottom: `${bottom}px`,
                                }}>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke={primaryColor}
                                        strokeWidth="1"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="w-16 h-16 animate-tick"
                                    >
                                        <path d="M20 6L9 17l-5-5" />
                                    </svg>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
            <style jsx>{`
                @keyframes tick {
                    0% {
                        stroke-dasharray: 0, 24;
                    }
                    100% {
                        stroke-dasharray: 24, 0;
                    }
                }
                .animate-tick {
                    animation: tick 1s ease-in-out forwards;
                }
            `}</style>
        </div>
    )
}


export enum IconButtonSizes {
    small = "small",
    medium = "medium",
    large = "large",
    full = "full",
}



export type IconButtonProps = {
    alt: string
    align: string
    src: string
    fontFamily: StyleProperty
    disabled: boolean
    enableRedirect: boolean
    size: IconButtonSizes
    containerBackground: string
    background: StyleProperty
    backgroundHover: StyleProperty
    color: StyleProperty
    colorHover: StyleProperty
    text: string
    icon: string
    paddingLeft: string | number
    paddingTop: string | number
    paddingRight: string | number
    paddingBottom: string | number
    radius: StyleProperty
    flexDirection: string
    alignItems: string
    justifyContent: string
    gap: number
    time: number
    border: number
    borderColor: StyleProperty
    borderHoverColor: StyleProperty
    marginLeft: number
    marginTop: number
    marginRight: number
    marginBottom: number
    left: number
    top: number
    right: number
    bottom: number
    width: string | number
    height: string | number
    fullWidth: boolean
    preset: string
    settingsTab: string
    buttonSize: string
    tracking: boolean
    trackingEvent: string
    buttonAction: "next-screen" | "custom-action" | "none"
    nextScreen: string
}

export const LoaderDefaultProps: IconButtonProps = {
    fontFamily: {
        value: "inherit",
        globalStyled: true,
        isCustomized: false,
    },
    containerBackground: "#ffffff",
    background: {
        value: "#4050ff",
        globalStyled: false,
        isCustomized: false,
    },
    color: {
        value: "#ffffff",
        globalStyled: false,
        isCustomized: false,
    },
    backgroundHover: {
        value: "#3182ce",
        globalStyled: false,
        isCustomized: false,
    },
    colorHover: {
        value: "#ffffff",
        globalStyled: false,
        isCustomized: false,

    },
    radius: {
        value: "0",
        globalStyled: false,
        isCustomized: false,
    },
    justifyContent: "center",
    borderColor: {
        value: "inherit",
        globalStyled: false,
        isCustomized: false,
    },
    borderHoverColor: {
        value: "inherit",
        globalStyled: false,
        isCustomized: false,
    },
    alt: "Image",
    align: "center",
    src: '',
    disabled: false,
    enableRedirect: true,
    width: "85%",
    height: "auto",
    size: IconButtonSizes.medium,
    buttonSize: "medium",
    text: "Get quote",
    marginLeft: 0,
    marginTop: 0,
    marginRight: 0,
    marginBottom: 0,
    top: 20,
    bottom: 20,
    right: 0,
    left: 0,
    icon: "arrowright",
    paddingLeft: "16",
    paddingTop: "26",
    time: 2,
    paddingRight: "16",
    paddingBottom: "26",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    border: 0,
    fullWidth: true,
    preset: 'filled',
    settingsTab: 'content',
    tracking: false,
    trackingEvent: 'button_clicked',
    nextScreen: '',
    buttonAction: "next-screen",
}

LoaderComponent.craft = {
    props: LoaderDefaultProps,
    related: {
        settings: LoaderSettings,
    },
}
