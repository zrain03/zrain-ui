import test from 'node:test';
import assert from 'node:assert/strict';
import {mountZrainUI,ZRAIN_HOME,ZRAIN_TAGLINE} from '../src/zrain-ui.js';
function node(tag){return {tag,children:[],attributes:{},setAttribute(k,v){this.attributes[k]=v},append(...n){this.children.push(...n)},replaceChildren(...n){this.children=n}}}
test('main brand navigation and footer stay consistent',()=>{
 const header=node('div'),footer=node('div'),nav=node('nav'); nav.append(node('a'));
 const doc={createElement:node,querySelector(s){if(s==='.zrain-header .zrain-brand')return header;if(s==='.zrain-footer .zrain-footer__identity')return footer;if(s.includes('.main-nav'))return nav;return null}};
 const result=mountZrainUI({product:'Monitor',logoSrc:'/zrain-logo.webp',productHref:'/monitor',document:doc});
 assert.equal(header.children[0].href,ZRAIN_HOME);
 assert.equal(header.children[0].children[1].textContent,'Zrain');
 assert.equal(header.children[1].textContent,'Monitor');
 assert.equal(header.children[1].href,'/monitor');
 assert.equal(footer.children[0].href,ZRAIN_HOME);
 assert.equal(footer.children[0].children[1].children[0].textContent,'Developed by Zrain');
 assert.equal(footer.children[0].children[1].children[1].textContent,ZRAIN_TAGLINE);
 assert.equal(nav.children.length,1);
 assert.equal(result.homeHref,ZRAIN_HOME);
});
test('optional navigation renders for a new project',()=>{
 const header=node('div'),footer=node('div'),nav=node('nav'),footerLinks=node('div');
 const doc={createElement:node,querySelector(s){if(s==='.zrain-header .zrain-brand')return header;if(s==='.zrain-footer .zrain-footer__identity')return footer;if(s.includes('.main-nav'))return nav;if(s.includes('.zrain-footer__links'))return footerLinks;return null}};
 mountZrainUI({product:'Ecosystem',logoSrc:'/zrain-logo.webp',document:doc,navigation:[{label:'Products',href:'#products',current:true}],footerLinks:[{label:'Contact',href:'mailto:zrain.dev@gmail.com'}]});
 assert.equal(nav.children[0].textContent,'Products');
 assert.equal(nav.children[0].attributes['aria-current'],'page');
 assert.equal(footerLinks.children[0].href,'mailto:zrain.dev@gmail.com');
});
test('reject missing required configuration',()=>{assert.throws(()=>mountZrainUI({product:'Monitor'}),TypeError)});
