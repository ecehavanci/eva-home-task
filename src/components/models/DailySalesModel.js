
class Item {
  constructor(data) {
    this.date = data.date || '';
    this.amount = data.amount || 0;
    this.fbaAmount = data.fbaAmount || 0;
    this.fbmAmount = data.fbmAmount || 0;
    this.orderCount = data.orderCount || 0;
    this.fbaOrderCount = data.fbaOrderCount || '';
    this.fbmOrderCount = data.fbmOrderCount || 0;
    this.unitCount = data.unitCount || 0;
    this.fbaUnitCount = data.fbaUnitCount || 0;
    this.fbmUnitCount = data.fbmUnitCount || 0;
    this.avgSalesPrev30Days = data.avgSalesPrev30Days || 0;
    this.prevYearDate = data.prevYearDate || 0;
    this.prevYearAmount = data.prevYearAmount || 0;
    this.prevYearFbaAmount = data.prevYearFbaAmount || 0;
    this.prevYearFbmAmount = data.prevYearFbmAmount || 0;
    this.prevYearOrderCount = data.prevYearOrderCount || 0;
    this.prevYearUnitCount = data.prevYearUnitCount || 0;
    this.yoy30DailySalesGrowth = data.yoy30DailySalesGrowth || 0;
    this.prevYearAvgSalesPrev30Days = data.prevYearAvgSalesPrev30Days || 0;
    this.profit = data.profit || 0;
    this.cogs = data.cogs || 0;
    this.amazonExpense = data.amazonExpense || 0;
    this.totalExpense = data.totalExpense || 0;
    this.shippingAmount = data.shippingAmount || 0;
    this.fbaShippingAmount = data.fbaShippingAmount || 0;
    this.fbmShippingAmount = data.fbmShippingAmount || 0;
    this.avgProfitPrev30Days = data.avgProfitPrev30Days || 0;
    this.avgAdvertisingCostPrev30Days = data.avgAdvertisingCostPrev30Days || 0;
    this.advertisingCost = data.advertisingCost || 0;
    this.acos = data.acos || 0;
    this.refundCount = data.refundCount || 0;
    this.refundCommissionAmount = data.refundCommissionAmount || 0;
    this.commissionAmount = data.commissionAmount || 0;
    this.refundPrincipalAmount = data.refundPrincipalAmount || 0;
    this.refundOtherAmounts = data.refundOtherAmounts || 0;
    this.refundTotalAmount = data.refundTotalAmount || 0;
    this.totalVatAmount = data.totalVatAmount || 0;
    this.otherFee = data.otherFee || 0;
  }
}

class DailySalesModel {
  constructor(data) {
    this.Currency = data?.Data?.Currency || '';
    this.item = data?.Data?.item?.map((itemData) => new Item(itemData)) || [];
    this.isYoyExist = data?.Data?.isYoyExist || false;
  }
}

export default DailySalesModel;
