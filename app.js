// Generated by CoffeeScript 1.7.1
(function() {
  var Matrix, Piece, app, piece;

  piece = angular.module('piece', []);

  Matrix = (function() {
    Matrix.prototype.get_blank_line = function() {
      return (function() {
        var _i, _ref, _results;
        _results = [];
        for (_i = 1, _ref = this.width; 1 <= _ref ? _i <= _ref : _i >= _ref; 1 <= _ref ? _i++ : _i--) {
          _results.push('white');
        }
        return _results;
      }).call(this);
    };

    function Matrix(width, height) {
      if (width == null) {
        width = 10;
      }
      if (height == null) {
        height = 20;
      }
      this.width = width;
      this.height = height;
      this.matrix = (function() {
        var _i, _results;
        _results = [];
        for (_i = 1; 1 <= height ? _i <= height : _i >= height; 1 <= height ? _i++ : _i--) {
          _results.push(this.get_blank_line());
        }
        return _results;
      }).call(this);
      this.interval = 500;
      this.deleted_lines = 0;
    }

    Matrix.prototype.dump = function() {
      return this.matrix;
    };

    Matrix.prototype.is_line_full = function(line) {
      var block, _i, _len, _ref;
      _ref = this.matrix[line];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        block = _ref[_i];
        if (block === 'white') {
          return false;
        }
      }
      return true;
    };

    Matrix.prototype.delete_line = function(line) {
      var _ref;
      this.deleted_lines++;
      [].splice.apply(this.matrix, [1, line - 1 + 1].concat(_ref = this.matrix.slice(0, +(line - 1) + 1 || 9e9))), _ref;
      return this.matrix[0] = this.get_blank_line();
    };

    Matrix.prototype.clean_line = function(line) {
      if (this.is_line_full(line)) {
        return this.delete_line(line);
      }
    };

    Matrix.prototype.clean_matrix = function() {
      var i, _i, _ref;
      this.deleted_lines = 0;
      for (i = _i = 0, _ref = this.height - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
        this.clean_line(i);
      }
      return this.deleted_lines;
    };

    Matrix.prototype.clean_all = function() {
      return this.matrix = (function() {
        var _i, _ref, _results;
        _results = [];
        for (_i = 1, _ref = this.height; 1 <= _ref ? _i <= _ref : _i >= _ref; 1 <= _ref ? _i++ : _i--) {
          _results.push(this.get_blank_line());
        }
        return _results;
      }).call(this);
    };

    return Matrix;

  })();

  Piece = (function() {
    function Piece(matrix, preview_matrix) {
      var colors, pieces;
      this.type = Math.floor(Math.random() * 7);
      pieces = [[[0, 0], [0, 1], [1, 0], [1, 1]], [[-1, 0], [0, 0], [1, 0], [2, 0]], [[-1, 0], [0, 0], [1, 0], [1, 1]], [[-1, 0], [0, 0], [1, 0], [-1, 1]], [[0, 0], [1, 0], [-1, 1], [0, 1]], [[-1, 0], [0, 0], [1, 0], [0, 1]], [[-1, 0], [0, 0], [0, 1], [1, 1]]];
      colors = ["darkred", "orange", "darkmagenta", "darkcyan", "darkblue", "lime", "darkgray"];
      this.x = 4;
      this.y = 1;
      this.piece = pieces[this.type];
      this.color = colors[this.type];
      this.matrix = matrix;
      preview_matrix.clean_all();
      this.do_preview_apply(preview_matrix.dump());
    }

    Piece.prototype.do_rotate = function() {
      var block;
      console.log(this.piece);
      this.piece = (function() {
        var _i, _len, _ref, _results;
        _ref = this.piece;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          block = _ref[_i];
          _results.push([-block[1], block[0]]);
        }
        return _results;
      }).call(this);
      return console.log(this.piece);
    };

    Piece.prototype.do_un_rotate = function() {
      var block;
      return this.piece = (function() {
        var _i, _len, _ref, _results;
        _ref = this.piece;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          block = _ref[_i];
          _results.push([block[1], -block[0]]);
        }
        return _results;
      }).call(this);
    };

    Piece.prototype.do_down = function() {
      return this.y++;
    };

    Piece.prototype.do_up = function() {
      return this.y--;
    };

    Piece.prototype.do_left = function() {
      return this.x--;
    };

    Piece.prototype.do_right = function() {
      return this.x++;
    };

    Piece.prototype.do_preview_apply = function(matrix_dump) {
      var block, tmp_x, tmp_y, _i, _len, _ref, _results;
      _ref = this.piece;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        block = _ref[_i];
        tmp_x = 1 + block[0];
        tmp_y = 1 + block[1];
        _results.push(matrix_dump[tmp_y][tmp_x] = this.color);
      }
      return _results;
    };

    Piece.prototype.do_apply = function(matrix_dump, apply) {
      var block, tmp_x, tmp_y, _i, _len, _ref;
      if (apply == null) {
        apply = true;
      }
      _ref = this.piece;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        block = _ref[_i];
        tmp_x = this.x + block[0];
        tmp_y = this.y + block[1];
        if (apply) {
          if (!matrix_dump[tmp_y] || matrix_dump[tmp_y][tmp_x] !== "white") {
            return false;
          }
        }
        matrix_dump[tmp_y][tmp_x] = apply ? this.color : "white";
      }
      return true;
    };

    Piece.prototype.apply = function() {
      var tmp_matrix_dump;
      tmp_matrix_dump = JSON.parse(JSON.stringify(this.matrix.dump()));
      if (this.do_apply(tmp_matrix_dump)) {
        this.do_apply(this.matrix.dump());
        return true;
      } else {
        return false;
      }
    };

    Piece.prototype.un_apply = function() {
      return this.do_apply(this.matrix.dump(), false);
    };

    Piece.prototype.act = function(action, un_action) {
      this.un_apply(this.matrix.dump());
      action.call(this);
      if (!this.apply(this.matrix.dump())) {
        un_action.call(this);
        this.apply(this.matrix.dump());
        return false;
      } else {
        return true;
      }
    };

    Piece.prototype.down = function() {
      return this.act(this.do_down, this.do_up);
    };

    Piece.prototype.left = function() {
      return this.act(this.do_left, this.do_right);
    };

    Piece.prototype.right = function() {
      return this.act(this.do_right, this.do_left);
    };

    Piece.prototype.rotate = function() {
      if (this.type) {
        return this.act(this.do_rotate, this.do_un_rotate);
      }
    };

    return Piece;

  })();

  app = angular.module('tetris', []);

  app.controller('MainCtrl', function($scope, $timeout) {
    var bind_key, die, disable_autodown, do_autodown, do_new_piece, down, down_to_bottom, enable_autodown, first_down_to_bottom, init, new_piece, pause_game, start_game, timmer;
    timmer = 0;
    first_down_to_bottom = true;
    do_new_piece = function() {
      return new Piece($scope.matrix, $scope.preview_matrix);
    };
    new_piece = function() {
      var _ref;
      first_down_to_bottom = true;
      $scope.next_piece = (_ref = $scope.next_piece) != null ? _ref : do_new_piece();
      $scope.piece = $scope.next_piece;
      $scope.piece.apply();
      return $scope.next_piece = do_new_piece();
    };
    die = function() {
      var is_die;
      return is_die = true;
    };
    down = function() {
      var del_lines;
      if (!$scope.piece.down()) {
        if ($scope.piece.y) {
          del_lines = $scope.matrix.clean_matrix();
          $scope.score += Math.pow(del_lines, 2) * 10;
          new_piece();
        } else {
          die();
        }
        return false;
      } else {
        return true;
      }
    };
    down_to_bottom = function() {
      var r;
      r = true;
      if (first_down_to_bottom) {
        while (r) {
          r = $scope.piece.down();
        }
        enable_autodown();
        return first_down_to_bottom = false;
      } else {
        return down();
      }
    };
    bind_key = function() {
      return $scope.on_keypress = function(event) {
        var key;
        key = event.which;
        if (key === 40) {
          if (!$scope.is_playing) {
            start_game();
            return;
          } else if ($scope.is_pausing) {
            pause_game();
            return;
          }
        } else if (key === 27) {
          if ($scope.is_playing) {
            pause_game();
            return;
          }
        }
        if (!$scope.is_playing || $scope.is_pausing) {
          return;
        }
        switch (key) {
          case 37:
            return $scope.piece.left();
          case 38:
            return $scope.piece.rotate();
          case 39:
            return $scope.piece.right();
          case 40:
            return down();
          case 32:
            return down_to_bottom();
        }
      };
    };
    do_autodown = function() {
      down();
      return enable_autodown();
    };
    disable_autodown = function() {
      if (timmer) {
        return $timeout.cancel(timmer);
      }
    };
    enable_autodown = function() {
      disable_autodown();
      if ($scope.is_playing) {
        return timmer = $timeout(do_autodown, 1000);
      }
    };
    start_game = function() {
      $scope.matrix.clean_all();
      new_piece();
      $scope.score = 0;
      $scope.is_playing = true;
      $scope.is_pausing = false;
      return enable_autodown();
    };
    $scope.start_game = function() {
      return start_game();
    };
    pause_game = function() {
      if (!$scope.is_playing) {
        return;
      }
      $scope.is_pausing = !$scope.is_pausing;
      if ($scope.is_pausing) {
        return disable_autodown();
      } else {
        return enable_autodown();
      }
    };
    $scope.pause_game = function() {
      return pause_game();
    };
    init = function() {
      $scope.matrix = new Matrix;
      $scope.preview_matrix = new Matrix(4, 4);
      $scope.score = 0;
      $scope.is_playing = false;
      $scope.is_pausing = false;
      return bind_key();
    };
    return init();
  });

}).call(this);
