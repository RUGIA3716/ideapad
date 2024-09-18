"use strict"


// 第二章
// まずはcanvasを取得しlineを引く。
let canvas_2 = document.getElementById("canvas_demo_2");
// 描画用のオブジェクト・ハンドラを取得
let canvas_2c = canvas_2.getContext('2d');

// パスの開始
canvas_2c.beginPath();
canvas_2c.moveTo(10, 10);
canvas_2c.lineTo(100, 10);
// 上記の軌跡を描画
canvas_2c.stroke();


// 第三章
// まずはcanvasを取得しlineを引く。
let canvas_3 = document.getElementById("canvas_demo_3");
// 描画用のオブジェクト・ハンドラを取得
let canvas_3c = canvas_3.getContext('2d');

// パスの開始
canvas_3c.beginPath();
// 四角形を描く
canvas_3c.moveTo(10, 10);
canvas_3c.lineTo(100, 10);
canvas_3c.lineTo(100, 100);
canvas_3c.lineTo(10, 100);
canvas_3c.lineTo(10, 10);
canvas_3c.stroke();

// 三角形を描く
canvas_3c.moveTo(60, 200);
canvas_3c.lineTo(110, 200 + (50 * Math.pow(3, (1 / 2))));
canvas_3c.lineTo(10, 200 + (50 * Math.pow(3, (1 / 2))));
canvas_3c.lineTo(60, 200);
canvas_3c.stroke();



// 第四章
// 上記の処理をもとに関数を作成する。

// 任意の箇所から任意の箇所へ線を引く関数。
function canvas_demo_draw_line(canvas_c, start_point, end_point) {
    // 始点から終点までの横幅、縦幅のみを求める。
    let line_x = start_point.x - end_point.x;
    let line_y = start_point.y - end_point.y;

    // 描画開始
    canvas_c.beginPath();
    canvas_c.moveTo(start_point.x, start_point.y);
    canvas_c.lineTo(start_point.x - line_x, start_point.y - line_y);
    canvas_c.stroke();
}

// 任意の箇所から任意の箇所へ、直角の線を引く関数。
function canvas_demo_draw_straight_line(canvas_c, start_point, end_point) {
    // 始点から終点までの横幅、縦幅を求める。
    let line_x = start_point.x - end_point.x;
    let line_y = start_point.y - end_point.y;

    // 描画開始
    canvas_c.beginPath();
    canvas_c.moveTo(start_point.x, start_point.y);
    // より長く引けるほうの線のみ採用。
    if (Math.abs(line_x) >= Math.abs(line_y)) {
        line_y = 0;
    }
    else {
        line_x = 0;
    }
    canvas_c.lineTo(start_point.x - line_x, start_point.y - line_y);
    canvas_c.stroke();
}

// 任意の箇所から任意の箇所へ四角形を描く
function canvas_demo_draw_Rect(canvas_c, start_point, end_point) {
    // 始点から終点までの横幅、立幅のみを求める。
    let line_x = start_point.x - end_point.x;
    let line_y = start_point.y - end_point.y;

    // 描画開始
    canvas_c.beginPath();
    canvas_c.moveTo(start_point.x, start_point.y);
    canvas_c.lineTo(start_point.x - line_x, start_point.y);
    canvas_c.lineTo(start_point.x - line_x, start_point.y - line_y);
    canvas_c.lineTo(start_point.x, start_point.y - line_y);
    canvas_c.lineTo(start_point.x, start_point.y);
    canvas_c.stroke();
}

// 任意の箇所から任意の箇所へより小きい方で正四角形を描く
function canvas_demo_draw_square(canvas_c, start_point, end_point) {
    // 始点から終点までの横幅、立幅のみを求める。
    let line_x = start_point.x - end_point.x;
    let line_y = start_point.y - end_point.y;

    // 正負を合わせる必要があるため、マイナスの場合はマイナスをかけるように補正
    if (Math.abs(line_x) >= Math.abs(line_y)) {
        line_x = (line_x / Math.abs(line_x)) * Math.abs(line_y);
    }
    else {
        line_y = (line_y / Math.abs(line_x)) * Math.abs(line_x);
    }

    // 描画開始
    canvas_c.beginPath();
    canvas_c.moveTo(start_point.x, start_point.y);
    canvas_c.lineTo(start_point.x - line_x, start_point.y);
    canvas_c.lineTo(start_point.x - line_x, start_point.y - line_y);
    canvas_c.lineTo(start_point.x, start_point.y - line_y);
    canvas_c.lineTo(start_point.x, start_point.y);
    canvas_c.stroke();
}

