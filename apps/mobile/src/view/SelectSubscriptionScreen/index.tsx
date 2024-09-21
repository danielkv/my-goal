import { useState } from 'react'
import { Alert } from 'react-native'
import PagerView from 'react-native-pager-view'
import { PACKAGE_TYPE, PurchasesPackage } from 'react-native-purchases'
import Animated, { useSharedValue } from 'react-native-reanimated'

import * as Linking from 'expo-linking'
import { ANALYTICS_EVENTS, APP_OFFERING } from 'goal-models'
import { FREE_PACKAGE } from 'goal-utils'
import useSWR from 'swr'
import { Card, Separator, Stack, Text, ToggleGroup, XStack, YStack } from 'tamagui'

import { firebaseProvider } from '@common/providers/firebase'
import ActivityIndicator from '@components/ActivityIndicator'
import AlertBox from '@components/AlertBox'
import { alert } from '@components/AppAlert/utils'
import Button from '@components/Button'
import PaginationDots from '@components/PaginationDots'
import { useUserContext } from '@contexts/user/userContext'
import { usePageScrollHandler } from '@hooks/helpers/usePageScrollHandler'
import { RouteProp, StackActions, useNavigation, useRoute } from '@react-navigation/native'
import { ERouteName, TReactNavigationStackParamList } from '@router/types'
import { Check, CheckCircle2, ExternalLink } from '@tamagui/lucide-icons'
import { getOfferingsUseCase } from '@useCases/subscriptions/getOfferings'
import { purchasePackageUseCase } from '@useCases/subscriptions/purchasePackage'
import { userHasActiveSubscriptionUseCase } from '@useCases/subscriptions/userHasActiveSubscription'
import { getErrorMessage } from '@utils/getErrorMessage'

function displayPrice(price: number, period: PACKAGE_TYPE): string {
    if (price === 0) return 'Grátis'

    const value = `R$ ${price.toFixed(2).replace('.', ',')}`

    switch (period) {
        case PACKAGE_TYPE.ANNUAL:
            return `${value} / ano`
        case PACKAGE_TYPE.MONTHLY:
            return `${value} / mês`
        case PACKAGE_TYPE.SIX_MONTH:
            return `${value} / semestre`
        case PACKAGE_TYPE.THREE_MONTH:
            return `${value} / trimestre`
        case PACKAGE_TYPE.TWO_MONTH:
            return `${value} / bimestre`
        case PACKAGE_TYPE.WEEKLY:
            return `${value} / semana`
        default:
            return value
    }
}

type TPeriods = 'annual' | 'monthly'

const AnimatedPagerView = Animated.createAnimatedComponent(PagerView)

