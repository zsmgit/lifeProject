<template lang="html">
	<div class="container">
		<div id='msg'><span>{{msg}}</span></div>
		<div id="form_div">
			<form id="form">
				<ul id="ui_container" v-show='formShow'>
					<li class="line_li">
						<div class="title_div_li">
							个人行业：
						</div>
						<div class="li_content_div_right">
							<input class='oneLineInput' id="personalIndustry" v-model="personalIndustry" type="text" required />
						</div>
					</li>

					<li class="line_li">
						<div class="title_div_li">
							希望了解知识：
						</div>
						<div class="li_content_div_right">
							<span>细胞储存</span>
							<input class='two_input_one_line' v-model="intention" id='kn1' value='细胞储存' type="checkbox" required>
							<span>基因解密</span>
							<input class='two_input_one_line' v-model="intention" id='kn2' value='基因解密' type="checkbox" required>

						</div>
					</li>
					<li class="line_li">
						<div class="title_div_li">
						</div>
						<div class="li_content_div_right">
							<span>生命健康</span>
							<input class='two_input_one_line' v-model="intention" id='kn3' value='生命健康' type="checkbox" required>
							<span>慢病管理</span>
							<input class='two_input_one_line' v-model="intention" id='kn4' value='慢病管理' type="checkbox" required>

						</div>

					</li>
					<li class="line_li">
						<div class="title_div_li">
						</div>
						<div class="li_content_div_right">
							<span>再生医学</span>
							<input class='two_input_one_line' v-model="intention" id='kn5' value='再生医学' type="checkbox" required>
							<span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;其他</span>
							<input class='two_input_one_line' v-model="intention" id='kn6' value='其他' type="checkbox" required>

						</div>

					</li>
					<li class="line_li">
						<div class="title_div_li">
							居住区域：
						</div>
						<div class="li_content_div_right">
							<select class='oneLineInput' v-on:change="firstSelect($event)" style="width: 1.1rem;">
								<option v-for="option1 in areaData" v-bind:value="option1.text">{{option1.text}}</option>
							</select>
							<select class='oneLineInput' v-on:change="secondSelect($event)" v-show="isShow" style="width: 1.1rem;">
								<option v-for="option2 in ChengDuArea" v-bind:value="option2.text">{{option2.text}}</option>
							</select>
						</div>
					</li>

					<li class="line_li">
						<div class="title_div_li">
							同行人数：
						</div>
						<div class="li_content_div_right">
							<input class='check_input' id="totalNumber" v-model="totalNumber" type="radio" value="1" required />1
							<input class='check_input' id="totalNumber" v-model="totalNumber" type="radio" value="2" required />2
							<input class='check_input' id="totalNumber" v-model="totalNumber" type="radio" value="3" required />3
						</div>

					</li>
					<li class="line_li">
						<div class="title_div_li">
							同行人关系：
						</div>
						<div class="li_content_div_right">
							<input class='check_input' v-model="relationShip" type="checkbox" value="伴侣" required />伴侣
							<input class='check_input' v-model="relationShip" type="checkbox" value="朋友" required />朋友
						</div>

					</li>
					<li class="line_li">
						<div class="title_div_li">
						</div>
						<div class="li_content_div_right">
							<input class='check_input' v-model="relationShip" type="checkbox" value="父母" required />父母
							<input class='check_input' v-model="relationShip" type="checkbox" value="子女" required />子女
						</div>

					</li>
					<li class="line_li">
						<div class="title_div_li">
							未成年人：
						</div>
						<div class="li_content_div_right">
							<input class='check_input' v-model="minor" type="radio" value="有" required />有
							<input class='check_input' v-model="minor" type="radio" value="无" required />无
						</div>
					</li>

					<li class="line_li">
						<div class="title_div_li">
							参观日期：
						</div>
						<div class="li_content_div_right">
							<input class="oneLineInput" id='visitDate' type="date" v-model="visitDate" required />
						</div>
					</li>

				</ul>

				<a href="javascript:void(0);" class="common-btn" v-on:click="submitForm($event)" v-show='submitShow'>提交</a>
				<!--<a href="javascript:void(0);" v-on:click="toBuy" v-show='payBtn'>支付</a>-->
				<a href="javascript:void(0);" class="common-btn" v-on:click="closeAppointment">{{close}}</a>
			</form>
		</div>
	</div>
	</div>

</template>
<script>
	import laydate from 'laydate'
	import axios from 'axios'
	import domainUtils from '../utils/domain'

	export default {
		data() {
			return {
				msg: '',
				A: '四川省成都区',
				B: '新都区',
				isShow: true,
				payBtn: false,
				submitShow: true,
				formShow: true,
				personalIndustry: '',
				totalNumber: '',
				minor: '',
				visitDate: "",
				relationShip: [],
				intention: [],
				close: '取消',
				areaData: [{
					"text": "四川省成都区",

				}, {
					"text": "四川省非成都区"
				}, {
					"text": "其他"
				}],
				ChengDuArea: [{
					"text": "新都区"
				}, {
					"text": "青羊区 "
				}, {
					"text": "双流区"
				}, {
					"text": "金牛区"
				}, {
					"text": "青白江区"
				}, {
					"text": "武侯区"
				}, {
					"text": "成华区 "
				}, {
					"text": "锦江区"
				}, {
					"text": "温江区"
				}, {
					"text": "都江堰"
				}, {
					"text": "彭州"
				}, {
					"text": "崇州"
				}, {
					"text": "邛崃"
				}]

			}
		},
		methods: {
			firstSelect(event) {
				this.A = event.target.value;

				if(this.A == "其他" || this.A == "四川省非成都区") {

					this.isShow = false;
				} else {
					this.isShow = true;
				}
			},
			secondSelect(event) {
				this.B = event.target.value;
			},
			closeAppointment: function(envent) {
				this.$router.push({
					name: 'wyArtCenter'
				})
			},
			submitForm(event) {
				event.preventDefault();
				let wxOpenId = window.localStorage.getItem('wxOpenId');
				let formData = new FormData();
				var livingArea = this.A + "," + this.B;

				if(!this.personalIndustry || !this.totalNumber || !this.minor || !this.visitDate || this.intention.length == 0 || this.relationShip.length == 0) {
					//					this.msg = '请将信息填写完整!'
					alert("请将信息填写完整!")
				} else {
					this.msg = ''
					formData.append("personalIndustry", this.personalIndustry);
					formData.append("intention", this.intention);
					formData.append("livingArea", livingArea);
					formData.append("totalNumber", this.totalNumber);
					formData.append("relationShip", this.relationShip);
					formData.append("minor", this.minor);
					formData.append('visitDate', this.visitDate);
					formData.append('wxOpenId', wxOpenId);
					let config = {
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
						}
					}
					var url = domainUtils.domain + "/addArtMuseumAppointment"
					this.$post(url, formData, config).then((data) => {
						if(data.status == "success") {
							var id = data.data;
							var payInfo = {
								"id": id,
								"retName": '0'
							}

							window.localStorage.setItem("payInfo", JSON.stringify(payInfo));
							window.localStorage.removeItem("refresh");
							this.$router.push({
								name: "payment"
							});

						} else {
							var left = data.data;
							if(!!left) {
								this.msg = "您预约日期当天仅剩余" + left + "个预约";
							} else {
								if(!!data.remark) {
									this.msg = data.remark
								}
							}
						}

					})
				}
			}
		},
		components: {}
	}
</script>

<style lang="scss">
	@import "../assets/scss/common.scss";
	@import "../assets/scss/wyCellAdd.scss";
	@import "../assets/scss/reset.css";
</style>