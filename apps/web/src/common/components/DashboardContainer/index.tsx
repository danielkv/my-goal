import { ParentComponent } from 'solid-js'

import DashboardHeader from '@components/DashboardHeader'

const DashboardContainer: ParentComponent = (props) => {
    return (
        <>
            <DashboardHeader />
            {props.children}
        </>
    )
}

export default DashboardContainer
