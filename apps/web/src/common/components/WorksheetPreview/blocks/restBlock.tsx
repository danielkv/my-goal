import { Component } from 'solid-js'

import { WorksheetPeace } from '@interfaces/preview'
import { IRestBlock } from '@models/block'
import { Stack } from '@suid/material'
import { restBlockDisplay } from '@utils/display/restBlock'

export interface EventBlockPreviewProps extends WorksheetPeace<IRestBlock> {}

const RestBlockPreview: Component<EventBlockPreviewProps> = (props) => {
    return (
        <Stack class="bg-gray-800 rounded-xl text-sm p-3 font-bold">
            {restBlockDisplay.display(props.item)}
            <span class="font-normal">{props.item.text && <span>{props.item.text}</span>}</span>
        </Stack>
    )
}

export default RestBlockPreview
