let stopFlag = false;
let arraySize = document.getElementById('input-size');
arraySize.value = 10;

const simulation = (function sortingVisualizer(){
    const arrayContainer = document.getElementById('array-container');
    const start = document.getElementById('start-button');
    const stop = document.getElementById('stop-button');
    const dataSize = arraySize.value

    function createPillar(array){
        array.forEach(value => {
            const pillarContainer = document.createElement('div');
            pillarContainer.id = 'pillar-container';
            const pillar = document.createElement('div');
            const height = document.createElement('div');
            height.id = 'pillar-height'
            pillar.className = 'pillar';
            pillarContainer.appendChild(pillar);
            pillarContainer.appendChild(height);
            arrayContainer.appendChild(pillarContainer);
        });
        arrayContainer.style.width = `${arrayContainer.children.length * 40}px`;
    }

    function changePillarHeight(array){
        array.forEach((item, index) => {
            let pillar = document.getElementsByClassName('pillar')[index];
            pillar.style.height = `${item * 5}px`;
            let pillarHeight = document.querySelectorAll('#pillar-height');
            pillarHeight[index].textContent = array[index].toString();
        });
    }

    function changePillarColor(index, color){
        let pillar = document.querySelectorAll('.pillar');
        pillar[index].style.backgroundColor = color;
    }

    async function timer(time){
        return await new Promise(resolve => setTimeout(resolve, time));
    }

    async function setSimulation(arr){
        createPillar(arr);
        await timer(800)
        changePillarHeight(arr);
    }

    async function bubbleSort(arr){

        for(let j = 0 ; j < arr.length ; j++){
            for(let i = 0 ; i < arr.length ; i++){
                if(stopFlag){
                    return;
                }
                let speed = document.getElementById('speed').value;
                if(arr[i] > arr[i+1]){
                    let temp = arr[i+1];
                    arr[i+1] = arr[i];
                    arr[i] = temp;
                    //switch pillars
                    changePillarColor(i, 'red');
                    changePillarColor(i + 1, 'red');
                    await timer(`${(10-speed) * (71 - dataSize)}`);
                    
                    changePillarHeight(arr); 
                    changePillarColor(i, 'yellow');
                    changePillarColor(i + 1, 'yellow');
                    await timer(`${(10-speed) * (71 - dataSize)}`);
                }
            }
        }
    }

    async function selectionSort(arr){

        for(let j = 0 ; j < arr.length ; j++){
            for(let i = j + 1 ; i < arr.length ; i++){
                if(stopFlag){
                    return;
                }
                let speed = document.getElementById('speed').value
                if(arr[i] < arr[j]){
                    let temp = arr[j];
                    arr[j] = arr[i];
                    arr[i] = temp;
                    //switch pillars
                    changePillarColor(i, 'red');
                    changePillarColor(j, 'red');
                    await timer(`${(10-speed) * (71 - dataSize)}`);
                    changePillarHeight(arr); 
                    changePillarColor(i, 'yellow');
                    changePillarColor(j, 'yellow');
                    await timer(`${(10-speed) * (71 - dataSize)}`);
                }
            }
        }
    }
    return {createPillar, changePillarHeight, changePillarColor, timer, setSimulation, bubbleSort, selectionSort, arrayContainer, start, stop};
})();

//main
document.getElementById('value').textContent = document.getElementById('speed').value;
document.getElementById('start-button').disabled = true;
document.getElementById('stop-button').disabled = true;

let arr = [];
let target = "";

document.getElementById("input-container").addEventListener("click", async function(event) {
    if(event.target.classList.contains("sim-button")) {
        simulation.arrayContainer.innerHTML = "";
        document.getElementById('start-button').disabled = true;
        arr= [];
        let inputSize = document.getElementById('input-size').value;
        while(inputSize --){
            const randomNumber = Math.floor(Math.random() * 70) + 1;
            arr.push(randomNumber);
        }
    
        await simulation.setSimulation(arr);
        target = event.target.id;
        document.getElementById('start-button').disabled = false;
    }
    
});

simulation.start.addEventListener('click', async () => {
    stopFlag = false;
    if(arraySize.value < 1 || arraySize.value > 70){
        alert("input range = [1,70]");
        return;
    }

    const buttonList = document.querySelectorAll('.sim-button');
    buttonList.forEach(button => button.disabled = true);

    document.getElementById('stop-button').disabled = false;

    if(target == 'selection-sort-button'){
        await simulation.selectionSort(arr);
    }
    else{
        await simulation.bubbleSort(arr);
    }
    
    const pillars = document.querySelectorAll('.pillar');
    if(!stopFlag){
        pillars.forEach(pillar => {
            pillar.style.backgroundColor = 'rgb(111, 255, 98)';
        })
    }
    buttonList.forEach(button => button.disabled = false);
    document.getElementById('start-button').disabled = true;
    document.getElementById('stop-button').disabled = true;
});


simulation.stop.addEventListener('click', () => stopFlag = true);

document.getElementById('speed').addEventListener('input', () => {
    document.getElementById('value').textContent = document.getElementById('speed').value;
});