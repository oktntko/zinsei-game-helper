import{u as n}from"./chunk-A3PVMI4K-M-spppvk.js";function l(...e){return n(i,e)}function i(e,r=[],o=[]){if(typeof e=="function")return e;if(typeof e!="object"||e===null||e instanceof Date||e instanceof RegExp)return structuredClone(e);let t=r.indexOf(e);return t!==-1?o[t]:(r.push(e),Array.isArray(e)?s(e,r,o):c(e,r,o))}function c(e,r,o){let t={};o.push(t);for(let[u,f]of Object.entries(e))t[u]=i(f,r,o);return t}function s(e,r,o){let t=[];o.push(t);for(let[u,f]of e.entries())t[u]=i(f,r,o);return t}export{l as p};
