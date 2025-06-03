const simulation = (function sortingVisualizer(){
    const arrayContainer = document.getElementById('array-container');

    //scoped variables and constants
    let arr = [];
    let stopFlag = false;
    let target = "";
    let arraySize = document.getElementById('input-size');
    arraySize.value = 10;
    const dataSize = arraySize.value

    function setSpeedValue(){
        document.getElementById('value').textContent = document.getElementById('speed').value;
    }

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

    async function insertionSort(arr){
        for(let i = 1; i < arr.length; i++){
            let key = arr[i];
            let j = i - 1;
            for(; j >= 0; j--){
                if(stopFlag){
                    return;
                }
                let speed = document.getElementById('speed').value
                if(arr[j] > key){
                    arr[j+1] = arr[j];
                    changePillarColor(i, 'red');
                    changePillarColor(j, 'red');
                    await timer(`${(10-speed) * (71 - dataSize)}`); 
                    changePillarColor(i, 'yellow');
                    changePillarColor(j, 'yellow');
                    await timer(`${(10-speed) * (71 - dataSize)}`)
                }
                else break;
            }
            arr[j + 1] = key;
            changePillarHeight(arr);
            await timer(`${(10-speed) * (71 - dataSize)}`)
        }
    }

    function buttonTargettable(id, status){
        const button = document.getElementById(id);
        if (button) {
            button.disabled = !status;
        } else {
            console.warn(`"${id}" not found.`);
        }
    }

    function allButtonsTargettable(status){
        const buttonList = document.querySelectorAll('.sim-button');
        buttonList.forEach(button => button.disabled = !status);
    }

    async function setPillars(arr){//set pillar heights according to the randomized array
        createPillar(arr);
        await timer(800)
        changePillarHeight(arr);
    }

    async function readyData(event){//initialize a random array and ready the pillars to start the simulation
        if(arraySize.value < 1 || arraySize.value > 70){
            alert("input range = [1,70]");
            return;
        }

        arrayContainer.innerHTML = "";
        buttonTargettable('start-button', false);
        arr= [];
        let inputSize = document.getElementById('input-size').value;
        while(inputSize --){
            const randomNumber = Math.floor(Math.random() * 70) + 1;
            arr.push(randomNumber);
        }
    
        await setPillars(arr);
        target = event.target.id;
        buttonTargettable('start-button', true);
    }

    async function applyAlgorithm(){
        stopFlag = false;
        if(arraySize.value < 1 || arraySize.value > 70){
            alert("input range = [1,70]");
            return;
        }

        allButtonsTargettable(false);
        buttonTargettable('stop-button', true);

        if(target == 'bubble-sort-button'){
            await bubbleSort(arr);
        }
        else if(target == 'selection-sort-button'){
            await selectionSort(arr);
        }
        else{
            await insertionSort(arr);
        }

        allButtonsTargettable(true);
        buttonTargettable('start-button', false);
        buttonTargettable('stop-button', false);
    }

    function markComplete(){
        const pillars = document.querySelectorAll('.pillar');
        if(!stopFlag){
            pillars.forEach(pillar => {
                pillar.style.backgroundColor = 'rgb(111, 255, 98)';
            })
        }
    }

    function stopOperations(){
        stopFlag = true;
    }

    return {
        setSpeedValue, createPillar, changePillarHeight, changePillarColor, timer, bubbleSort, selectionSort, insertionSort, buttonTargettable, setPillars, readyData, applyAlgorithm, markComplete, stopOperations
    };
})();

//main
const startButton = document.getElementById('start-button');
const stopButton = document.getElementById('stop-button');

simulation.setSpeedValue();

document.getElementById('speed').addEventListener('input', () => {//respond to changes in  speed value
    simulation.setSpeedValue();
});

simulation.buttonTargettable('start-button', false);
simulation.buttonTargettable('stop-button', false);

document.getElementById("input-container").addEventListener("click", async function(event) {
    if(event.target.classList.contains("sim-button")) {
        await simulation.readyData(event);
    }
});

startButton.addEventListener('click', async () => {
    await simulation.applyAlgorithm();
    simulation.markComplete();
});

stopButton.addEventListener('click', () => simulation.stopOperations());