<template>
	<view class="top-box">
		<view class="content">
			<image src="../../static/hand-in-hand.svg" mode=""></image>
			<text class="title">{{title}}</text>
		</view>
		<view class="login-button">
			<button>Login</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: 'Seren'
			}
		},
		onLoad() {

		},
		methods: {

		}
	}
</script>

<style lang="scss">
	.top-box {
		background-color: #F43F5E;
		
		.login-button{
			button{
				background-color: #FACC15;
				
			}
		}
		
	}
</style>