const SelectSubscriptionScreen: React.FC = () => {
    const [period, setPeriod] = useState<TPeriods>('monthly')

    const managementURL = useUserContext((ctx) => ctx.subscriptionInfo?.managementURL)

    const { params } = useRoute<RouteProp<TReactNavigationStackParamList, 'SelectSubscription'>>()

    const navigation = useNavigation()
    const activeSubscriptions = useUserContext((context) => context.subscriptionInfo?.activeSubscriptions || [])

    const [loading, setLoading] = useState(false)

    const { isLoading, data: offerings } = useSWR('user_subscriptions', getOfferingsUseCase, {
        onError(err) {
            console.log(err)
        },
    })

    const packagesSubscriptions = offerings
        ? Object.values(offerings)
              .flatMap((off) => off.availablePackages)
              .map((pkg) => pkg.product.identifier)
        : []
    const hasAnySubscriptionFromOffering = activeSubscriptions.some((sub) => packagesSubscriptions.includes(sub))

    const offset = useSharedValue(0)
    const position = useSharedValue(0)
    const scrollHandler = usePageScrollHandler({
        onPageScroll: (e: any) => {
            'worklet'
            offset.value = e.offset
            position.value = e.position
        },
    })

    const handleSelectPackage = (pkg: PurchasesPackage) => () => {
        const msg = hasAnySubscriptionFromOffering
            ? 'Você confirma que deseja alterar seu plano?'
            : 'Você confirma que deseja assinar esse plano?'
        alert('Confirmação', msg, [{ text: 'Sim', onPress: () => handleConfirmSelectPackage(pkg) }], true)
    }

    const handleConfirmSelectPackage = async (pkg: PurchasesPackage) => {
        if (pkg.identifier === FREE_PACKAGE.identifier) {
            handleRedirect()

            return
        }

        try {
            setLoading(true)
            await firebaseProvider.getAnalytics().logEvent(ANALYTICS_EVENTS.SELECT_SUBSCRIPTION, {
                value: pkg.product.price,
                currency: pkg.product.currencyCode,
                package: pkg.identifier,
                item_id: pkg.product.identifier,
                item_name: pkg.product.title,
            })
            await purchasePackageUseCase(pkg)
            await firebaseProvider.getAnalytics().logAddPaymentInfo({
                value: pkg.product.price,
                currency: pkg.product.currencyCode,
                items: [
                    {
                        item_id: pkg.product.identifier,
                        item_name: pkg.product.title,
                        price: pkg.product.price,
                    },
                ],
            })

            handleRedirect()
        } catch (err) {
            Alert.alert('Ocorreu um erro', getErrorMessage(err))
        } finally {
            setLoading(false)
        }
    }

    function handleRedirect() {
        if (params?.redirect) {
            navigation.dispatch(StackActions.replace(params.redirect, params.redirectParams))
        } else {
            navigation.reset({
                routes: [{ name: ERouteName.HomeScreen }],
            })
        }
    }

    if (isLoading || loading)
        return (
            <Stack flex={1} ai="center" jc="center">
                <ActivityIndicator />
            </Stack>
        )

    const periodToUse = period || 'monthly'
    const PRICE_COLOR = periodToUse === 'monthly' ? '#00B633' : '#E0B20C'

    return (
        <YStack f={1} py="$5">
            {!offerings ? (
                <Stack mx="$5">
                    <AlertBox
                        type="warning"
                        text={'Tente novamente mais tarde.'}
                        title="Nenhuma assinatura foi encontrada"
                    />
                </Stack>
            ) : (
                <>
                    <ToggleGroup
                        mx="$5"
                        value={period}
                        disableDeactivation
                        defaultValue="monthly"
                        onValueChange={(value) => setPeriod(value as TPeriods)}
                        type="single"
                        h={40}
                    >
                        <ToggleGroup.Item value="monthly" f={1}>
                            <Text>Mensal</Text>
                        </ToggleGroup.Item>
                        <ToggleGroup.Item value="annual" f={1}>
                            <Text>Anual (-15%)</Text>
                        </ToggleGroup.Item>
                    </ToggleGroup>
                    <AnimatedPagerView initialPage={1} style={{ flex: 1 }} onPageScroll={scrollHandler}>
                        {offerings.map((offering) => {
                            const identifier = offering.identifier
                            const isFree = identifier === APP_OFFERING.APP_FREE_SUBSCRIPTION
                            const pkg = (isFree ? offering.lifetime : offering[periodToUse]) as PurchasesPackage

                            const isActiveSubscription = userHasActiveSubscriptionUseCase(pkg.product.identifier)
                            const currentIsFree = !hasAnySubscriptionFromOffering && isFree

                            const isCurrent = isActiveSubscription || currentIsFree

                            const metaDescription = (offering.metadata?.description || []) as string[]

                            return (
                                <Card elevation={5} key={identifier} f={1} py="$5" gap="$3" m="$5" bg="$gray9">
                                    <Text fontSize="$6" fontWeight="700" ta="center" mt="$2">
                                        {pkg.product.title}
                                    </Text>

                                    <Separator
                                        borderColor="$gray6"
                                        br={10}
                                        width={80}
                                        my="$2"
                                        bw={3}
                                        alignSelf="center"
                                    />

                                    <Stack gap="$1" mx="$6" f={1}>
                                        {metaDescription.map((item) => (
                                            <XStack key={item}>
                                                <Stack mt={4} mr={3}>
                                                    <Check size={10} />
                                                </Stack>
                                                <Text>{item}</Text>
                                            </XStack>
                                        ))}
                                    </Stack>

                                    <Stack bg="$gray6" h="$7" ai="center" jc="center">
                                        <Text color={PRICE_COLOR} fontSize="$6" fontWeight="700">
                                            {displayPrice(pkg.product.price, pkg.packageType)}
                                        </Text>
                                    </Stack>

                                    <Stack px="$5">
                                        {isCurrent ? (
                                            <XStack ai="center" jc="center" gap="$2">
                                                <CheckCircle2 size={20} />
                                                <Text color="$gray1">Assinatura atual</Text>
                                            </XStack>
                                        ) : hasAnySubscriptionFromOffering && isFree && managementURL ? (
                                            <>
                                                <Button
                                                    mb="$2"
                                                    onPress={() => Linking.openURL(managementURL)}
                                                    icon={<ExternalLink />}
                                                >
                                                    Gerenciar assinaturas
                                                </Button>
                                                <Text fontSize="$2" ta="center" color="$gray3">
                                                    Para cancelar sua assinatura paga, clique no botão acima e cancele
                                                    sua assinatura
                                                </Text>
                                            </>
                                        ) : (
                                            <Button variant="primary" onPress={handleSelectPackage(pkg)}>
                                                Assinar
                                            </Button>
                                        )}
                                    </Stack>
                                </Card>
                            )
                        })}
                    </AnimatedPagerView>

                    <PaginationDots
                        length={offerings ? Object.entries(offerings).length : 0}
                        position={position}
                        offset={offset}
                    />
                </>
            )}
        </YStack>
    )
}

export default SelectSubscriptionScreen
