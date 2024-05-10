import { Component } from 'solid-js'

import { ChevronLeft, ChevronRight } from '@suid/icons-material'
import { IconButton, Stack } from '@suid/material'

interface PaginationProps {
    onClickNext(): void
    onClickPrev(): void
}

const Pagination: Component<PaginationProps> = (props) => {
    return (
        <Stack flexDirection="row" justifyContent="center">
            <IconButton onClick={props.onClickPrev}>
                <ChevronLeft />
            </IconButton>
            <IconButton onClick={props.onClickNext}>
                <ChevronRight />
            </IconButton>
        </Stack>
    )
}

export default Pagination
