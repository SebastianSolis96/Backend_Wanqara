"use strict";(self.webpackChunkclient=self.webpackChunkclient||[]).push([[967],{4967:function(e,n,c){c.r(n);var t=c(4942),a=c(1413),i=c(885),o=c(2791),r=c(6030),u=c(9626),l=(c(7485),c(184)),m={commentInvoiceValue:""};n.default=function(e){var n=(0,r.I0)(),c=e.blockCharge,s=(0,r.v9)((function(e){return e.invoice})).activeInvoice,v=(0,r.v9)((function(e){return e.ui})).actionView,f=(0,o.useState)(m),d=(0,i.Z)(f,2),h=d[0],C=d[1],I=h.commentInvoiceValue;(0,o.useEffect)((function(){if(s[0]&&s[0].comentario){var e={commentInvoiceValue:s[0].comentario};C(e)}else C(m)}),[s]),(0,o.useEffect)((function(){if(v&&v.length>0){var e={comentario:I};n((0,u.qC)(e))}}),[I,n,v]);return(0,l.jsxs)("div",{className:"invoice-comment-card",children:[(0,l.jsx)("p",{className:"comment-title",children:"Comentario:"}),(0,l.jsx)("textarea",{name:"commentInvoiceValue",disabled:c,value:I,onChange:function(e){var n=e.target;C((0,a.Z)((0,a.Z)({},h),{},(0,t.Z)({},n.name,n.value)))},className:"comment-detail",placeholder:"Escriba un comentario"})]})}}}]);
//# sourceMappingURL=967.0d23abdf.chunk.js.map