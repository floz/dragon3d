class Main

    constructor: ->
        engine.init document.getElementById( "scene" )
        engine.scene.add new Axis 500
        engine.scene.add new Dragon()

        updateManager.start()

    update: ->

$( window ).on "load", ->
    new Main()
