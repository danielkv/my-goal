import { Component } from 'solid-js'

import { Stack } from '@suid/material'

export interface HomeFeatureProps {
    title: string
    description: string
    image: string
}

const HomeFeature: Component<HomeFeatureProps> = (props) => {
    return (
        <Stack class="!flex-col-reverse md:!flex-row">
            <div class="flex flex-1 justify-center items-center">
                <img src={props.image} alt={props.title} class="h-[300px] md:h-[485px]" />
            </div>
            <Stack class="gap-5" flex={1} p={4} pb={5} justifyContent="center">
                <h3 class="text-2xl font-bold ">{props.title}</h3>
                <div>{props.description}</div>
            </Stack>
        </Stack>
    )
}

export default HomeFeature
