import Gun from 'gun/gun'
import 'gun/sea'
// import 'gun/nts.js'
import 'gun/lib/then'
// import 'gun/lib/time.js'
import 'gun/lib/not'
import 'gun/lib/unset'
// import 'gun/lib/promise'
import 'gun/lib/radix'
import 'gun/lib/radisk'
import 'gun/lib/store'
import 'gun/lib/rindexed'
import 'gun/lib/open'
import 'gun/lib/load'

const opt = {
  localStorage: false,
  peers: ['http://localhost:5050/gun']
}
// opt.store = RindexedDB(opt)
// opt.localStorage = false

// const gun = Gun(['http://localhost:5000/gun'])
const gun = Gun(opt)

// console.log(Gun.text.random(5))

// Gun.chain.incrval = function () {
//   let self = this;
//   this.get('.').once(function(data,key){ 
//     if(typeof data === "undefined") data = 0;
//     data = data+1;
//     return self.put({[key]:data});
//   });
// }
// Gun.chain.decrval = function(){
//   let self = this;
//   this.get('.').once(function(data,key){
//     if(typeof data === "undefined") data = 0;
//     data = data-1;
//     return self.put({[key]:data});
//   });
// }
// Gun.chain.currval = async function(){
//   let curr = await this.get('.').then();
//   if(!curr) curr = 0;
//   return curr;
// }

export {gun, Gun}