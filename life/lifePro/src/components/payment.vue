<template lang="html">
	<div ref='container'>

		<div id='msg' v-show="beforePay"><span>{{msg}}</span></div>

		<div v-show="beforePay">
			<div class="pay-content">
				<span class="pay-logo-font">体验券活动价</span>
				<span class="money-amount">{{payMoney}}</span>
				<span class="money">元</span>
			</div>
			<div class="pay-method">
				<span>支付方式</span><br />
				<img src="../assets/payment.png" class="wx-logo" />
			</div>
			<div>
				<a href="javascript:void(0);" class="common-btn" v-on:click="genePreOrder">支付</a>
				<a href="javascript:void(0);" class="common-btn" v-on:click="close">取消</a>
			</div>
		</div>

		<div v-show="afterPay" class="pay_success">
			<img src="../assets/img/ok.png" class="pay_suc_img" />
			<span class="pay_suc_span">缴费完成，预约成功！</span>
			<a href="javascript:void(0);" class="yuyue_detail" v-on:click="viewDetail">查看预约详情</a>
		</div>

	</div>
</template>

<script>
	import domainUtils from '../utils/domain'
	export default {
		data() {
			return {
				retComponent: '',
				detailComponent: '',
				msg: '',
				payMoney: 29.9,
				afterPay: false,
				beforePay: true,
				//				afterPay: true,
				//				beforePay: false,
				id: ''
			}
		},
		methods: {
			close: function(envent) {
				this.$router.push({
					name: this.retComponent
				})
			},
			//=================
			//todo
			genePreOrder: function() {

				var url = domainUtils.domain + '/preOrder';
				let wxOpenId = window.localStorage.getItem('wxOpenId');
				const data = {
					wxOpenId: wxOpenId,
					appointId: this.id,
					fee: this.payMoney
				}
				this.$post(url, data).then((data) => {

					if(data.status == "success") {

						var ret = data.data;
						//页面内调起微信支付
						function onBridgeReady() {
							WeixinJSBridge.invoke(
								'getBrandWCPayRequest', {
									"appId": ret.appId, //公众号名称，由商户传入     
									"timeStamp": ret.timeStamp, //时间戳，自1970年以来的秒数     
									"nonceStr": ret.nonceStr, //随机串     
									"package": ret.package,
									"signType": ret.signType, //微信签名方式：     
									"paySign": ret.paySign //微信签名 
								},
								function(res) {
									if(res.err_msg == "get_brand_wcpay_request:ok") {
										window.localStorage.setItem("refresh", "1");
										location.reload();
//										location.replace(location.href);
									} else if(res.err_msg == "get_brand_wcpay_request:fail" || res.err_msg == "get_brand_wcpay_request:cancel") {
										//										alert(JSON.stringify(res));
										this.msg = "调起支付失败"
									}
								}
							);
						};
						if(typeof WeixinJSBridge == "undefined") {
							if(document.addEventListener) {
								document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
							} else if(document.attachEvent) {
								document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
								document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
							}
						} else {
							onBridgeReady();
						}
					} else {
						this.msg = "统一下单失败"
					}
				});
			}, //=========
			viewDetail: function() {
				window.localStorage.removeItem("refresh");
				alert("view!")
				this.$router.push({
					name: this.detailComponent,
					params: {
						id: this.id
					}
				});
			}
		},
		created() {
			
			var payInfo = JSON.parse(window.localStorage.getItem("payInfo"))
			this.id = payInfo["id"];
			var retName = payInfo["retName"];

			if(retName == 0) {
				this.retComponent = "wyArtCenter";
				this.detailComponent = "wyArtDetail";
			} else {
				this.retComponent = "wyCellCenter";
				this.detailComponent = "wyCellDetail";
			}
			
			
			var refresh = window.localStorage.getItem("refresh");
			if(refresh){
				this.$router.push({
					name:"afterPay"
				})
			}
			
		}
	}
</script>

<style lang="scss">
	@import "../assets/scss/reset.css";
	@import "../assets/scss/payment.scss";
</style>