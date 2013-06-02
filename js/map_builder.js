/////// consts
var dimX = 20
var dimY = 20


// Maximum number of sprites in images (max x and max y for the sprite image)
var max_rows = 70
var max_collumns = 63

// Sprite Categories
var spriteCategory = {
	'terrains': { min_x: 0, min_y: 0, max_x: 21, max_y: 0 },
	'terrains 2': { min_x: 17, min_y: 52, max_x: 28, max_y: 52 },
	'doorways': { min_x: 22, min_y: 0, max_x: 27, max_y: 0 },
	'doors': { min_x: 3, min_y: 2, max_x: 16, max_y: 2 }
}


/////// main

var mapCanvas = new spriteGridContainer('#map_canvas.sprite-container')
var spriteSelectorCanvas = new spriteSelectorCanvas('div#sprite_selector > div.sprite-container')
var spriteSelector = new spriteSelector('div#sprite_selector > div#sprite_type_selector', spriteSelectorCanvas)

spriteSelector.addOptions()
spriteSelector.optionChanged()
mapCanvas.drawBackground()


/////// Objects
function spriteSelector(selector, canvas) {

	this.selector = selector
	this.canvas = canvas

	this.addOptions = function() {

		$('<select></select>')
			.appendTo(this.selector)
			.bind('change', this.optionChanged)

		for(var category in spriteCategory) {
			$('<option></option>', { text: category, value: category })
				.appendTo(this.selector + ' select')
		}
	}

	this.optionChanged = function() {
		var category = spriteCategory[$('select').val()]
		
		$('div#sprite_selector > div.sprite-container').html('')

		for (var y = category.min_y; y <= category.max_y; ++y)
			for (var x = category.min_x; x <= category.max_x; ++x)
				new sprite('', y, x)
					.jqueryObj
					.draggable('enable')
					.appendTo('div#sprite_selector > div.sprite-container')
	}
}

// Sprite Container Object
function spriteSelectorCanvas(selector) {
	this.selector = selector

	this.addSprite = function(sprite) {
		return sprite.jqueryObj
					.draggable('enable')
					.appendTo(this.selector)
	}

	this.cleanSprites = function() {
		$(this.selector).html('')
	}
}

function spriteGridContainer(selector) {
	this.selector = selector
	this.spriteGrid = new Array(dimY)

	this.logMap = function() {
		for(var y = 0; y < dimY; ++y) {
			var row = ''
			for(var x = 0; x < dimX; ++x) {
				row += '(' + this.spriteGrid[y][x].collumn +
							 ',' + this.spriteGrid[y][x].row + ') ' 
			}
			console.log(row)
		}
	}

	this.drawBackground = function() {

		for(var y = 0; y < dimY; ++y) {
			this.spriteGrid[y] = new Array(dimX)

			for(var x = 0; x < dimX; ++x) {
				this.spriteGrid[y][x] = this.addSprite()
			}
			$(this.selector).append('</br>')
		}

		this.logMap()
	}


	this.addSprite = function() {
		var newSprite = new sprite('', 0, 0)

		newSprite.jqueryObj
				.addClass('canvas')
				.appendTo(this.selector)
				.droppable({
					drop: function(event, ui) {
						var row = $(event.toElement).attr('data-row')
						var collumn = $(event.toElement).attr('data-collumn')

						drawSprite(event.target, row, collumn)
					}
				})
				.draggable({
					cursor: 'auto',
					containment: 'parent',
					opacity: 0,
					refreshPositions: true,
					drag: function(event, ui) {

						if( $(event.toElement).hasClass('canvas') )
							drawSprite(event.toElement,
								$('.selected').attr('data-row'), 
								$('.selected').attr('data-collumn'))					},
					stop: function(event, ui) {
						var elem = $(event.toElement)

						if( !elem.hasClass('sprite') ||
								!elem.hasClass('canvas') ||
								!$('.selected') )
							return;
						
						drawSprite(elem,
							$('.selected').attr('data-row'), 
							$('.selected').attr('data-collumn'))
						event.preventDefault()
					}
				})
				.unbind('click')
				.click(function(e) {
					drawSprite(e.toElement,
						$('.selected').attr('data-row'), 
						$('.selected').attr('data-collumn'))
				})

		return newSprite
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
	})
	.css(getSpriteCss(this.row, this.collumn))
	.draggable({
				revert: 'invalid',
				revertDuration: 25,
				stack: '.sprite',
				cursor: 'move',
				helper: 'clone',
				snap: true,
				snapMode: 'inner'
			})
	.click(function(){
		$('.selected').not(this).each(function() {
			$(this).removeClass('selected')
		})
		$(this).toggleClass('selected')
	})
}




/////// utils

// calculates pixel position for the background image position attribute. p.e. 0 = 0*32 = -32px, 3 => 3*32 = -96px
// each sprite is 32x32 hence *32
function calcSpritePosition(coord) {
	return - 32 * coord + "px"
}

function getSpriteCss(row, collumn) {
	return {
				'background': 'url("img/sprites.jpeg") ' +
				calcSpritePosition(collumn) + ' ' +
				calcSpritePosition(row)
			}
}

function drawSprite(sprite, row, collumn) {
		$(sprite)
			.css(getSpriteCss(row, collumn))
			.removeClass('selected')
			.addClass('canvas')
	}