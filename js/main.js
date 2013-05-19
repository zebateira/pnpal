$(document).ready(function($) {
	// var navBarValues = ['home', 'pnp_player', 'map_builder', 'char_builder', 'about_project', 'about_team']

	window.onhashchange = function() {
		var href = $('a[href^="' + document.location.hash + '"]').attr('href')
		href = href.substr(href.indexOf('#') + 1)
		$('body > div.container').load('src/' + href + '.html')

		$('li.active > a.nav-item').parent().removeClass('active')
		$('a.nav-item[href^="' + document.location.hash + '"]').parent().addClass('active')

		console.log('link -> ' + href)
	}

	document.location.hash = '#home'
})