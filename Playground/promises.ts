const add = (a,b)=>{
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            resolve (a+b);
        },2000)
    })
}

// add(2,3).then((sum)=>{
//     console.log(sum);
//     add(sum, 5).then((sum)=>{
//         console.log(sum)
//     }).catch((e)=>{
//         console.log(e)
//     })
// }).catch((e)=>{
//     console.log(e);
// })


// Above can be written with promise chaining as 
add(2,3).then((sum)=>{
    console.log(sum);
    return add(sum,5);
}).then((sum1)=>{
    console.log(sum1);
}).catch((e)=>{
    console.log(e);
})
