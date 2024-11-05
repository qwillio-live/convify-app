'use client'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { withHistory } from "slate-history"
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Button } from './ui/button'
import { Bold, Highlighter, Italic, Underline } from 'lucide-react'
import { Slate, Editable, withReact, useSlate, useFocused } from 'slate-react'
import {
    Editor,
    Transforms,
    Text,
    createEditor,
    Descendant,
    Range,
} from 'slate'
import { cn } from '@/lib/utils'
import { Separator } from './ui/separator'

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

    return <span {...attributes}>{children}</span>
}
const ToolbarItem = ({ icon, label, onClickHandler, isActive = false }) => (
    <Button
        variant="ghost"
        size="icon"
        className={cn("text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900", isActive ? "bg-muted" : "")}
        onClick={onClickHandler}
    >

        {icon}
        <span className="sr-only">{label}</span>
    </Button>
)


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
                    </div>
                </div>
            </div>
        </div>
    )

}
export const TextEditor = ({ isReadOnly = false, initValue, onChange  = (val) => {}}) => {
    const [editor] = useState(() => withHistory(withReact(createEditor())))

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
                    }
                }}
            />
        </Slate>

    )
}