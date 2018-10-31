<template>
	<div id="app">
		<router-view></router-view>
	</div>
</template>

<script>
	export default {
		name: 'app',
		created() {
			//在页面加载时读取localStorage里的状态信息
			localStorage.getItem("userinfo") && this.$store.replaceState(JSON.parse(localStorage.getItem("userinfo")));

			//在页面刷新时将vuex里的信息保存到localStorage里
			window.addEventListener("beforeunload", () => {
				localStorage.setItem("userinfo", JSON.stringify(this.$store.state))
			})
		}
	}
</script>

<style>
	#app {
		font-family: 'Avenir', Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		text-align: center;
		color: #2c3e50;
	}
</style>