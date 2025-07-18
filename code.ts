// This plugin will open a window to prompt the user to enter a number, and
// it will then create that many shapes and connectors on the screen.

// This file holds the main code for plugins. Code in this file has access to
// the *figma document* via the figma global object.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (See https://www.figma.com/plugin-docs/how-plugins-run).

// This shows the HTML page in "ui.html".
figma.showUI(__html__);

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
function clone(val: any) {
  return JSON.parse(JSON.stringify(val))
}

function getBoard() {
  // we want a 40x40 space of shapes.
  // make it the first time, afterwards grab
  // boardNotes =  await miro.board.get({
  //   type: "sticky_note",
  // })
  const boardNotes: StickyNode[] = figma.currentPage.children.map(x => x as StickyNode)

  boardNotes.sort((a: StickyNode,b: StickyNode): number => {
    if(a.y < b.y) {return 1}
    else if(a.y > b.y){ return -1}
    else {return a.x < b.x ? 1 : -1}
  })
  return boardNotes.reverse(); // I want it top->bottom left->right
}

function animate(data: any) {
  // const boardNotes: StickyNode[] = figma.currentPage.children.map(x => x as StickyNode)
  const boardNotes = getBoard();
  const width = 100;
  const height = 100;

  const step = 10;
  for (let x = 0; x < width; x += step) {
    for (let y = 0; y < height; y += step) {
      const i = (y * width + x) * 4;
      const boardIndex = (y/step * 10 + (x/step));
      console.log(boardIndex)
      if (data[i] === 0) {
        setShapeFill(boardNotes[boardIndex], true)
        // should show black
      } else {
        setShapeFill(boardNotes[boardIndex], false)
        // should show white 
      }
    }
  }
}

async function setShapeFill(shape: StickyNode, isDrawn: boolean) {
  const fills = clone(shape.fills)
  fills[0] = figma.util.solidPaint(isDrawn ? '#FFFFFF88' : '0000088', fills[0])
  shape.fills = fills
}

figma.ui.onmessage =  (msg: {type: string, data: [number,number,number][]}) => {
  // One way of distinguishing between different types of messages sent from
  // your HTML page is to use an object with a "type" property like this.
  if(msg.type == 'data') {
    animate(msg.data)
  }

  // Make sure to close the plugin when you're done. Otherwise the plugin will
  // keep running, which shows the cancel button at the bottom of the screen.
  // figma.closePlugin();
};
