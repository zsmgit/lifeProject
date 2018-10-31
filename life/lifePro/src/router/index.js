import Vue from 'vue'
import Router from 'vue-router'

const wyArtCenter = () =>
	import('../components/wyArtCenter.vue')
const wyArtDetail = () =>
	import('../components/wyArtDetail.vue')
const wyArtAdd = () =>
	import('../components/wyArtAdd.vue')
const wyCellCenter = () =>
	import('../components/wyCellCenter.vue')
const wyCellDetail = () =>
	import('../components/wyCellDetail.vue')
const wyCellAdd = () =>
	import('../components/wyCellAdd.vue')
const wyRegister = () =>
	import('../components/wyRegister.vue') 
const payment = () =>
	import('../components/payment.vue');

const afterPay = () =>
	import('../components/afterPay.vue');

Vue.use(Router)

export default new Router({
	mode: 'history',
	routes: [{
		path: '/wyArtCenter',
		name: 'wyArtCenter',
		component: wyArtCenter,
		meta: {
			reqireLogin: false
		}
	}, {
		path: '/wyArtDetail',
		name: 'wyArtDetail',
		component: wyArtDetail,
		meta: {
			reqireLogin: true
		}
	}, {
		path: '/wyArtAdd',
		name: 'wyArtAdd',
		component: wyArtAdd,
		meta: {
			reqireLogin: true
		}
	}, {
		path: '/wyCellCenter',
		name: 'wyCellCenter',
		component: wyCellCenter,
		meta: {
			reqireLogin: false
		}
	}, {
		path: '/wyCellDetail',
		name: 'wyCellDetail',
		component: wyCellDetail,
		meta: {
			reqireLogin: true
		}
	}, {
		path: '/wyCellAdd',
		name: 'wyCellAdd',
		component: wyCellAdd,
		meta: {
			reqireLogin: true
		}
	}, {
		path: '/wyRegister',
		name: 'wyRegister',
		component: wyRegister,
		meta: {
			reqireLogin: false
		}
	}, {
		path: '/payment',
		name: 'payment',
		component: payment,
		meta: {
			reqireLogin: true
		}
	}, {
		path: '/afterPay',
		name: 'afterPay',
		component: afterPay,
		meta: {
			reqireLogin: true
		}
	}]
})