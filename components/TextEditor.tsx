'use client'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { withHistory } from "slate-history"
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Button } from './ui/button'
import { Bold, Highlighter, Italic, Link, LinkIcon, Underline } from 'lucide-react'
import { Slate, Editable, withReact, useSlate, useFocused } from 'slate-react'
import {
    Editor,
    Transforms,
    Text,
    createEditor,
    Descendant,
    Range,
    Element as SlateElement
} from 'slate'
import { cn } from '@/lib/utils'
import { Separator } from './ui/separator'
import { Input } from './ui/input'

const isMarkActive = (editor, format) => {
    const marks = Editor.marks(editor)
    return marks ? marks[format] === true : false
}


const toggleMark = (editor, format) => {
    const isActive = isMarkActive(editor, format)

    if (isActive) {
        Editor.removeMark(editor, format)
    } else {
        Editor.addMark(editor, format, true)
    }
}
const isLinkActive = (editor) => {
    const [link] = Editor.nodes(editor, {
        match: n => !Editor.isEditor(n) && SlateElement.isElement(n) && (n as any).type === 'link',
    })
    return !!link
}

const unwrapLink = (editor) => {
    Transforms.unwrapNodes(editor, {
        match: n => !Editor.isEditor(n) && SlateElement.isElement(n) && (n as any).type === 'link',
    })
}

const wrapLink = (editor, url) => {
    if (isLinkActive(editor)) {
        unwrapLink(editor)
    }

    const { selection } = editor
    const isCollapsed = selection && Range.isCollapsed(selection)
    const link = {
        type: 'link',
        url,
        children: isCollapsed ? [{ text: url }] : [],
    }

    if (isCollapsed) {
        Transforms.insertNodes(editor, link)
    } else {
        Transforms.wrapNodes(editor, link, { split: true })
        Transforms.collapse(editor, { edge: 'end' })
    }
}


const LinkElement = ({ attributes, children, element }) => {
    return (
        <a {...attributes} href={element.url} className="text-blue-600 hover:underline">
            {children}
        </a>
    )
}

const Element = props => {
    const { attributes, children, element } = props
    switch (element.type) {
        case 'link':
            return <LinkElement {...props} />
        default:
            return <p {...attributes}>{children}</p>
    }
}
const LinkInput = ({ onSubmit }) => {
    const [url, setUrl] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        onSubmit(url)
        setUrl('')
    }

    return (
        <form onSubmit={handleSubmit} className="p-2 flex space-x-2">
            <Input
                type="url"
                placeholder="Enter URL"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-grow"
            />
            <Button type="submit">Add</Button>
        </form>
    )
}

const Leaf = ({ attributes, children, leaf }) => {
    console.log(leaf)
    if (leaf.bold) {
        children = <strong>{children}</strong>
    }

    if (leaf.italic) {
        children = <em>{children}</em>
    }

    if (leaf.underline) {
        children = <u>{children}</u>
    }

    if (leaf.highlight) {
        children = <span className="bg-yellow-200">{children}</span>
    }

    if(leaf.link) {

    }

    return <span {...attributes}>{children}</span>
}
const ToolbarItem = ({ icon, label, onClickHandler, isActive = false, popoverContent = <></>, showPopover = false }) => {
    const [isOpen, setIsOpen] = useState(false)
    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className={`text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 ${isActive ? 'bg-gray-200' : ''}`}
                    onClick={() => {
                        if (showPopover) {
                            setIsOpen(!isOpen)
                        } else {
                            onClickHandler()
                        }
                    }}
                >
                    {icon}
                    <span className="sr-only">{label}</span>
                </Button>
            </PopoverTrigger>
            {showPopover && (
                <PopoverContent className="w-auto p-0">
                    {popoverContent}
                </PopoverContent>
            )}
        </Popover>)
}


const withLinks = (editor) => {
    const { isInline, insertData } = editor

    editor.isInline = element => {
        return element.type === 'link' ? true : isInline(element)
    }

    editor.insertData = data => {
        const text = data.getData('text/plain')
        const { selection } = editor

        if (selection && Range.isCollapsed(selection)) {
            if (isUrl(text)) {
                wrapLink(editor, text)
                return
            }
        }

        insertData(data)
    }

    return editor
}

