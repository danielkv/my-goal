import { Component, ParentProps } from 'solid-js'
import { JSX } from 'solid-js'

import { IconButton } from '@suid/material'

interface EditorMenuButtonProps {
    active?: boolean
    onClick?: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent>
}

const EditorMenuButton: Component<ParentProps<EditorMenuButtonProps>> = (props) => {
    return (
        <IconButton
            class={props.active ? '!bg-gray-600' : ''}
            onClick={props.onClick}
            size="small"
            aria-expanded="true"
            onMouseDown={(e) => {
                e.preventDefault()
                e.stopPropagation()
            }}
            onMouseUp={(e) => {
                e.preventDefault()
                e.stopPropagation()
            }}
            style={{ width: '30px', height: '30px', 'font-size': '14px', color: props.active ? 'white' : 'black' }}
        >
            {props.children}
        </IconButton>
    )
}

export default EditorMenuButton
