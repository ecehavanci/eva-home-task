<template>
    <div>
        <div id="chartContainer"></div>
        <select name="select" id="select" v-model="dayChoice" @change="updateChartData">
            <option value="60">Last 60 days</option>
            <option value="30">Last 30 days</option>
            <option value="14">Last 14 days</option>
            <option value="7">Last 7 days</option>
        </select>
    </div>
    <table v-if="showTable" border="1" class="styled-table">
        <thead>
            <tr>
                <th>SKU</th>
                <th>Product Name</th>
                <th>{{ this.categoriesArr[this.selectedColumns[0]] }} Sales / Units</th>
                <th v-if="this.selectedColumns.length == 2">{{ this.categoriesArr[this.selectedColumns[1]] }} Sales / Units
                </th>
                <th>SKU Refund Rate</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="sku in tableData" :key="sku.sku">
                <td>{{ sku.sku }}</td> <!--is a ist -->
                <td>{{ sku.productName }}</td>
                <td>{{ sku.amount }}</td>
                <td v-if="this.selectedColumns.length == 2">{{ }}</td>
                <td>refundRateDataWillBeAdded %</td>
            </tr>
        </tbody>
    </table>
</template>

<script>
import axios from 'axios'
import DailySalesModel from './models/DailySalesModel.js';
import Highcharts from 'highcharts';
import SkuDailySalesModel from './models/SkuDailySalesModel.js';

