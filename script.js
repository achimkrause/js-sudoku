let grid=[];
let maxSolutions = 10;
let automatic = false;

function main(){
  let sudoku = document.getElementById('sudoku');
  for(let i=0; i<9; i++){
    grid.push([]);
    for(let j=0; j<9; j++){
      let input = document.createElement('input');
      input.setAttribute('type','text');
      if(i%3 === 0){
        input.classList.add('top');
      }
      if(i%3 === 2){
        input.classList.add('bottom');
      }
      if(j%3 === 0){
        input.classList.add('left');
      }
      if(j%3 === 2){
        input.classList.add('right');
      }
      input.addEventListener('keydown', (e) => {
        clearAutomatic();
        e.preventDefault();
        if(e.key === 'Enter'){
          solve();
        }
        else if(e.key === 'Backspace'){
          input.value = '';
        }
        else if(isFinite(e.key) && e.key !== '0'){
          if(getPossibilities(i,j)[i][j].includes(parseInt(e.key))){
            input.value = e.key;
            solve();
          }
        }
      });
      input.addEventListener('click', (e) => {
        clearAutomatic();
      });
      input.addEventListener('focus', (e) => {
        clearAutomatic();
      });
      grid[i].push(input);
      sudoku.appendChild(input);
    }
  }
}

function clearAutomatic(){
  if(automatic){
    automatic=false;
    for(let i=0; i<9; i++){
      for(let j=0; j<9; j++){
        if(grid[i][j].classList.contains('automatic')){
          grid[i][j].classList.remove('automatic');
          grid[i][j].value = '';
        }
      }
    }
    document.getElementById('message').innerText = '';
  }
}

function getPossibilities(i0,j0){
  let possibilities = [];
  for(let i=0; i<9; i++){
    possibilities.push([]);
    for(let j=0; j<9; j++){
      possibilities[i].push([1,2,3,4,5,6,7,8,9]);
    }
  }
  for(let i=0; i<9; i++){
    for(let j=0; j<9; j++){
      if(i===i0 && j===j0){
        continue;
      }
      if(grid[i][j].classList.contains('automatic')){
        continue;
      }
      val = parseInt(grid[i][j].value);
      if(!isNaN(val)){
        set(possibilities, i, j, val);
      }
    }
  }
  return possibilities;
}

function set(possibilities, i, j, val){
  for(let i0=0; i0<9; i0++){
    for(let j0=0; j0<9; j0++){
      if(Array.isArray(possibilities[i0][j0]) && (i0 === i || j0 === j 
        || (Math.floor(i/3) === Math.floor(i0/3) && Math.floor(j/3) === Math.floor(j0/3)))){
        possibilities[i0][j0] = possibilities[i0][j0].filter(item => item !== val);
      }
    }
  }
  possibilities[i][j] = val;
}

function solve(){
  let solutions = solveStep(getPossibilities());
  let msg='';
  if(solutions.length >= maxSolutions){
    msg = 'at least ' + maxSolutions + ' solutions';
  }
  else if(solutions.length === 0){
    msg = 'no solutions';
  }
  else if(solutions.length === 1){
    msg = '1 solution';
  }
  else{
    msg = solutions.length + ' solutions';
  }
  document.getElementById('message').innerText = msg;
  if(solutions.length > 0){
    automatic = true;
    for(let i=0; i<9; i++){
      for(let j=0; j<9; j++){
        if(grid[i][j].value === ''){
          grid[i][j].value=solutions[0][i][j];
          grid[i][j].classList.add('automatic');
        }
      }
    }
  }
}

function copyPossibilities(possibilities){
  let newPossibilities=[];
  for(let i=0; i<possibilities.length; i++){
    newPossibilities.push([]);
    for(let j=0; j<possibilities[i].length; j++){
      newPossibilities[i].push([]);
      if(Array.isArray(possibilities[i][j])){
        newPossibilities[i][j]=possibilities[i][j].slice();
      }
      else{
        newPossibilities[i][j]=possibilities[i][j];
      }
    }
  }
  return newPossibilities;
}

function solveStep(possibilities){
  let iMin = null;
  let jMin = null;
  let possMin = null;
  for(let i=0; i<9; i++){
    for(let j=0; j<9; j++){
      if(Array.isArray(possibilities[i][j])){
        if(possMin === null || possibilities[i][j].length < possMin){
          possMin = possibilities[i][j].length;
          iMin = i;
          jMin = j;
        }
      }
    }
  }
  if(possMin === null){
    return [possibilities];
  }
  if(possMin === 0){
    return [];
  }
  else{
    let solutions = [];
    for(let k=0; k<possibilities[iMin][jMin].length-1; k++){
      let newPossibilities = copyPossibilities(possibilities);
      set(newPossibilities,iMin,jMin,possibilities[iMin][jMin][k]);
      solutions = solutions.concat(solveStep(newPossibilities));
      if(solutions.length >= maxSolutions){
        break;
      }
    }
    if(solutions.length < maxSolutions){
      set(possibilities,iMin,jMin,possibilities[iMin][jMin][possibilities[iMin][jMin].length-1]);
      solutions = solutions.concat(solveStep(possibilities));
    }
    return solutions;
  }
}

window.addEventListener('DOMContentLoaded',main, false);
