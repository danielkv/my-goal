import { ScrollView } from 'react-native'

import dayjs from 'dayjs'
import * as Linking from 'expo-linking'
import { FREE_ENTITLEMENT } from 'goal-utils'
import useSWR from 'swr'
import { Card, Separator, Stack, Text, XStack, YStack } from 'tamagui'

import ActivityIndicator from '@components/ActivityIndicator'
import Button from '@components/Button'
import { useUserContext } from '@contexts/user/userContext'
import { useNavigation } from '@react-navigation/native'
import { ERouteName } from '@router/types'
import { ExternalLink } from '@tamagui/lucide-icons'
import { getUserSubscriptions } from '@useCases/subscriptions/getUserSubscription'

function displayPrice(price: number, period: string | null): string {
    if (price === 0) return 'Grátis'

    const value = `R$ ${price.toFixed(2).replace('.', ',')}`

    switch (period) {
        case 'P1Y':
            return `${value} / ano`
        case 'P1M':
            return `${value} / mês`
        default:
            return value
    }
}

const UserSubscriptionScreen: React.FC = () => {
    const managementURL = useUserContext((ctx) => ctx.subscriptionInfo?.managementURL)
    const { navigate } = useNavigation()

    const { isLoading, data: subscriptions } = useSWR('user_subscription', getUserSubscriptions, {
        revalidateIfStale: true,
    })

    if (isLoading)
        return (
            <Stack flex={1} ai="center" jc="center">
                <ActivityIndicator />
            </Stack>
        )

    return (
        <YStack f={1} py="$5">
            <ScrollView>
                {subscriptions?.map((item) => {
                    const isFree = item.entitlement.identifier === FREE_ENTITLEMENT.identifier

                    return (
                        <Card elevation={5} key={item.entitlement.identifier} f={1} py="$5" gap="$3" m="$5" bg="$gray9">
                            <Text fontSize="$6" fontWeight="700" ta="center" mt="$2">
                                {item.product.description}
                            </Text>

                            <Separator borderColor="$gray6" br={10} width={80} my="$2" bw={3} alignSelf="center" />

                            {!isFree && (
                                <YStack gap="$2" mx="$6" f={1}>
                                    <XStack gap="$1">
                                        <Text color="$gray3">Valor:</Text>
                                        <Text>{displayPrice(item.product.price, item.product.subscriptionPeriod)}</Text>
                                    </XStack>
                                    <XStack gap="$1">
                                        <Text color="$gray3">Última renovação:</Text>
                                        <Text>
                                            {dayjs(item.entitlement.latestPurchaseDate).format('DD/MM/YYYY HH:mm')}
                                        </Text>
                                    </XStack>
                                    <XStack gap="$1">
                                        <Text color="$gray3">Expira em:</Text>
                                        <Text>{dayjs(item.entitlement.expirationDate).format('DD/MM/YYYY HH:mm')}</Text>
                                    </XStack>
                                    <XStack gap="$1">
                                        <Text color="$gray3">Renovação automática:</Text>
                                        <Text>{item.entitlement.willRenew ? 'Sim' : 'Não'}</Text>
                                    </XStack>
                                </YStack>
                            )}

                            <Stack px="$5">
                                <Button onPress={() => navigate(ERouteName.SelectSubscription)}>Alterar Plano</Button>
                            </Stack>
                        </Card>
                    )
                })}
            </ScrollView>

            {!!managementURL && (
                <Button mx="$5" w="auto" onPress={() => Linking.openURL(managementURL)} icon={<ExternalLink />}>
                    Gerenciar assinaturas
                </Button>
            )}
        </YStack>
    )
}

export default UserSubscriptionScreen