export default {
    data() {
        return {
            dayChoice: 7,
            selectedColumns: [],
            categoriesArr: [],
            chartDataArray: [],
            fbaShippingAmount: [],
            showTable: false,
            tableData: [],
            pageNum: 1
        }
    },
    mounted() {
        this.setChartData();
    },
    methods: {
        async fetchDataForTable() {
            const userObj = this.$store.getters.getUserInfo;
            const accessToken = this.$store.getters.getBareerToken;
            // console.log(accessToken);
            const storeInfo = userObj.user.store;

            storeInfo.map((storeItem) => {
                let data = JSON.stringify({
                    "marketplace": storeItem.marketplaceName,
                    "sellerId": storeItem.storeId,
                    "salesDate": this.categoriesArr[this.selectedColumns[0]],
                    "salesDate2": this.selectedColumns.length == 2
                        ? "" : this.categoriesArr[this.selectedColumns[1]],
                    "pageSize": 30,
                    "pageNumber": this.pageNum,
                    "isDaysCompare": this.selectedColumns.length == 2 ? 0 : 1
                });

                console.log("my body", data)

                let config = {
                    method: 'post',
                    maxBodyLength: Infinity,
                    url: 'https://iapitest.eva.guru/data/daily-sales-sku-list/',
                    headers: {
                        'accept': 'application/json',
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    },
                    data: data
                };

                axios.request(config)
                    .then((response) => {
                        console.log(response.data);

                        const skuObj = new SkuDailySalesModel(response);
                        console.log(skuObj);

                        if (skuObj.data.item) {
                            skuObj.data.item.forEach((skuModel) => {

                                this.tableData.push({
                                    sku: skuModel.sku,
                                    productName: skuModel.productName,
                                    amount: skuModel.amount
                                });
                            });

                        }
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            });
        },
        async setChartData() {
            const userObj = this.$store.getters.getUserInfo;
            const storeInfo = userObj.user.store;
            const accessToken = this.$store.getters.getBareerToken;

            const categoriesArr = [];
            const chartDataArray = [];

            const profitData = {
                name: 'Profit',
                data: []
            };

            const fbaAmountData = {
                name: 'FBA Amount',
                data: []
            };

            const fbmAmountData = {
                name: 'FBM Amount',
                data: []
            };

            const fbaShippingAmount = {
                name: 'FBM Shipping Amount',
                data: []
            };

            const axiosRequests = storeInfo.map((storeItem) => {
                const requestBody = JSON.stringify({
                    "sellerId": storeItem.storeId,
                    "requestStatus": 0,
                    "day": this.dayChoice,
                    "excludeYoYData": true,
                    "marketplace": storeItem.marketplaceName
                });

                const config = {
                    method: 'post',
                    maxBodyLength: Infinity,
                    url: 'https://iapitest.eva.guru/data/daily-sales-overview',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`
                    },
                    data: requestBody
                };

                return axios.request(config).then((response) => {
                    if (response.data.ApiStatusCode === 200) {
                        const salesObj = new DailySalesModel(response.data);

                        if (salesObj.item.length !== 0) {
                            salesObj.item.forEach((itemInLine) => {

                                if (!categoriesArr.includes(itemInLine.date)) {
                                    categoriesArr.push(itemInLine.date);
                                    profitData.data.push(itemInLine.profit);
                                    fbaAmountData.data.push(itemInLine.fbaAmount);
                                    fbmAmountData.data.push(itemInLine.fbmAmount);
                                    fbaShippingAmount.data.push(itemInLine.fbaShippingAmount);
                                }
                                else {
                                    var index = categoriesArr.indexOf(itemInLine.date);
                                    profitData.data[index] = profitData.data[index] + itemInLine.profit;
                                    fbaAmountData.data[index] = fbaAmountData.data[index] + itemInLine.fbaAmount;
                                    fbmAmountData.data[index] = fbmAmountData.data[index] + itemInLine.fbmAmount;
                                    fbaShippingAmount.data[index] = fbaShippingAmount.data[index] + itemInLine.fbmAmount;
                                }
                            });
                        }
                    } else {
                        console.log("error fetching data");
                    }
                }).catch((error) => {
                    console.log(error);
                });
            });

            await Promise.all(axiosRequests);

            chartDataArray.push(profitData);
            chartDataArray.push(fbaAmountData);
            chartDataArray.push(fbmAmountData);
            this.categoriesArr = categoriesArr;
            this.chartDataArray = chartDataArray;
            this.fbaShippingAmount = fbaShippingAmount
            // chartDataArray.push(fbaShippingAmount);

            // console.log("chartDataArray", chartDataArray);
            // console.log("categoriesArr", categoriesArr);

            this.drawChart(categoriesArr, chartDataArray, fbaShippingAmount);

        },
        drawChart(categoriesArr, chartDataArray, externalData) {
            var mychart = Highcharts.chart('chartContainer', {
                chart: {
                    type: 'column'
                },
                title: {
                    text: 'Daily Sales',
                    align: 'left'
                },
                xAxis: {
                    categories: categoriesArr //our dates
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Amount ($)'
                    },
                    stackLabels: {
                        enabled: true
                    }
                },
                legend: {
                    verticalAlign: 'top',
                    itemStyle: {
                        fontSize: '16px'
                    }
                },
                plotOptions: {
                    column: {
                        stacking: 'normal',
                        dataLabels: {
                            enabled: true
                        }, events: {
                            click: (event) => {
                                const clickedColumnIndex = event.point.index;
                                const chartInstance = mychart;
                                const isSelected = this.selectedColumns.includes(clickedColumnIndex); //check selected before

                                if (!isSelected) {
                                    if (this.selectedColumns.length >= 2) {
                                        console.log("errrrror", this.selectedColumns)
                                    }
                                    else {
                                        this.selectedColumns.push(clickedColumnIndex);
                                        event.point.update({
                                            color: 'rgba(0, 128, 255, 0.7)',
                                        });
                                    }
                                }
                                else {
                                    const ind = this.selectedColumns.indexOf(clickedColumnIndex)
                                    if (ind > -1) {
                                        this.selectedColumns.splice(ind, 1)
                                    }
                                    event.point.update({
                                        color: null,
                                    });
                                }
                                console.log(this.selectedColumns)

                                this.showTable = this.selectedColumns.length > 0;
                                this.fetchDataForTable();
                                chartInstance.redraw()

                            },
                            stacking: 'normal',
                            dataLabels: {
                                enabled: true
                            },
                        }
                    }
                },
                tooltip: {
                    shared: true,
                    formatter: function () {
                        const category = this.x;
                        let tooltip = '<b>' + category + '</b><br/>';

                        const dataPoint = chartDataArray.find(data => data.name === this.series.name);
                        if (dataPoint) {
                            const index = this.point.index;
                            const fbaSales = chartDataArray[1].data[index];
                            const fbmSales = chartDataArray[2].data[index];
                            const shipping = externalData.data[index];
                            const totalSales = fbaSales + fbmSales;
                            const profit = dataPoint.name === 'Profit' ? totalSales : totalSales - fbaSales - fbmSales;

                            tooltip += 'Total Sales: $' + totalSales + '<br/>';
                            tooltip += 'Shipping: $' + shipping + '<br/>';
                            tooltip += 'Profit: $' + profit + '<br/>';
                            tooltip += 'FBA Sales: $' + fbaSales + '<br/>';
                            tooltip += 'FBM Sales: $' + fbmSales + '<br/>';
                        }

                        return tooltip;
                    }

                },

                series: chartDataArray.map((seriesData) => ({
                    ...seriesData,
                    visible: true,
                }))
            });
        },
        updateChartData() {
            this.showTable = false;
            this.tableData = [];
            this.selectedColumns = []
            this.setChartData();
        },
    }
};
</script>
<style>
.styled-table {
    border-collapse: collapse;
    width: 100%;
}

.styled-table td {
    padding: 8px;
    text-align: left;
    border: 1px solid #ddd;
}

.styled-table th {
    background-color: #f2f2f2;
}
</style>