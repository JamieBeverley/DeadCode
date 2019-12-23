

export function spread (func, spreadDelay){
    let spreadQueue = [];
    let spreadInterval;
    return (...args)=>{
        spreadQueue.push([func,[...args]]);
        clearInterval(spreadInterval);
        spreadInterval = setInterval(()=>{
            let q = spreadQueue.shift(1);

            if(q===undefined){
                clearInterval(spreadInterval);
                return;
            }

            q[0](...q[1])
        },spreadDelay);
    }
}