// 任意の箇所から任意の箇所へ上下の三角形を描く
function canvas_demo_draw_isosceles_triangle(canvas_c, start_point, end_point) {
    // 始点から終点までの横幅、立幅のみを求める。
    let line_x = start_point.x - end_point.x;
    let line_y = start_point.y - end_point.y;

    // 描画開始
    canvas_c.beginPath();
    canvas_c.moveTo(start_point.x, start_point.y);
    canvas_c.lineTo(start_point.x - line_x, start_point.y - line_y);
    canvas_c.lineTo(start_point.x + line_x, start_point.y - line_y);
    canvas_c.lineTo(start_point.x, start_point.y);
    canvas_c.stroke();
}

// 任意の箇所から任意の箇所へ上下の正三角形を描く
// やや間違いがあるが、正式版では修正済み
function canvas_demo_draw_equilateral_triangle(canvas_c, start_point, end_point) {
    // 始点から終点までの横幅、立幅のみを求める。
    let line_x = start_point.x - end_point.x;
    let line_y = start_point.y - end_point.y;

    // より短く引けるほうの線のみ採用。
    if (Math.abs(line_x) >= Math.abs(line_y)) {
        line_x = line_y;
    }
    else {
        line_y = line_x;
    }

    // 描画開始
    canvas_c.beginPath();
    canvas_c.moveTo(start_point.x, start_point.y);
    canvas_c.lineTo(start_point.x - line_x, start_point.y - (line_y * Math.pow(3, (1 / 2))));
    canvas_c.lineTo(start_point.x + line_x, start_point.y - (line_y * Math.pow(3, (1 / 2))));
    canvas_c.lineTo(start_point.x, start_point.y);
    canvas_c.stroke();
}

// 楕円形を描く
function canvas_demo_draw_ellipse(canvas_c, start_point, end_point) {
    // canvas_c.ellipse(100, 100, 50, 75, 0, 0, 2 * Math.PI) ;
    let line_x = start_point.x - end_point.x;
    let line_y = start_point.y - end_point.y;
    // 円の始点は常に右側なので、円の出来上がりが右によるときのみX座標を修正する。
    if (line_x >= 0) {
        canvas_c.moveTo(start_point.x, start_point.y - (line_y / 2));
    }
    else {
        canvas_c.moveTo(start_point.x - line_x, start_point.y - (line_y / 2));
    }
    canvas_c.ellipse(start_point.x - (line_x / 2), start_point.y - (line_y / 2), Math.abs(line_x / 2), Math.abs(line_y / 2), 0, 0, 2 * Math.PI);
    canvas_c.stroke()
}

// 正円を描く
function canvas_demo_draw_perfect_circle(canvas_c, start_point, end_point) {
    // canvas_c.ellipse(100, 100, 50, 75, 0, 0, 2 * Math.PI) ;
    let line_x = start_point.x - end_point.x;
    let line_y = start_point.y - end_point.y;

    // より短いほうに合わせる
    // 正負を合わせる必要があるため、マイナスの場合はマイナスをかけるように補正
    if (Math.abs(line_x) >= Math.abs(line_y)) {
        line_x = (line_x / Math.abs(line_x)) * Math.abs(line_y);
    }
    else {
        line_y = (line_y / Math.abs(line_y)) * Math.abs(line_x);
    }

    // 円の始点は常に右側なので、円の出来上がりが右によるときのみX座標を修正する。
    if (line_x >= 0) {
        canvas_c.moveTo(start_point.x, start_point.y - (line_y / 2));
    }
    else {
        canvas_c.moveTo(start_point.x - line_x, start_point.y - (line_y / 2));
    }
    canvas_c.ellipse(start_point.x - (line_x / 2), start_point.y - (line_y / 2), Math.abs(line_x / 2), Math.abs(line_y / 2), 0, 0, 2 * Math.PI);
    canvas_c.stroke()
}

