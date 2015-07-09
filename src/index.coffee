# Dependencies
Promise= Q.Promise

# Private styles
style= document.createElement 'style'
style.textContent= '''
.edgy-ripple {
  position: relative;
}
.edgy-ripple canvas{
  position:absolute;
  top:0;
  left:0;
  right:0;
  bottom:0;
}
'''
document.head.appendChild style

# Private methods
calcRipple= (t,max)->
  i= t/max

  begin= .25

  scale= i+begin
  scale+= (1-begin)*i
  opacity= .5
  if i+begin>1
    opacity-= (i+begin-1)/begin*.5
    opacity= round1 opacity

  {scale,opacity}

round1= (value)->
  Math.round(value*10)/10

# Upgrade automatic of ".edgy-ripple"
window.addEventListener 'load',->
  elements= document.querySelectorAll '.edgy-ripple'
  for element in elements
    edgyRipple.upgrade element

# Public
class EdgyRipple
  size: 2
  frame: 60
  upgrade: (element)->
    element.addEventListener 'click',(event)->
      canvas= document.createElement 'canvas'
      canvas.setAttribute key,value for key,value of element.getBoundingClientRect()
      element.appendChild canvas

      context= canvas.getContext '2d'

      new Promise (resolve,reject,notify)->
        i= 0

        # start the loop in the next tick
        requestAnimationFrame ->
          next()

        # Initialize the plane filling
        size= if canvas.width>canvas.height then canvas.width else canvas.height
        pixels= []
        length= size/window.edgyRipple.size
        for h in [0..length]
          for v in [0..length]
            x= h * window.edgyRipple.size
            y= v * window.edgyRipple.size
            width= window.edgyRipple.size
            height= window.edgyRipple.size
            deferred= 0

            pixels.push {x,y,width,height,deferred}

        # widen the scope of the circle
        next= ->
          {scale,opacity}= calcRipple i,window.edgyRipple.frame

          width= canvas.width * scale
          height= canvas.height * scale

          x= (event.clientX|0)
          y= (event.clientY|0)
          canvas.setAttribute 'style',"opacity:#{opacity};"

          notify {x,y,width,height,scale,opacity,pixels}
          return requestAnimationFrame next unless i++ is window.edgyRipple.frame

          resolve i

      # gradually display circularly the pixels
      .progress ({x,y,width,height,scale,opacity,pixels})->
        size= if width>height then width else height
        for pixel in pixels
          continue if pixel.rendered

          # Collision detection of the circle and pixel
          red= Math.atan2(pixel.y-y,pixel.x-x)
          a= pixel.x-x
          aMove= a * Math.cos red
          b= pixel.y-y
          bMove= b * Math.sin red
          if aMove+bMove < size/2
            # Ignore the random pixels for make a hangnail to boundary
            if scale>.25 and pixel.deferred<3 and (Math.random() < 0.5)
              pixel.deferred++
              continue

            context.fillRect pixel.x,pixel.y,pixel.width,pixel.height

            pixel.rendered= yes

      .then (i)->
        element.removeChild canvas

# Export
window.edgyRipple= new EdgyRipple
window.edgyRipple.EdgyRipple= EdgyRipple