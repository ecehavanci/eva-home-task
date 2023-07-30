
class Store {
    constructor(data) {
        this.storeName = data.storeName;
        this.storeId = data.storeId;
        this.evaStoreId = data.evaStoreId;
        this.storeType = data.storeType;
        this.region = data.region;
        this.paidStatus = data.paidStatus;
        this.pricingStatus = data.pricingStatus;
        this.linkedDate = data.linkedDate;
        this.reimbursementPackageTrialEndDate = data.reimbursementPackageTrialEndDate;
        this.unlimitedReimbursementStatus = data.unlimitedReimbursementStatus;
        this.showSellerCentralExternalLink = data.showSellerCentralExternalLink;
        this.remainingReimbursementCredit = data.remainingReimbursementCredit;
        this.monthlyReimbursementPackageCredit = data.monthlyReimbursementPackageCredit;
        this.marketplaceName = data.marketplaceName;
        this.marketplaceCode = data.marketplaceCode;
        this.enableRepricing = data.enableRepricing;
        this.screenPermissionList = data.screenPermissionList;
        this.reimbursementStatus = data.reimbursementStatus;
        this.loanOfferAmount = data.loanOfferAmount;
        this.subscriptionCancelationStatus = data.subscriptionCancelationStatus;
        this.subscriptionCancelationDate = data.subscriptionCancelationDate;
        this.is3plStore = data.is3plStore;
        this.isAdvertisingConnected = data.isAdvertisingConnected;
        this.sellerApiTokenStatus = data.sellerApiTokenStatus;
        this.sellerApiAuthCodeCreatedAt = data.sellerApiAuthCodeCreatedAt;
    }
}

class TurnoverPackageInformation {
    constructor(data) {
        this.packageName = data.packageName;
        this.pricingStatus = data.pricingStatus
        this.monthlyFee = data.monthlyFee;
        this.lowerLimit = data.lowerLimit;
        this.upperLimit = data.upperLimit;
        this.reimbursementCredit = data.reimbursementCredit
    }
}


class SKUPackageInformation {
    constructor(data) {
        this.packageName = data.packageName;
        this.pricingStatus = data.pricingStatus
        this.packageDefinition = data.packageDefinition;
        this.lowerSkuCount = data.lowerSkuCount;
        this.upperSkuCount = data.upperSkuCount;
    }
}

class User {
    constructor(data) {
        this.firstName = data?.firstName || ''; // Use optional chaining to handle potential undefined
        this.lastName = data?.lastName || ''; // Use optional chaining to handle potential undefined
        this.email = data?.email || ''; // Use optional chaining to handle potential undefined
        this.isAdmin = data?.isAdmin || false; // Use optional chaining to handle potential undefined
        this.countryCode = data?.countryCode || null; // Use optional chaining to handle potential undefined
        this.callingCode = data?.callingCode || null; // Use optional chaining to handle potential undefined
        this.telephoneNumber = data?.telephoneNumber || null; // Use optional chaining to handle potential undefined
        this.accountStatus = data?.accountStatus || 0; // Use optional chaining to handle potential undefined
        this.accountType = data?.accountType || 0; // Use optional chaining to handle potential undefined
        this.userId = data?.userId || ''; // Use optional chaining to handle potential undefined
        this.store = data?.store?.map((storeData) => new Store(storeData)) || [];
        this.packageInformation = data?.packageInformation.turnoverPackageInformation?.map(
            (packageData) => new TurnoverPackageInformation(packageData)
        ) || [];
        this.skuPackageInformation = data?.packageInformation.skuPackageInformation?.map(
            (packageData) => new SKUPackageInformation(packageData)
        ) || [];
    }
}

class UserModel {
    constructor(data) {
        this.user = new User(data);
    }
}

export default UserModel;
