import { Component, ParentProps } from 'solid-js'

import { IconButton } from '@suid/material'

interface EditorMenuButtonProps {
    active?: boolean
    onClick?: () => void
}

const EditorMenuButton: Component<ParentProps<EditorMenuButtonProps>> = (props) => {
    return (
        <IconButton
            class={props.active ? '!bg-gray-600' : ''}
            onClick={props.onClick}
            size="small"
            style={{ width: '30px', height: '30px', 'font-size': '14px' }}
        >
            {props.children}
        </IconButton>
    )
}

export default EditorMenuButton
