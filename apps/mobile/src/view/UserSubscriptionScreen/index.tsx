import { useCallback } from 'react'
import { ScrollView } from 'react-native'

import dayjs from 'dayjs'
import * as Linking from 'expo-linking'
import { APP_ENTITLEMENTS } from 'goal-models'
import { APP_ENTITLEMENT_DESCRIPTIONS, APP_STORES_DESCRIPTIONS, FREE_ENTITLEMENTS } from 'goal-utils'
import useSWR from 'swr'
import { Card, Stack, Text, XStack, YStack, getTokens } from 'tamagui'

import ActivityIndicator from '@components/ActivityIndicator'
import { IAlertButton } from '@components/AppAlert/types'
import { alert } from '@components/AppAlert/utils'
import Button from '@components/Button'
import { useUserContext } from '@contexts/user/userContext'
import { useNavigation } from '@react-navigation/native'
import { ERouteName } from '@router/types'
import { Edit3, ExternalLink } from '@tamagui/lucide-icons'
import { getUserSubscriptions } from '@useCases/subscriptions/getUserSubscription'

function displayPrice(price: number, period: string | null): string {
    if (price === 0) return 'Grátis'

    const value = `R$ ${price.toFixed(2).replace('.', ',')}`

    switch (period) {
        case 'P1Y':
            return `${value}/ano`
        case 'P1M':
            return `${value}/mês`
        default:
            return value
    }
}

const UserSubscriptionScreen: React.FC = () => {
    const { space } = getTokens()

    const managementURL = useUserContext((ctx) => ctx.subscriptionInfo?.managementURL)
    const { navigate } = useNavigation()

    const { isLoading, data: { subscriptions, entitlements } = {} } = useSWR(
        'user_subscription',
        getUserSubscriptions,
        {
            revalidateIfStale: true,
        }
    )

    const subscriptionManagedHere = subscriptions?.length && entitlements?.length

    const handleEditSubscription = useCallback(() => {
        if (subscriptionManagedHere) navigate(ERouteName.SelectSubscription)
        else {
            const buttons: IAlertButton[] = [
                { text: 'Selecionar outra assinatura', onPress: () => navigate(ERouteName.SelectSubscription) },
            ]

            if (managementURL)
                buttons.unshift({
                    text: 'Gerenciar assinaturas',
                    onPress: () => Linking.openURL(managementURL),
                    icon: <ExternalLink />,
                })

            alert(
                'Você já tem uma assinatura ativa gerenciada por outra plataforma. Caso queira gerencia-la aqui, não esqueça de cancela-la na outra plataforma.',
                buttons,
                true
            )
        }
    }, [subscriptionManagedHere])

    if (isLoading)
        return (
            <Stack flex={1} ai="center" jc="center">
                <ActivityIndicator />
            </Stack>
        )

    {
        !!managementURL && (
            <Button onPress={() => Linking.openURL(managementURL)} icon={<ExternalLink />}>
                Gerenciar assinaturas
            </Button>
        )
    }

    return (
        <ScrollView contentContainerStyle={{ padding: space['3.5'].val }}>
            <YStack gap="$3.5">
                <YStack gap="$2.5">
                    {subscriptionManagedHere ? (
                        subscriptions.map((subscription) => {
                            const PRICE_COLOR = subscription.subscriptionPeriod === 'P1M' ? '#00B633' : '#E0B20C'
                            return (
                                <XStack
                                    key={subscription.identifier}
                                    bg="$gray9"
                                    btlr="$4"
                                    bblr="$4"
                                    jc="space-between"
                                    h={40}
                                    pl="$3.5"
                                >
                                    <Text alignSelf="center" fontSize="$3">
                                        {subscription.title}
                                    </Text>
                                    <XStack bg={PRICE_COLOR} btrr="$4" bbrr="$4" ai="center" px="$3.5">
                                        <Text fontSize="$4" fontWeight="700">
                                            {displayPrice(subscription.price, subscription.subscriptionPeriod)}
                                        </Text>
                                    </XStack>
                                </XStack>
                            )
                        })
                    ) : (
                        <Text ta="center" color="$yellow10">
                            Você tem uma assinatura ativa, mas ela não é gerenciada por esta plataforma.
                        </Text>
                    )}

                    <Button onPress={handleEditSubscription} icon={<Edit3 />}>
                        Alterar assinatura
                    </Button>
                    {!!managementURL && (
                        <Button onPress={() => Linking.openURL(managementURL)} icon={<ExternalLink />}>
                            Gerenciar assinaturas
                        </Button>
                    )}
                </YStack>

                <Text fontSize="$7" fontWeight="700" ta="center">
                    Acessos
                </Text>
                <YStack gap="$3.5">
                    {entitlements?.map((entitlement) => {
                        const isFree = FREE_ENTITLEMENTS.map((e) => e.identifier).includes(entitlement.identifier)

                        return (
                            <Card elevation={5} key={entitlement.identifier} f={1} p="$5" gap="$1" bg="$gray9">
                                <YStack gap="$1" f={1}>
                                    <XStack gap="$1">
                                        <Text fontSize={14} fontWeight="700">
                                            {APP_ENTITLEMENT_DESCRIPTIONS[entitlement.identifier as APP_ENTITLEMENTS]}
                                        </Text>
                                    </XStack>
                                    {!isFree && (
                                        <>
                                            <XStack gap="$1">
                                                <Text fontSize={12} color="$gray3">
                                                    Última renovação:
                                                </Text>
                                                <Text fontSize={12}>
                                                    {dayjs(entitlement.latestPurchaseDate).format('DD/MM/YYYY HH:mm')}
                                                </Text>
                                            </XStack>
                                            <XStack gap="$1">
                                                <Text fontSize={12} color="$gray3">
                                                    Expira em:
                                                </Text>
                                                <Text fontSize={12}>
                                                    {dayjs(entitlement.expirationDate).format('DD/MM/YYYY HH:mm')}
                                                </Text>
                                            </XStack>
                                            <XStack gap="$1">
                                                <Text fontSize={12} color="$gray3">
                                                    Gerenciado por:
                                                </Text>
                                                <Text fontSize={12}>{APP_STORES_DESCRIPTIONS[entitlement.store]}</Text>
                                            </XStack>
                                            <XStack gap="$1">
                                                <Text fontSize={12} color="$gray3">
                                                    Renovação automática:
                                                </Text>
                                                <Text fontSize={12}>{entitlement.willRenew ? 'Sim' : 'Não'}</Text>
                                            </XStack>
                                        </>
                                    )}
                                </YStack>
                            </Card>
                        )
                    })}
                </YStack>
            </YStack>
        </ScrollView>
    )
}

export default UserSubscriptionScreen
