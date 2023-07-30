class RefundModel {
    constructor(data) {
      this.marketplace = data.marketplace || '';
      this.sellerId = data.sellerId || '';
      this.skuList = Array.isArray(data.skuList) ? data.skuList : [];
      this.requestedDay = data.requestedDay || 0;
    }
  }
  
  export default RefundModel;
  