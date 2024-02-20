import { Models } from 'goal-models'
import { pluralize } from 'goal-utils'

import { Component } from 'solid-js'

import { Card, Stack } from '@suid/material'

interface ProgramItemProps {
    program: Models<'programs'>
    onClick?: (program: Models<'programs'>) => void
}

const ProgramItem: Component<ProgramItemProps> = (props) => {
    return (
        <Card class="cursor-pointer hover:bg-gray-800" onClick={() => console.log('123')}>
            <Stack direction="row">
                <img src={props.program.image} class="w-[100px] h-auto object-cover" />
                <Stack px={2} py={1}>
                    <h3 class="text-lg font-bold">{props.program.name}</h3>
                    <div class="text-sm text-gray-400">Valor atual: R$ {props.program.amount.toFixed(2)}</div>
                    <div class="text-sm text-gray-400">
                        Expira em {props.program.expiration} {pluralize(props.program.expiration, 'dia')} após a compra
                    </div>
                </Stack>
            </Stack>
        </Card>
    )
}

export default ProgramItem
