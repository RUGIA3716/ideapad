"use strict"
let control_canvas = document.getElementById("control_canvas");
let ccx = control_canvas.getContext('2d');

let save_canvas = document.getElementById("save_canvas");
let scx = save_canvas.getContext('2d');

let canvas_mouse_down = false;

/**任意の二次元座標を保管します。
  */
class Point2D {
    /**
     * @type {int}
     */
    static #cid = 0;
    #id;

    /**
     * @type {double}
     */
    #x;
    #y;

    /**
     * 色の設定
     * @type {Object}
     */
    #color
    /**
     * @type {Coordinate}
     */
    #coordinate;

    /**
     * @type {RenderCanvasPoint2D}
     */
    #renderCanvasPoint2D;

    /** 
     * double x , double y
     * @param {double} x double
     * @param {double} y double
     */
    constructor({ x = 0.0, y = 0.0 }) {
        this.#x = x;
        this.#y = y;
        this.#id = ++Point2D.#cid;
    }
    /**
     * 保存されているxを取得
     * @return {double}
     */
    x() {
        return this.#x;
    }
    /**
     * 保存されているyを取得
     * @return {double}
     */
    y() {
        return this.#y;
    }
    /**
     * 保存されているxを整数で取得
     * @return {int}
     */
    ix() {
        return Math.round(this.#x);
    }
    /**
     * 保存されているyを整数で取得
     * @return {int}
     */
    iy() {
        return Math.round(this.#y);
    }

    /**
     * @param {CoordinateList} CoordinateList 描かれているドットがどの座標と紐づいているかを保管する
     */
    set_coordinate(CoordinateList, index) {
        this.#coordinate = CoordinateList.get({ x: this.ix(), y: this.iy() });
        CoordinateList.addPoint({ point: this, index: index });
    }
    /**
     * @param {Coordinate} coordinate このドットがどの座標と紐づいているかを取得する
     */
    coordinate() {
        return this.#coordinate;
    }
    /**
     * 
     * @param {RenderCanvasPoint2D} RenderCanvasPoint2D 
     */
    set_renderCanvaspoint2D(RenderCanvasPoint2D) {
        this.#renderCanvasPoint2D = RenderCanvasPoint2D;
    }
    getId() {
        return this.#id;
    }

}

/**
 * マウスの座標を保管します。
 */
class MousePoint extends Point2D {
    /** 
     * double x , double y
     * @param {double} x double
     * @param {double} y double
     */
    constructor({ x = 0.0, y = 0.0 }) {
        super({ x: x, y: y });
    }
}
/**
 * CANVASに描いた場所を整数(ドット単位)で記録します。
 */
class RenderCanvasPoint2D {
    // 図形が図形を内包できるようにしたい...
    // 図形を持つか、座標の集合を持つかどちらかを設定する。
    /**
     * ClassTypeを設定
     * @type {int}
     */
    ClassType;
    /**
     * ClassTypeの候補
     * @type {Object}
     */
    static ENUMCLASSTYPE = { shape: 1, collection: 2 };
    /**
     * @type {Point2D[]}
     */
    #Point2D = [];
    /**
     * この軌跡情報から行動履歴を探れるようにポインタを渡す
     */
    #activity;
    // 複数の図形を持つことができるため、座標の集合体の設定を複数できるようにする。
    /**
     * この線の主要な座標位置を記録
     * @type {RenderCanvasPoint2D[]}
     */
    #shapes_detail = [];
    #shapes_length = [];
    // 図形の記録をする場合にこちらを使う
    /**
     * この線の集合の種類を記録
     * @type {string[]}
     */
    #shape_type = [];
    /**
     * この図形の主要な座標位置を記録
     * @type {int[]}
     */
    #shape_detail = [];
    // 特に初回で指定する必要はない。

    /**
     * @param {int} 含まれているパスや図形の長さを表します。
     */
    #path_length = 0;
    /** 
     * @param {string} CpassType 軌跡を追加します。
     */
    constructor({ CpassType }) {
        if (typeof CpassType == "undefined") {
            return;
        }
        this.CpassType = CpassType;
    }
    setType(type) {
        this.ClassType = type;
    }
    setShape(shape_type) {
        this.#shape_type = shape_type;
    }
    setShapeDetail(shape_detail) {
        this.#shape_detail = shape_detail;

    }

    setShapes(shape_type) {
        this.#shape_type = shape_type;

    }
    /**
     * 
     * @param {RenderCanvasPoint2D} shape_detail 
     */
    setShapesDetail(shape_detail) {
        this.#shapes_detail.push(shape_detail);
        this.#shapes_length.push(shape_detail.Pathlength());
    }

    getShape() {
        return this.#shape_type;
    }
    /**
     * このクラスのタイプを図形集合か図形自体かの設定ができます。
     */
    /** 
     * @param {Point2D} CanvasPoint 軌跡を追加します。
     */
    addPoint({ CanvasPoint = new Point2D({}) }) {
        if (this.ClassType == RenderCanvasPoint2D.ENUMCLASSTYPE.collection) {
            console.warn("RenderCanvasPoint2D:図形集合タイプに図形詳細情報を追記することはできません。");
            return;
        }

        CanvasPoint.set_renderCanvaspoint2D(this);
        this.#Point2D.push(CanvasPoint);
    }
    /** 
     * @param {Point2D} CanvasPoint 軌跡をまとめて追加します。
     */
    addPath({ CanvasPoints = [new Point2D({})] }) {
        if (this.ClassType == RenderCanvasPoint2D.ENUMCLASSTYPE.collection) {
            console.warn("RenderCanvasPoint2D:図形集合タイプに図形詳細情報を追記することはできません。");
            return;
        }

        Path_length = CanvasPoints.length;
        for (let i = 0; i < Path_length; ++i) {
            this.addPoint({ CanvasPoint: CanvasPoints[i] });
        }
    }

    /** 
     * @param {Point2D} CanvasPoint 軌跡をまとめて追加します。
     */
    addRenderCanvasPath({ RenderCanvasPoint }) {
        if (this.ClassType == RenderCanvasPoint2D.ENUMCLASSTYPE.collection) {
            console.warn("RenderCanvasPoint2D:図形集合タイプに図形詳細情報を追記することはできません。");
            return;
        }
        let Path_length = RenderCanvasPoint.Pathlength();
        for (let i = 0; i < Path_length; ++i) {
            this.addPoint({ CanvasPoint: RenderCanvasPoint.Point2D(i) });
        }
    }

    /** 
     * @param {Point2D} CanvasPoint 軌跡をまとめて追加します。
     */
    addRenderCanvasPath({ RenderCanvasPoint }) {
        if (this.ClassType == RenderCanvasPoint2D.ENUMCLASSTYPE.collection) {
            console.warn("RenderCanvasPoint2D:図形集合タイプに図形詳細情報を追記することはできません。");
            return;
        }
        let Path_length = RenderCanvasPoint.Pathlength();
        for (let i = 0; i < Path_length; ++i) {
            this.addPoint({ CanvasPoint: RenderCanvasPoint.Point2D(i) });
        }
    }

    /** 
     * @param {RenderCanvasPoint2D} RenderCanvasPoint 図形情報を追加します。図形詳細タイプだけではなく、図形集合タイプの統合も可能です。
     */
    addRenderCanvasShape({ RenderCanvasPoint }) {
        if (this.ClassType == RenderCanvasPoint2D.ENUMCLASSTYPE.shape) {
            console.warn("RenderCanvasPoint2D:図形詳細タイプに図形情報を追記することはできません。");
            return;
        }

    }

    /**
     * 保存されているPointを取得
     * @param {int} index 記録されているポイントの番数を指定
     * @return {double}
     */
    Point2D(index) {
        if (this.ClassType == RenderCanvasPoint2D.ENUMCLASSTYPE.collection) {
            for (let i = 0; i < this.#shapes_detail.length; ++i) {
                // 長さを確認
                if (this.#shapes_length[i] > index) {
                    return this.#shapes_detail[i].Point2D(index);
                }
                else {
                    index -= this.#shapes_length[i];
                }
            }
        }
        if (this.ClassType == RenderCanvasPoint2D.ENUMCLASSTYPE.shape) {
            return this.#Point2D[index];
        }
    }
    Pathlength() {
        if (this.ClassType == RenderCanvasPoint2D.ENUMCLASSTYPE.collection) {
            let sum = 0;
            for (let i = 0; i < this.#shapes_length.length; ++i) {
                sum += this.#shapes_length[i];
            }
            return sum;
        }
        if (this.ClassType == RenderCanvasPoint2D.ENUMCLASSTYPE.shape) {
            return this.#Point2D.length;
        }
        else {
            return this.#Point2D.length;

        }
    }
    activity() {
        return this.#activity;
    }
    set_activity(activity) {
        this.#activity = activity;
    }
    /**
     * 
     * @param {CoordinateList} coordinateList 
     * @param {int} index 
     */
    set_coordinate(coordinateList, index) {
        // 所有しているリストに対してすべて適応する
        if (this.ClassType == RenderCanvasPoint2D.ENUMCLASSTYPE.collection) {
            let sl = this.#shapes_detail.length;
            for (let i = 0; i < sl; ++i) {
                let buffer = this.#shapes_detail[i];
                buffer.set_coordinate(coordinateList, index);
            }
        }
        else {
            let pl = this.Pathlength();
            for (let i = 0; i < pl; ++i) {
                this.#Point2D[i].set_coordinate(coordinateList, index);
            }
        }
    }
}

/**
 * 特定の座標にあるドットと履歴の管理 キャンバスに最適化しているので整数のみ
 */
class Coordinate {
    /**
     * @type {int}
     */
    static #cid = 0;
    #id;

    /**
     * @type {Point2D[]}
     */
    #PointList = [];
    /**
     * @type {CoordinateList}
     */
    #Parent;

    /**
     * @type {int}
     */
    #x;
    #y;

    /**
     * この座標がどこにあるのかを設定
     * @param {int} x  
     * @param {int} y  
     */
    constructor({ x, y }) {
        this.#x = x;
        this.#y = y;
        this.#id = ++Coordinate.#cid;
    }
    /**
     * 
     * @param {Point2D} point この座標にあるドットの追加。
     */
    addPoint({ point = new Point2D({}), index = 0 }) {
        this.#PointList[index] = point;
    }
    /**
     * この座標に設定されているポイント設定を参照します。
     * @returns {Point2D[]}
     */
    getPoint() {
        return this.#PointList;
    }
    getParent() {
        return this.#Parent;
    }
    setParent({ CoordinateList }) {
        this.#Parent = CoordinateList;
    }

}

class CoordinateList {
    /**
     * @type {Coordinate[][]}
     */
    #CoordinateList = [];
    /**
     * この座標がどこにあるのかを設定
     * @param {int} x  
     * @param {int} y  
     */
    constructor({ width = 0, height = 0 }) {
        for (let x = 0; x < width; ++x) {
            this.#CoordinateList[x] = [];
            for (let y = 0; y < height; ++y) {
                this.#CoordinateList[x][y] = new Coordinate({ x: x, y: y });
                this.#CoordinateList[x][y].setParent({ CoordinateList: this });
            }
        }
    }
    /**
     * @param {Point2D} point この座標にあるドットの追加。
     */
    addPoint({ point = new Point2D({}), index = 0 }) {
        this.#CoordinateList[point.x()][point.y()].addPoint({ point: point, index: index });
    }

    /**
     * 座標リストから特定の座標情報を取得
     * @param {int} x 
     * @param {int} y 
     */
    get({ x, y }) {
        return this.#CoordinateList[x][y];
    }
}
class Activity {
    /**
     * 
     * @param {string} activity 
     * @param {int} index 
     * @param {RenderCanvasPoint2D} RenderCanvasPoint2D 
     * @param {Array} parent 
     */
    constructor({ activity, index, RenderCanvasPoint2D, parent }) {
        this.activity = activity;
        this.index = index;
        this.RenderCanvasPoint = RenderCanvasPoint2D;
        this.RenderCanvasPoint.set_activity(this);
        this.parent = parent;
    }
    /**
     * 
     * @returns {RenderCanvasPoint2D}
     */
    getRenderCanvas() {
        return this.RenderCanvasPoint;
    }
}
// 始点と終点を管理
let first_click = new MousePoint({});
let end_click = new MousePoint({});

// 軌跡を管理
let move_click = [];
let move_click_num = 0;


// 要保管 -> クラス化する可能性高
/**
 * @type {Activity[]}
 */
let activity_list = [];
let current_activity_num = 0;
let max_activity_num = 0;

let rectangular_coordinate = new CoordinateList({ width: 1280, height: 720 });

console.log(rectangular_coordinate);



control_canvas.addEventListener('mousedown', function (e) {
    // マウスが押されたことを保存。
    canvas_mouse_down = true;

    // first_click = new MousePoint({ x: e.offsetX, y: e.offsetY });

    // 終点の座標が空だと不具合が起きる可能性があるので仮発行
    end_click = new MousePoint({ x: e.offsetX, y: e.offsetY });
    // 初期化
    move_click = [];
    move_click_num = 0;

    // 軌跡追加
    move_click.push(new MousePoint({ x: e.offsetX, y: e.offsetY }));
    ++move_click_num;
    // 直接ペンで引くという意味でDraw。描画にはRenderを使用する。
    draw_line(move_click, move_click_num);

});

control_canvas.addEventListener('mousemove', function (e) {
    // マウスが押されていない場合は実行しない。
    if (!canvas_mouse_down) {
        return;
    }

    move_click.push(new MousePoint({ x: e.offsetX, y: e.offsetY }));
    ++move_click_num;

    draw_line(move_click, move_click_num);
});

control_canvas.addEventListener('mouseup', function (e) {
    if (!canvas_mouse_down) {
        return;
    }
    move_click.push(new MousePoint({ x: e.offsetX, y: e.offsetY }));
    ++move_click_num;

    let copy_image = scx.getImageData(0, 0, save_canvas.width, save_canvas.height);
    ccx.putImageData(copy_image, 0, 0);

    canvas_mouse_down = false;

    render_line(move_click, move_click_num);
});

let current_mode = "shape";
let current_detail = "free_line";

function set_mode(mode, detail) {
    current_mode = mode;
    current_detail = detail;
}

function draw_line(move_point, move_num) {
    ccx.beginPath();

    let prev_point = 1;
    // 軌跡が複数ある場合は最後から2番目と最後を描画
    if (move_num > 1) {
        prev_point = 2;
    }
    // 軌跡が一つの場合は最後から最後を描画
    else {
        prev_point = 1;
    }
    if (current_detail == "free_line") {
        ccx.moveTo(move_point[move_num - prev_point].ix(), move_point[move_num - prev_point].iy());
        ccx.lineTo(move_point[move_num - 1].ix(), move_point[move_num - 1].iy());
    }
    if (current_detail == "rect") {
        let copy_image = scx.getImageData(0, 0, save_canvas.width, save_canvas.height);
        ccx.putImageData(copy_image, 0, 0);
        canvas_draw_rect(ccx, move_point);

    }
    ccx.stroke();
}


function render_line(move_point, move_num) {
    console.log("レンダリング開始");
    // まず、軌跡の一つ一つを直線のドットに変換
    // マウスダウンとマウスアップで必ず二つ以上の軌跡があるため、一つの場合は考慮しなくてよい。
    let final_render_path = new RenderCanvasPoint2D({});
    console.log("整数補正開始");
    let shape_detail = [];
    if (current_detail == "free_line") {
        // 補正実行
        shape_detail.push(move_point[0]);
        for (let i = 1; i < move_num; ++i) {

            let first_point = move_point[i - 1];
            let next_point = move_point[i];
            shape_detail.push(next_point);
            final_render_path.setShapesDetail(line_collection(first_point, next_point));
        }
    }
    if (current_detail == "rect") {
        // 補正実行
        let first_point = move_point[0];
        let final_point = move_point[move_point.length - 1];

        let next_point1 = new Point2D({ x: first_point.x(), y: first_point.y() });
        let next_point2 = new Point2D({ x: final_point.x(), y: first_point.y() });
        shape_detail.push(next_point1);
        shape_detail.push(next_point2);

        final_render_path.setShapesDetail(line_collection(next_point1, next_point2));

        next_point1 = new Point2D({ x: final_point.x(), y: first_point.y() });
        next_point2 = new Point2D({ x: final_point.x(), y: final_point.y() });
        shape_detail.push(next_point2);

        final_render_path.setShapesDetail(line_collection(next_point1, next_point2));

        next_point1 = new Point2D({ x: final_point.x(), y: final_point.y() });
        next_point2 = new Point2D({ x: first_point.x(), y: final_point.y() });
        shape_detail.push(next_point2);

        final_render_path.setShapesDetail(line_collection(next_point1, next_point2));

        next_point1 = new Point2D({ x: first_point.x(), y: final_point.y() });
        next_point2 = new Point2D({ x: first_point.x(), y: first_point.y() });
        shape_detail.push(next_point2);

        final_render_path.setShapesDetail(line_collection(next_point1, next_point2));
    }
    // 塗りつぶし
    if (true) {

    }

    final_render_path.setType(RenderCanvasPoint2D.ENUMCLASSTYPE.collection);
    final_render_path.setShape(current_detail);
    final_render_path.setShapeDetail(shape_detail)

    // 座標の紐づけ
    final_render_path.set_coordinate(rectangular_coordinate, current_activity_num);

    let Path_length = final_render_path.Pathlength();
    console.log("レンダリング開始 : " + Path_length);
    console.log("パス数 : " + Path_length);
    for (let i = 0; i < Path_length; ++i) {
        scx.strokeStyle = "rgb(0, 0, 0)";
        scx.fillRect(final_render_path.Point2D(i).x(), final_render_path.Point2D(i).y(), 1, 1);
    }

    // コントロールキャンバスへ反映
    console.log("レンダリング完了。メインキャンバスへ反映");
    let copy_image = scx.getImageData(0, 0, save_canvas.width, save_canvas.height);
    ccx.putImageData(copy_image, 0, 0);

    // アクティビティへ追加
    activity_list.push(new Activity({ Activity: current_mode, index: current_activity_num, RenderCanvasPoint2D: final_render_path, parent: activity_list }));
    ++current_activity_num;

    console.log(activity_list);
    return;
}
/**
 * 軌跡補完
 * @param {*} first_point 
 * @param {*} next_point 
 * @param {*} path 
 */
function line_collection(first_point, next_point) {
    let int_path = new RenderCanvasPoint2D({});
    // 距離を算出
    let dx = first_point.ix() - next_point.ix();
    let dy = first_point.iy() - next_point.iy();
    // より距離の長いほうを採用
    let sum_d = Math.abs(dx) > Math.abs(dy) ? Math.abs(dx) : Math.abs(dy);
    sum_d == 0 ? 1 : sum_d;
    let shape_detail = [];
    for (let j = 0; j <= sum_d; ++j) {
        let point = new Point2D({
            x: (first_point.ix() - (dx ? Math.round((j * (dx / sum_d))) : 0)),
            y: (first_point.iy() - (dy ? Math.round((j * (dy / sum_d))) : 0)),
        })
        int_path.addPoint({ CanvasPoint: point });
        shape_detail.push(point);
    }

    int_path.setType(RenderCanvasPoint2D.ENUMCLASSTYPE.shape);
    int_path.setShape("line");
    int_path.setShapeDetail(shape_detail);
    return int_path;
}
let timelaps_play = false;
let timelaps_button;
let timelaps_fps = 3;
function start_taimelaps(e) {
    if (activity_list.length == 0) {
        return;
    }
    timelaps_button = e;
    e.disabled = true;
    timelaps_play = true;

    // コントロールキャンバスを初期化
    ccx.fillStyle = "rgb(255, 255, 255)";
    ccx.fillRect(0, 0, control_canvas.width, control_canvas.height);

    setTimeout(render_timelaps, timelaps_fps, 0, 0)
}
let all_timelaps_start_count = 0;
let all_timelaps_start_limit = 2;

let timelaps_all_play = false;
let timelaps_all_button;

function start_taimelaps_all(e) {
    if (activity_list.length == 0) {
        return;
    }
    timelaps_all_button = e;
    e.disabled = true;
    timelaps_all_play = true;

    // コントロールキャンバスを初期化
    ccx.fillStyle = "rgb(255, 255, 255)";
    ccx.fillRect(0, 0, control_canvas.width, control_canvas.height);

    all_timelaps_start_count = 0;
    for (let i = 0; i < all_timelaps_start_limit && i < current_activity_num; ++i) {
        setTimeout(render_timelaps_all, timelaps_fps, i, 0, 0)
    }
}

function render_timelaps(activity_num, path_num) {
    let rcp2d = activity_list[activity_num].getRenderCanvas();
    let rcp2d_p2d = rcp2d.Point2D(path_num);
    let rc2dp_path_num = rcp2d.Pathlength();


    // コントロールキャンバスに描画    
    ccx.fillStyle = "rgb(0, 0, 0)";
    ccx.strokeStyle = "rgb(0, 0, 0)";
    ccx.fillRect(rcp2d_p2d.ix(), rcp2d_p2d.iy(), 1, 1);

    // 描画後、継続・次のアクティビティへ移る・終了を判定
    // 今回が最後のパスの場合
    if (path_num + 1 >= rc2dp_path_num) {
        // 次のアクティビティへ移行
        // アクティビティが残っている場合
        console.log("activity_num : " + activity_num + "   current activity num : " + current_activity_num);
        if (current_activity_num > activity_num + 1) {
            setTimeout(render_timelaps, timelaps_fps * 20, ++activity_num, 0)
            return;
        }
        else {
            // 終了
            timelaps_button.disabled = false;
            timelaps_play = false;
            return;
        }
    }
    else {
        for (let i = 0; i < 10; ++i) {
            if (rc2dp_path_num >= path_num + 5) {
                rcp2d_p2d = rcp2d.Point2D(path_num + 1);
                ccx.fillRect(rcp2d_p2d.ix(), rcp2d_p2d.iy(), 1, 1);
                ++path_num;
            }
            else {
                break;
            }
        }
        setTimeout(render_timelaps, timelaps_fps, activity_num, ++path_num)
        return;
    }
}

function render_timelaps_all(activity_num, path_num, accel) {
    let rcp2d = activity_list[activity_num].getRenderCanvas();
    let rcp2d_p2d = rcp2d.Point2D(path_num);
    let rc2dp_path_num = rcp2d.Pathlength();


    // コントロールキャンバスに描画    
    ccx.fillStyle = "rgb(0, 0, 0)";
    ccx.strokeStyle = "rgb(0, 0, 0)";
    ccx.fillRect(rcp2d_p2d.ix(), rcp2d_p2d.iy(), 1, 1);

    // 描画後、継続・次のアクティビティへ移る・終了を判定
    // 今回が最後のパスの場合
    if (path_num + 1 >= rc2dp_path_num) {
        // 次のアクティビティへ移行
        // アクティビティが残っている場合
        // console.log("activity_num : " + activity_num + "   current activity num : " + current_activity_num);
        ++all_timelaps_start_count;

        if (current_activity_num > all_timelaps_start_count - 1) {
            setTimeout(render_timelaps_all, timelaps_fps * 10, all_timelaps_start_count - 1, 0, 0)
        }
        if (current_activity_num > all_timelaps_start_count) {
            setTimeout(render_timelaps_all, timelaps_fps * 10, all_timelaps_start_count, 0, 0)
        }

    }
    else {
        for (let i = 0; i < accel; ++i) {
            if (rc2dp_path_num >= path_num + 5) {
                rcp2d_p2d = rcp2d.Point2D(path_num + 1);
                ccx.fillRect(rcp2d_p2d.ix(), rcp2d_p2d.iy(), 1, 1);
                ++path_num;
            }
            else {
                break;
            }
        }
        setTimeout(render_timelaps_all, timelaps_fps, activity_num, ++path_num, accel + 0.1)
    }
    // すべてのタイムラプスが終了したら完全停止。
    if (all_timelaps_start_count == current_activity_num) {
        // 終了
        timelaps_all_button.disabled = false;
        timelaps_all_play = false;
    }
}
/**
 * 
 * @param {Point2D} start_point 
 * @param {Point2D} end_point 
 * @param {string} priority 
 * @param {boolean} revision 
 * @returns 
 */
function line_between(start_point, end_point, priority, revision) {
    let line_x = start_point.ix() - end_point.ix();
    let line_y = start_point.iy() - end_point.iy();
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
    return new Point2D({ x: line_x, y: line_y });
}
// 図形の線描画と、色の設定描画実行などを分けて一つのライブラリとして設計するとよさそう。
// 最終的に描画のアクティビティと図形の座標を別途専用のクラスで保存しておく必要があるか。
/**
 * 四角形の描画を行う。マウスの軌跡の最初と最後を自動的に読み取り変換
 * @param {*} canvas_c 
 * @param {Point2D[]} move_point 
 */
function canvas_draw_rect(canvas_c, move_point) {
    // 始点から終点までの横幅、縦幅のみを求める。
    let line_b = line_between(move_point[0], move_point[move_point.length - 1]);
    let start_point = move_point[0];
    // 描画開始
    canvas_c.moveTo(start_point.ix(), start_point.iy());
    canvas_c.lineTo(start_point.ix() - line_b.ix(), start_point.iy());
    canvas_c.lineTo(start_point.ix() - line_b.ix(), start_point.iy() - line_b.iy());
    canvas_c.lineTo(start_point.ix(), start_point.iy() - line_b.iy());
    canvas_c.lineTo(start_point.ix(), start_point.iy());
}
function save_project() {
    console.log(activity_list);
    console.log(rectangular_coordinate);
    let str = "";
    str += "activity{";
    for (let i = 0; i < activity_list.length; ++i) {
        str += "0:{";
        for (let j = 0; j < activity_list[i].getRenderCanvas().Pathlength(); ++j) {
            str += "1:{id:" + activity_list[i].getRenderCanvas().Point2D(j).getId() + "x:" + activity_list[i].getRenderCanvas().Point2D(j).x() + "y:" + activity_list[i].getRenderCanvas().Point2D(j).y() + "}";
        }
        str += "},";
    }
    console.log(str);
    sessionStorage.setItem('test', activity_list);
    let test = sessionStorage.getItem('test');
    console.log(JSON.parse(test));
}
let check_box_layer_buffer = [];
let check_box_list = [];
function check_box_old(e) {
    console.log(rectangular_coordinate);
    // バッファレイヤを初期化
    for (let x = 0; x < 1280; ++x) {
        check_box_layer_buffer[x] = [];
        for (let y = 0; y < 720; ++y) {
            let c = rectangular_coordinate.get({ x: x, y: y });
            // 線があれば10を入れる
            if (c.getPoint().length != 0) {
                check_box_layer_buffer[x][y] = 10;
            }
            else {
                check_box_layer_buffer[x][y] = 0;
            }
        }
    }

    let buffer_i = [];
    let buffer_k = [];

    for (let x = 1; x < 1279; ++x) {
        for (let y = 1; y < 719; ++y) {
            // 現在の一つ上、一つ左を取得
            let up = check_box_layer_buffer[x][y - 1];
            let left = check_box_layer_buffer[x - 1][y];

            // どちらにも線があれば囲まれている判定にする。
            if (up > 0 && left > 0) {
                console.log("左上 - 判定");
                check_box_layer_buffer[x][y] += 3;
            }
            let plus_flag = false;
            for (let i = 0; i < buffer_i.length; ++i) {
                if (buffer_i[i] == check_box_layer_buffer[x][y]) {
                    ++buffer_k[i];
                    plus_flag = true;
                }
            }
            if (!plus_flag) {
                buffer_i.push(check_box_layer_buffer[x][y]);
                buffer_k.push(0);
            }
        }
    }
    console.log(buffer_i);
    console.log(buffer_k);


    buffer_i = [];
    buffer_k = [];
    for (let x = 1278; x > 0; --x) {
        for (let y = 718; y > 0; --y) {
            // 現在の一つ上、一つ左を取得
            let right = check_box_layer_buffer[x + 1][y];
            let down = check_box_layer_buffer[x][y + 1];

            // どちらにも線があれば囲まれている判定にする。
            if (down > 4 && right > 4) {
                console.log("右下 - 判定");
                check_box_layer_buffer[x][y] += 5;
            }
            // 該当の箇所に判定のフラグがあれば消した履歴を残す
            else {
                if (check_box_layer_buffer[x][y] == 3) {
                    check_box_layer_buffer[x][y] -= 1;
                }
            }
            // 外
            if (check_box_layer_buffer[x][y] == 0) {
                ccx.fillStyle = "rgb(230, 255, 230)";
                ccx.strokeStyle = "rgb(230, 255, 230)";
            }

            // 左上からの判定 -> 取り消し
            else if (check_box_layer_buffer[x][y] == 2) {
                ccx.fillStyle = "rgb(255, 230, 230)";
                ccx.strokeStyle = "rgb(255, 230, 230)";
            }
            // 右下からの判定
            else if (check_box_layer_buffer[x][y] == 5) {
                ccx.fillStyle = "rgb(230, 230, 255)";
                ccx.strokeStyle = "rgb(230, 230, 255)";
            }
            // 内予定
            else if (check_box_layer_buffer[x][y] == 8) {
                ccx.fillStyle = "rgb(128, 128, 128)";
                ccx.strokeStyle = "rgb(128, 128, 128)";
            }
            // 線
            else {
                ccx.fillStyle = "rgb(255, 0, 0)";
                ccx.strokeStyle = "rgb(255, 0, 0)";
            }
            ccx.fillRect(x, y, 1, 1);
            let plus_flag = false;
            for (let i = 0; i < buffer_i.length; ++i) {
                if (buffer_i[i] == check_box_layer_buffer[x][y]) {
                    ++buffer_k[i];
                    plus_flag = true;
                }
            }
            if (!plus_flag) {
                buffer_i.push(check_box_layer_buffer[x][y]);
                buffer_k.push(0);
            }
        }
    }
    console.log(buffer_i);
    console.log(buffer_k);
}
function check_box(e) {
    // グループリスト 0 は使わない
    let group_code = [0, [], []];
    let color_code = [0, { r: 0, g: 0, b: 0 }, { r: 255, g: 255, b: 255 }];

    // バッファレイヤを初期化
    for (let x = 0; x < 1280; ++x) {
        check_box_layer_buffer[x] = [];
        for (let y = 0; y < 720; ++y) {
            let c = rectangular_coordinate.get({ x: x, y: y });
            // 壁は 1 で埋める
            if (c.getPoint().length != 0) {
                check_box_layer_buffer[x][y] = 1;
            }
            // 外辺は 2 で埋める
            else if (x == 0 || y == 0) {
                check_box_layer_buffer[x][y] = 2;
            }
            else if (x == 1280 || y == 719) {
                check_box_layer_buffer[x][y] = 2;
            }
            else {
                // ベースは0
                check_box_layer_buffer[x][y] = 0;
                // 埋まっていない候補をリストに入れる
                check_box_list.push({ x: x, y: y });
            }
        }
    }

    // 数値グループ化方
    // あるマスの上下左右を見て、その中で一番小さい数字を自身の数値とする。
    // 周りに数字がない場合は自身に新しい一番小さい数字を割り当てる。

    // また、小さい数字と大きい数字があった場合、それらのペアを台帳に記録する。
    // もしくは、大きい数字を持っているグループを自身の数字で上書きする。
    // 一番外辺を一番小さい数字に設定する。
    // 外辺とペアになったことのある数字を

    let min_num = 2;
    for (let x = 1; x < 1279; ++x) {
        for (let y = 1; y < 719; ++y) {
            if (check_box_layer_buffer[x][y] == 1) {
                continue;
            }
            let up = check_box_layer_buffer[x][y - 1];
            let left = check_box_layer_buffer[x - 1][y];
            let right = check_box_layer_buffer[x + 1][y];
            let down = check_box_layer_buffer[x][y + 1];
            let changed = false;
            // 外辺の場合、自身をその数字に変える
            changed = compare_check_box(up, group_code, changed);
            changed = compare_check_box(left, group_code, changed);
            changed = compare_check_box(right, group_code, changed);
            changed = compare_check_box(down, group_code, changed);

            // 変化がなかった場合、新しい数字を割り当てる
            if (!changed) {
                ++min_num;
                group_code[min_num] = [];
                changed = min_num;

                // 色
                let r, g, b;
                r = Math.random() * 256;
                g = Math.random() * 256;
                b = Math.random() * 256;
                color_code[min_num] = { r: r, g: g, b: b };
            }
            // 変更した数字を入れる
            group_code[changed].push({ x: x, y: y });
            check_box_layer_buffer[x][y] = changed;

            let cc = color_code[changed];
            ccx.fillStyle = "rgb(" + (cc.r) + "," + (cc.g) + "," + (cc.b) + ")";

            ccx.fillRect(x, y, 1, 1);
        }
    }
    for (let i = 1; i < group_code.length; ++i) {
        // グループIDが残っていた場合表示
        if (group_code[i].length != 0) {
            console.log(" グループコード : " + i + "  グループ規模 : " + group_code[i].length);
        }
    }
    for (let x = 1; x < 1279; ++x) {
        for (let y = 1; y < 719; ++y) {

            let cc = color_code[check_box_layer_buffer[x][y]];
            ccx.fillStyle = "rgb(" + (cc.r) + "," + (cc.g) + "," + (cc.b) + ")";

            ccx.fillRect(x, y, 1, 1);
        }
    }
    return;
    for (let x = 1278; x > 0; --x) {
        for (let y = 718; y > 0; --y) {


            // どちらにも線があれば囲まれている判定にする。
            if (down > 4 && right > 4) {
                console.log("右下 - 判定");
                check_box_layer_buffer[x][y] += 5;
            }
            // 該当の箇所に判定のフラグがあれば消した履歴を残す
            else {
                if (check_box_layer_buffer[x][y] == 3) {
                    check_box_layer_buffer[x][y] -= 1;
                }
            }
            // 外
            if (check_box_layer_buffer[x][y] == 0) {
                ccx.fillStyle = "rgb(230, 255, 230)";
                ccx.strokeStyle = "rgb(230, 255, 230)";
            }

            // 左上からの判定 -> 取り消し
            else if (check_box_layer_buffer[x][y] == 2) {
                ccx.fillStyle = "rgb(255, 230, 230)";
                ccx.strokeStyle = "rgb(255, 230, 230)";
            }
            // 右下からの判定
            else if (check_box_layer_buffer[x][y] == 5) {
                ccx.fillStyle = "rgb(230, 230, 255)";
                ccx.strokeStyle = "rgb(230, 230, 255)";
            }
            // 内予定
            else if (check_box_layer_buffer[x][y] == 8) {
                ccx.fillStyle = "rgb(128, 128, 128)";
                ccx.strokeStyle = "rgb(128, 128, 128)";
            }
            // 線
            else {
                ccx.fillStyle = "rgb(255, 0, 0)";
                ccx.strokeStyle = "rgb(255, 0, 0)";
            }
            ccx.fillRect(x, y, 1, 1);
            let plus_flag = false;
            for (let i = 0; i < buffer_i.length; ++i) {
                if (buffer_i[i] == check_box_layer_buffer[x][y]) {
                    ++buffer_k[i];
                    plus_flag = true;
                }
            }
            if (!plus_flag) {
                buffer_i.push(check_box_layer_buffer[x][y]);
                buffer_k.push(0);
            }
        }
    }
    console.log(buffer_i);
    console.log(buffer_k);
}

function compare_check_box(target, group, changed) {
    if (target > 1) {
        // 変更済みの場合
        if (changed) {
            // 変更した数字と同じ場合
            if (changed == target) {
                // 反映済みなのでなにもしない
            }
            // 異なる場合
            else {
                let max, min;
                // より小さいほうを設定する
                if (changed > target) {
                    max = changed;
                    min = target;
                }
                else {
                    max = target;
                    min = changed;
                }
                // max のほうが大きいので、 max は消去し、 min に置き換える
                let change_length = group[max].length;
                for (let i = 0; i < change_length; ++i) {
                    let buffer_changed = group[max].shift();
                    check_box_layer_buffer[buffer_changed.x][buffer_changed.y] = min;
                    group[min].push(buffer_changed);
                }
                changed = min;
            }
        }
        changed = target;
    }
    return changed;
}