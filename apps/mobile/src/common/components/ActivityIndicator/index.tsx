import { Spinner, SpinnerProps } from 'tamagui'

export interface ActivityIndicatorProps extends SpinnerProps {}

const ActivityIndicator: React.FC<ActivityIndicatorProps> = (props) => {
    return <Spinner color="$red5" {...props} />
}

export default ActivityIndicator