// 正円を描く
function canvas_demo_draw_perfect_center_circle(canvas_c, start_point, end_point) {
    // canvas_c.ellipse(100, 100, 50, 75, 0, 0, 2 * Math.PI) ;
    let line_x = start_point.x - end_point.x;
    let line_y = start_point.y - end_point.y;

    // より短いほうに合わせる
    if (Math.abs(line_x) >= Math.abs(line_y)) {
        line_x = line_y;
    }
    else {
        line_y = line_x;
    }

    // 円の中心に移動
    canvas_c.moveTo(start_point.x + Math.abs(line_x / 2), start_point.y);

    canvas_c.ellipse(start_point.x, start_point.y, Math.abs(line_x / 2), Math.abs(line_y / 2), 0, 0, 2 * Math.PI);
    canvas_c.stroke()
}


let canvas_4 = document.getElementById("canvas_demo_4");
let canvas_4c = canvas_4.getContext('2d');

// 線を引く
canvas_demo_draw_line(canvas_4c, { x: 100, y: 100 }, { x: 200, y: 100 });
canvas_demo_draw_line(canvas_4c, { x: 100, y: 200 }, { x: 50, y: 200 });
canvas_demo_draw_line(canvas_4c, { x: 100, y: 300 }, { x: 200, y: 350 });
canvas_demo_draw_line(canvas_4c, { x: 300, y: 300 }, { x: 500, y: 200 });

// 直角の線を引く
let canvas_5 = document.getElementById("canvas_demo_5");
let canvas_5c = canvas_5.getContext('2d');
canvas_demo_draw_straight_line(canvas_5c, { x: 100, y: 100 }, { x: 200, y: 100 });
canvas_demo_draw_straight_line(canvas_5c, { x: 100, y: 200 }, { x: 50, y: 200 });
canvas_demo_draw_straight_line(canvas_5c, { x: 100, y: 300 }, { x: 200, y: 350 });
canvas_demo_draw_straight_line(canvas_5c, { x: 300, y: 300 }, { x: 500, y: 200 });

// 四角形
let canvas_6 = document.getElementById("canvas_demo_6");
let canvas_6c = canvas_6.getContext('2d');
canvas_demo_draw_Rect(canvas_6c, { x: 100, y: 300 }, { x: 200, y: 350 });
canvas_demo_draw_Rect(canvas_6c, { x: 300, y: 300 }, { x: 500, y: 200 });

// 正方形
let canvas_7 = document.getElementById("canvas_demo_7");
let canvas_7c = canvas_7.getContext('2d');
canvas_demo_draw_square(canvas_7c, { x: 100, y: 300 }, { x: 200, y: 350 });
canvas_demo_draw_square(canvas_7c, { x: 300, y: 300 }, { x: 500, y: 200 });

// 三角形　上下
let canvas_8 = document.getElementById("canvas_demo_8");
let canvas_8c = canvas_8.getContext('2d');
canvas_demo_draw_isosceles_triangle(canvas_8c, { x: 300, y: 200 }, { x: 350, y: 250 });
canvas_demo_draw_isosceles_triangle(canvas_8c, { x: 350, y: 150 }, { x: 400, y: 100 });
canvas_demo_draw_isosceles_triangle(canvas_8c, { x: 100, y: 200 }, { x: 150, y: 350 });


// 正三角形　上下
let canvas_9 = document.getElementById("canvas_demo_9");
let canvas_9c = canvas_9.getContext('2d');
canvas_demo_draw_equilateral_triangle(canvas_9c, { x: 300, y: 200 }, { x: 350, y: 250 });
canvas_demo_draw_equilateral_triangle(canvas_9c, { x: 350, y: 150 }, { x: 400, y: 100 });
canvas_demo_draw_equilateral_triangle(canvas_9c, { x: 100, y: 200 }, { x: 150, y: 350 });


