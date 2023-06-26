import cloneDeep from 'clone-deep'
import { TPeaces } from 'goal-models'
import { FiArrowDown, FiArrowUp, FiCopy, FiPlus, FiTrash2 } from 'solid-icons/fi'

import { Component, JSX } from 'solid-js'

import { Path } from '@interfaces/app'
import { Controllable } from '@interfaces/preview'
import { pathToNextIndex } from '@utils/paths'

export interface PeaceControlProps extends Omit<Controllable, 'onClickPeace'> {
    thisPath: Path
    item: TPeaces
    copyOnAddTop?: Partial<TPeaces>
    copyOnAddBottom?: Partial<TPeaces>
    createInitialValues: () => TPeaces
}

const PeaceControl: Component<PeaceControlProps> = (props): JSX.Element => {
    const handleClickRemove = () => {
        props.onRemove?.(props.thisPath)
    }
    const handleClickTopAdd = () => {
        props.onAdd?.(props.thisPath, {
            ...props.createInitialValues(),
            ...props.copyOnAddTop,
        } as TPeaces)
    }
    const handleClickBottomAdd = () => {
        props.onAdd?.(pathToNextIndex(props.thisPath), {
            ...props.createInitialValues(),
            ...props.copyOnAddBottom,
        } as TPeaces)
    }
    const handleClickTopDuplicate = () => {
        props.onAdd?.(props.thisPath, cloneDeep(props.item))
    }
    const handleClickBottomDuplicate = () => {
        props.onAdd?.(pathToNextIndex(props.thisPath), cloneDeep(props.item))
    }
    const handleClickTopMove = () => {
        props.onMove?.(props.thisPath, 'up')
    }
    const handleClickBottomMove = () => {
        props.onMove?.(props.thisPath, 'down')
    }

    return (
        <>
            <button class="icon-btn remove" onClick={handleClickRemove}>
                <FiTrash2 />
            </button>

            <button class="icon-btn add top" onClick={handleClickTopAdd}>
                <FiPlus />
            </button>

            <button class="icon-btn add bottom" onClick={handleClickBottomAdd}>
                <FiPlus />
            </button>

            <button class="icon-btn duplicate top" onClick={handleClickTopDuplicate}>
                <FiCopy />
            </button>

            <button class="icon-btn duplicate bottom" onClick={handleClickBottomDuplicate}>
                <FiCopy />
            </button>

            <button class="icon-btn move top" onClick={handleClickTopMove}>
                <FiArrowUp />
            </button>
            <button class="icon-btn move bottom" onClick={handleClickBottomMove}>
                <FiArrowDown />
            </button>
        </>
    )
}

export default PeaceControl
