import $ from 'jquery'

export default class Twitch {
	constructor(args) {
		this.can = args.can;
		this.rootEl = args.rootEl;

		this.can.on('question:answered',() => {
			$.get('/twitchchannel', (channel) => {
				if(channel){
					this.render(channel);
				}
			});
		})
	}
	render(channel){

		const height = $('body').height(),
			width = $('body').width();

		/*const markup = `
			<blockquote class="embedly-card" data-card-key="fe1980bb199e4fffb3125413ddb379d9" data-card-type="article-full">
				<h4><a href="http://player.twitch.tv/?channel=${channel}">Twitch</a></h4>
				<p>(null)</p>
			</blockquote>
			<script async src="//cdn.embedly.com/widgets/platform.js" charset="UTF-8"></script>`*/

		const markup = `
			 <iframe 
		        src="http://player.twitch.tv/?channel=${channel}" 
		        height="${height}"
		        width="${width}"
		        frameborder="0"
		        scrolling="no"
		        allowfullscreen="true">
		    </iframe>`;
		
		
		/*const markup =`
			<object type="application/x-shockwave-flash" height="${height}" width="${width}" id="live_embed_player_flash" data="http://www.twitch.tv/widgets/live_embed_player.swf?channel=${channel}" bgcolor="#000000">
				<param name="allowFullScreen" value="true" />
				<param name="allowScriptAccess" value="always" />
				<param name="allowNetworking" value="all" />
				<param name="movie" value="http://www.twitch.tv/widgets/live_embed_player.swf" />
				<param name="flashvars" value="hostname=www.twitch.tv&channel=${channel}&auto_play=true&start_volume=25" />
			</object>`*/

		/*const markup = `
			<iframe class="videoplayer" src="http://www.twitch.tv/embed?channel=${channel}" height="${height}" width="${width}" frameborder="0" scrolling="no"></iframe>`;*/

		this.rootEl.append(markup);
	}
}