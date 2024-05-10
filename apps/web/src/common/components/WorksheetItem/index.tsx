import dayjs from 'dayjs'
import { Models } from 'goal-models'
import { FiCheck, FiRewind, FiTrash } from 'solid-icons/fi'

import { Component, Match, Show, Switch } from 'solid-js'

import LogoSvg from '@assets/logo.svg?component-solid'
import { IconButton } from '@suid/material'

export interface WorksheetItemProps {
    worksheet?: Models<'worksheets'>
    onClickRemove?(worksheetId: string): void
    onClickTooglePublish?(worksheetId: string): void
    onClick(): void
    loading?: boolean
}

const WorksheetItem: Component<WorksheetItemProps> = (props) => {
    return (
        <div class="p-10 hover:bg-gray-700 rounded-xl" classList={{ 'opacity-50': props.loading }}>
            <div
                class="w-32 h-40 shadow-md bg-gray-900 relative rounded-xl"
                onClick={props.onClick}
                classList={{ 'cursor-pointer': !!props.onClick }}
            >
                <div class="absolute left-1/2 top-1/2 -ml-[20px] -mt-[25px]">
                    <LogoSvg height={50} />
                </div>
            </div>
            <div class="text-center mt-2 max-w-[130px]">
                <h3 class=" font-bold">{props.worksheet?.name || 'Nova planilha'}</h3>
                <h4 class="text-xs">{!!props.worksheet && dayjs(props.worksheet.created_at).format('DD/MM/YYYY')}</h4>
            </div>
            <div class="flex justify-center mt-3 gap-3">
                <Show when={props.onClickTooglePublish}>
                    <IconButton
                        disabled={props.loading}
                        class="icon-btn"
                        onClick={() => {
                            if (props.worksheet?.id) props.onClickTooglePublish?.(props.worksheet?.id)
                        }}
                    >
                        <Switch>
                            <Match when={!!props.worksheet?.published}>
                                <FiRewind size={16} />
                            </Match>
                            <Match when={!props.worksheet?.published}>
                                <FiCheck size={16} />
                            </Match>
                        </Switch>
                    </IconButton>
                </Show>
                <Show when={props.onClickRemove}>
                    <IconButton
                        disabled={props.loading}
                        class="icon-btn"
                        onClick={() => {
                            if (props.worksheet?.id) props.onClickRemove?.(props.worksheet?.id)
                        }}
                    >
                        <FiTrash size={16} />
                    </IconButton>
                </Show>
            </div>
        </div>
    )
}

export default WorksheetItem
