var Axis,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Axis = (function(_super) {
  __extends(Axis, _super);

  function Axis(length) {
    THREE.Object3D.call(this);
    this.add(this._buildAxis(new THREE.Vector3(0, 0, 0), new THREE.Vector3(length, 0, 0), 0xff0000, false));
    this.add(this._buildAxis(new THREE.Vector3(0, 0, 0), new THREE.Vector3(-length, 0, 0), 0xff0000, true));
    this.add(this._buildAxis(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, length, 0), 0x00ff00, false));
    this.add(this._buildAxis(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, -length, 0), 0x00ff00, true));
    this.add(this._buildAxis(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, length), 0x0000ff, false));
    this.add(this._buildAxis(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, -length), 0x0000ff, true));
  }

  Axis.prototype._buildAxis = function(src, dst, colorHex, dashed) {
    var axis, geom, mat;
    geom = new THREE.Geometry();
    if (dashed) {
      mat = new THREE.LineDashedMaterial({
        lineWidth: 3,
        color: colorHex,
        dashSize: 3,
        gapSize: 3
      });
    } else {
      mat = new THREE.LineBasicMaterial({
        lineWidth: 3,
        color: colorHex
      });
    }
    geom.vertices.push(src);
    geom.vertices.push(dst);
    geom.computeLineDistances();
    return axis = new THREE.Line(geom, mat, THREE.LinePieces);
  };

  return Axis;

})(THREE.Object3D);

var Dragon,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Dragon = (function(_super) {
  __extends(Dragon, _super);

  Dragon.prototype._geom = null;

  Dragon.prototype._material = null;

  Dragon.prototype._mesh = null;

  Dragon.prototype._radiusSegments = null;

  Dragon.prototype._heighSegments = null;

  Dragon.prototype._distanceMax = null;

  Dragon.prototype._lines = null;

  Dragon.prototype._lastMouse = null;

  Dragon.prototype._initialized = false;

  function Dragon() {
    var height;
    THREE.Object3D.call(this);
    height = 100;
    this._radiusSegments = 20;
    this._heighSegments = 10;
    this._distanceMax = height / this._heighSegments;
    this._geom = new THREE.CylinderGeometry(20, 20, height, this._radiusSegments, this._heighSegments, true);
    this._geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 50, 0));
    this._material = new THREE.MeshBasicMaterial({
      color: 0x0044cc,
      wireframe: true
    });
    this._mesh = new THREE.Mesh(this._geom, this._material);
    this.add(this._mesh);
    this.rotation.x = .5;
    this._sortVertices();
    this._lastMouse = {
      x: stage.mouse.x - stage.size.w * .5,
      y: stage.mouse.y - stage.size.h * .5
    };
    updateManager.register(this);
  }

  Dragon.prototype._sortVertices = function() {
    var i, idx, j, line, v, _i, _ref, _results;
    this._lines = [];
    _results = [];
    for (i = _i = 0, _ref = this._radiusSegments; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
      console.log(i);
      line = [];
      this._lines.push(line);
      _results.push((function() {
        var _j, _ref1, _results1;
        _results1 = [];
        for (j = _j = 0, _ref1 = this._heighSegments; 0 <= _ref1 ? _j <= _ref1 : _j >= _ref1; j = 0 <= _ref1 ? ++_j : --_j) {
          idx = i + j * this._radiusSegments + j;
          v = this._geom.vertices[idx];
          line.push(v);
          _results1.push(console.log(">", idx, "{x: ", v.x, ", y: ", v.y, ", z: ", v.z, "}"));
        }
        return _results1;
      }).call(this));
    }
    return _results;
  };

  Dragon.prototype.update = function() {
    var dx, dy, i, lastVertice, length, line, vTrans, vertice, _i, _j, _len, _ref, _ref1;
    if (!this._initialized) {
      if (stage.mouse.x !== 0 && stage.mouse.y !== 0) {
        this._lastMouse.x = stage.mouse.x;
        this._lastMouse.y = stage.mouse.y;
        this._initialized = true;
      }
      return;
    }
    dx = stage.mouse.x - this._lastMouse.x;
    dy = -stage.mouse.y + this._lastMouse.y;
    this._lastMouse.x = stage.mouse.x;
    this._lastMouse.y = stage.mouse.y;
    _ref = this._lines;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      line = _ref[_i];
      for (i = _j = 0, _ref1 = line.length - 1; 0 <= _ref1 ? _j <= _ref1 : _j >= _ref1; i = 0 <= _ref1 ? ++_j : --_j) {
        vertice = line[i];
        if (i === 0) {
          vertice.x += dx;
          vertice.y += dy;
          vertice.z += dy * .5;
        } else {
          lastVertice = line[i - 1];
          vTrans = new THREE.Vector3(0, 0, 0);
          vTrans.subVectors(vertice, lastVertice);
          length = vTrans.length();
          length += (this._distanceMax - length) * .25;
          vTrans.normalize();
          vTrans.setLength(length);
          vertice.addVectors(lastVertice, vTrans);
        }
      }
    }
    return this._geom.verticesNeedUpdate = true;
  };

  return Dragon;

})(THREE.Object3D);

var EngineSingleton, engine;

