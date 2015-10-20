class ObjectFactoryProvider {
  constructor(){
      this.created = [];
  }

  newObject(type) {
    let newObj = {type: type};
    this.created.push(newObj);
    return newObj;
  }

  getCreated() {
    return this.created.slice();
  }

  reset() {
    this.created = [];
  }
}

// let ObjectFactoryProvider = (function() {
//   let instance;
//
//   function init() {
//     let created = [];
//     return {
//       newObject: (type) => {
//         let newObj = {
//           type: type
//         };
//         created.push(newObj);
//         return newObj;
//       },
//       getCreated: () => {
//         return created.slice();
//       },
//       reset: () => {
//         created = [];
//       }
//     };
//   }
//
//   return {
//     getInstance: () => {
//       if(!instance) {
//         instance = init();
//       }
//       return instance;
//     }
//   };
// }());

module.exports = ObjectFactoryProvider;
