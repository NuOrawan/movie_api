let msg = 'Hello Node';
console.log(msg);

console.log('Goodbye');
import { Buffer } from "buffer";
const bufs = Buffer.from([1,2,3,4]);
for (const buf of bufs){
    console.log(buf);
};