EngineSingleton = (function() {
  var EngineInstance, instance;

  function EngineSingleton() {}

  EngineInstance = (function() {
    function EngineInstance() {}

    EngineInstance.prototype._container = null;

    EngineInstance.prototype._stats = null;

    EngineInstance.prototype.renderer = null;

    EngineInstance.prototype.camera = null;

    EngineInstance.prototype.controls = null;

    EngineInstance.prototype.scene = null;

    EngineInstance.prototype._composer = null;

    EngineInstance.prototype._depthTarget = null;

    EngineInstance.prototype.init = function(container) {
      this.renderer = new THREE.WebGLRenderer({
        alpha: false,
        antialias: false,
        precision: "lowp"
      });
      this.renderer.setClearColor(0x031a3f, 1);
      this.renderer.setSize(stage.size.w, stage.size.h);
      this._container = container;
      this._container.appendChild(this.renderer.domElement);
      this.camera = new THREE.PerspectiveCamera(50, stage.size.w / stage.size.h, 1, 3000);
      this.camera.position.set(0, 0, 550);
      this.scene = new THREE.Scene();
      return updateManager.register(this);
    };

    EngineInstance.prototype.update = function() {
      if (this._composer) {
        return this._composer.render();
      } else {
        return this.renderer.render(this.scene, this.camera);
      }
    };

    return EngineInstance;

  })();

  instance = null;

  EngineSingleton.get = function() {
    return instance != null ? instance : instance = new EngineInstance();
  };

  return EngineSingleton;

})();

engine = EngineSingleton.get();

var StageSingleton, stage,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

StageSingleton = (function() {
  var StageInstance, instance;

  function StageSingleton() {}

  StageInstance = (function() {
    StageInstance.prototype.mouse = null;

    StageInstance.prototype.size = null;

    StageInstance.prototype._$window = null;

    function StageInstance() {
      this._onResize = __bind(this._onResize, this);
      this._onMouseMove = __bind(this._onMouseMove, this);
      this.mouse = {
        x: 0.0,
        y: 0.0
      };
      this.size = {
        w: 0,
        h: 0
      };
      this._$window = $(window);
      $(document).on("mousemove", this._onMouseMove);
      this._$window.on("resize", this._onResize);
      this._onResize();
    }

    StageInstance.prototype._onMouseMove = function(e) {
      this.mouse.x = e.clientX;
      return this.mouse.y = e.clientY;
    };

    StageInstance.prototype._onResize = function(e) {
      this.size.w = this._$window.width();
      return this.size.h = this._$window.height();
    };

    return StageInstance;

  })();

  instance = null;

  StageSingleton.get = function() {
    return instance != null ? instance : instance = new StageInstance();
  };

  return StageSingleton;

}).call(this);

stage = StageSingleton.get();

var UpdateManagerSingleton, updateManager,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

UpdateManagerSingleton = (function() {
  var UpdateManagerInstance, instance;

  function UpdateManagerSingleton() {}

  UpdateManagerInstance = (function() {
    UpdateManagerInstance.prototype._list = null;

    UpdateManagerInstance.prototype._stats = null;

    UpdateManagerInstance.prototype._rafId = -1;

    function UpdateManagerInstance() {
      this.update = __bind(this.update, this);
      this._list = [];
    }

    UpdateManagerInstance.prototype.enableDebugMode = function() {
      this._stats = new Stats();
      this._stats.domElement.style.position = "absolute";
      this._stats.domElement.style.left = "0";
      this._stats.domElement.style.top = "0";
      this._stats.domElement.style.zIndex = 100;
      return document.body.appendChild(this._stats.domElement);
    };

    UpdateManagerInstance.prototype.start = function() {
      return this._rafId = requestAnimationFrame(this.update);
    };

    UpdateManagerInstance.prototype.update = function() {
      var item, _i, _len, _ref;
      if (this._stats) {
        this._stats.begin();
      }
      _ref = this._list;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        item = _ref[_i];
        item.update();
      }
      if (this._stats) {
        this._stats.end();
      }
      return this._rafId = requestAnimationFrame(this.update);
    };

    UpdateManagerInstance.prototype.stop = function() {
      return cancelAnimationFrame(this._rafId);
    };

    UpdateManagerInstance.prototype.register = function(item) {
      if (this._list.indexOf(item) === -1) {
        return this._list.push(item);
      }
    };

    UpdateManagerInstance.prototype.unregister = function(item) {
      var idx;
      if ((idx = this._list.indexOf(item)) >= 0) {
        return this._list.splice(idx, 1);
      }
    };

    return UpdateManagerInstance;

  })();

  instance = null;

  UpdateManagerSingleton.get = function() {
    return instance != null ? instance : instance = new UpdateManagerInstance();
  };

  return UpdateManagerSingleton;

}).call(this);

updateManager = UpdateManagerSingleton.get();

var Main;

Main = (function() {
  function Main() {
    engine.init(document.getElementById("scene"));
    engine.scene.add(new Axis(500));
    engine.scene.add(new Dragon());
    updateManager.start();
  }

  Main.prototype.update = function() {};

  return Main;

})();

$(window).on("load", function() {
  return new Main();
});
