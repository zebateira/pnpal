$(document).ready(function () {
	var container = $('.sprite-container')
	var max_rows = 70
	var max_collumns = 63

	function addSprite(row, collumn) {
		container.append('<span class="sprite" data-row="' + row + '" data-collumn="' + collumn + '" />')
	}

	// add sprites to sprite container
	for (var row = 0; row <= max_rows; row++) {
		for (var collumn = 0; collumn <= max_collumns; collumn++) {
			addSprite(row, collumn)
		}
		container.append('<br />')
	}

	// add positions of sprite image for every sprite
	$('.sprite').each(function() {
		$(this).css('background-position-x', calcSpritePosition($(this).attr('data-collumn')))
			   .css('background-position-y', calcSpritePosition($(this).attr('data-row')))
	})

	function calcSpritePosition(coord) {
		return - 32 * coord + "px"
	}
})
