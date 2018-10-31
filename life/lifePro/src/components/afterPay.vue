<template>
	<div>
		<div id="pay_success">
			<img src="../assets/img/ok.png" id="pay_suc_img" />
			<span id="pay_suc_span">缴费完成，预约成功！</span>
			<a href="javascript:void(0);" id="yuyue_detail" v-on:click="viewDetail">查看预约详情</a>
		</div>
	</div>
</template>

<script>
	export default {
		data(){
			return {
				'detailComponent':''
			}
		},
		methods:{
			viewDetail: function() {
				window.localStorage.removeItem("refresh");
				this.$router.push({
					name: this.detailComponent,
					params: {
						id: this.id
					}
				});
			}
		},
		created(){
			
			var payInfo = JSON.parse(window.localStorage.getItem("payInfo"))
			this.id = payInfo["id"];
			var retName = payInfo["retName"];
			
			window.localStorage.removeItem("payInfo");

			if(retName == 0) {
				this.detailComponent = "wyArtDetail";
			} else {
				this.detailComponent = "wyCellDetail";
			}
		}
	}
</script>

<style lang="scss">
	@import "../assets/scss/afterPay.scss";

</style>