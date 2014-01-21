class Dragon extends THREE.Object3D

    _geom: null
    _material: null
    _mesh: null

    _lines: null

    constructor: ->
        THREE.Object3D.call @

        @_geom = new THREE.CylinderGeometry 20, 20, 100, 8, 5
        @_material = new THREE.MeshBasicMaterial
            color: 0x0044cc
            wireframe: true

        @_mesh = new THREE.Mesh @_geom, @_material
        @.add @_mesh

        @.rotation.x = .5

        @_sortVertices()

    _sortVertices: ->
        @_lines = []
        console.log @_geom.vertices.length
        for vertice, idx in @_geom.vertices
            console.log "idx", idx, "::", vertice.x, vertice.y, vertice.z
        for i in [0..8]
            console.log i
            for j in [0..5]
                idx = i + j * 8 + j
                v = @_geom.vertices[ idx ]
                console.log ">", idx, "{x: ", v.x, ", y: ", v.y, ", z: ", v.z, "}"

        

