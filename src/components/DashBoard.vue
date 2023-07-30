<template>
    <div>
        <p>dsfdfds</p>
        <div id="chartContainer"></div>
        <select name="select" id="select" v-model="dayChoice" @change="updateChartData">
            <option value="60">Last 60 days</option>
            <option value="30">Last 30 days</option>
            <option value="14">Last 14 days</option>
            <option value="7">Last 7 days</option>
        </select>
    </div>
</template>

<script>
import axios from 'axios'
import DailySalesModel from './models/DailySalesModel.js';
import Highcharts from 'highcharts';
// import UserModel from './models/UserModel.js';
// import HighchartsLine from 'highcharts/modules/series-line';


export default {
    data() {
        return {
            dailySalesArray: [],
            dayChoice: 7,
            chartData: [5, 10, 15, 20, 25],
        }
    },
    mounted() {
        this.setChartData();
        // this.drawChart();
    },
    methods: {
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
            // chartDataArray.push(fbaShippingAmount);

            // console.log("chartDataArray", chartDataArray);
            // console.log("categoriesArr", categoriesArr);

            this.drawChart(categoriesArr, chartDataArray, fbaShippingAmount);

        },
        drawChart(categoriesArr, chartDataArray, externalData) {
            Highcharts.chart('chartContainer', {
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
                        },
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
                            console.log(shipping)

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
                    visible: true // Make sure all series are visible
                }))
            });
        },
        updateChartData() {
            this.setChartData();
        },
    }
};
</script>