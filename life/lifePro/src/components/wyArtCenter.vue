<template lang="html">
	<div id='container' ref='tfContainer'>

		<div id='tittle'>
			<span>艺术馆参观预约</span>
		</div>
		<div id='msg_div'>
			<span>{{msg}}</span>

			<span id='addBtn' v-show="isShow2">
				<a href="javascript:void(0);" @click="addArt($event);"  >{{add}}</a>
			</span>
		</div>
		<div id="appointContainer">
			<div v-for="appointment in appointments" style="width:100%;">
				<router-link :to="{ name: 'wyArtDetail', params: {id : appointment.id} }">
					<div>
						<ul class="show_ul">
							<li class="show_li">
								<span class="show_span">同行人数：{{appointment.totalNumber}}</span>
							</li>
							<li class="show_li">
								<span class="show_span">同行人关系：{{appointment.relationShip}}</span>
							</li>
							<li class="show_li">
								<span class="show_span">有无未成年人同行：{{appointment.minor}}</span>
							</li>
							<li class="show_li">
								<span class="show_span">参观日期：{{appointment.visitDate}}</span>
							</li>
							<li class="show_li">
								<!--<span class="show_span">预约日期：{{appointment.appointmentDate}}</span>-->
								<span class="show_span" id='viewBtn'><a href="javascript:void(0);" >{{view}}</a></span>
							</li>
						</ul>
					</div>
				</router-link>
			</div>
		</div>
	</div>
</template>

<script>
	import wyArtAdd from './wyArtAdd.vue'
	import axios from 'axios'
	import dateUtils from '../utils/dateUtils'
	import domainUtils from '../utils/domain'

	export default {
		data() {
			return {
				wxCode: '',
				wxOpenId: '',
				mobile: '',
				msg: "",
				add: "添加预约",
				view: "查看详情",
				isShow2: true,
				appointments: []
			}
		},
		methods: {
			isLocalStorage: function(storage) {
				if(!!storage) {
					try {
						storage.setItem("key", "value");
						storage.removeItem("key");
						return true;
					} catch(e) {
						return false;
					}
				} else {
					return false;
				}
			},
//			register: function(event) {
//				this.$router.push({
//					name: 'wyRegister',
//					params: {
//						wxOpenId: window.localStorage.getItem("wxOpenId"),
//						retComponent: '0'
//					}
//				})
//			},
			login() {
				var data = this.$route.query.data;

				if(!!data) {
					if(data == "getOpenidError" || data == "weixinauthError") {
						this.msg = "微信授权出错"
						this.isShow2 = false;

					} else {
						window.localStorage.setItem("wxOpenId", data);

						this.$store.commit('ADD_USER_INFO', {
							"wxOpenId": data
						})

					}
				} else {
					var message = this.$route.params.msg;

					if(message == "infoAddSuccess") {
						this.msg = "个人信息完善成功！"
					} else if(message == "deleteSuccess") {
						this.msg = "取消预约成功！";
					} else if(message == "deleteFailed") {
						this.msg = "取消预约失败！";
					}
				}

//			    window.localStorage.setItem('wxOpenId','o1EZf1qSMtnp3ahMOlI2L7_Wt9FI');
				var wxOpenId = window.localStorage.getItem('wxOpenId');

				if(!!wxOpenId) {
					var url = domainUtils.domain + "/loadArtMuseumAppointmentList";

					this.$post(url, {
						wxOpenId: wxOpenId
					}).then((data) => {
						//						console.log(data)
						if(data.status == "success") {
							var appoints = data.data;
							if(!!appoints) {
								appoints.forEach((value, index) => {
									for(var key in value) {
										//										if(key == 'appointmentDate') {
										//											value.appointmentDate = dateUtils.getDate(value.appointmentDate);
										//										}
										if(key == 'visitDate') {
											value.visitDate = dateUtils.getDate(value.visitDate)
										}
									}
									this.appointments.push(value);
								});
							} else {
								this.msg = "没有预约记录";
							}
						} else {
							this.msg = "500 服务器错误";
							this.isShow2 = false;
						}
					})
				} else {
					var REDIRECT_URI = domainUtils.domain + "/redirectToArtMuseumCenter";
					var APPID = "";
					var SCOPE = 'snsapi_base';
					var STATE = "123";
					var url = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + APPID + "&redirect_uri=" + REDIRECT_URI + "&response_type=code&scope=" + SCOPE + "&state=" + STATE + "#wechat_redirect";
					window.location.href = url;
				}
			},
			addArt: function(envent) {
				this.$router.push({
					name: 'wyArtAdd',
				})
			}
		},
		created() {
			this.login()
		},
		components: {
			wyArtAdd
		}
	}
</script>

<style lang="scss">
	@import "../assets/scss/common.scss";
	@import "../assets/scss/reset.css";
	@import "../assets/scss/wyCenter.scss";
</style>