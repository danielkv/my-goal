import { FiChevronsRight } from 'solid-icons/fi'

import { Component, For } from 'solid-js'

import BreadcrumbItem from './item'
import { BreadcrumbProps } from './types'

const Breadcrumb: Component<BreadcrumbProps> = (props) => {
    const handleItemClick = (key: string) => {
        return props.onClick?.(key)
    }

    return (
        <div class="flex items-center flex-1 flex-wrap">
            <For each={props.items}>
                {(item, index) => (
                    <>
                        {index() > 0 && <FiChevronsRight color="black" />}
                        <BreadcrumbItem item={item} onClick={handleItemClick} />
                    </>
                )}
            </For>
        </div>
    )
}

export default Breadcrumb
