<template lang="html">
	<div class="container" ref='wyContainer'>

		<div id='msg' v-show="true">{{msg}}</div>
		<div id="logo">

		</div>
		<div id='content'>
			<ul id="ui_container">
				<li class="line_li" v-show="isShow2">
					<div class="title_div_li">
						手&nbsp;&nbsp;&nbsp;&nbsp;机：
					</div>
					<div class="li_content_div_right">
						<input class="input-box" type="text" id="mobile" v-model="mobile" @focus="removeErrorClass">
					</div>
				</li>
				<li class="line_li" v-show="isShow2">
					<div class="title_div_li">
						验证码：
					</div>
					<div class="li_content_div_right">
						<input class="input-box" type="text" id="txtVerfiyCode" v-model="verifyCode" @focus="removeErrorClass">
						<span id='btn' class="add-btn click-send" @click="getVerifyCode" v-show="isShow">点击发送</span>
						<!--<button id="btn" class="add-btn" @click="getVerifyCode" v-show="isShow">获取验证码</button>-->
					</div>
				</li>
				<li class="line_li" v-show="isShow1">
					<div class="title_div_li">
						姓名：
					</div>
					<div class="li_content_div_right">
						<input class="input-box" type="text" v-model="name" v-verify='name' />
						<label v-verified="verifyError.name"></label>
					</div>

				</li>
				<li class="line_li" v-show="isShow1">
					<div class="title_div_li">
						性别：
					</div>
					<div class="li_content_div_right">
						<input type="radio" v-model="sex" value="男" class="sex_choice" /> <span class="sex">男</span>
						<input type="radio" v-model="sex" value="女" class="sex_choice" /><span class="sex">女</span>
						<label v-verified="verifyError.sex"></label>
					</div>

				</li>
				<li class="line_li" v-show="isShow1">
					<div class="title_div_li">
						出生日期：
					</div>
					<div class="li_content_div_right">
						<input class="date_plugin" type="date" v-model="birthday" v-verify='birthday' />
						<label v-verified="verifyError.birthday"></label>
					</div>

				</li>
				<li class="line_li" v-show="isShow1">
					<div class="title_div_li">
						身份证号：
					</div>
					<div class="li_content_div_right">
						<input class="input-box" type="text" v-model="cardNumber" v-verify='cardNumber' />
						<label v-verified="verifyError.cardNumber"></label>
					</div>
				</li>

				<li class="line_li" v-show="isShow2">
					<button class="add-btn register-btn" @click="register">注册</button>
				</li>

				<li class="line_li" v-show='isShow1'>
					<div style="text-align:center;padding-top:20px;">
						<button class="add-btn register-btn" @click="submitInfo">提交</button>
					</div>
				</li>

			</ul>
		</div>
		<div id='p_bg'></div>
	</div>
</template>

