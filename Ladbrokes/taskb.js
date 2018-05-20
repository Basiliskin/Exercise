"use strict";
/*
node version required 8+
run :
	node taskb.js
*/
const child_process = require('child_process'), execFile = child_process.execFile;

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
/* execute task */
async function runTask()
{	
	/* api key */
	const key = 'pCNN85KHlpoe5K6ZlysWZBEgLJRcftOd';
	/* band list */
	const bandList = ['Juice WRLD','Rich The Kid','YBN Nahmir','landoncube'];
	let band = [];
	
	for(var i in bandList)
	{
		const band_name = bandList[i];
		/* fetch data - limited to 6 songs  */
		let ret = await runUrl('http://api.soundcloud.com/tracks/?limit=6&q='+band_name+'&client_id='+key);
		if(ret.data)
		{
			/* parse data to json */
			try{
				let json = JSON.parse(ret.data);
				/*sort by descending order */
				json.sort(function(a,b){return b.likes_count-a.likes_count;});
				/* cutomize result */
				const Band = {
					Name:band_name,
					Best:json.length ? json[0].likes_count : 0,
					BestTitle:json.length ? json[0].title : '',
					songs : json
				};
				/* add to global array for later sorting by band */
				band.push(Band);
				/* print result */
				log('***Band***',Band.Name,Band.BestTitle,Band.songs);
			}
			catch(e)
			{
				
			}
		}
		
	}
	/*sort all requested band by descending ,by best likes_count  */
	band.sort(function(a,b){return b.Best-a.Best;});
	/* print best band by likes_count */
	log('***Best***',band[0].Name,band[0].BestTitle);
}
async function Task()
{
	await runTask();
}
Task()