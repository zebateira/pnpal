/////// consts
var canvasDimX = 20
var canvasDimY = 20


// Maximum number of sprites in images (max x and max y for the sprite image)
var maxX = 70
var maxY = 63

// Sprite Categories
var spriteCategory = {
	'terrains': { 
		'1': { spriteX1: 0, spriteY1: 0, spriteX2: 21, spriteY2: 0 },
		'2': { spriteX1: 17, spriteY1: 52, spriteX2: 28, spriteY2: 52 },
		'3': { spriteX1: 28, spriteY1: 0, spriteX2: 30, spriteY2: 0 },
		'3': { spriteX1: 23, spriteY1: 2, spriteX2: 31, spriteY2: 2 }
	},
	'doorways': {
		'1': { spriteX1: 22, spriteY1: 0, spriteX2: 27, spriteY2: 0 }
	},
	'doors': {
		'1': { spriteX1: 3, spriteY1: 2, spriteX2: 15, spriteY2: 2 },
		'2': { spriteX1: 32, spriteY1: 6, spriteX2: 63, spriteY2: 7 }
	},
	'goods': {
		'1': { spriteX1: 17, spriteY1: 3, spriteX2: 30, spriteY2: 3 },
		'2': { spriteX1: 0, spriteY1: 4, spriteX2: 31, spriteY2: 6 },
		'3': { spriteX1: 0, spriteY1: 7, spriteX2: 22, spriteY2: 7 }
	},
	'armour': {
		'1': { spriteX1: 24, spriteY1: 7, spriteX2: 31, spriteY2: 7 },
		'2': { spriteX1: 0, spriteY1: 8, spriteX2: 19, spriteY2: 8 },
		'3': { spriteX1: 8, spriteY1: 9, spriteX2: 31, spriteY2: 9 },
		'4': { spriteX1: 0, spriteY1: 10, spriteX2: 12, spriteY2: 10 }
	},
	'shields': {
		'1': { spriteX1: 20, spriteY1: 8, spriteX2: 31, spriteY2: 8 },
		'2': { spriteX1: 0, spriteY1: 9, spriteX2: 7, spriteY2: 9 }
	},
	'weapons': {
		'1': { spriteX1: 0, spriteY1: 54, spriteX2: 26, spriteY2: 54 },
		'2': { spriteX1: 13, spriteY1: 10, spriteX2: 31, spriteY2: 10 },
		'3': { spriteX1: 0, spriteY1: 11, spriteX2: 31, spriteY2: 11 }
	},
	'chars': {
		'1': { spriteX1: 0, spriteY1: 18, spriteX2: 30, spriteY2: 28 }
	},
	'mobs': {
		'1': { spriteX1: 0, spriteY1: 30, spriteX2: 31, spriteY2: 41 }
	},
	'all': {
		'1': { spriteX1: 0, spriteY1: 0, spriteX2: maxX, spriteY2: maxY }
	}


}


/////// main

var mapCanvas = new mapCanvas('#map_canvas.sprite-container')
var spriteSelector = new spriteSelector('div#sprite_selector > div#sprite_type_selector')

spriteSelector.addOptions()
spriteSelector.optionChanged()
mapCanvas.drawBackground()

// export
$('a#export.btn').click(function() {
	var blob = new Blob([mapCanvas.export()], {type: 'text/xml;charset=utf-8'});
	saveAs(blob, 'map.xml');
})

// import
$('a#import.btn').click(function() {
	$('input#import_map').click()

	return false
})

var fileReader = new FileReader()

fileReader.onload = function(e) {
  mapCanvas.import($.parseXML(e.target.result))
}

$('input#import_map').change(function() {
  fileReader.readAsText(this.files[0])
})


/////// Objects

// Sprite Selector Object
function spriteSelector(selector) {

	this.selector = selector

	this.addOptions = function() {

		$('div#sprite_type_selector select')
			.bind('change', this.optionChanged)

		for(var category in spriteCategory) {
			$('<option></option>', { text: category, value: category })
				.appendTo(this.selector + ' select')
		}
	}

	this.optionChanged = function() {
		var category = spriteCategory[$('select').val()]

		$('div#sprite_selector > div.sprite-container').html('')

		for (var subcategory in category) {
			var subcategory = category[subcategory]
			for (var spriteY = subcategory.spriteY1; spriteY <= subcategory.spriteY2; ++spriteY)
				for (var spriteX = subcategory.spriteX1; spriteX <= subcategory.spriteX2; ++spriteX)
					new sprite(category, new coord(-1, -1), new coord(spriteY, spriteX))
						.jqueryObj
						.draggable('enable')
						.appendTo('div#sprite_selector > div.sprite-container')
		}
	}
}

