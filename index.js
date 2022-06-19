// Commands variables
let enableCommands;
let timerCommandWord;

// Timer value variables
let startTime = 21600;
let enableMaxTime = false;
let maxTime = 86400;
let currentTime = 0;
let isRunning = false;
let isFinished = false;
let isPaused = false;

// Get DOM elements
const timer = document.getElementById('timer');
const timerEvent = document.getElementById('timer-event');

// Get event variables
let followerEnabled = false;
let followerIncrease = 0;
let subEnabled = false;
let subIncrease = 0;
let sub2Increase = 0;
let sub3Increase = 0;
let cheerEnabled = false;
let cheerIncrease = 0;
let donoEnabled = false;
let donoIncrease = 0;
let raidEnabled = false;
let raidIncrease = 0;
let minRaidAmount = 0;

// Event text variables
let eventText = '';
let enableEventText = false;
let eventTextDuration = 2000;
let eventTimer;

// Application variables
let eventQueue = [];
let maxAddTimeListener = 0;


// Set the values coming from the fields on widget load
window.addEventListener('onWidgetLoad', function (obj) {

    const fieldData = obj.detail.fieldData;

    enableCommands = fieldData.enableCommands && fieldData.enableCommands !== 'false';
    timerCommandWord = fieldData.commandWord;

    startTime = fieldData.startTime;
    enableMaxTime = fieldData.enableMaxTime && fieldData.enableMaxTime !== 'false';
    maxTime = fieldData.maxTime;
    // Set the maxAddTimeListener to check if it's reached by substracting the times added to the timer
    // I don't use maxTime directly since we don't want to change the value coming from the widget
    maxAddTimeListener = maxTime;

    followerEnabled = fieldData.followerEnabled && fieldData.followerEnabled !== 'false';
    followerIncrease = fieldData.followerIncrease;
    subEnabled = fieldData.subEnabled && fieldData.subEnabled !== 'false';
    subIncrease = fieldData.subIncrease;
    sub2Increase = fieldData.sub2Increase;
    sub3Increase = fieldData.sub3Increase;
    cheerEnabled = fieldData.cheerEnabled && fieldData.cheerEnabled !== 'false';
    cheerIncrease = fieldData.cheerIncrease;
    donoEnabled = fieldData.donoEnabled && fieldData.donoEnabled !== 'false';
    donoIncrease = fieldData.donoIncrease;
    raidEnabled = fieldData.raidEnabled && fieldData.raidEnabled !== 'false';
    raidIncrease = fieldData.raidIncrease;
    minRaidAmount = fieldData.minRaidAmount;

    eventText = fieldData.eventText;
    enableEventText = fieldData.enableEventText && fieldData.enableEventText !== 'false';

    if (enableEventText) displayEventMessages();

});

// Go through the eventQueue periodically to check if messages should be displayed
function displayEventMessages() {

    if (eventQueue.length > 0) {
        // Oldest event is last in array
    	eventQueue = eventQueue.reverse();

        // Get last (oldest) event out
        const event = eventQueue.pop();
        timerEvent.innerHTML = event;
        timerEvent.classList.add('show');

        // Reverse to old order
        eventQueue = eventQueue.reverse();
    }

    eventTimer = setTimeout(() => {
        timerEvent.classList.remove('show');

        setTimeout(() => {
            displayEventMessages();
        }, 1200)
    }, eventTextDuration);

}