// 楕円
let canvas_10 = document.getElementById("canvas_demo_10");
let canvas_10c = canvas_10.getContext('2d');
canvas_demo_draw_ellipse(canvas_10c, { x: 100, y: 100 }, { x: 200, y: 150 });
canvas_demo_draw_ellipse(canvas_10c, { x: 100, y: 100 }, { x: 200, y: 200 });
canvas_demo_draw_ellipse(canvas_10c, { x: 100, y: 100 }, { x: 50, y: 200 });
canvas_demo_draw_ellipse(canvas_10c, { x: 100, y: 100 }, { x: 50, y: 50 });


// 正円
let canvas_11 = document.getElementById("canvas_demo_11");
let canvas_11c = canvas_11.getContext('2d');
canvas_demo_draw_perfect_circle(canvas_11c, { x: 100, y: 100 }, { x: 200, y: 150 });
canvas_demo_draw_perfect_circle(canvas_11c, { x: 100, y: 100 }, { x: 200, y: 200 });
canvas_demo_draw_perfect_circle(canvas_11c, { x: 100, y: 100 }, { x: 50, y: 200 });
canvas_demo_draw_perfect_circle(canvas_11c, { x: 100, y: 100 }, { x: 50, y: 50 });



let canvas_12_mouse_pointer_label = document.getElementById("mouse_point_on_canvas_1");
let canvas_12 = document.getElementById("canvas_demo_12");
let canvas_12c = canvas_12.getContext('2d');

let mouse_down_f_12 = false;
let first_click;

canvas_12.addEventListener('mousedown', function (e) {
    // 直前のクリック位置を初期化
    canvas_12c = canvas_12.getContext('2d');
    // 初期化
    canvas_12c.beginPath();
    canvas_12c.fillStyle = "rgb(255, 255, 255)";
    canvas_12c.fillRect(0, 0, canvas_12.width, canvas_12.height);
    canvas_12c.strokeStyle = "rgb(255, 0, 0)";
    canvas_demo_draw_perfect_center_circle(canvas_12c, { x: e.offsetX, y: e.offsetY }, { x: e.offsetX + 50, y: e.offsetY + 50 });
    mouse_down_f_12 = true;
    first_click = { offsetX: e.offsetX, offsetY: e.offsetY };
    display_mouse_pointer_on_canvas_demo_1(e);
});

canvas_12.addEventListener('mousemove', function (e) {
    if (!mouse_down_f_12) {
        return;
    }
    // 直前のクリック位置を初期化
    canvas_12c = canvas_12.getContext('2d');
    // 初期化
    canvas_12c.beginPath();
    canvas_12c.strokeStyle = "rgb(0, 255, 0)";
    canvas_demo_draw_perfect_center_circle(canvas_12c, { x: e.offsetX, y: e.offsetY }, { x: e.offsetX + 5, y: e.offsetY + 5 });
    display_mouse_pointer_on_canvas_demo_1(e);
});

canvas_12.addEventListener('mouseup', function (e) {
    if (!mouse_down_f_12) {
        return;
    }
    // 直前のクリック位置を初期化
    canvas_12c = canvas_12.getContext('2d');
    // 初期化
    canvas_12c.beginPath();
    canvas_12c.strokeStyle = "rgb(0, 0, 255)";
    canvas_demo_draw_perfect_center_circle(canvas_12c, { x: e.offsetX, y: e.offsetY }, { x: e.offsetX + 50, y: e.offsetY + 50 });
    mouse_down_f_12 = false;
    display_mouse_pointer_on_canvas_demo_1(e);
});

function display_mouse_pointer_on_canvas_demo_1(e) {
    document.getElementById("mouse_point_on_canvas_1").innerText = "現在のマウスポインタのCANVAS上での座標 X : " + first_click.offsetX + " \t\t y : " + first_click.offsetY + " -> X : " + e.offsetX + " \t\t y : " + e.offsetY;
}