function mapCanvas(selector) {
	this.selector = selector
	this.canvasGrid = new Array(canvasDimY)

	this.import = function(xml) {
		var map = xml.childNodes[0]

		this.drawBackground()
		spriteSelector.optionChanged()

		for (var i = 0; i < map.childNodes.length; ++i) {
			var $xmlSprite = $(map.childNodes[i])
			var sprite = document.getElementById($xmlSprite.attr('id'))

			this.drawSprite(sprite, 
				new coord( $xmlSprite.attr('spriteY'),
									 $xmlSprite.attr('spriteX')))
		}
	}

	this.export = function() {
		var xml = '<?xml version="1.0"?>' +
							'<map height="' + canvasDimY + '" ' +
									 'width="' + canvasDimX + '" ' +
							'>'


		for (var y = 0; y < canvasDimY; ++y)
			for (var x = 0; x < canvasDimX; ++x)
				xml += '<sprite ' +
							 'type="' + this.canvasGrid[y][x].spriteType + '" ' +
							 'id="' + this.canvasGrid[y][x].id + '" ' +
							 'canvasX="' + this.canvasGrid[y][x].coord.x + '" ' +
							 'canvasY="' + this.canvasGrid[y][x].coord.y + '" ' +
							 'spriteX="' + this.canvasGrid[y][x].spriteCoord.x + '" ' +
							 'spriteY="' + this.canvasGrid[y][x].spriteCoord.y + '" ' +
							 '/>'

		return xml += '</map>'
	}

	this.logMap = function() {
		for(var y = 0; y < canvasDimY; ++y) {
			var rowLog = ''
			for(var x = 0; x < canvasDimX; ++x) {
				rowLog += pad(this.canvasGrid[y][x].spriteCoord.x) + '-' +
									pad(this.canvasGrid[y][x].spriteCoord.y) + ' '
			}
			console.log(rowLog)
		}

		console.log('')
	}

	this.drawBackground = function() {

		for(var y = 0; y < canvasDimY; ++y) {
			this.canvasGrid[y] = new Array(canvasDimX)

			for(var x = 0; x < canvasDimX; ++x) {
				this.canvasGrid[y][x] = this.addSprite(
								new sprite('default', new coord(y, x), new coord(0,0))
						)
			}
			$(this.selector).append('</br>')
		}

	}

	this.drawSprite = function(sprite, spriteCoord) {
			$(sprite)
				.css(getSpriteCss(spriteCoord.y, spriteCoord.x))
				.removeClass('selected')
				.addClass('canvas')

				var x = $(sprite).attr('data-x')
				var y = $(sprite).attr('data-y')

				this.canvasGrid[y][x].spriteCoord = spriteCoord
				
				// this.logMap()
	}

	this.addSprite = function(newSprite) {

		newSprite.jqueryObj
				.addClass('canvas')
				.appendTo(this.selector)
				.droppable({
					drop: function(event, ui) {
						var spriteY = $(event.toElement).attr('data-sprite-y')
						var spriteX = $(event.toElement).attr('data-sprite-x')

						mapCanvas.drawSprite(event.target, new coord(spriteY, spriteX))
					}
				})
				.draggable({
					cursor: 'auto',
					containment: 'parent',
					opacity: 0,
					refreshPositions: true,
					drag: function(event, ui) {

						if( $(event.toElement).hasClass('canvas') )
							mapCanvas.drawSprite(event.toElement,
								new coord($('.selected').attr('data-sprite-y'), 
													$('.selected').attr('data-sprite-x')))
					},
					stop: function(event, ui) {
						var elem = $(event.toElement)

						if( !(elem.hasClass('sprite') &&
								elem.hasClass('canvas')) ||
								!$('.selected') ) {
							event.preventDefault()
							return;
						}
						
						mapCanvas.drawSprite(elem, new coord(
							$('.selected').attr('data-sprite-y'), 
							$('.selected').attr('data-sprite-x')))
						event.preventDefault()
					}
				})
				.unbind('click')
				.click(function(e) {
					var spriteY = $('.selected').attr('data-sprite-y')
					var spriteX = $('.selected').attr('data-sprite-x')

					mapCanvas.drawSprite(e.toElement, new coord(spriteY, spriteX))
				})

		return newSprite
	}

}

// Sprite Object
function sprite(type, canvasCoord, spriteCoord) {
	this.id = canvasCoord.x + '-' + canvasCoord.y

	this.spriteType = type
	this.coord = canvasCoord
	this.spriteCoord = spriteCoord

	this.jqueryObj = $('<div/>',{
		id: this.id,
		class: 'sprite',
		'data-sprite-y': this.spriteCoord.y,
		'data-sprite-x': this.spriteCoord.x,
		'data-y': this.coord.y,
		'data-x': this.coord.x
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

function pad(n) {
	return n < 10 ? '0' + n : n
}