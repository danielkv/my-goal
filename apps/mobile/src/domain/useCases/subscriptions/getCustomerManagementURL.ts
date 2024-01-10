import Purchases from 'react-native-purchases'

export async function getCustomerManagementURL() {
    const customerInfo = await Purchases.getCustomerInfo()

    return customerInfo.managementURL
}
