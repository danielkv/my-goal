import { Component } from 'solid-js'

import { WorksheetPeace } from '@interfaces/preview'
import { ITextBlock } from '@models/block'
import { Stack } from '@suid/material'
import { textBlockDisplay } from '@utils/display/textBlock'

export interface EventBlockPreviewProps extends WorksheetPeace<ITextBlock> {}

const TextBlockPreview: Component<EventBlockPreviewProps> = (props) => {
    return <Stack class="bg-gray-800 rounded-xl text-sm p-3">{textBlockDisplay.display(props.item)}</Stack>
}

export default TextBlockPreview
