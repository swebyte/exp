import h from"./DD39qTSX.js";import{_ as d,u as x}from"./C8C0N9w-.js";import{o,c as i,w as m,d as e,t as c,b as l,e as _,r as f,F as g}from"./C7d0IkPw.js";import $ from"./DGudMjfR.js";import"./SEYYA0OU.js";import"./C-v3KzvZ.js";import"./BnAuAK5E.js";import"./BDAIKFW6.js";import"./ChwBadjN.js";const k={class:"pt-5 pb-2"},v={class:"text-2xl font-bold"},y={class:"text-gray-500 text-sm"},B={__name:"Post",props:["path"],setup(n){const r=n;return(u,p)=>{const s=h,a=d;return o(),i(a,{path:r.path},{default:m(({doc:t})=>[e("header",null,[e("div",k,[e("h1",v,c(t.title),1),e("p",y,c(t.date),1)])]),l(s,{value:t,class:"prose max-w-[100ch]"},null,8,["value"])]),_:1},8,["path"])}}},j={__name:"index",setup(n){return x({title:"exp",description:"My experience",image:"https://example.com/image.jpg",url:"https://example.com/experience"}),(r,u)=>{const p=B,s=$;return o(),i(s,{path:"/experience"},{default:m(({list:a})=>[(o(!0),_(g,null,f(a,t=>(o(),_("div",{key:t._path},[l(p,{path:`/experience/${t.slug}`},null,8,["path"])]))),128))]),_:1})}}};export{j as default};