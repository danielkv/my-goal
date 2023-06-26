import dayjs from 'dayjs'
import { IWorksheetModel } from 'goal-models'
import { FiCheck, FiCopy, FiRewind, FiTrash } from 'solid-icons/fi'

import { Component, Match, Show, Switch } from 'solid-js'

import LogoSvg from '@assets/logo.svg?component-solid'

export interface WorksheetItemProps {
    worksheet?: Omit<IWorksheetModel, 'days'>
    onClickDuplicate?(worksheetId: string): void
    onClickRemove?(worksheetId: string): void
    onClickTooglePublish?(worksheetId: string): void
    onClick(): void
    loading?: boolean
}

const WorksheetItem: Component<WorksheetItemProps> = (props) => {
    return (
        <div class="p-10 hover:bg-gray-700" classList={{ 'opacity-50': props.loading }}>
            <div
                class="w-32 h-40 shadow-md bg-gray-900 relative"
                onClick={props.onClick}
                classList={{ 'cursor-pointer': !!props.onClick }}
            >
                <Show when={props.worksheet?.isCurrent}>
                    <div class="w-2 h-2 rounded-full absolute top-2 right-2 bg-red-500"></div>
                </Show>
                <div class="absolute left-1/2 top-1/2 -ml-[20px] -mt-[25px]">
                    <LogoSvg height={50} />
                </div>
            </div>
            <div class="text-center mt-2 max-w-[130px]">
                <h3 class=" font-bold">{props.worksheet?.name || 'Nova planilha'}</h3>
                <h4 class="text-xs">{!!props.worksheet && dayjs(props.worksheet.startDate).format('DD/MM/YYYY')}</h4>
            </div>
            <div class="flex justify-center mt-3 gap-3">
                <Show when={props.onClickDuplicate}>
                    <button
                        disabled={props.loading}
                        class="icon-btn"
                        onClick={() => {
                            if (props.worksheet?.id) props.onClickDuplicate?.(props.worksheet?.id)
                        }}
                    >
                        <FiCopy />
                    </button>
                </Show>
                <Show when={props.onClickRemove}>
                    <button
                        disabled={props.loading}
                        class="icon-btn"
                        onClick={() => {
                            if (props.worksheet?.id) props.onClickRemove?.(props.worksheet?.id)
                        }}
                    >
                        <FiTrash />
                    </button>
                </Show>
                <Show when={props.onClickTooglePublish}>
                    <button
                        disabled={props.loading}
                        class="icon-btn"
                        onClick={() => {
                            if (props.worksheet?.id) props.onClickTooglePublish?.(props.worksheet?.id)
                        }}
                    >
                        <Switch>
                            <Match when={!!props.worksheet?.published}>
                                <FiRewind />
                            </Match>
                            <Match when={!props.worksheet?.published}>
                                <FiCheck />
                            </Match>
                        </Switch>
                    </button>
                </Show>
            </div>
        </div>
    )
}

export default WorksheetItem
