class SkuModel {
    constructor(data) {
        this.sku = data.sku || '';
        this.productName = data.productName || '';
        this.qty = data.qty || 0;
        this.shippingAmount = data.shippingAmount || 0;
        this.amount = data.amount || 0;
        this.refundPercentage = data.refundPercentage || 0;
        this.qty2 = data.qty2 || 0;
        this.amount2 = data.amount2 || 0;
    }
}

class ItemModel {
    constructor(data) {
        this.selectedDate = data.selectedDate || '';
        this.totalSale = data.totalSale || 0;
        this.skuList = Array.isArray(data.skuList)
            ? data.skuList.map((skuData) => new SkuModel(skuData))
            : [];
        this.selectedDate2 = data.selectedDate2 || '';
        this.totalSale2 = data.totalSale2 || 0;
    }
}

class DataModel {
    constructor(data) {
        this.currency = data.currency || '';
        this.item = data.item ? new ItemModel(data.item) : null;
    }
}

class SkuDailySalesModel {
    constructor(data) {
        this.data = data.data ? new DataModel(data.data) : null;
    }
}

export default SkuDailySalesModel;