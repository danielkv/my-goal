import cloneDeep from 'clone-deep'
import { IWorksheetInput, Typefy } from 'goal-models'
import { FiArrowDown, FiArrowUp, FiCopy, FiPlus, FiTrash2 } from 'solid-icons/fi'

import { JSX } from 'solid-js'

import { FieldArrayPath, FieldArrayPathValue, getValues, insert, move, remove } from '@modular-forms/solid'
import {
    createEmptyBlockV2,
    createEmptyDay,
    createEmptyPeriod,
    createEmptySection,
} from '@view/WorksheetFormScreen/WorksheetWeekV2/config'
import { IWorksheetArrayFormCommon } from '@view/WorksheetFormScreen/WorksheetWeekV2/types'

type Direction = 'up' | 'down'

export interface PeaceControlProps<Path extends FieldArrayPath<Typefy<IWorksheetInput<'v2'>>>>
    extends IWorksheetArrayFormCommon<Path> {}
const peacesMap = {
    blocks: createEmptyBlockV2,
    sections: createEmptySection,
    periods: createEmptyPeriod,
    days: createEmptyDay,
} as const

const PeaceControl = <Path extends FieldArrayPath<Typefy<IWorksheetInput<'v2'>>>>(
    props: PeaceControlProps<Path>
): JSX.Element => {
    const onClickAdd = (direction: Direction) => {
        const peaces = props.arrProps.name.split('.')
        const lastPeace = peaces.pop() as keyof typeof peacesMap
        if (!lastPeace) return

        const createEmptyFn = peacesMap[lastPeace]
        if (!createEmptyFn) return

        insert(props.form, props.arrProps.name, {
            value: createEmptyFn(),
            at: direction === 'up' ? props.index : props.index + 1,
        })
    }
    const onClickDuplicate = (direction: Direction) => {
        const duplicatedValue = getValues(props.form, props.arrProps.name)[props.index]
        if (!duplicatedValue) return

        const value = cloneDeep(duplicatedValue) as FieldArrayPathValue<Typefy<IWorksheetInput<'v2'>>, Path>[number]

        insert(props.form, props.arrProps.name, {
            value,
            at: direction === 'up' ? props.index : props.index + 1,
        })
    }
    const onClickMove = (direction: Direction) => {
        move(props.form, props.arrProps.name, {
            from: props.index,
            to: props.index + (direction === 'up' ? -1 : 1),
        })
    }
    const onClickRemove = () => {
        remove(props.form, props.arrProps.name, {
            at: props.index,
        })
    }

    return (
        <>
            <button
                class="icon-btn remove"
                onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    onClickRemove()
                }}
            >
                <FiTrash2 />
            </button>

            <button class="icon-btn add top" onClick={() => onClickAdd('up')}>
                <FiPlus />
            </button>

            <button class="icon-btn add bottom" onClick={() => onClickAdd('down')}>
                <FiPlus />
            </button>

            <button class="icon-btn duplicate top" onClick={() => onClickDuplicate('up')}>
                <FiCopy />
            </button>

            <button class="icon-btn duplicate bottom" onClick={() => onClickDuplicate('down')}>
                <FiCopy />
            </button>

            <button class="icon-btn move top" onClick={() => onClickMove('up')}>
                <FiArrowUp />
            </button>
            <button class="icon-btn move bottom" onClick={() => onClickMove('down')}>
                <FiArrowDown />
            </button>
        </>
    )
}

export default PeaceControl
