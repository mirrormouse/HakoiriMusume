import React, { useState, useRef, useEffect } from "react";

/**
 * Hakoiri Musume (Klotski) puzzle component – v3.0
 * ------------------------------------------------------
 * 改修点 (2025-06-23)
 * 1. ドラッグ距離に応じて **1〜3 マス** 自動でスライド。
 *    ドラッグ量しきい値（どちらか軸で判定）：
 *        0.5 マス以上   → 1 マス
 *        1.5 マス以上  → 2 マス（衝突手前まで）
 *        2.5 マス以上  → 3 マス（衝突手前まで）
 * 2. 途中衝突がある場合は、その手前で停止します。
 * 3. その他 API／カスタマイズ方法は変更なし。
 */

const classicConfig = {
  cols: 4,
  rows: 5,
  cellSize: 80,
  pieces: [
    { id: "goal", name: "娘", w: 2, h: 2, row: 0, col: 1, color: "#f9c2d1" },
    { id: "a", name: "兵1", w: 1, h: 2, row: 0, col: 0, color: "#c2d5f9" },
    { id: "b", name: "兵2", w: 1, h: 2, row: 0, col: 3, color: "#c2d5f9" },
    { id: "c", name: "兵3", w: 1, h: 2, row: 2, col: 0, color: "#c2d5f9" },
    { id: "d", name: "兵4", w: 1, h: 2, row: 2, col: 3, color: "#c2d5f9" },
    { id: "e", name: "卒1", w: 1, h: 1, row: 2, col: 1, color: "#f7f3c2" },
    { id: "f", name: "卒2", w: 1, h: 1, row: 2, col: 2, color: "#f7f3c2" },
    { id: "g", name: "卒3", w: 1, h: 1, row: 3, col: 1, color: "#f7f3c2" },
    { id: "h", name: "卒4", w: 1, h: 1, row: 3, col: 2, color: "#f7f3c2" },
  ],
  goalPiece: "goal",
  exit: { row: 4, col: 1 },
};

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

export default function HakoiriMusume({ config = classicConfig }) {
  const [pieces, setPieces] = useState(() => deepClone(config.pieces));
  const boardRef = useRef(null);
  const dragInfo = useRef(null);

  const { cols, rows, cellSize, goalPiece, exit } = config;

  //--------------------------------------------------------------------
  // Utility helpers
  //--------------------------------------------------------------------
  const occupiedGrid = (list) => {
    const g = Array.from({ length: rows }, () => Array(cols).fill(null));
    for (const p of list) {
      for (let r = 0; r < p.h; r++) {
        for (let c = 0; c < p.w; c++) g[p.row + r][p.col + c] = p.id;
      }
    }
    return g;
  };

  const canPlace = (id, newRow, newCol, list = pieces) => {
    const p = list.find((q) => q.id === id);
    if (id === goalPiece && (newRow == exit.row && newCol == exit.col)){
      return true;
    }
    if (
      newRow < 0 ||
      newCol < 0 ||
      newRow + p.h > rows ||
      newCol + p.w > cols
    )
      return false;

    const grid = occupiedGrid(list.filter((x) => x.id !== id));
    for (let r = 0; r < p.h; r++) {
      for (let c = 0; c < p.w; c++) if (grid[newRow + r][newCol + c]) return false;
    }
    return true;
  };

  // 最大 step (±limitCells) 内で衝突手前まで進める
  const maxStepWithin = (id, dirRow, dirCol, limitCells) => {
    const sign = dirRow !== 0 ? Math.sign(dirRow) : Math.sign(dirCol);
    const lim = limitCells;
    let step = 0;
    for (let i = 1; i <= lim; i++) {
      const dR = dirRow !== 0 ? i * sign : 0;
      const dC = dirCol !== 0 ? i * sign : 0;
      const p = pieces.find((x) => x.id === id);
      if (canPlace(id, p.row + dR, p.col + dC)) step = i * sign;
      else break; // 次セル衝突
    }
    return step;
  };

  //--------------------------------------------------------------------
  // Pointer handlers
  //--------------------------------------------------------------------
  const handlePointerDown = (e, id) => {
    const boardRect = boardRef.current.getBoundingClientRect();
    const p = pieces.find((q) => q.id === id);
    dragInfo.current = {
      id,
      boardRect,
      startX: e.clientX,
      startY: e.clientY,
      origRow: p.row,
      origCol: p.col,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = () => {
    /* スライド幅は pointerUp で確定するため、移動中に何もしない */
  };

  const handlePointerUp = (e) => {
    if (!dragInfo.current) return;

    const { id, boardRect, startX, startY, origRow, origCol } = dragInfo.current;
    dragInfo.current = null;

    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    // 判定軸（大きい方）
    const preferH = Math.abs(dx) > Math.abs(dy);
    const rawDist = preferH ? dx : dy; // px
    const sign = Math.sign(rawDist);
    const absCells = Math.abs(rawDist) / cellSize; // 何マス分ドラッグしたか

    let wantCells = 0;
    if (absCells > 2.5) wantCells = 3;
    else if (absCells > 1.5) wantCells = 2;
    else if (absCells > 0.5) wantCells = 1;

    let dRow = 0,
      dCol = 0;
    if (wantCells !== 0) {
      if (preferH) dCol = wantCells * sign;
      else dRow = wantCells * sign;
    }

    // 途中衝突を考慮しつつ制限内で最大移動
    if (dRow !== 0) dRow = maxStepWithin(id, dRow, 0, Math.abs(dRow));
    if (dCol !== 0) dCol = maxStepWithin(id, 0, dCol, Math.abs(dCol));

    const newRow = origRow + dRow;
    const newCol = origCol + dCol;

    if (dRow !== 0 || dCol !== 0) {
      setPieces((old) =>
        old.map((q) => (q.id === id ? { ...q, row: newRow, col: newCol } : q))
      );
    }
  };

  //--------------------------------------------------------------------
  // Victory detection
  //--------------------------------------------------------------------
  useEffect(() => {
    const goal = pieces.find((p) => p.id === goalPiece);
    if (goal.row === exit.row && goal.col === exit.col) {
      alert("🎉 クリア！おめでとうございます！");
    }
  }, [pieces, goalPiece, exit.row, exit.col]);

  //--------------------------------------------------------------------
  // Render
  //--------------------------------------------------------------------
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        ref={boardRef}
        className="relative bg-gray-200 rounded-xl shadow-inner"
        style={{ width: cols * cellSize, height: rows * cellSize }}
      >
        {pieces.map((p) => (
          <div
            key={p.id}
            onPointerDown={(e) => handlePointerDown(e, p.id)}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            className="absolute select-none rounded-lg shadow-md flex items-center justify-center text-lg font-semibold text-gray-800 cursor-grab active:cursor-grabbing"
            style={{
              top: p.row * cellSize,
              left: p.col * cellSize,
              width: p.w * cellSize,
              height: p.h * cellSize,
              backgroundColor: p.color,
              color: p.textColor || "#1f2937",
              transition: "top 0.1s, left 0.1s",
              touchAction: "none",
            }}
          >
            {p.name}
          </div>
        ))}
      </div>

    </div>
  );
}
