import { Text, XStack, YStack } from 'tamagui'

interface WeightPartialsProps {
    weight: number
    count: number
    startPct?: number
    addPct?: number
}

const WeightPartials: React.FC<WeightPartialsProps> = ({ weight, count, startPct = 10, addPct = 10 }) => {
    return (
        <XStack f={1} jc="space-between" my="$2">
            {Array.from({ length: count }).map((_, index) => {
                const pct = startPct + index * addPct
                const partialWeight = (pct / 100) * weight
                return (
                    <YStack key={`${partialWeight}${pct}`} ai="center" jc="center" bg="$gray9" w={58} h={55} br="$4">
                        <Text fontWeight="700">{`${Math.round(partialWeight * 10) / 10}kg`}</Text>
                        <Text fontSize={12} color="$gray3">{`${pct}%`}</Text>
                    </YStack>
                )
            })}
        </XStack>
    )
}

export default WeightPartials
