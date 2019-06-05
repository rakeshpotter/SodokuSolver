var app = angular.module('app', []);
app.controller('ctrl', ['$scope', function ($scope) {
        $scope.userInput = 0;
        var table = $scope.table = [];
        var preDefined = $scope.preDefined = [];
        var tableH = $scope.tableH = [];
        var tableUsed = $scope.tableUsed = [];
        var style = $scope.style = [];
        for (var i = 0; i < 9; i++) {
            table[i] = [];
            preDefined[i] = [];
            tableH[i] = [];
            tableUsed[i] = [];
            style[i] = [];
            for (var j = 0; j < 9; j++) {
                table[i][j] = '';
                tableH[i][j] = [];
                tableUsed[i][j] = false;
                preDefined[i][j] = '';
                style[i][j] = [];
                if (j % 3 == 2) {
                    style[i][j].push('border-right');
                }
                if (i % 3 == 2) {
                    style[i][j].push('border-bottom');
                }
                if (j == 0) {
                    style[i][j].push('border-left');
                }
                if (i == 0) {
                    style[i][j].push('border-top');
                }
            }
        }

        $scope.num = 0;
        $scope.count = 0;
        $scope.selectedRow = 0;
        $scope.selectedCol = 0;

        $scope.cellClicked = function (row, col) {
            $scope.selectedRow = row;
            $scope.selectedCol = col;
        };

        $scope.hintCellClicked = function (row, col, index) {
            index = (!index) ? 0 : index;
            var num = tableH[row][col][index];
            tableH[row][col] = [num];
            table[row][col] = num;
            tableUsed[row][col] = true;
            for (var i = 0; i < 9; i++) {
                if (i == col)
                    continue;
                var index = tableH[row][i].indexOf(num);
                if (index != -1)
                    tableH[row][i].splice(index, 1);
            }
            for (var i = 0; i < 9; i++) {
                if (i == row)
                    continue;
                var index = tableH[i][col].indexOf(num);
                if (index != -1)
                    tableH[i][col].splice(index, 1);
            }
            var br = Math.floor(row / 3);
            var bc = Math.floor(col / 3);
            for (var i = br * 3; i < br * 3 + 3; i++) {
                for (var j = bc * 3; j < bc * 3 + 3; j++) {
                    if (i == row && j == col)
                        continue;
                    var index = tableH[i][j].indexOf(num);
                    if (index != -1)
                        tableH[i][j].splice(index, 1);
                }
            }
        };

        $scope.resetCount = 0;
        $scope.attempt = 0;
        $scope.continueAttempt2 = 0;
        $scope.continueAttempt3 = 0;
        $scope.failedPositions = {};
        $scope.fillAll = function () {
            while ($scope.num < 9) {
                $scope.fillNext();
                if ($scope.countNum() < 9) {
                    $scope.attempt++;
                    $scope.continueAttempt2++;
                    $scope.continueAttempt3++;
                    $scope.removeLast();
                    if ($scope.continueAttempt2 > 10) {
//                        console.log('Attempt2');
                        $scope.continueAttempt2 = 0;
                        $scope.saveFailedPostion();
                        $scope.removeLast();
                    }
                    if ($scope.continueAttempt3 > 20) {
//                        console.log('Attempt3');
                        $scope.continueAttempt3 = 0;
                        $scope.saveFailedPostion();
                        $scope.removeLast();
                    }
                } else {
                    $scope.continueAttempt2 = 0;
                    $scope.continueAttempt3 = 0;
                }
                if ($scope.attempt > 100) {
//                    $scope.emptyTable();
                    break;
                    $scope.resetCount++;
                }
                if ($scope.resetCount > 100) {
                    break;
                }
            }
        }

        $scope.getProblem = function (percent) {
            $scope.reset();
            $scope.fillAll();
            var removeCount = Math.floor(81 * percent / 100);
            for (var i = 0; i < removeCount; ) {
                var row = Math.floor(Math.random() * 10) % 9;
                var col = Math.floor(Math.random() * 10) % 9;
                if (table[row][col]) {
                    table[row][col] = '';
                    i++;
                }
            }
            preDefined = $scope.preDefined = copyTable(table);
            $scope.userInput = 1;
        }

        $scope.saveFailedPostion = function () {
            if (!$scope.failedPositions[$scope.num]) {
                $scope.failedPositions[$scope.num] = [];
            }
            var cordinates = [];
            for (var i = 0; i < 9; i++) {
                for (var j = 0; j < 9; j++) {
                    if (table[i][j] == $scope.num)
                        cordinates.push([j, j]);
                }
            }
            $scope.failedPositions[$scope.num].push(cordinates);
        };

        $scope.fillNext = function () {
            fillWithNum(++$scope.num);
        };

        $scope.removeLast = function () {
            $scope.saveFailedPostion();
            for (var i = 0; i < 9; i++) {
                for (var j = 0; j < 9; j++) {
                    if (!preDefined[i][j] && table[i][j] == $scope.num)
                        table[i][j] = '';
                }
            }
            $scope.num -= ($scope.num > 0) ? 1 : 0;
        }

        $scope.reset = function () {
            $scope.emptyTable();
        };

        $scope.countNum = function () {
            var c = 0;
            for (var i = 0; i < 9; i++) {
                for (var j = 0; j < 9; j++) {
                    if (table[i][j] == $scope.num)
                        c++;
                }
            }
            return c;
        };

        $scope.keyUp = function (event) {
//            console.log(event);
            var code = event.keyCode;
            switch (true) {
                case code == 46://Delete
                case code == 27://Esace
                    $scope.resetAll();
                    break;
                case code == 32://Space
                    $scope.fillNumber(0);
                    break;
                case code == 13://Enter
                    $scope.fillAll();
                    break;
                case code == 9://Tab
                    cellMoveRight();
                    break;
                case code == 8://Backspace
                    if (table[$scope.selectedRow][$scope.selectedCol])
                        table[$scope.selectedRow][$scope.selectedCol] = '';
                    else
                        cellMoveLeft();
                    break;
                case code == 38://ArrowUp
                    cellMoveUp();
                    break;
                case code == 40://ArrowDown
                    cellMoveDown();
                    break;
                case code == 37://ArrowLeft
                    cellMoveLeft()
                    break;
                case code == 39://ArrowRight
                    cellMoveRight()
                    break;
                case (code >= 48 && code <= 57) || (code >= 96 && code <= 105)://Digits
                    var num = code;
                    num -= (code >= 48 && code <= 57) ? 48 : 96;
                    $scope.fillNumber(num);
                    break;
            }
        }

        $scope.fillHints = function () {
            for (var i = 0; i < 9; i++) {
                for (var j = 0; j < 9; j++) {
                    if (preDefined[i][j])
                        tableH[i][j] = [preDefined[i][j]];
                    else if (table[i][j])
                        tableH[i][j] = [table[i][j]];
                    else {
                        tableH[i][j] = [];
                        for (var n = 1; n < 10; n++) {
                            if (!checkNum(i, j, n)) {
                                tableH[i][j].push(n);
                            }
                        }
                    }
                }
            }
        };

        $scope.fillAllUnique = function () {
            var emptyCells = emptyCellCount();
            if (emptyCells == 0)
                return;

            $scope.fillAllSingles();
            $scope.fillBoxUnique();
            $scope.fillHlineUnique();
            $scope.fillVlineUnique();
            if (emptyCells != emptyCellCount())
                $scope.fillAllUnique();
        };

        $scope.startGuess = function (row, col, h) {
            if (h) {
//                console.log('hint guess = ', row, col, tableH[row][col].indexOf(h), h);
                $scope.hintCellClicked(row, col, tableH[row][col].indexOf(h));
                $scope.fillAllUnique();
                var ehc = emptyHintCount();
                if (ehc > 0) {
//                    console.log('Empty hint cell = ', ehc);
                    return false;
                }
                var ecc = emptyCellCount();
                if (ecc > 0) {
//                    console.log('Empty cell = ', ecc);
                    return $scope.startGuess();
                }
                return true;
            }
//            console.log('startGuess------');
            var cell = getLeastHintCountCell();
            var row = cell[0];
            var col = cell[1];
            if (row == -1 || col == -1) {
//                console.log('Can not guess-----');
                return false;
            }
            var hints = tableH[row][col];
            var guess = {table: copyTable(table)};

            for (var i = 0; i < hints.length; i++) {
                if ($scope.startGuess(row, col, hints[i])) {
                    return true;
                }
                table = $scope.table = copyTable(guess.table);
                $scope.fillHints();
            }

//            console.log('Sudoku Completed.');
            return false;
        };

        $scope.solveSudoku = function () {
            $scope.fillHints();
            $scope.fillAllUnique();
            $scope.startGuess();
        };

        $scope.fillAllSingles = function () {
            var callAgain = false;
            for (var i = 0; i < 9; i++) {
                for (var j = 0; j < 9; j++) {
                    if (!preDefined[i][j] && !table[i][j] && tableH[i][j].length == 1) {
                        $scope.hintCellClicked(i, j);
                        callAgain = true;
                    }
                }
            }
            if (callAgain)
                $scope.fillAllSingles();
        };

        $scope.fillBoxUnique = function () {
            var callAgain = false;
            for (var b = 0; b < 9; b++) {
                var bx = Math.floor(b / 3);
                var by = b % 3;
                var counts = [];
                for (var i = bx * 3; i < bx * 3 + 3; i++) {
                    for (var j = by * 3; j < by * 3 + 3; j++) {
                        if (table[i][j])
                            continue;
                        tableH[i][j].forEach(h => {
                            if (!counts[h])
                                counts[h] = 0;
                            counts[h]++;
                        });
                    }
                }
                var nums = [];
                counts.forEach((c, index) => {
                    if (c == 1) {
                        nums.push(index);
                        callAgain = true;
                    }
                });
                nums.forEach(n => {
                    for (var i = bx * 3; i < bx * 3 + 3; i++) {
                        for (var j = by * 3; j < by * 3 + 3; j++) {
                            var index = tableH[i][j].indexOf(n);
                            if (index != -1) {
                                $scope.hintCellClicked(i, j, index);
                            }
                        }
                    }
                });
                if (callAgain)
                    $scope.fillBoxUnique();
            }
        };

        $scope.fillHlineUnique = function () {
            var callAgain = false;
            for (var r = 0; r < 9; r++) {
                var counts = [];
                for (var j = 0; j < 9; j++) {
                    if (table[r][j])
                        continue;
                    tableH[r][j].forEach(h => {
                        if (!counts[h])
                            counts[h] = 0;
                        counts[h]++;
                    });
                }
                var nums = [];
                counts.forEach((c, index) => {
                    if (c == 1) {
                        nums.push(index);
                        callAgain = true;
                    }
                });
                nums.forEach(n => {
                    for (var j = 0; j < 9; j++) {
                        var index = tableH[r][j].indexOf(n);
                        if (index != -1) {
                            $scope.hintCellClicked(r, j, index);
                        }
                    }
                });
                if (callAgain)
                    $scope.fillHlineUnique();
            }
        };

        $scope.fillVlineUnique = function () {
            var callAgain = false;
            for (var c = 0; c < 9; c++) {
                var counts = [];
                for (var i = 0; i < 9; i++) {
                    if (table[i][c])
                        continue;
                    tableH[i][c].forEach(h => {
                        if (!counts[h])
                            counts[h] = 0;
                        counts[h]++;
                    });
                }
                var nums = [];
                counts.forEach((c, index) => {
                    if (c == 1) {
                        nums.push(index);
                        callAgain = true;
                    }
                });
                nums.forEach(n => {
                    for (var i = 0; i < 9; i++) {
                        var index = tableH[i][c].indexOf(n);
                        if (index != -1) {
                            $scope.hintCellClicked(i, c, index);
                        }
                    }
                });
                if (callAgain)
                    $scope.fillHlineUnique();
            }
        };

        $scope.preFill = function () {
            table = $scope.table = [
                ['', '', '', /* */'', '', '', /*    */'', '', 3],
                [7, 4, '', /*   */3, '', '', /*    */'', '', ''],
                [8, '', '', /*  */'', 5, '', /*    */4, 9, 6],

                ['', '', '', /* */'', 6, '', /*    */'', 8, ''],
                ['', '', '', /* */4, '', 5, /*    */'', '', ''],
                [5, '', 1, /* */'', '', '', /*    */'', 7, ''],

                [9, '', '', /* */'', 7, '', /*    */5, 3, ''],
                ['', '', '', /* */'', '', '', /*    */6, '', ''],
                ['', 1, '', /* */'', '', 9, /*    */'', '', '']
            ];

            preDefined = $scope.preDefined = copyTable(table);
        };

        $scope.fillNumber = function (num) {
            if (num == 0)
                num = '';
            table[$scope.selectedRow][$scope.selectedCol] = num;
            if (!$scope.userInput) {
                preDefined[$scope.selectedRow][$scope.selectedCol] = num;
            }
//            cellMoveRight();
        }

        function cellMoveRight() {
            $scope.selectedCol++;
            if ($scope.selectedCol > 8) {
                $scope.selectedCol = 0;
                if ($scope.selectedRow < 8)
                    cellMoveDown();
                else
                    $scope.selectedRow = 0;
            }
        }

        function cellMoveLeft() {
            $scope.selectedCol--;
            if ($scope.selectedCol < 0) {
                $scope.selectedCol = 8;
                if ($scope.selectedRow > 0)
                    cellMoveUp();
                else
                    $scope.selectedRow = 8;
            }
        }

        function cellMoveUp() {
            $scope.selectedRow--;
            if ($scope.selectedRow < 0) {
                $scope.selectedRow = 8;
                if ($scope.selectedCol > 0)
                    cellMoveLeft();
                else
                    $scope.selectedCol = 8;
            }
        }

        function cellMoveDown() {
            $scope.selectedRow++;
            if ($scope.selectedRow > 8) {
                $scope.selectedRow = 0;
                if ($scope.selectedCol < 8)
                    cellMoveRight();
                else
                    $scope.selectedCol = 0;
            }
        }

        function fillWithNum(num) {
            var boxs = [0, 1, 2, 3, 4, 5, 6, 7, 8];
            while (boxs.length > 0) {
                var boxIndex = Math.round(Math.random() * 10) % boxs.length;
                var boxNum = boxs[boxIndex];
                var boxX = Math.floor(boxNum / 3);
                var boxY = boxNum % 3;
                var cell = [0, 1, 2, 3, 4, 5, 6, 7, 8];
                while (cell.length > 0) {
                    var cellIndex = Math.round(Math.random() * 10) % cell.length;
                    var cellNum = cell[cellIndex];
                    var cellX = (boxX * 3) + Math.floor(cellNum / 3);
                    var cellY = (boxY * 3) + (cellNum % 3);

                    if (!preDefined[cellX][cellY] && !table[cellX][cellY]) {
                        if (!checkNum(cellX, cellY, num)) {
                            table[cellX][cellY] = num;
                            break;
                        }
                    }
                    cell.splice(cellIndex, 1);
                }
                boxs.splice(boxIndex, 1);
            }
        }

        $scope.resetAll = function () {
//            console.log('Reset All---------------------');
            $scope.emptyTable(true);
            $scope.resetCount = 0;
        }

        $scope.emptyTable = function (resetPredefined) {
//            console.log('Empty Table---------------------');
            $scope.num = 0;
            $scope.attempt = 0;
            for (var i = 0; i < 9; i++) {
                for (var j = 0; j < 9; j++) {
                    if (preDefined[i][j]) {
                        if (resetPredefined) {
                            table[i][j] = '';
                            preDefined[i][j] = '';
                        }
                    } else {
                        table[i][j] = '';
                        tableUsed[i][j] = false;
                    }
                }
            }
        };

        function checkNum(row, col, num) {
            return checkBox(row, col, num) || checkVline(col, num) || checkHline(row, num);
        }
        function checkBox(row, col, num) {
            var x = Math.floor(row / 3) * 3;
            var y = Math.floor(col / 3) * 3;
            for (var i = x; i < x + 3; i++) {
                for (var j = y; j < y + 3; j++) {
                    if (table[i][j] == num)
                        return true;
                }
            }
            return false;
        }
        function checkVline(col, num) {
            for (var i = 0; i < 9; i++) {
                if (table[i][col] == num)
                    return true;
            }
            return false;
        }
        function checkHline(row, num) {
            for (var i = 0; i < 9; i++) {
                if (table[row][i] == num)
                    return true;
            }
            return false;
        }
        function emptyCellCount() {
            var count = 0;
            for (var i = 0; i < 9; i++) {
                for (var j = 0; j < 9; j++) {
                    if (!table[i][j])
                        count++
                }
            }
            return count;
        }
        function emptyHintCount() {
            var count = 0;
            for (var i = 0; i < 9; i++) {
                for (var j = 0; j < 9; j++) {
                    if (tableH[i][j].length == 0)
                        count++
                }
            }
            return count;
        }
        function getLeastHintCountCell() {
            var cell = [-1, -1];
            var min = 10;
            for (var i = 0; i < 9; i++) {
                for (var j = 0; j < 9; j++) {
                    if (!table[i][j] && tableH[i][j].length < min) {
                        cell = [i, j];
                        min = tableH[i][j].length;
                    }
                }
            }
            return cell;
        }
        function copyTable(table) {
            var t = [];
            for (var i = 0; i < 9; i++) {
                t[i] = [];
                for (var j = 0; j < 9; j++) {
                    t[i][j] = table[i][j];
                }
            }
            return t;
        }
    }]);