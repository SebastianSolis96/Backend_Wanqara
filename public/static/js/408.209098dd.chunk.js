"use strict";(self.webpackChunkclient=self.webpackChunkclient||[]).push([[408],{408:function(i,e,c){c.r(e);var n=c(6030),s=c(9626),t=c(3180),l=c(9522),a=(c(7485),c(184));e.default=function(i){var e=(0,n.I0)(),c=i.blockCharge,o=(0,n.v9)((function(i){return i.invoice})).activeInvoice,r=function(i){return i.filter((function(i){return i.total&&i.total.trim().length>0}))};return(0,a.jsxs)("div",{className:"articles-invoice-container",children:[(0,a.jsx)("div",{className:"action-button float-button",children:(0,a.jsx)("button",{disabled:!!c||!(o[0]&&o[0].cliente&&o[0].cliente.length>0),className:c?"btn-add-invoice disabled-button-action":o[0]&&o[0].cliente&&o[0].cliente.length>0?"btn-add-invoice":"btn-add-invoice disabled-button-action",onClick:c?void 0:o[0]&&o[0].cliente&&o[0].cliente.length>0?function(){e((0,t.AX)())}:void 0,children:(0,a.jsx)("img",{src:l.Z,alt:"new"})})}),(0,a.jsx)("div",{className:"articles-list-invoice",children:(0,a.jsx)("div",{className:"list-invoice",children:o[0]&&o[0].listProducts&&o[0].listProducts.length>0&&r(o[0].listProducts).length>0?r(o[0].listProducts).map((function(i,n){return(0,a.jsxs)("div",{onClick:c?function(){}:function(){return c=i.codigo.trim(),e((0,t.xe)()),void e((0,s.A9)(c));var c},children:[(0,a.jsxs)("div",{className:"articles-invoice",children:[(0,a.jsxs)("div",{className:"article-info-invoice",children:[(0,a.jsxs)("div",{className:"article-info-invoice-items",children:[(0,a.jsx)("p",{className:"article-info-invoice-title",children:"Bodega:"}),(0,a.jsx)("p",{className:"article-info-invoice-detail",children:i.bodega.trim()})]}),(0,a.jsxs)("div",{className:"article-info-invoice-items",children:[(0,a.jsx)("p",{className:"article-info-invoice-title",children:"C\xf3digo:"}),(0,a.jsx)("p",{className:"article-info-invoice-detail",children:i.codigo.trim()})]}),(0,a.jsxs)("div",{className:"article-info-invoice-items",children:[(0,a.jsx)("p",{className:"article-info-invoice-title",children:"Nombre:"}),(0,a.jsx)("p",{className:"article-info-invoice-detail \r name-article-invoice",children:i.detalle.trim()})]})]}),(0,a.jsxs)("div",{className:"article-values-invoice",children:[(0,a.jsxs)("div",{className:"article-info-invoice-items space-between",children:[(0,a.jsx)("p",{className:"article-info-invoice-title",children:"Cantidad:"}),(0,a.jsx)("p",{className:"article-info-invoice-detail",children:parseFloat(i.cantidad).toFixed(2)})]}),(0,a.jsxs)("div",{className:"article-info-invoice-items space-between",children:[(0,a.jsx)("p",{className:"article-info-invoice-title",children:"Precio:"}),(0,a.jsx)("p",{className:"article-info-invoice-detail",children:parseFloat(i.precio).toFixed(2)})]}),(0,a.jsxs)("div",{className:"article-info-invoice-items space-between",children:[(0,a.jsx)("p",{className:"article-info-invoice-title",children:"%Descto:"}),(0,a.jsx)("p",{className:"article-info-invoice-detail red",children:"-"+parseFloat(i.descto).toFixed(2)+" %"})]}),(0,a.jsx)("hr",{className:"hr-articles-invoice"}),(0,a.jsxs)("div",{className:"article-info-invoice-items space-between",children:[(0,a.jsx)("p",{className:"article-info-invoice-title",children:"TOTAL:"}),(0,a.jsx)("p",{className:"article-info-invoice-detail green",children:"$"+parseFloat(i.total).toFixed(2)})]})]})]}),(0,a.jsx)("hr",{className:"hr-articles-invoice item"})]},n)})):(0,a.jsx)("div",{className:"article-invoice"})})})]})}}}]);
//# sourceMappingURL=408.209098dd.chunk.js.map