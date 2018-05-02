'use strict'

var rp = require('request-promise')
var events = require('events')

const event = events.EventEmitter()

const peer_id = '2000000' + '' //3 символа
let ts, key, server;
const access_token = ''
const mode = 8 + 32

class LongPoll{
	constructor(){
		this.updateServer()
	}
	updateServer(){
		let ts, key, server

		const getLongPollServer = {
			method: 'GET',
			json: true,
			uri: encodeURI(`https://api.vk.com/method/messages.getLongPollServer?lp_version=3&access_token=${access_token}&v=5.74`)
		}
		rp(getLongPollServer)
			.then((response) => {
				this.ts = response.response.ts
				this.key = response.response.key
				this.server = response.response.server
				console.log(response)
				this.update()
			}).catch((err) => {console.log('Какая-то хуйня в getLongPollServer')})
	}

	async update(){
		try{
			const connect = {
				method: 'GET',
				json: true,
				uri: encodeURI(`https://${this.server}?act=a_check&ts=${this.ts}&key=${this.key}&wait=25&mode=${mode}&version=3&access_token=${access_token}&v=5.74`)
			}
				await rp(connect)
					.then((response) => {
						this.response = response 
						this.ts = response.ts
						if(response.updates[1] !== undefined){
						this.peer_id = response.updates[1][3]
						}
						if(response.updates[1] !== undefined){
						this.message = response.updates[1][5]
						}
						switch(this.peer_id){
							case 2000000192: {
								switch(this.message){
									case '!вафел': {
										this.messageSend('@id316097527 (Вафел) норм сос')
										break
									}	
									case '!рваль': {
										this.messageSend('@mizeriking69 (Рваль) норм шлюха чет')
										break
									}
									case '!шлюхченка': {
										this.messageSend('@id420912168 (Шлюхченка) норм сосы')
										break
									}
								}
							}
						}
					})
					.catch((error) => {console.log(error + '\n')})
					setInterval(() => {

					}, 3000)

		} catch(error){console.log(error + '\n')}
		this.update()
	}
	async messageSend(message){
		const messageSend = {
			method: 'POST',
			uri: encodeURI(`https://api.vk.com/method/messages.send?message=${message}&peer_id=${peer_id}&access_token=${access_token}&v=5.74`),
			json: true
		}

		try{
			rp(messageSend)
					  .then((response) => {
						  console.log(response)
					  }).catch((error) => {console.log('ОШИБКА:                 ' + error)})
		} catch(error){}
	}
}
const start = new LongPoll()