<template lang="html">
	<div id="container">

		<div id="appoint" >
			<!--<div id="logo" v-show="fail">
			</div>-->
			<div id='msg' v-show="fail"><span>{{msg}}</span></div>
			
			<ul class="show_detail_ul" v-show="isShow">
				<li class="show_detail_li">
					<span class="title_span">姓名：</span>
					<span class="content_span">{{name}}</span>
				</li>
				<li class="show_detail_li">
					<span class="title_span">出生年月：</span>
					<span class="content_span">{{birthday}}</span>
				</li>
				<li class="show_detail_li">
					<span class="title_span">性别：</span>
					<span class="content_span">{{sex}}</span>
				</li>
				<li class="show_detail_li">
					<span class="title_span">身份证号码：</span>
					<span class="content_span">{{cardNumber}}</span>
				</li>
				<li class="show_detail_li">
					<span class="title_span">联系电话：</span>
					<span class="content_span">{{telephone}}</span>
				</li>
				<li class="show_detail_li">
					<span class="title_span">个人行业：</span>
					<span class="content_span">{{personalIndustry}}</span>
				</li>
				<li class="show_detail_li">
					<span class="title_span">希望了解知识：</span>
					<span class="content_span">{{intention}}</span>
				</li>
				<li class="show_detail_li">
					<span class="title_span">居住区域：</span>
					<span class="content_span">{{livingArea}}</span>
				</li>
				</li>
				<li class="show_detail_li">
					<span class="title_span">存储项目：</span>
					<span class="content_span">{{cellStorageProject}}</span>
				</li>
				<li class="show_detail_li">
					<span class="title_span">同行人数：</span>
					<span class="content_span">{{totalNumber}}</span>
				</li>
				</li>
				<li class="show_detail_li">
					<span class="title_span">同行人关系：</span>
					<span class="content_span">{{relationShip}}</span>
				</li>
				</li>
				<li class="show_detail_li">
					<span class="title_span">有无未成年人同行：</span>
					<span class="content_span">{{minor}}</span>
				</li>
				</li>
				<li class="show_detail_li">
					<span class="title_span">参观日期：</span>
					<span class="content_span">{{visitDate}}</span>
				</li>
				</li>
				<li class="show_detail_li">
					<span class="title_span">预约日期：</span>
					<span class="content_span">{{appointmentDate}}</span>
				</li>
			</ul>
			<nav>
				<!--<a href="javascript:void(0);" class="common-btn" v-on:click="deleteAppoint" v-show="isShow">{{cancel}}</a>-->
				<a href="javascript:void(0);" class="common-btn" v-on:click="closeWindow">{{close}}</a>
			</nav>

		</div>
		<!--<div id='p_bg' v-show="fail"></div>-->
	</div>

</template>

<script>
	import axios from 'axios'
	import domainUtils from '../utils/domain'

	export default {
		data() {
			return {
				name: '',
				birthday: '',
				sex: '',
				cardNumber: '',
				telephone: '',
				personalIndustry: '',
				intention: '',
				livingArea: '',
				totalNumber: '',
				relationShip: "",
				minor: '',
				visitDate: '',
				appointmentDate: '',
				cellStorageProject: '',
//				cancel: '取消预约',
				close: '返回',
				msg: '',
				isShow: true,
				fail: false
			}
		},
		created() {
			this.getCellDetail()
		},

		methods: {
			getCellDetail() {
				var url = domainUtils.domain + "/getAppointment";
				this.$post(url, {
					'id': this.$route.params.id,
					//					'id': '6b3e5b90657e4c4aa93638a2c24c073f'
				}).then((data) => {
					
//					data.status = "fail"
					if(data.status == "success") {
						var appoint = data.data;
						this.name = appoint.name;
						this.birthday = appoint.birthday;
						this.sex = appoint.sex;
						this.cardNumber = appoint.cardNumber;
						this.telephone = appoint.telephone;
						this.personalIndustry = appoint.personalIndustry;
						this.intention = appoint.intention;
						this.livingArea = appoint.livingArea;
						this.totalNumber = appoint.totalNumber;
						this.relationShip = appoint.relationShip;
						this.minor = appoint.minor;
						this.visitDate = appoint.visitDate;
						this.appointmentDate = appoint.appointmentDate;
						this.cellStorageProject = appoint.cellStorageProject;
					} else {
						this.isShow = false;
						this.fail = true;
						this.msg = "预约记录未查到!"
					}

				})
			},

//			deleteAppoint: function(envent) {
//				var url = domainUtils.domain + "/deleteAppointment";
//				this.$post(url, {
//					id: this.$route.params.id
//					//					id: '1'
//				}).then((data) => {
//					var msg = "deleteFailed";
//
//					if(data.status == "success") {
//						msg = "deleteSuccess";
//					}
//					this.$router.push({
//						name: 'wyCellCenter',
//						params: {
//							msg: msg
//						}
//					})
//				})
//			},

			closeWindow: function(envent) {
				this.$router.push({
					name: 'wyCellCenter'
				})
			}
		},
		components: {
		}
	}
</script>

<style lang="scss">
	@import "../assets/scss/common.scss";
	@import "../assets/scss/wyArtDetail.scss";
</style>