<script>
	import axios from 'axios'
	import Vue from "vue";
	import verify from "vue-verify-plugin";
	import domainUtils from '../utils/domain'

	Vue.use(verify, {
		blur: true
	});

	export default {
		data() {
			return {
				isShow1: false,
				isShow: true,
				isShow2: true,
				msg: "",
				name: '',
				sex: '',
				birthday: '',
				cardNumber: '',
				mobile: '',
				verifyCode: '',
				retComponent: ''
			}
		},
		verify: {
			name: [ //自定义的插件
				"required",
				{
					test: function(val) {
						if(val.length < 2) {
							return false;
						}
						return true;
					},
					message: "姓名不得小于2位"
				}
			],
			//			mobile: "required",
			cardNumber: [
				"required", {
					minLength: 18,
					maxLength: 20,
					message: "身份证不符合规定长度"
				}
			],
			birthday: "required",
			sex: "required"

		},

		methods: {
			getVerifyCode: function() {
				var url = domainUtils.domain + "/getVerifyCode"
				if(this._check1()) {
					this.$post(url, {
						mobile: this.mobile
					}).then((data) => {
						if(data.status == "success") {
							this.msg = '';
							this.isShow = false;
							//							this.isShow1 = true;
						} else {
							if(data.remark == 'hasRegisted') {
								alert('手机号已注册')
								//								this.msg = '手机号已注册'
							} else if(data.remark == 'mobileLimit') {
								alert('发送太频繁')
								//								this.msg = '发送太频繁'
							} else if(data.remark == 'sendError') {
								alert("短信平台服务器故障")
								//								this.msg = '短信平台服务器故障'
							} else if(data.remark == 'error') {
								alert("短信平台未开通") //this.msg = "authcode sms no authorization"
								//								this.msg = "短信平台未开通"
							} else if(data.remark == 'mobileError') {
								alert("手机号不正确")
								//								this.msg = "手机号不正确"
							} else if(data.remark == "insertError") {
								alert("500 服务器内部错误")
								//								this.msg = "500 服务器内部错误"
							}
						}
					})
				} else {
					alert("手机号不正确，请重新填写")
				}
			},
			register: function() {
				var wxOpenId = window.localStorage.getItem('wxOpenId')

				var url = domainUtils.domain + "/register";
				if(this._check2()) {
					this.$post(url, {
						telephone: this.mobile,
						verifyCode: this.verifyCode,
						wxOpenId: wxOpenId
					}).then((data) => {
						if(data.status == "success") {
							alert("注册成功，请完善个人信息")
							//							this.msg = "注册成功，请完善个人信息"
							this.isShow2 = false;
							this.isShow1 = true;
							//								msg = "registerSuccess";
						} else {
							if(data.remark == "codeError") {
								alert("验证码不正确")
								//								this.msg = "验证码不正确"
							} else if(data.remark == "500") {
								alert("500 服务器内部错误")
								//								this.msg = "500 服务器内部错误"
							} else if(data.remark == 'overtime') {
								alert("验证码超时")
								//								this.msg = "验证码超时"
							} else if(data.remark == "codeNotSend") {
								alert("请先点击发送获取验证码")
							}
						}
					})
				} else {
					alert('验证码不能为空且长度为4')
				}

			},
			submitInfo: function() {
				var wxOpenId = window.localStorage.getItem('wxOpenId')
				var url = domainUtils.domain + "/addCustomerInfo";
				if(this.$verify.check()) {
					this.$post(url, {
						name: this.name,
						birthday: this.birthday,
						cardNumber: this.cardNumber,
						sex: this.sex,
						wxOpenId: wxOpenId
					}).then((data) => {
						if(data.status == "success") {
							this.$router.push({
								name: this.retComponent,
								params: {
									msg: "infoAddSuccess"
								}
							})
						} else {
							if(data.remark == 'paramsNotComplete') {
								this.msg = "信息填写不完整"
							} else if(data.remark == '500') {
								this.msg = "500 服务器内部错误"
							}

							//							this.$router.push({
							//								name: this.retComponent,
							//								params: {
							//									msg: this.msg
							//								}
							//							})
						}
					})
				} else {

				}

			},
			_check1: function() {
				let container = this.$refs.wyContainer
				let mobile = container.querySelector('#mobile')
				if(this.mobile === '' || this.mobile.length !== 11) {
					mobile.classList.add('error-border')
				} else {
					return true
				}
				return false
			},
			_check2: function() {
				let container = this.$refs.wyContainer
				let txtVerfiyCode = container.querySelector('#txtVerfiyCode')
				if(this.verifyCode === '' || this.verifyCode.length !== 4) {
					txtVerfiyCode.classList.add('error-border')
				} else {
					return true
				}
				return false
			},
			removeErrorClass: function(e) {
				e.target.classList.remove('error-border')
			},
			getRetName() {
				var wxOpenId = this.$route.query.wxOpenId;
				window.localStorage.setItem("wxOpenId", wxOpenId);

				this.$store.commit('ADD_USER_INFO', {
					"wxOpenId": wxOpenId
				})

				var retName = this.$route.query.retName;
				if(retName == 0) {
					this.retComponent = "wyArtCenter";

				}
				if(retName == 1) {
					this.retComponent = "wyCellCenter";
				}
			}
		},
		computed: { //这个是关键，有长度的地方必须要有
			verifyError() {
				return this.$verify.$errors;
			}
		},
		created() {
			this.getRetName()
		},
		components: {}
	}
</script>

<style lang="scss">
	@import "../assets/scss/common.scss";
	@import "../assets/scss/reset.css";
	@import "../assets/scss/register.scss";
</style>