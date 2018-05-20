"use strict";
/*
node version required 8+
npm install express redis
run :
	node taska.js
	
test:
	curl http://127.0.0.1:3001/ladbrokes?band_name=pix&secret_key=pCNN85KHlpoe5K6ZlysWZBEgLJRcftOd
*/
const 
	child_process = require('child_process'),
	express = require('express'),
	redis   = require("redis"),
	app = express(),
	execFile = child_process.execFile;
/* general log function */
function log(){
	var args = Array.prototype.slice.call(arguments);
	args.unshift(new Date());
	args.unshift(__filename);
    console.log.apply(console, args);
	//console.log(null,new Date()+':>',__filename,arguments);
}
/* use external program to grab data - curl */
function runUrl(url){
	return new Promise(function(resolve, reject){
		const time = 10;
		const child = execFile('curl', ['--speed-time',time,'--speed-limit','1000','--max-time',time,'--connect-timeout',time,'-L',url], (error, stdout, stderr) => {
			resolve({err:false,data:stdout});
		});
	});
}
/* setup Redis connection - local server */ 
var rclient = redis.createClient({host: "172.18.0.41", port: 6379});
rclient.on("error", function (err) {
	log("Error " + err);
});
/* wrap any callback function to by synchronized */
function async_call(){
	var args = Array.prototype.slice.call(arguments);
	if(args.length==1){
		// Promise
		var p = args[0];
		return new Promise(function(resolve, reject){
			p.then(function(record) {
				resolve({
				   result : record
				});
			}).catch(function(error) {
				resolve({
				   err : error
				});
			});
		});		
	}
	var obj = args.shift();
	
	var func = obj instanceof Function ? obj : obj[args.shift()];
	//console.log('async_call',func);
	return new Promise(function(resolve, reject){
		try{
			if(func){
				args.push(function (err, replay){
					if (replay) {
					   resolve({
						   result : replay
					   });
					} else {
						resolve({
							err: err
						});
					}
				});
				func.apply(obj, args);
			}
			else
				resolve({
					err : 'Not defined '+func
				});
		}catch(e){
			resolve({
				err:e
			});
		}
		
	});
}
/* handle user request - http://127.0.0.1:3001/ladbrokes */
async function get_response(req, res)
{
	/* send response to client */
	function send(data)
	{
		res.status(200).send(JSON.stringify(data));
	}
	/* handle error / response results */
	function Finish(err,data)
	{
		if(err)
		{
			send({
				Error:err,result:data
			});
		}
		else
		{
			send(data);	
		}
	}
	/* input checks */
	let band_name = req.query.band_name;
	if(!band_name || band_name=='') return Finish('Band name undefined')
	let secret_key = req.query.secret_key;
	if(!secret_key || secret_key=='') return Finish('Secret Key undefined')

	let page = 50;
	let offset = 0;
	var ret;
	let result = {
		all : [],
		most : [],
		least : []
	};
	const options = {
		year: "numeric",
		month: "2-digit",
		day: "2-digit"
	};
	/* fetch all songs */
	while(page){
		ret = await runUrl('http://api.soundcloud.com/tracks/?offset='+offset+'&limit='+page+'&q='+band_name+'&client_id='+secret_key);
		/* Network error */
		if(ret.err)
		{
			return Finish(ret.err);
		}
		/* wrong request - probably wrong sercet key */
		if(ret.data=='')
		{
			return Finish('Invalid Secret Key',ret);
		}
		/* handle date time formats */
		process.env.TZ = 'Asia/Jerusalem'
		var date = new Date();
		/* current date also Redis key in 'ladbrokes' set */
		ret.dt = date.toLocaleTimeString()+' '+date.toLocaleDateString("en",options);
		/* save result to Redis - each request stored by dt as key */
		let r = await async_call(rclient,'hset','ladbrokes',ret.dt,JSON.stringify(ret));
		/* check if data stored */
			//log('hset',r);
			//r = await async_call(rclient,'hget','ladbrokes',ret.dt);
			//log('hget',r);
		/* increase offset */
		offset += page;
		if(ret.data)
		{
			/* convert data to JSON */
			try{
				let json = JSON.parse(ret.data);
				if(json.length<=page)
				{
					page = 0;// stop
					/*  papulate array with all songs , {id,description,likes_count,title,tag_list}*/
					json.map(function(song){
						result.all.push({
							id 			: song.id,
							description : song.description,
							likes_count : song.likes_count,
							title 		: song.title,
							tag_list 	: song.tag_list,
						});
					});						
				}
			}
			catch(e)
			{
				/* something wrong with data returned by server */
				ret.err = 'catch:'+e;
				return Finish(ret.err)
				page = 0;
			}
			
		}
		else
		{
			page = 0;
		}
	}
	/* sort by descending order */
	result.all.sort(function(a,b){return b.likes_count-a.likes_count;});
	let least = result.all.slice(-3); /* copy last 3 items as least */
	let most = result.all.slice(0,3); /* copy 3 first items as most */
	/* Send result to client */
	Finish(false,{			
		least : least,
		most : most
	});	
}
rclient.on("ready", function () {
	/* redis connection is ready*/
	log("ready");	
	/* setup server */
	app.get('/ladbrokes', get_response);
	app.listen(3001, function () {
		log(' on port : 3001');
	});
});