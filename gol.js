const rows = 90;
const cols = 200;

let started = false; // Set to true when use clicks start
let timer; //To control evolutions
let evolutionSpeed = 50; // How quickly cells are updated

let currGen = [rows];
let nextGen = [rows]; // Creates two-dimensional arrays
let genCounter = 0; // Generation counter

function createGenArrays() {
  for (let i = 0; i < rows; i++) {
    currGen[i] = new Array(cols);
    nextGen[i] = new Array(cols);
  }
}

function initGenArrays() {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      currGen[i][j] = 0;
      nextGen[i][j] = 0;
    }
  }
}
// Create world grid
function createWorld() {
  let world = document.querySelector("#world");
  let tbl = document.createElement("table"); // Create and set object for html table element

  tbl.setAttribute("id", "worldgrid");

  for (let i = 0; i < rows; i++) {
    // Create cells in table
    let tr = document.createElement("tr");
    for (let j = 0; j < cols; j++) {
      let cell = document.createElement("td");
      cell.setAttribute("id", i + "_" + j); // Set object id to eg. '0_1'
      cell.setAttribute("class", "dead");

      tr.appendChild(cell);
    }
    tbl.appendChild(tr); // Create table row
  }
  world.appendChild(tbl);
}
// Create the next generation
function createNextGen() {
  for (row in currGen) {
    for (col in currGen[row]) {
      let neighbors = getNeighborCount(row, col);

      // Check the rules
      // If Alive
      if (currGen[row][col] == 1) {
        if (neighbors < 2) {
          nextGen[row][col] = 0;
        } else if (neighbors == 2 || neighbors == 3) {
          nextGen[row][col] = 1;
        } else if (neighbors > 3) {
          nextGen[row][col] = 0;
        }
      } else if (currGen[row][col] == 0) {
        // If Dead or Empty

        if (neighbors == 3) {
          // Propogate the species
          nextGen[row][col] = 1; // Birth?
        }
      }
    }
  }
}
// Determin which cells will generate life and which will die
function getNeighborCount(row, col) {
  let count = 0;
  let nrow = Number(row);
  let ncol = Number(col);

  // Make sure we are not at the first row
  if (nrow - 1 >= 0) {
    // Check top neighbor
    if (currGen[nrow - 1][ncol] == 1) count++;
  }
  // Make sure we are not in the first cell
  // Upper left corner
  if (nrow - 1 >= 0 && ncol - 1 >= 0) {
    //Check upper left neighbor
    if (currGen[nrow - 1][ncol - 1] == 1) count++;
  } // Make sure we are not on the first row last column
  // Upper right corner
  if (nrow - 1 >= 0 && ncol + 1 < cols) {
    //Check upper right neighbor
    if (currGen[nrow - 1][ncol + 1] == 1) count++;
  } // Make sure we are not on the first column
  if (ncol - 1 >= 0) {
    //Check left neighbor
    if (currGen[nrow][ncol - 1] == 1) count++;
  }
  // Make sure we are not on the last column
  if (ncol + 1 < cols) {
    //Check right neighbor
    if (currGen[nrow][ncol + 1] == 1) count++;
  } // Make sure we are not on the bottom left corner
  if (nrow + 1 < rows && ncol - 1 >= 0) {
    //Check bottom left neighbor
    if (currGen[nrow + 1][ncol - 1] == 1) count++;
  } // Make sure we are not on the bottom right
  if (nrow + 1 < rows && ncol + 1 < cols) {
    //Check bottom right neighbor
    if (currGen[nrow + 1][ncol + 1] == 1) count++;
  }

  // Make sure we are not on the last row
  if (nrow + 1 < rows) {
    //Check bottom neighbor
    if (currGen[nrow + 1][ncol] == 1) count++;
  }

  return count;
}
// Update the current generation with the next generation
function updateCurrGen() {
  for (row in currGen) {
    for (col in currGen[row]) {
      // Update the current generation with
      // the results of createNextGen function
      currGen[row][col] = nextGen[row][col];
      // Set nextGen back to empty
      nextGen[row][col] = 0;
    }
  }
}
// Update world's population
function updateWorld() {
  for (row in currGen) {
    for (col in currGen[row]) {
      let cell = document.getElementById(row + "_" + col);
      if (currGen[row][col] == 0) {
        cell.setAttribute("class", "dead");
      } else {
        cell.setAttribute("class", "alive");
      }
    }
  }
}
// Run and display all updates
function evolve() {
  createNextGen(); // Generate new population
  updateCurrGen(); // Update 'current generation' with the new population
  updateWorld(); // Update world grid with new live and dead cells

  if (started) {
    // main loop
    timer = setTimeout(evolve, evolutionSpeed);
    // generation counter for page display
    genCounter++;
    document.getElementById("gencount").innerHTML = genCounter;
  }
}
// Start and stop reproduction - connected to button
function startStopGol() {
  let startstop = document.querySelector("#btnstartstop");

  if (!started) {
    started = true;
    startstop.value = "Stop";
    evolve();
  } else {
    started = false;
    startstop.value = "Start";
    clearTimeout(timer);
  }
}
// Reset world grid to blank - connected to button
function resetWorld() {
  location.reload();
}

window.onload = () => {
  createWorld(); // The visual table
  createGenArrays(); // current and next generations
  initGenArrays(); //Set all array locations to 0=dead

  let table = document.getElementById("worldgrid");
  let tableEntry = document.getElementsByTagName("td");
  let isToggling = false;
  // Allow user to click and drag mouse across cells to enable/disable starter cells
  function enableToggle(e) {
    isToggling = true;

    if (e.target !== table) {
      cellClick(e);
    }
  }
  // Toggle alive or dead
  function cellClick(e) {
    if (isToggling === false) {
      return;
    }

    let loc = e.target.id.split("_");
    let row = Number(loc[0]);
    let col = Number(loc[1]);
    // Toggle cell alive or dead
    if (e.target.className === "alive") {
      e.target.setAttribute("class", "dead");
      currGen[row][col] = 0;
    } else {
      e.target.setAttribute("class", "alive");
      currGen[row][col] = 1;
    }
  }

  function disableToggle() {
    isToggling = false;
  }

  table.onmousedown = enableToggle;
  for (var i = 0, il = tableEntry.length; i < il; i++) {
    tableEntry[i].onmouseenter = cellClick; //changes color
  }

  table.onmouseup = disableToggle;

  // Random button
  let randBtn = document.getElementById("btnrandom");
  // Generate random live cells - connected to button
  randBtn.addEventListener("click", () => {
    let i = 0;

    while (i < tableEntry.length) {
      if (Math.floor(Math.random() * Math.floor(6)) == 5) {
        // Generates random number per cell - sets to live if generated number = 5
        let loc = tableEntry[i].id.split("_");
        let row = Number(loc[0]);
        let col = Number(loc[1]);
        tableEntry[i].setAttribute("class", "alive");
        currGen[row][col] = 1;
      }
      i++;
    }
  });
};
