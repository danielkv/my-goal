import { FiAlignCenter, FiAlignLeft, FiAlignRight, FiBold, FiItalic, FiList, FiUnderline } from 'solid-icons/fi'
import { createEditorTransaction } from 'solid-tiptap'

import { Component } from 'solid-js'

import { Stack } from '@suid/material'
import { Editor } from '@tiptap/core'

import EditorMenuButton from '../EditorMenuButton'

interface EditorMenuProps {
    editor: Editor
    ref: HTMLDivElement | ((el: HTMLDivElement) => void)
}
const EditorMenu: Component<EditorMenuProps> = (props) => {
    const isHeading1 = createEditorTransaction(
        () => props.editor,
        (editor) => editor?.isActive('heading', { level: 1 }) || false
    )
    const isHeading2 = createEditorTransaction(
        () => props.editor,
        (editor) => editor?.isActive('heading', { level: 2 }) || false
    )
    const isBold = createEditorTransaction(
        () => props.editor,
        (editor) => editor?.isActive('bold') || false
    )
    const isItalic = createEditorTransaction(
        () => props.editor,
        (editor) => editor?.isActive('italic') || false
    )
    const isUndeline = createEditorTransaction(
        () => props.editor,
        (editor) => editor?.isActive('underline') || false
    )

    const isAlignedLeft = createEditorTransaction(
        () => props.editor,
        (editor) => editor?.isActive({ textAlign: 'left' }) || false
    )

    const isAlignedCenter = createEditorTransaction(
        () => props.editor,
        (editor) => editor?.isActive({ textAlign: 'center' }) || false
    )

    const isAlignedRight = createEditorTransaction(
        () => props.editor,
        (editor) => editor?.isActive({ textAlign: 'right' }) || false
    )

    const isList = createEditorTransaction(
        () => props.editor,
        (editor) => editor?.isActive('listItem') || false
    )

    return (
        <Stack direction="row" ref={props.ref} gap={1} class="bg-gray-900 rounded-md" p={1}>
            <Stack direction="row">
                <EditorMenuButton
                    active={isHeading1()}
                    onClick={() => props.editor.chain().focus().toggleHeading({ level: 1 }).run()}
                >
                    H1
                </EditorMenuButton>
                <EditorMenuButton
                    active={isHeading2()}
                    onClick={() => props.editor.chain().focus().toggleHeading({ level: 2 }).run()}
                >
                    H2
                </EditorMenuButton>
            </Stack>
            <Stack direction="row">
                <EditorMenuButton
                    active={isAlignedLeft()}
                    onClick={() => props.editor.chain().focus().setTextAlign('left').run()}
                >
                    <FiAlignLeft />
                </EditorMenuButton>
                <EditorMenuButton
                    active={isAlignedCenter()}
                    onClick={() => props.editor.chain().focus().setTextAlign('center').run()}
                >
                    <FiAlignCenter />
                </EditorMenuButton>
                <EditorMenuButton
                    active={isAlignedRight()}
                    onClick={() => props.editor.chain().focus().setTextAlign('right').run()}
                >
                    <FiAlignRight />
                </EditorMenuButton>
            </Stack>
            <Stack direction="row">
                <EditorMenuButton active={isBold()} onClick={() => props.editor.chain().focus().toggleBold().run()}>
                    <FiBold />
                </EditorMenuButton>
                <EditorMenuButton active={isItalic()} onClick={() => props.editor.chain().focus().toggleItalic().run()}>
                    <FiItalic />
                </EditorMenuButton>
                <EditorMenuButton
                    active={isUndeline()}
                    onClick={() => props.editor.chain().focus().toggleUnderline().run()}
                >
                    <FiUnderline />
                </EditorMenuButton>
            </Stack>
            <Stack direction="row">
                <EditorMenuButton
                    active={isList()}
                    onClick={() => props.editor.chain().focus().toggleWrap('listItem').run()}
                >
                    <FiList />
                </EditorMenuButton>
            </Stack>
        </Stack>
    )
}

export default EditorMenu
