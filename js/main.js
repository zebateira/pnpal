$(document).ready(function ($) {

	var mapCanvas = new spriteContainer('#map_canvas.sprite-container')
	var spriteSelector = new spriteContainer('div#sprite_selector > div.sprite-container')

	// Maximum number of sprites in images
	var max_rows = 70
	var max_collumns = 63

	// Sprite Categories
	var spriteCategory = {
		terrains: { min_x: 17, min_y: 52, max_x: 28, max_y: 52 },
		doors: { min_x: 3, min_y: 2, max_x: 16, max_y: 2 },
	}

	$('div#sprite_type_selector > select').change(function() {
		var category = spriteCategory[$(this).val()]

		spriteSelector.cleanSprites()

		for (var y = category.min_y; y <= category.max_y; ++y)
			for (var x = category.min_x; x <= category.max_x; ++x)
				spriteSelector.addSprite(new sprite('', y, x))
	})

	$('div#sprite_type_selector > select').change()




	// Sprite Container Object
	function spriteContainer(selector) {
		this.selector = selector

		this.addSprite = function(sprite) {
			sprite.jqueryObj.appendTo(this.selector)
		}

		this.cleanSprites = function() {
			$(this.selector).html('')
		}
	}

	// Sprite Object
	function sprite(id, row, collumn) {
		this.id = id

		this.row = row
		this.collumn = collumn

		this.jqueryObj = $('<div/>',{
			id: this.id,
			class: 'sprite',
			'data-row': this.row,
			'data-collumn': this.collumn
		}).css({'background': 'url("img/sprites.bmp") ' +
			calcSpritePosition(this.collumn) + ' ' +
			calcSpritePosition(this.row)})
	}




	// utils

	// calculates pixel position for the background image position attribute. p.e. 0 = 0*32 = -32px, 3 => 3*32 = -96px
	// each sprite is 32x32 hence *32
	function calcSpritePosition(coord) {
		return - 32 * coord + 'px'
	}


	// random funcs

	function drawAllSprites() {
		// adds positions of sprite image for every sprite ("draws" the sprite)
		$('.sprite').each(function() {
			var data_collumn = $(this).attr('data-collumn')
			var data_row = $(this).attr('data-row')

			$(this).css({'background': 'url("img/sprites.bmp") ' +
										calcSpritePosition($(this).attr('data-collumn')) + " " +
										calcSpritePosition($(this).attr('data-row'))})
					.click(function() {
						console.log('(' + data_collumn + ',' + data_row + ')')
						$(this).toggleClass('selected')
					})
		})
	}

	// draws all the sprites in all the sprite containers
	function dumpAllSprites() {
		var container = new spriteContainer('.sprite-container')

		for (var row = 0; row <= max_rows; row++) {
			for (var collumn = 0; collumn <= max_collumns; collumn++) {
				var tempSprite = new sprite(row+collumn, row, collumn)

				container.addSprite(tempSprite)
			}
		}
	}
})
