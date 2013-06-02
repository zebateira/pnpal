/////// consts
var canvasDimX = 20
var canvasDimY = 20


// Maximum number of sprites in images (max x and max y for the sprite image)
var max_rows = 70
var max_collumns = 63

// Sprite Categories
var spriteCategory = {
	'terrains': { spriteX1: 0, spriteY1: 0, spriteX2: 21, spriteY2: 0 },
	'terrains 2': { spriteX1: 17, spriteY1: 52, spriteX2: 28, spriteY2: 52 },
	'doorways': { spriteX1: 22, spriteY1: 0, spriteX2: 27, spriteY2: 0 },
	'doors': { spriteX1: 3, spriteY1: 2, spriteX2: 16, spriteY2: 2 }
}


/////// main

var mapCanvas = new spriteGridContainer('#map_canvas.sprite-container')
var spriteSelector = new spriteSelector('div#sprite_selector > div#sprite_type_selector')

spriteSelector.addOptions()
spriteSelector.optionChanged()
mapCanvas.drawBackground()


/////// Objects

// Sprite Selector Object
function spriteSelector(selector) {

	this.selector = selector

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

		for (var spriteY = category.spriteY1; spriteY <= category.spriteY2; ++spriteY)
			for (var spriteX = category.spriteX1; spriteX <= category.spriteX2; ++spriteX)
				new sprite('', new coord(spriteY, spriteX))
					.jqueryObj
					.draggable('enable')
					.appendTo('div#sprite_selector > div.sprite-container')
	}
}

function spriteGridContainer(selector) {
	this.selector = selector
	this.spriteGrid = new Array(canvasDimY)

	this.logMap = function() {
		for(var y = 0; y < canvasDimY; ++y) {
			var rowLog = ''
			for(var x = 0; x < canvasDimX; ++x) {
				rowLog += pad(this.spriteGrid[y][x].spriteCoord.x) + '-' +
									pad(this.spriteGrid[y][x].spriteCoord.y) + ' '
			}
			console.log(rowLog)
		}

		console.log('')
	}

	this.drawBackground = function() {

		for(var y = 0; y < canvasDimY; ++y) {
			this.spriteGrid[y] = new Array(canvasDimX)

			for(var x = 0; x < canvasDimX; ++x) {
				this.spriteGrid[y][x] = this.addSprite(new sprite(new coord(y, x), new coord(0,0)))
			}
			$(this.selector).append('</br>')
		}

		this.logMap()
	}


	this.addSprite = function(newSprite) {

		newSprite.jqueryObj
				.addClass('canvas')
				.appendTo(this.selector)
				.droppable({
					drop: function(event, ui) {
						var spriteY = $(event.toElement).attr('data-sprite-y')
						var spriteX = $(event.toElement).attr('data-sprite-x')

						drawSprite(event.target, spriteY, spriteX)
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
								$('.selected').attr('data-sprite-y'), 
								$('.selected').attr('data-sprite-x'))
					},
					stop: function(event, ui) {
						var elem = $(event.toElement)

						if( !(elem.hasClass('sprite') &&
								elem.hasClass('canvas')) ||
								!$('.selected') ) {
							event.preventDefault()
							return;
						}
						
						drawSprite(elem,
							$('.selected').attr('data-sprite-y'), 
							$('.selected').attr('data-sprite-x'))
						event.preventDefault()
					}
				})
				.unbind('click')
				.click(function(e) {
					var spriteY = $('.selected').attr('data-sprite-y')
					var spriteX = $('.selected').attr('data-sprite-x')

					drawSprite(e.toElement, spriteY, spriteX)
				})

		return newSprite
	}

}

// Sprite Object
function sprite(canvasCoord, spriteCoord) {
	this.id = canvasCoord.x + '-' + canvasCoord.y

	this.coord = canvasCoord
	this.spriteCoord = spriteCoord
	// this.canvasCoord = canvasCoord

	this.jqueryObj = $('<div/>',{
		id: this.id,
		class: 'sprite',
		'data-sprite-y': this.spriteCoord.y,
		'data-sprite-x': this.spriteCoord.x
	})
	.css(getSpriteCss(this.spriteCoord.y, this.spriteCoord.x))
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

function coord(y, x) {
	this.x = x
	this.y = y
}


/////// utils

// calculates pixel position for the background image position attribute. p.e. 0 = 0*32 = -32px, 3 => 3*32 = -96px
// each sprite is 32x32 hence *32
function calcSpritePosition(coord) {
	return - 32 * coord + "px"
}

function getSpriteCss(spriteY, spriteX) {
	return {
				'background': 'url("img/sprites.jpeg") ' +
				calcSpritePosition(spriteX) + ' ' +
				calcSpritePosition(spriteY)
			}
}

function drawSprite(sprite, spriteY, spriteX) {
		$(sprite)
			.css(getSpriteCss(spriteY, spriteX))
			.removeClass('selected')
			.addClass('canvas')
			console.log(sprite)
			mapCanvas.logMap()
	}

	function pad(n) {
		return n < 10 ? '0' + n : n
	}