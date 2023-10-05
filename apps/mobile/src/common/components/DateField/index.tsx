import { Platform } from 'react-native'

import dayjs from 'dayjs'
import { Button } from 'tamagui'

import DateTimePicker, {
    AndroidNativeProps,
    DateTimePickerAndroid,
    IOSNativeProps,
} from '@react-native-community/datetimepicker'

type DateFieldProps = IOSNativeProps | AndroidNativeProps

const DateField: React.FC<DateFieldProps> = (props) => {
    const handleOpenAndroid = () => {
        DateTimePickerAndroid.open(props as AndroidNativeProps)
    }

    return (
        <>
            {Platform.OS === 'android' && (
                <Button
                    onPress={handleOpenAndroid}
                    px="$3"
                    py="$1.5"
                    height="auto"
                    bg="$gray6"
                    pressStyle={{ opacity: 0.4 }}
                >
                    {dayjs(props.value).format('DD [de] MMM [de] YYYY')}
                </Button>
            )}
            {Platform.OS === 'ios' && <DateTimePicker {...props} />}
        </>
    )
}

export default DateField
