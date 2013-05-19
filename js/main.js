$(document).ready(function($) {
	// var navBarValues = ['home', 'pnp_player', 'map_builder', 'char_builder', 'about_project', 'about_team']

	$('a.nav-item').click(function() {
		//$('body > div.container').load('src/' + $(this).attr('id') + '.html')
		$('li.active > a.nav-item').parent().removeClass('active')
		$(this).parent().addClass('active')
	})

	window.onhashchange = function() {
		var href = $('a[href^="' + document.location.hash + '"]').attr('href')
		href = href.substr(href.indexOf('#') + 1)
		$('body > div.container').load('src/' + href + '.html')

		console.log('link -> ' + href)
	}

	document.location.hash = '#home'
})