const isUrl = (string) => {
    try {
        new URL(string)
        return true
    } catch {
        return false
    }
}


const FloatingToolbar = () => {
    const editorRef = useRef<HTMLDivElement | null>(null)
    const editor = useSlate()
    const inFocus = useFocused()

    useEffect(() => {
        const el = editorRef.current
        const { selection } = editor

        if (!el) {
            return
        }

        if (
            !selection ||
            !inFocus ||
            Range.isCollapsed(selection) ||
            Editor.string(editor, selection) === ''
        ) {
            // el.style.display = 'none'
            el.style.opacity = '0'
            el.style.pointerEvents = 'none'
            return
        }

        const domSelection = window.getSelection()
        if (domSelection === null) {
            return
        }
        const domRange = domSelection.getRangeAt(0)
        const rect = domRange.getBoundingClientRect()
        // el.style.display = 'block'
        el.style.opacity = '1'
        el.style.pointerEvents = 'auto'
        el.style.top = `${rect.top + window.pageYOffset - el.offsetHeight}px`
        el.style.left = `${rect.left + window.pageXOffset - el.offsetWidth / 2 + rect.width / 2
            }px`
    })
    const addLink = (url) => {
        if (url) {
            wrapLink(editor, url)
        }
    }
    return (
        <div ref={editorRef} onMouseDown={e => {
            // prevent toolbar from taking focus away from editor
            e.preventDefault()
        }}
            className="fixed z-50 transition-opacity duration-200"
        >
            <div className="flex justify-center p-4">
                <div className="bg-white rounded-lg shadow-md border border-gray-200 p-2 flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                        <ToolbarItem icon={<Bold className="h-4 w-4" />} label="Bold" onClickHandler={() => toggleMark(editor, 'bold')} isActive={isMarkActive(editor, 'bold')} />
                        <ToolbarItem icon={<Italic className="h-4 w-4" />} label="Italic" onClickHandler={() => toggleMark(editor, 'italic')} isActive={isMarkActive(editor, 'italic')} />
                        <ToolbarItem icon={<Underline className="h-4 w-4" />} label="Underline" onClickHandler={() => toggleMark(editor, 'underline')} isActive={isMarkActive(editor, 'underline')} />
                        <ToolbarItem icon={<Highlighter className="h-4 w-4" />} label="Underline" onClickHandler={() => toggleMark(editor, 'highlight')} isActive={isMarkActive(editor, 'highlight')} />

                        <ToolbarItem 
                            icon={<LinkIcon className="h-4 w-4" />} 
                            label="Link" 
                            showPopover={true}
                            onClickHandler={() => {}}
                            popoverContent={<LinkInput onSubmit={addLink} />}
                            isActive={isLinkActive(editor)}
                        />

                    </div>
                </div>
            </div>
        </div>
    )

}
export const TextEditor = ({ isReadOnly = false, initValue, onChange = (val) => { } }) => {
    const [editor] = useState(() =>withLinks(withHistory(withReact(createEditor()))))

    return (
        <Slate editor={editor} initialValue={initValue}
            onChange={(val) => {
                console.log(val, "check check")
                onChange(val)
            }}>
            <FloatingToolbar />
            <Editable
                readOnly={isReadOnly}
                renderLeaf={props => <Leaf {...props} />}
                renderElement={props => <Element {...props} />}
                placeholder="Enter some text..."
                onDOMBeforeInput={(event: InputEvent) => {
                    switch (event.inputType) {
                        case 'formatBold':
                            event.preventDefault()
                            return toggleMark(editor, 'bold')
                        case 'formatItalic':
                            event.preventDefault()
                            return toggleMark(editor, 'italic')
                        case 'formatUnderline':
                            event.preventDefault()
                            return toggleMark(editor, 'underlined')
                        case 'formatHighlight':
                            event.preventDefault()
                            return toggleMark(editor, 'highlight')
                    }
                }}
            />
        </Slate>

    )
}