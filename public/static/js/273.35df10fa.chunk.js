"use strict";(self.webpackChunkclient=self.webpackChunkclient||[]).push([[273],{9273:function(e,a,n){n.r(a),n.d(a,{default:function(){return C}});var c=n(885),s=n(2791),r=n(6030),i=n(8693),t=n(2426),l=n.n(t);n(5098);var o=n.p+"static/media/homeBanner.f1c9dc658cf284fbc0907c3c5b8894d2.svg";var d=n.p+"static/media/timeIcon.26d93559594b7c6621a1ea23324a0312.svg";var m=n.p+"static/media/dateIcon.88c35a657eb30e7b7156dca7d3d8b40b.svg";var f=n.p+"static/media/enterpriseIconCard.421614be1cd8c1b00a680c7b15899a90.svg";var u=n.p+"static/media/locationIconCard.c8ddddb115e5fa06551e6adf689d5e87.svg";var h=n.p+"static/media/emailIconCard.2dad94522f39afcf2e5245ba28820517.svg",v=n(5861),p=n(7757),x=n.n(p),g=n(1830),j=n.n(g),b=n(362),N=n(9734),E=function(e){return{type:N.V.empresaLoad,payload:e}},I=n(3180),S=n(5243),y=n(9626),k=n(184),C=function(){l().locale("es");var e=(0,r.I0)(),a=(0,r.v9)((function(e){return e.auth})).active,n=(0,r.v9)((function(e){return e.enterprise})).myEnterprise,t=(0,s.useState)(l()().format("LTS")),p=(0,c.Z)(t,2),g=p[0],N=p[1];return(0,s.useEffect)((function(){localStorage.setItem("thisPage","inicio"),e((0,I.U)(localStorage.getItem("thisPage"))),e((0,S.m_)()),e((0,y.OB)())}),[e]),(0,s.useEffect)((function(){var e=setInterval((function(){N(l()().format("LTS"))}),1e3);return function(){return clearInterval(e)}}),[]),!n&&e(function(e){return function(){var a=(0,v.Z)(x().mark((function a(n){var c,s,r,i,t;return x().wrap((function(a){for(;;)switch(a.prev=a.next){case 0:return c=localStorage.getItem("p1"),s=localStorage.getItem("p2"),r=localStorage.getItem("p3"),a.next=5,(0,b.Z)("auth/miempresa",{userEncrypt:c,passwordEncrypt:s,databaseEncrypt:r,code:e},"POST");case 5:return i=a.sent,a.next=8,i.json();case 8:(t=a.sent).ok?n(E({myEnterprise:t.msg})):j().fire({title:"Error",text:t.msg,icon:"error",confirmButtonText:"Ok",confirmButtonColor:"#0191CE"});case 10:case"end":return a.stop()}}),a)})));return function(e){return a.apply(this,arguments)}}()}(a)),(0,k.jsxs)("div",{className:"home",children:[(0,k.jsx)("div",{className:"container-banner-home",children:(0,k.jsxs)(i.E.div,{className:"banner-home",initial:{scale:.8},animate:{scale:1},children:[(0,k.jsxs)("div",{className:"banner-info",children:[n?(0,k.jsx)("p",{className:"banner-title",children:n.nombre.trim()}):"",(0,k.jsxs)("div",{className:"banner-hour",children:[(0,k.jsx)("img",{src:d,alt:"home-banner"}),(0,k.jsx)("p",{className:"hour",children:g})]}),(0,k.jsxs)("div",{className:"banner-date",children:[(0,k.jsx)("img",{src:m,alt:"home-banner"}),(0,k.jsx)("p",{className:"date",children:l()().format("LL")})]})]}),(0,k.jsx)("img",{className:"banner-img",src:o,alt:"banner"})]})}),(0,k.jsxs)("div",{className:"cards-home",children:[(0,k.jsx)(i.E.div,{className:"container-home ruc",initial:{scale:.8},animate:{scale:1},children:(0,k.jsxs)("div",{className:"glass-card",children:[(0,k.jsx)("div",{className:"icon-info",children:(0,k.jsx)("img",{src:f,alt:"\xedcono"})}),n?(0,k.jsx)("p",{className:"card-info info-ruc",children:n.ruc.trim()}):""]})}),(0,k.jsx)(i.E.div,{className:"container-home direccion",initial:{scale:.8},animate:{scale:1},children:(0,k.jsxs)("div",{className:"glass-card",children:[(0,k.jsx)("div",{className:"icon-info",children:(0,k.jsx)("img",{src:u,alt:"\xedcono"})}),n?(0,k.jsx)("p",{className:"card-info info-direccion",children:n.direccion.trim()}):""]})}),(0,k.jsx)(i.E.div,{className:"container-home correo",initial:{scale:.8},animate:{scale:1},children:(0,k.jsxs)("div",{className:"glass-card",children:[(0,k.jsx)("div",{className:"icon-info",children:(0,k.jsx)("img",{src:h,alt:"\xedcono"})}),n?(0,k.jsx)("p",{className:"card-info info-email",children:n.email.trim()}):""]})})]})]})}}}]);
//# sourceMappingURL=273.35df10fa.chunk.js.map