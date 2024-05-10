import dayjs from 'dayjs'
import { Models } from 'goal-models'
import { FiCheck, FiCopy, FiRewind, FiTrash } from 'solid-icons/fi'

import { Component, Match, Switch } from 'solid-js'

import LogoSvg from '@assets/logo.svg?component-solid'
import { Card, IconButton, Stack } from '@suid/material'
import { ToggleWeekPublishedUseCaseAction } from '@useCases/worksheet/toggleWorksheetPublished'

interface ProgramItemProps {
    week: Models<'worksheet_weeks'>
    onClick?: (weekId: string) => void
    onClickDelete?: (weekId: string) => void
    onClickDuplicate?: (weekId: string) => void
    onClickPublish?: (action: ToggleWeekPublishedUseCaseAction, weekId: string) => void
    disabled?: boolean
}

const WorksheetWeekItem: Component<ProgramItemProps> = (props) => {
    return (
        <Card
            class="cursor-pointer hover:bg-gray-800 transition-all px-2 py-3"
            onclick={() => !props.disabled && props.onClick?.(props.week.id)}
        >
            <Stack direction="row" gap={2}>
                <div class="flex items-center justify-center w-10 pl-4">
                    <LogoSvg width={30} />
                </div>
                <Stack flex={1}>
                    <h3 class="text-lg font-bold">{props.week.name}</h3>

                    <div class="text-sm text-gray-400">
                        {`${dayjs(props.week.startDate).format('DD/MM/YYYY')} - ${dayjs(props.week.endDate).format(
                            'DD/MM/YYYY'
                        )}`}
                    </div>
                </Stack>
                <Stack direction="row" gap={0.5}>
                    {!!props.onClickDuplicate && (
                        <IconButton
                            disabled={props.disabled}
                            onClick={(e) => {
                                e.stopPropagation()
                                props.onClickDuplicate?.(props.week.id)
                            }}
                            sx={{ height: 28 }}
                            size="small"
                        >
                            <FiCopy title="Duplicar semana" color="gray" />
                        </IconButton>
                    )}
                    {!!props.onClickPublish && (
                        <IconButton
                            disabled={props.disabled}
                            onClick={(e) => {
                                e.stopPropagation()
                                props.onClickPublish?.(props.week.published ? 'unpublish' : 'publish', props.week.id)
                            }}
                            sx={{ height: 28 }}
                            size="small"
                        >
                            <Switch>
                                <Match when={!!props.week?.published}>
                                    <FiRewind title="Despublicar semana" color="gray" />
                                </Match>
                                <Match when={!props.week?.published}>
                                    <FiCheck title="Publicar semana" color="gray" />
                                </Match>
                            </Switch>
                        </IconButton>
                    )}
                    {!!props.onClickDelete && (
                        <IconButton
                            disabled={props.disabled}
                            onClick={(e) => {
                                e.stopPropagation()
                                props.onClickDelete?.(props.week.id)
                            }}
                            sx={{ height: 28 }}
                            size="small"
                        >
                            <FiTrash title="Excluir semana" color="gray" />
                        </IconButton>
                    )}
                </Stack>
            </Stack>
        </Card>
    )
}

export default WorksheetWeekItem
