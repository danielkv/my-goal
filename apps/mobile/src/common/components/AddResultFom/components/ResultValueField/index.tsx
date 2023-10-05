import { TResultType } from 'goal-models'
import { Text } from 'tamagui'

import TextField from '@components/TextField'
import TimeField from '@components/TimeField2'

interface ResultValueFieldProps {
    onChange(value: number): void
    value: number
    type: TResultType
}

const ResultValueField: React.FC<ResultValueFieldProps> = ({ onChange, type, value }) => {
    switch (type) {
        case 'time':
            return (
                <>
                    <Text fontSize="$3" color="$gray1">
                        Tempo
                    </Text>
                    <TimeField value={value} onChange={onChange} />
                </>
            )
        case 'reps':
            return (
                <TextField
                    label="Repetições"
                    keyboardType="number-pad"
                    value={value.toString()}
                    onChangeText={(text) => onChange(Number(text))}
                />
            )
        case 'weight':
            return (
                <TextField
                    label="Peso (kg)"
                    keyboardType="number-pad"
                    value={value.toString()}
                    onChangeText={(text) => onChange(Number(text))}
                />
            )
    }
}

export default ResultValueField
