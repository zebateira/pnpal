var mapCanvas = new spriteGridContainer('#map_canvas.sprite-container')
var spriteSelector = new spriteContainer('div#sprite_selector > div.sprite-container')

var dimX = 20
var dimY = 20

// Maximum number of sprites in images (max x and max y for the sprite image)
var max_rows = 70
var max_collumns = 63

// Sprite Categories
var spriteCategory = {
	terrains: { min_x: 17, min_y: 52, max_x: 28, max_y: 52 },
	doors: { min_x: 3, min_y: 2, max_x: 16, max_y: 2 },
}

var spriteSel = $('div#sprite_type_selector > select')



spriteSel.change(function() {
	var category = spriteCategory[$(this).val()]

	spriteSelector.cleanSprites()

	for (var y = category.min_y; y <= category.max_y; ++y)
		for (var x = category.min_x; x <= category.max_x; ++x)
			spriteSelector.addSprite(new sprite('', y, x))
})

spriteSel.change()
mapCanvas.drawBackground()

/////// Objects

// Sprite Container Object
function spriteContainer(selector) {
	this.selector = selector

	this.addSprite = function(sprite) {
		return sprite.jqueryObj
					.appendTo(this.selector)
	}

	this.cleanSprites = function() {
		$(this.selector).html('')
	}
}


var shifter = true // used to alternate opacity to create grid effect
function spriteGridContainer(selector) {
	this.selector = selector;
	this.spriteGrid = new Array(dimY)

	this.addSprite = function() {
		shifter = !shifter
		return new sprite('', 0, 0).jqueryObj
				.addClass('canvas')
				.css('opacity', (shifter ? 1 : 0.95 ))
				.appendTo(this.selector)
				.draggable('disable')
				.droppable('enable')
				.unbind('click')
				.click(function(e) {
					console.log(e)
					$(e.toElement).css({
						'background': 'url("img/sprites.jpeg") ' +
							calcSpritePosition($('.selected').attr('data-collumn')) + ' ' +
							calcSpritePosition($('.selected').attr('data-row'))
					})
				})
	}

	this.drawBackground = function() {
		for(var y = 0; y < dimY; ++y) {
			this.spriteGrid[y] = new Array(dimX)
		}

		for(var y = 0; y < dimY; ++y) {
			for(var x = 0; x < dimX; ++x) {
				this.spriteGrid[y][x] = this.addSprite()
			}
			shifter = !shifter
			$(this.selector).append('</br>')
		}
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
		'data-collumn': this.collumn})
	.css({'background': 'url("img/sprites.jpeg") ' +
		calcSpritePosition(this.collumn) + ' ' +
		calcSpritePosition(this.row)})
	.draggable({
				opacity: 0.75,
				revert: 'invalid',
				revertDuration: 25,
				// snap: true,
				// snapMode: 'inner',
				stack: '.sprite',
				cursor: 'move',
				helper: 'clone'
			})
	.droppable({
		torelance: 'fit',
		drop: function(event, ui) {
			$(event.target).css({
				'background': 'url("img/sprites.jpeg") ' +
							calcSpritePosition($(event.toElement).attr('data-collumn')) + ' ' +
							calcSpritePosition($(event.toElement).attr('data-row'))
			})
		}
		
	})
	.click(function(){
		$('.selected').not(this).each(function() {
			$(this).removeClass('selected')
		})
		$(this).toggleClass('selected')
		console.log($(this).hasClass())
	})
}




/////// utils

// calculates pixel position for the background image position attribute. p.e. 0 = 0*32 = -32px, 3 => 3*32 = -96px
// each sprite is 32x32 hence *32
function calcSpritePosition(coord) {
	return - 32 * coord + "px"
}
