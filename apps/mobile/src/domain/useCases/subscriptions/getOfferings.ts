import Purchases from 'react-native-purchases'

import { IOffering } from 'goal-models'
import { FREE_OFFERING } from 'goal-utils'

export async function getOfferingsUseCase(): Promise<IOffering[]> {
    const offerings = await Purchases.getOfferings()

    console.log(offerings)

    return [FREE_OFFERING, offerings.all['app_pro_subscription'], offerings.all['app_premium_subscription']]
}
