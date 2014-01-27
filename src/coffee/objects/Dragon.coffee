class Dragon extends THREE.Object3D

    _geom: null
    _material: null
    _mesh: null
    _radiusSegments: null
    _heighSegments: null
    _distanceMax: null

    _lines: null

    _lastMouse: null

    _initialized: false

    constructor: ->
        THREE.Object3D.call @

        height = 100
        @_radiusSegments = 20
        @_heighSegments = 10
        @_distanceMax = height / @_heighSegments

        @_geom = new THREE.CylinderGeometry 20, 20, height, @_radiusSegments, @_heighSegments, true
        @_geom.applyMatrix new THREE.Matrix4().makeTranslation( 0, 50, 0 )

        @_material = new THREE.MeshBasicMaterial
            color: 0x0044cc
            wireframe: true

        @_mesh = new THREE.Mesh @_geom, @_material
        @.add @_mesh

        @.rotation.x = .5

        @_sortVertices()

        @_lastMouse = 
            x: stage.mouse.x - stage.size.w * .5 
            y: stage.mouse.y - stage.size.h * .5

        updateManager.register @

    _sortVertices: ->
        @_lines = []
        for i in [0..@_radiusSegments]
            console.log i
            line = []
            @_lines.push line
            for j in [0..@_heighSegments]
                idx = i + j * @_radiusSegments + j
                v = @_geom.vertices[ idx ]
                line.push v
                console.log ">", idx, "{x: ", v.x, ", y: ", v.y, ", z: ", v.z, "}"

    update: ->
        if !@_initialized 
            if stage.mouse.x != 0 && stage.mouse.y != 0
                @_lastMouse.x = stage.mouse.x
                @_lastMouse.y = stage.mouse.y
                @_initialized = true
            return

        dx = stage.mouse.x - @_lastMouse.x
        dy = -stage.mouse.y + @_lastMouse.y
        @_lastMouse.x = stage.mouse.x
        @_lastMouse.y = stage.mouse.y

        for line in @_lines
            for i in [0..line.length-1]
                vertice = line[ i ]
                if i == 0
                    vertice.x += dx
                    vertice.y += dy
                    vertice.z += dy * .5
                else
                    lastVertice = line[ i - 1 ]
                    vTrans = new THREE.Vector3 0, 0, 0
                    vTrans.subVectors vertice, lastVertice
                    length = vTrans.length()
                    length += ( @_distanceMax - length ) * .25
                    vTrans.normalize()
                    vTrans.setLength length
                    vertice.addVectors lastVertice, vTrans
                    # vdx = lastVertice.x - vertice.x
                    # vdy = lastVertice.y - vertice.y
                    # a = Math.atan2 vdy, vdx
                    # a -= Math.PI
                    # dist = Math.sqrt vdx * vdx + vdy * vdy
                    # dist += ( 20 - dist ) * .25
                    # vertice.x = lastVertice.x + Math.cos( a ) * dist
                    # vertice.y = lastVertice.y + Math.sin( a ) * dist

        # for line in @_lines
        #     for i in [0..line.length-1]
        #         vertice = line[ i ]
        #         if i == 0
        #             vertice.x += dx
        #             vertice.y += dy
        #         else
        #             lastVertice = line[ i - 1 ]
        #             vdx = lastVertice.x - vertice.x
        #             vdy = lastVertice.y - vertice.y
        #             a = Math.atan2 vdy, vdx
        #             a -= Math.PI
        #             dist = Math.sqrt vdx * vdx + vdy * vdy
        #             dist += ( 20 - dist ) * .25
        #             vertice.x = lastVertice.x + Math.cos( a ) * dist
        #             vertice.y = lastVertice.y + Math.sin( a ) * dist
                    

        @_geom.verticesNeedUpdate = true

        