// 最終章
// 共通の関数から任意の図形を描けるように、中間の関数を追加。また、塗りつぶしの可否も追加。
function draw_shape(canvas_c, shape_form, start_point, end_point, stroke_color, filling, filling_color) {

    // 共通処理
    canvas_c.beginPath();
    canvas_c.strokeStyle = "rgb(" + stroke_color.r + "," + stroke_color.g + "," + stroke_color.b + ")";


    switch (shape_form) {
        case "line":
            alpha_canvas_demo_draw_line(canvas_c, start_point, end_point, stroke_color);
            break;
        case "straight_line":
            alpha_canvas_demo_draw_straight_line(canvas_c, start_point, end_point, stroke_color);
            break;
        case "rect":
            alpha_canvas_demo_draw_Rect(canvas_c, start_point, end_point, stroke_color, filling, filling_color);
            break;
        case "square":
            alpha_canvas_demo_draw_square(canvas_c, start_point, end_point, stroke_color, filling, filling_color);
            break;
        case "isosceles_triangle":
            alpha_canvas_demo_draw_isosceles_triangle(canvas_c, start_point, end_point, stroke_color, filling, filling_color);
            break;
        case "equilateral_triangle":
            alpha_canvas_demo_draw_equilateral_triangle(canvas_c, start_point, end_point, stroke_color, filling, filling_color);
            break;
        case "ellipse":
            alpha_canvas_demo_draw_ellipse(canvas_c, start_point, end_point, stroke_color, filling, filling_color);
            break;
        case "perfect_circle":
            alpha_canvas_demo_draw_perfect_circle(canvas_c, start_point, end_point, stroke_color, filling, filling_color);
            break;



    }
    // 共通処理
    if (filling) {
        canvas_c.fillStyle = "rgb(" + filling_color.r + "," + filling_color.g + "," + filling_color.b + ")";
        canvas_c.fill();
    }
    // 共通処理
    canvas_c.stroke();

}

function line_between(start_point, end_point, priority, revision) {
    let line_x = start_point.x - end_point.x;;
    let line_y = start_point.y - end_point.y;;
    if (priority == false || typeof priority == "undefined") {
        // nothing
    }
    else if (priority == "long") {
        // 使う関数なし
    }
    else if (priority == "long_only") {
        if (Math.abs(line_x) >= Math.abs(line_y)) {
            line_y = 0;
        }
        else {
            line_x = 0;
        }
    }
    else if (priority == "short") {
        if (typeof revision == "undefined" || revision == false) {
            // より短く引けるほうの線のみ採用。
            if (Math.abs(line_x) >= Math.abs(line_y)) {
                line_x = line_y;
            }
            else {
                line_y = line_x;
            }
        }
        else if (revision == true) {
            if (Math.abs(line_x) >= Math.abs(line_y)) {
                line_x = (line_x / Math.abs(line_x)) * Math.abs(line_y);
            }
            else {
                line_y = (line_y / Math.abs(line_y)) * Math.abs(line_x);
            }
        }
    }
    else if (priority == "short_only") {
        // 使う関数なし
    }
    return { x: line_x, y: line_y };
}

// 任意の箇所から任意の箇所へ線を引く関数。
function alpha_canvas_demo_draw_line(canvas_c, start_point, end_point, stroke_color) {
    // 始点から終点までの横幅、縦幅のみを求める。
    let line_b = line_between(start_point, end_point);

    // 描画開始
    canvas_c.moveTo(start_point.x, start_point.y);
    canvas_c.lineTo(start_point.x - line_b.x, start_point.y - line_b.y);
}

// 任意の箇所から任意の箇所へ、直角の線を引く関数。
function alpha_canvas_demo_draw_straight_line(canvas_c, start_point, end_point) {
    // 始点から終点までの横幅、縦幅を求める。
    // より長く引けるほうの線のみ採用。
    let line_b = line_between(start_point, end_point, "long_only");

    // 描画開始
    canvas_c.moveTo(start_point.x, start_point.y);
    canvas_c.lineTo(start_point.x - line_b.x, start_point.y - line_b.y);
}

