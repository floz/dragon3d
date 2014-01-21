class EngineSingleton

    class EngineInstance

        _container: null
        _stats: null

        renderer: null
        camera: null
        controls: null
        scene: null

        _composer: null
        _depthTarget: null

        init: ( container ) ->
            @renderer = new THREE.WebGLRenderer 
                alpha: false
                antialias: false
                precision: "lowp"

            @renderer.setClearColor 0x031a3f, 1
            @renderer.setSize stage.size.w, stage.size.h

            @_container = container
            @_container.appendChild @renderer.domElement

            @camera = new THREE.PerspectiveCamera 50, stage.size.w / stage.size.h, 1, 3000
            @camera.position.set 0, 0, 550

            @scene = new THREE.Scene()

            updateManager.register @

        update: ->
            if @_composer
                @_composer.render()
            else
                @renderer.render @scene, @camera

    instance = null
    @get: -> 
        instance ?= new EngineInstance()

engine = EngineSingleton.get()
