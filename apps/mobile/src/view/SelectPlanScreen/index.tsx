import { useState } from 'react'
import { Alert, TouchableOpacity } from 'react-native'
import { PACKAGE_TYPE, PurchasesPackage } from 'react-native-purchases'

import dayjs from 'dayjs'
import * as Linking from 'expo-linking'
import { sort } from 'radash'
import useSWR from 'swr'
import { Card, Separator, Stack, Text, XStack, YStack } from 'tamagui'

import ActivityIndicator from '@components/ActivityIndicator'
import { alert } from '@components/AppAlert/utils'
import Button from '@components/Button'
import { useEntitlements, useUserContext } from '@contexts/user/userContext'
import { RouteProp, StackActions, useNavigation, useRoute } from '@react-navigation/native'
import { ERouteName, TReactNavigationStackParamList } from '@router/types'
import { CheckCircle2, ExternalLink } from '@tamagui/lucide-icons'
import { FREE_PACKAGE, getCurrentOfferingUseCase } from '@useCases/subscriptions/getCurrentOffering'
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

type TPeriods = 'annual' | 'sixMonth' | 'monthly'

const SelectPlanScreen: React.FC = () => {
    const period: TPeriods = 'monthly'

    const { params } = useRoute<RouteProp<TReactNavigationStackParamList, 'SelectPlan'>>()
    const navigation = useNavigation()
    const activeSubscriptions = useUserContext((context) => context.subscriptionInfo?.activeSubscriptions || [])
    const managementURL = useUserContext((context) => context.subscriptionInfo?.managementURL || null)
    const entitlements = useEntitlements()

    const [loading, setLoading] = useState(false)

    const { isLoading, data: offering } = useSWR('user_subscriptions', getCurrentOfferingUseCase)

    const handleSelectPackage = (pkg: PurchasesPackage) => () => {
        alert(
            'Confirmação',
            'Você confirma que deseja assinar esse plano?',
            [{ text: 'Sim', onPress: () => handleConfirmSelectPackage(pkg) }],
            true
        )
    }

    const handleConfirmSelectPackage = async (pkg: PurchasesPackage) => {
        if (pkg.identifier === FREE_PACKAGE.identifier) {
            handleRedirect()

            return
        }

        try {
            setLoading(true)
            await purchasePackageUseCase(pkg)

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

    const packages = !offering?.[period] ? [FREE_PACKAGE] : ([offering[period], FREE_PACKAGE] as PurchasesPackage[])
    const packagesSubscriptions = packages.map((pkg) => pkg.product.identifier)
    const hasAnySubscriptionFromOffering =
        activeSubscriptions.filter((sub) => packagesSubscriptions.includes(sub)).length > 0

    return (
        <YStack f={1} gap="$3.5" m="$3.5">
            {packages?.map((pkg) => {
                const current = userHasActiveSubscriptionUseCase(pkg.product.identifier)
                const currentIsFree = !hasAnySubscriptionFromOffering && pkg.identifier === FREE_PACKAGE.identifier
                const entitlement = sort(
                    Object.values(entitlements).filter((ent) => ent.productIdentifier === pkg.product.identifier),
                    (ent) => dayjs(ent.expirationDate).utcOffset(),
                    true
                )[0]

                return (
                    <TouchableOpacity key={pkg.identifier} style={{ flex: 1 }} onPress={handleSelectPackage(pkg)}>
                        <Card f={1} p="$3.5" gap="$3" ai="center" br="$6" jc="center" bg="$gray1">
                            <Text color="$gray9" fontSize="$8" fontWeight="700">
                                {pkg.product.title}
                            </Text>

                            <Separator borderColor="$gray6" br={10} width={80} my="$2" bw={3} alignSelf="center" />
                            <Text color="$red5" fontSize="$6" fontWeight="700">
                                {displayPrice(pkg.product.price, pkg.packageType)}
                            </Text>
                            <Text color="$gray5">{pkg.product.description}</Text>
                            {(current || currentIsFree) && (
                                <YStack ai="center">
                                    <XStack ai="center" gap="$2" bg="$green10" px="$2" py="$1.5" br="$4">
                                        <CheckCircle2 size={20} />
                                        <Text color="$gray1">Este já é o seu plano atual</Text>
                                    </XStack>
                                    {entitlement?.expirationDate && (
                                        <Text color="$gray4">
                                            {`${entitlement.willRenew ? 'Auto renovação em' : 'Expira em'} ${dayjs(
                                                entitlement.expirationDate
                                            ).format('DD/MM/YY HH:mm')}`}
                                        </Text>
                                    )}
                                </YStack>
                            )}
                        </Card>
                    </TouchableOpacity>
                )
            })}
            {managementURL && (
                <Button
                    bg="white"
                    color="$gray9"
                    onPress={() => Linking.openURL(managementURL)}
                    icon={<ExternalLink />}
                >
                    Gerenciar assinatura
                </Button>
            )}
        </YStack>
    )
}

export default SelectPlanScreen