// 任意の箇所から任意の箇所へ四角形を描く
function alpha_canvas_demo_draw_Rect(canvas_c, start_point, end_point, filling, filling_color) {
    // 始点から終点までの横幅、縦幅のみを求める。
    let line_b = line_between(start_point, end_point);

    // 描画開始
    canvas_c.moveTo(start_point.x, start_point.y);
    canvas_c.lineTo(start_point.x - line_b.x, start_point.y);
    canvas_c.lineTo(start_point.x - line_b.x, start_point.y - line_b.y);
    canvas_c.lineTo(start_point.x, start_point.y - line_b.y);
    canvas_c.lineTo(start_point.x, start_point.y);
}

// 任意の箇所から任意の箇所へより小きい方で正四角形を描く
function alpha_canvas_demo_draw_square(canvas_c, start_point, end_point, filling, filling_color) {
    // 始点から終点までの横幅、立幅のみを求める。
    // より短いほうを採用
    // 正負を合わせる必要があるため、マイナスの場合はマイナスをかけるように補正
    let line_b = line_between(start_point, end_point, "short", true);

    // 描画開始
    canvas_c.moveTo(start_point.x, start_point.y);
    canvas_c.lineTo(start_point.x - line_b.x, start_point.y);
    canvas_c.lineTo(start_point.x - line_b.x, start_point.y - line_b.y);
    canvas_c.lineTo(start_point.x, start_point.y - line_b.y);
    canvas_c.lineTo(start_point.x, start_point.y);
}

// 任意の箇所から任意の箇所へ上下の三角形を描く
function alpha_canvas_demo_draw_isosceles_triangle(canvas_c, start_point, end_point, filling, filling_color) {
    // 始点から終点までの横幅、縦幅のみを求める。
    let line_b = line_between(start_point, end_point);

    // 描画開始
    canvas_c.moveTo(start_point.x, start_point.y);
    canvas_c.lineTo(start_point.x - line_b.x, start_point.y - line_b.y);
    canvas_c.lineTo(start_point.x + line_b.x, start_point.y - line_b.y);
    canvas_c.lineTo(start_point.x, start_point.y);
}

// 任意の箇所から任意の箇所へ上下の正三角形を描く
function alpha_canvas_demo_draw_equilateral_triangle(canvas_c, start_point, end_point, filling, filling_color) {
    // 始点から終点までの横幅、縦幅のみを求める。
    // より短く引けるほうに合わせる。



    let line_b = line_between(start_point, end_point, "short");

    // デフォルトだと高さが√3倍されてしまう。そのため補正をかける。
    let line_a = line_between(start_point, end_point);
    // if(line_a.y > line_a.x){
       line_b.y /= Math.pow(3, (1 / 2));
       line_b.x /= Math.pow(3, (1 / 2));
    // }
    
    // 描画開始
    canvas_c.moveTo(start_point.x, start_point.y);
    canvas_c.lineTo(start_point.x - line_b.x, start_point.y - (line_b.y * Math.pow(3, (1 / 2))));
    canvas_c.lineTo(start_point.x + line_b.x, start_point.y - (line_b.y * Math.pow(3, (1 / 2))));
    canvas_c.lineTo(start_point.x, start_point.y);
}

// 楕円形を描く
function alpha_canvas_demo_draw_ellipse(canvas_c, start_point, end_point, filling, filling_color) {
    // 始点から終点までの横幅、縦幅のみを求める。
    let line_b = line_between(start_point, end_point);
    // 円の始点は常に右側なので、円の出来上がりが右によるときのみX座標を修正する。
    if (line_b.x >= 0) {
        canvas_c.moveTo(start_point.x, start_point.y - (line_b.y / 2));
    }
    else {
        canvas_c.moveTo(start_point.x - line_b.x, start_point.y - (line_b.y / 2));
    }
    canvas_c.ellipse(start_point.x - (line_b.x / 2), start_point.y - (line_b.y / 2), Math.abs(line_b.x / 2), Math.abs(line_b.y / 2), 0, 0, 2 * Math.PI);
}

