import{i as H,g as d,h as w,j as y,k as b,l as j,m as S,n as q,p as x,a as h,u as g,q as O,s as C,v as $,x as k,y as I,z as l}from"./Db1NMpat.js";import B from"./DteiEWf7.js";import T from"./CMYVCXc9.js";function U(r,s={}){const e=s.head||H();if(e)return e.ssr?e.push(r,s):z(e,r,s)}function z(r,s,e={}){const c=d(!1),u=d({});w(()=>{u.value=c.value?{}:x(s)});const n=r.push(u.value,e);return y(u,f=>{n.patch(f)}),q()&&(b(()=>{n.dispose()}),j(()=>{c.value=!0}),S(()=>{c.value=!1})),n}const v=(r,s=g())=>{const e=h(r),c=C();y(()=>h(r),(n=e)=>{if(!s.path||!n)return;const t=Object.assign({},(n==null?void 0:n.head)||{});t.meta=[...t.meta||[]],t.link=[...t.link||[]];const f=t.title||(n==null?void 0:n.title);f&&(t.title=f),c.public.content.host;const a=(t==null?void 0:t.description)||(n==null?void 0:n.description);a&&t.meta.filter(p=>p.name==="description").length===0&&t.meta.push({name:"description",content:a}),t!=null&&t.image||(n==null||n.image),O(()=>U(t))},{immediate:!0})},N=$({name:"ContentDoc",props:{tag:{type:String,required:!1,default:"div"},excerpt:{type:Boolean,default:!1},path:{type:String,required:!1,default:void 0},query:{type:Object,required:!1,default:void 0},head:{type:Boolean,required:!1,default:void 0}},render(r){const{contentHead:s}=C().public.content,e=k(),{tag:c,excerpt:u,path:n,query:t,head:f}=r,a=f===void 0?s:f,p={...t||{},path:n||(t==null?void 0:t.path)||I(g().path),find:"one"},_=(o,i)=>l("pre",null,JSON.stringify({message:"You should use slots with <ContentDoc>",slot:o,data:i},null,2));return l(T,p,{default:e!=null&&e.default?({data:o,refresh:i,isPartial:D})=>{var m;return a&&v(o),(m=e.default)==null?void 0:m.call(e,{doc:o,refresh:i,isPartial:D,excerpt:u,...this.$attrs})}:({data:o})=>(a&&v(o),l(B,{value:o,excerpt:u,tag:c,...this.$attrs},{empty:i=>e!=null&&e.empty?e.empty(i):_("default",o)})),empty:o=>{var i;return((i=e==null?void 0:e.empty)==null?void 0:i.call(e,o))||l("p",null,"Document is empty, overwrite this content with #empty slot in <ContentDoc>.")},"not-found":o=>{var i;return((i=e==null?void 0:e["not-found"])==null?void 0:i.call(e,o))||l("p",null,"Document not found, overwrite this content with #not-found slot in <ContentDoc>.")}})}}),P=N,J=Object.freeze(Object.defineProperty({__proto__:null,default:P},Symbol.toStringTag,{value:"Module"}));export{J as C,P as _,U as u};