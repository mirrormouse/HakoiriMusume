import React from "react";
import HakoiriMusume from "./HakoiriMusume.jsx";
import "./index.css";

function App() {


const myPuzzle ={
  cols: 6,
  rows: 5,
  cellSize: 80,
  //父母は青色、大番頭と番頭は緑色、祖父母は黄色、その他は白色
  //青色：f9c2d1、緑色：c2d5f9、黄色：f7f3c2、白色：ffffff
  pieces: [
    { id: "goal", name: "娘", w: 2, h: 2, row: 0, col: 3, color: "#f9c2d1" },
    { id: "a",    name: "父",    w: 1, h: 2, row: 0, col: 2, color: "#c2d5f9" },
    { id: "b",    name: "母",    w: 1, h: 2, row: 0, col: 5, color: "#c2d5f9" },
    { id: "c",    name: "大番頭", w: 4, h: 1, row: 2, col: 2, color: "#c2f4c2" },
    { id: "d",    name: "手代",  w: 1, h: 1, row: 2, col: 1, color: "#fff9c2" },
    { id: "e",    name: "丁稚",  w: 1, h: 1, row: 2, col: 0, color: "#fff9c2" },
    { id: "f",    name: "丁稚",  w: 1, h: 1, row: 3, col: 0, color: "#fff9c2" },
    { id: "g",    name: "番頭",  w: 2, h: 1, row: 3, col: 1, color: "#c2f4c2" },
    { id: "h",    name: "女中",  w: 2, h: 1, row: 3, col: 3, color: "#c2f4c2" },
    { id: "i",    name: "兄嫁",  w: 1, h: 1, row: 3, col: 5, color: "#fff9c2" },
    { id: "j",    name: "番犬",  w: 1, h: 1, row: 4, col: 0, color: "#fff9c2" },
    { id: "k",    name: "祖父",  w: 2, h: 1, row: 4, col: 1, color: "#f9e2c2" },
    { id: "l",    name: "祖母",  w: 2, h: 1, row: 4, col: 3, color: "#f9e2c2" },
    { id: "m",    name: "丁稚",  w: 1, h: 1, row: 4, col: 5, color: "#fff9c2" },
  ],
  goalPiece: "goal",
  exit: { row: 4, col: 2 },
};

const godPuzzle ={
  cols: 6,
  rows: 5,
  cellSize: 80,
  //父母は青色、大番頭と番頭は緑色、祖父母は黄色、その他は白色
  //青色：f9c2d1、緑色：c2d5f9、黄色：f7f3c2、白色：ffffff
  pieces: [
    { id: "goal", name: "怪異", w: 2, h: 2, row: 0, col: 3, color: "#000000" , textColor: "#ffffff"},
    { id: "a",    name: "結界",    w: 1, h: 2, row: 0, col: 2, color: "#ffffff" },
    { id: "b",    name: "呪符",    w: 1, h: 2, row: 0, col: 5, color: "#ffffff" },
    { id: "c",    name: "鎮石", w: 4, h: 1, row: 2, col: 2, color: "#ffffff" },
    { id: "d",    name: "長老",  w: 1, h: 1, row: 2, col: 1, color: "#ffffff" },
    { id: "e",    name: "人柱",  w: 1, h: 1, row: 2, col: 0, color: "#ffffff" },
    { id: "f",    name: "祠",  w: 1, h: 1, row: 3, col: 0, color: "#ffffff" },
    { id: "g",    name: "道祖神",  w: 2, h: 1, row: 3, col: 1, color: "#ffffff" },
    { id: "h",    name: "坊主",  w: 2, h: 1, row: 3, col: 3, color: "#ffffff" },
    { id: "i",    name: "供物",  w: 1, h: 1, row: 3, col: 5, color: "#ffffff" },
    { id: "j",    name: "火",  w: 1, h: 1, row: 4, col: 0, color: "#ffffff" },
    { id: "k",    name: "巫女",  w: 2, h: 1, row: 4, col: 1, color: "#ffffff" },
    { id: "l",    name: "しめ縄",  w: 2, h: 1, row: 4, col: 3, color: "#ffffff" },
    { id: "m",    name: "盛り塩",  w: 1, h: 1, row: 4, col: 5, color: "#ffffff" },
  ],
  goalPiece: "goal",
  exit: { row: 4, col: 2 },
};


  return (
    <div className="app-container">
      <HakoiriMusume config={myPuzzle} />
    </div>
  );
}

export default App;