// Listen and react to incoming events (follows, subs, cheeers, etc.)
window.addEventListener('onEventReceived', function (obj) {

    const data = obj.detail.event.data;
    const type = obj.detail.listener;
    const event = obj.detail.event;

    switch (type) {
        case 'message':
            handleChatMessage(data);
            break;
      
        case 'follower-latest':
            if (followerEnabled && followerIncrease > 0) {
                const realSecondsAdded = add(followerIncrease);
                if (realSecondsAdded <= 0) return;
                addEventToQueue(event.name, realSecondsAdded);
            }
            break;

    case 'subscriber-latest':
        let increase = subIncrease;
        if (parseInt(event.tier) === 2000) increase = sub2Increase;
        if (parseInt(event.tier) === 3000) increase = sub3Increase;
        if (subEnabled && increase > 0) {
            if (event.hasOwnProperty('bulkGifted') && event.bulkGifted) {
                const realSecondsAdded = add(event.amount * increase);
                if (realSecondsAdded <= 0) return;
                addEventToQueue(event.sender, realSecondsAdded);
            } else if (!event.hasOwnProperty('isCommunityGift') || event.isCommunityGift != true) {
                // If isCommunityGift is set to true this is part of a bulk gift that is why we filter it out
                const realSecondsAdded = add(increase);
                addEventToQueue(event.sender ? event.sender : event.name, realSecondsAdded);
            }
        }
        break;

    case 'cheer-latest':
        if (cheerEnabled && cheerIncrease > 0) {
            if (event.amount) {
                const realSecondsAdded = add(cheerIncrease * event.amount);
                if (realSecondsAdded <= 0) return;
                addEventToQueue(event.name, realSecondsAdded);
            }
        }
        break;

    case 'tip-latest':
        if (donoEnabled && donoIncrease > 0) {
            if (event.amount) {
                const realSecondsAdded = add(donoIncrease * Math.floor(event.amount));
                if (realSecondsAdded <= 0) return;
                addEventToQueue(event.name, realSecondsAdded);
            }
        }
        break;

    case 'raid-latest':
        if (raidEnabled && raidIncrease > 0 && event.amount >= minRaidAmount) {
            const realSecondsAdded = add(event.amount * raidIncrease);
            if (realSecondsAdded <= 0) return;
            addEventToQueue(event.name, realSecondsAdded);
        }
        break;
    }

});

// Handle chat messages and check for commands
function handleChatMessage(data) {

    if (!data) return;

    const messageParts = data['text'].split(' ');;
    const command = messageParts[0];
    if (command.toLowerCase() !== timerCommandWord.toLowerCase()) return;

    const badge1 = data['badges'][0];
    if (badge1['type'] !== 'broadcaster' && badge1['type'] !== 'moderator') return;

    const commandAction = messageParts[1];
    const commandActionValue = messageParts[2];

    switch (commandAction.toLowerCase()) {
        case 'start':
            currentTime = parseInt(startTime, 10) + 1;
            if (commandActionValue && parseInt(commandActionValue, 10)) currentTime = parseInt(commandActionValue, 10) + 1;
            if (!isRunning) run();
            break;
    case 'add':
        if (!commandActionValue) return;
        const reallyAdded = add(commandActionValue);
        if (reallyAdded) {
            addEventToQueue(data.displayName, reallyAdded);
        }
        break;
    case 'pause':
        isPaused = true;
        isRunning = false;
        break;
    case 'unpause':
        isPaused = false;
        if (!isRunning) run();
        break;
    case 'clear':
        currentTime = 1;
        if (!isRunning) run();
        break;
    }

}

// Run timer
// Call every second and substract 1 s from currentTime each tick
function run() {

    if (!currentTime || isPaused) return;

    isFinished = false;
    isPaused = false;
    isRunning = true;
  
    currentTime--;
  
    // Timer finished if currentTime reaches 0 or beneath
    if (currentTime <= 0) {
        timer.innerHTML = '00:00:00';
        isFinished = true;
        isRunning = false;
        isPaused = false;
        return;
    }

    // Display currentTime (which is seconds) in time format hh:mm:ss
    timer.innerHTML = secondsToTimer(currentTime);

    setTimeout(run, 1000);

}

// Show seconds as hh:mm:ss
function secondsToTimer(seconds) {

    let hours = Math.floor(seconds / 60 / 60);
    let mins = Math.floor((seconds - (hours * 3600)) / 60);
    let secs = seconds - mins * 60 - hours * 3600;
    hours = hours > 9 ? hours : `0${hours}`;
    mins = mins > 9 ? mins : `0${mins}`;
    secs = secs > 9 ? secs : `0${secs}`;

    return `${hours}:${mins}:${secs}`;

}

// Add specified seconds to timer
function add(additionalTime) {

    const time = parseInt(additionalTime, 10);

    // Consider the maximum amount of time we can add
    if (enableMaxTime) {
    	// Check if maximum add time listener is 0 (max time is already reached)
        if (maxAddTimeListener === 0) return 0;
        if (maxAddTimeListener - time < 0) time = maxAddTimeListener;
    }

    currentTime = currentTime + 1 + time;

    if (enableMaxTime) {
        maxAddTimeListener -= time;
    }

    if (!isRunning) run();

    return time;

}

// Replace variables in event text dummy to display real event text
function addEventToQueue(viewer, amount) {

    if (enableEventText && eventText) {
        const realEventText = eventText.replace('[viewer]', viewer).replace('[amount]', amount);
        eventQueue.push(realEventText);
    }

}