// 正円を描く
function alpha_canvas_demo_draw_perfect_circle(canvas_c, start_point, end_point, filling, filling_color) {
    // 始点から終点までの横幅、縦幅のみを求める。
    // より短いほうに合わせる
    // 正負を合わせる必要があるため、マイナスの場合はマイナスをかけるように補正
    let line_b = line_between(start_point, end_point, "short", true);

    // 円の始点は常に右側なので、円の出来上がりが右によるときのみX座標を修正する。
    if (line_b.x >= 0) {
        canvas_c.moveTo(start_point.x, start_point.y - (line_b.y / 2));
    }
    else {
        canvas_c.moveTo(start_point.x - line_b.x, start_point.y - (line_b.y / 2));
    }
    canvas_c.ellipse(start_point.x - (line_b.x / 2), start_point.y - (line_b.y / 2), Math.abs(line_b.x / 2), Math.abs(line_b.y / 2), 0, 0, 2 * Math.PI);
}


let canvas_13 = document.getElementById("canvas_demo_13");
let canvas_13c = canvas_13.getContext('2d');

let canvas_14 = document.getElementById("canvas_demo_14");
let canvas_14c = canvas_14.getContext('2d');

let mouse_down_f_13 = false;
let first_click_13;
let end_click_13;

// 色
let stroke_color = { r: 0, g: 0, b: 0 };
let filling_color = { r: 128, g: 255, b: 128 };

let filling_mode_select = false;
// 形状
let shape_form_mode = "rect";
function change_form(str, e) {
    shape_form_mode = str;
    let selector = document.querySelectorAll(".shape_form_selector");
    for (let i = 0; i < selector.length; ++i) {
        selector[i].classList.remove("selected");
    }
    e.classList.add("selected")
}

function change_fill_mode() {
    filling_mode_select = !filling_mode_select;
}
function change_stroke_color(color_type, e) {
    if (0 <= e.value && e.value < 256) {
        switch (color_type) {
            case "r":
                stroke_color.r = e.value;
                break;
            case "g":
                stroke_color.g = e.value;
                break;
            case "b":
                stroke_color.b = e.value;
                break;
        }
    }
    else {
        console.error("線の色は0~255で指定してください。");
    }
}
function change_fill_color(color_type, e) {
    if (0 <= e.value && e.value < 256) {
        switch (color_type) {
            case "r":
                filling_color.r = e.value;
                break;
            case "g":
                filling_color.g = e.value;
                break;
            case "b":
                filling_color.b = e.value;
                break;
        }
    }
    else {
        console.error("塗りつぶしの色は0~255で指定してください。");
    }
}

canvas_13.addEventListener('mousedown', function (e) {

    mouse_down_f_13 = true;

    first_click_13 = { x: e.offsetX, y: e.offsetY };
    end_click_13 = { x: e.offsetX, y: e.offsetY };
    draw_shape(canvas_13c, shape_form_mode, first_click_13, end_click_13, stroke_color, filling_mode_select, filling_color);

});

canvas_13.addEventListener('mousemove', function (e) {
    if (!mouse_down_f_13) {
        return;
    }

    // キャンバスをコピー
    let copy_image = canvas_14c.getImageData(0, 0, canvas_13.width, canvas_13.height);
    canvas_13c.putImageData(copy_image, 0, 0);

    end_click_13 = { x: e.offsetX, y: e.offsetY };
    draw_shape(canvas_13c, shape_form_mode, first_click_13, end_click_13, stroke_color, filling_mode_select, filling_color);

});

canvas_13.addEventListener('mouseup', function (e) {
    if (!mouse_down_f_13) {
        return;
    }

    end_click_13 = { x: e.offsetX, y: e.offsetY };
    draw_shape(canvas_14c, shape_form_mode, first_click_13, end_click_13, stroke_color, filling_mode_select, filling_color);

    let copy_image = canvas_14c.getImageData(0, 0, canvas_13.width, canvas_13.height);
    canvas_13c.putImageData(copy_image, 0, 0);

    mouse_down_f_13 = false;
});