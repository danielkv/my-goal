import { Component } from 'solid-js'

import { BreadcrumbItemProps } from './types'

const BreadcrumbItem: Component<BreadcrumbItemProps> = ({ item, onClick }) => {
    return (
        <button
            disabled={item.buttonDisabled}
            class="bg-gray-900 rounded-md px-2 py-1 text-sm whitespace-nowra my-1 hover:enabled:bg-gray-800"
            onClick={() => onClick(item.key)}
        >
            {item.label}
        </button>
    )
}

export default BreadcrumbItem
