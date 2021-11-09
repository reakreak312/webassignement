// <!-- ==================== -->
// <!--    By @Ren Vireak    -->
// <!-- ==================== -->

// data table jQuery
$(document).ready(function() {
  console.log('$(document).ready(function() {}');
  $('#table').DataTable({
      // ordering: true
  });
});

var defaultUser = {
  storageKey: 'login>index.html'
  ,email : 'admin@'
  ,password : '123'
};

//@key of all function, can't not null/undefined
var activeMenu = null, temp=null;;
var items = {}//proId:data;
var dasboardObj= ['Customers','Staffs','Accounts','Products','Suppliers','Orders','List Sale'];

//menu must setup in here
//@add @remove @update @save @rendertable @clear @loadmenu 
//all this function using the same logic for each menu page
var mapMenu = {
  'Dasboard':{
    pageURL:'dasboard.html'
    ,icon:'fas fa-chart-line fa-lg'
    ,isActive:false
    ,fields : []
    ,storageKey:''
    ,data : []
    ,formName:''
    ,prefixKey:''
    ,isOverrideFun:true
  }
  ,'Customers':{
    pageURL:'customer.html'
    ,icon:'fas fa-restroom fa-lg'
    ,isActive:false
    ,fields : ['id','cusFullName','cusGender','cusPhone','cusAddress']
    ,storageKey:'customer.html'
    ,data : []
    ,formName:'customerfm'
    ,notRequired:['id','cusPhone','cusAddress']
    ,prefixKey:'CUS'
    ,isOverrideFun:false
    ,isOverrideForm:true
    ,addNewFormId:'addNewModel'
  }
  ,'Staffs':{
    pageURL:'staff.html'
    ,icon:'fas fa-user-shield fa-lg'
    ,isActive:false
    ,fields : ['id','stfNameKH','stfNameEN','stfGender','stfDateOfBirth','stfHireData','stfPhone','stfEmail','stfAddress']
    ,storageKey:'staff.html'
    ,data : []
    ,formName:'stafffm'
    ,notRequired:['id','cusPhone','stfAddress','stfPhone','stfEmail']
    ,prefixKey:'STA'
    ,isOverrideFun:false
    ,isOverrideForm:true
    ,addNewFormId:'addNewModel'
  }
  ,'Accounts':{
    pageURL:'account.html'
    ,icon:'fas fa-users fa-lg'
    ,isActive:false
    ,fields : ['id','accStaffId','accUsername','accRole','accPassword','accStatus']
    ,storageKey:'account.html'
    ,data : []
    ,formName:'accountfm'
    ,notRequired:['id']
    ,prefixKey:'ACC'
    ,isOverrideFun:false
    ,isOverrideForm:true
    ,addNewFormId:'addNewModel'
  }
  ,'Categorys':{
    pageURL:'category.html'
    ,icon:'fas fa-box-open fa-lg'
    ,isActive:false
    ,fields : ['id','catName','catStatus']
    ,storageKey:'category.html'
    ,data : []
    ,formName:'categoryfm'
    ,notRequired:['id']
    ,prefixKey:'CAT'
    ,isOverrideFun:false
    ,isOverrideForm:true
    ,addNewFormId:'addNewModel'
  }
  ,'Products':{
    pageURL:'Xproduct.html'
    ,icon:'fas fa-file-signature fa-lg'
    ,isActive:false
    ,fields : ['id','proCategory','proAccount','proName','proPrice','proThumnail','proDetail','proStatus']
    ,storageKey:'Xproduct.html'
    ,data : []
    ,formName:'productfm'
    ,notRequired:['id','proThumnail','proDetail']
    ,prefixKey:'PRO'
    ,isOverrideFun:false
  }
  ,'Suppliers':{
    pageURL:'supplier.html'
    ,icon:'fas fa-cubes fa-lg'
    ,isActive:false
    ,fields : ['id','supName','supGender','supAddress','supEmail','supPhone']
    ,storageKey:'supplier.html'
    ,data : []
    ,formName:'supplierfm'
    ,notRequired:['id','supEmail','supPhone']
    ,prefixKey:'SUP'
    ,isOverrideFun:false
    ,isOverrideForm:true
    ,addNewFormId:'addNewModel'
  }
  ,'Stocks':{
    pageURL:'stock.html'
    ,icon:'fas fa-store fa-lg'
    ,isActive:false
    ,fields : ['id','stkProductId','stkSupplier','stkQty','stkExpotBy','stkExportData','stkExpiredDate']
    ,storageKey:'stock.html'
    ,data : []
    ,formName:'stockfm'
    ,notRequired:['id']
    ,prefixKey:'SUP'
    ,isOverrideFun:false
    ,isOverrideForm:true
    ,addNewFormId:'addNewModel'
  }
  ,'Sale Orders':{
    pageURL:'order.html'
    ,icon:'fas fa-home fa-lg'
    ,isActive:false
    ,fields : ['id','ordCustomerId','ordDate','ordCreatedBy','ordProductId','ordProductName','ordDate']
    ,itemFields : ['ordProductId','ordQty','ordProductName','ordCategory','ordPrice','ordAmount']
    ,storageKey:'order.html'
    ,data : []
    ,formName:'itemfm'
    ,notRequired:['id']
    ,prefixKey:'ORD'
    ,isOverrideFun:false
    ,isOverrideForm:false
    // ,addNewFormId:'addNewModel'
  }
  ,'List Sale':{
    pageURL:'invoice.html'
    ,icon:'fas fa-file-invoice-dollar fa-lg'
    ,isActive:false
    ,fields : ['id','invCreatedBy','invCustomerName','invSaleData','invTotal','invDiscount','invReccive','invReturn','invPaymentSatus','invType','invInreccive','invDescription']
    ,storageKey:'order.html'
    ,data : []
    ,formName:'itemfm'
    ,notRequired:['id']
    ,prefixKey:'ORD'
    ,isOverrideFun:false
    ,isOverrideForm:false
    // ,addNewFormId:'addNewModel'
  }
};
console.log(mapMenu);
//@menu render
init();

function init() {
  crateDefaultUser();
  if(!defaultUser.isLog) return getFileFromBaseURL()=='index.html'? "" :navigateTo('index.html');
  cacheMenuText();
  loadDataOfMenu();
  //re-use code, but don't need templete
  if(activeMenu==null) return;
  var mainp = document.getElementById('pageContent');
  document.body.innerHTML = getDasboardTemplete(mapMenu["allli"]);
  var domDsb = document.getElementById('toprow');
  mainp.className = 'col-md-9 ms-sm-auto col-lg-10 px-md-4';
  domDsb.append(mainp);
  if(!activeMenu.isOverrideFun) preloadOption();
}

function crateDefaultUser() {//isLog
  const ux = retrieveFromStorage(defaultUser.storageKey);
  if(ux==undefined||ux==null) save2Storage(defaultUser.storageKey,defaultUser);
  else defaultUser = ux;
}
//form option relationship
function preloadOption() {
  const url = activeMenu.pageURL;
   //form: any, element: any, relateToKey: any, value: any, label: any)
  if(url=='account.html') loadOption('accStaffId','Staffs','id','stfNameEN');
  if(url=='Xproduct.html') {
    loadOption('proCategory','Categorys','id','catName');
    // loadOption('proAccount','Accounts','id','accStaffId');
    setInitValue('proAccount',activeMenu.formName,defaultUser.email);
  }
  if(url=='order.html') {
    // loadOption('ordProductId','Products','id','proName');
    loadOption('ordCustomerId','Customers','id','cusFullName');
    setInitValue('ordDate','itemfm',new Date().toJSON().slice(0, 10));
    setInitValue('ordCreatedBy','itemfm',defaultUser.email);
    refreshItem();
  }
  if (url=='stock.html') {
    loadOption('stkProductId','Products','id','proName');
    loadOption('stkSupplier','Suppliers','id','supName');
    setInitValue('stkExpotBy',activeMenu.formName,defaultUser.email);
    setInitValue('stkQty',activeMenu.formName,'1');
  }
}

function refreshItem() {
  let pros = document.getElementById('productSelect');
  pros.innerHTML=getItems();
}

function getStockQty() {
  var re = {};
  const stk = mapMenu['Stocks'].data.length>0 ? mapMenu['Stocks'].data : retrieveFromStorage(mapMenu['Stocks'].storageKey);
  // console.log('data.length?'+mapMenu['Stocks'].data.length);
  // console.log('stk ?',stk);
  if(stk!=undefined){
    for (let index = 0; index <stk.length; index++){
      if(re[stk[index]['stkProductId']]==undefined||re[stk[index]['stkProductId']]==null) re[stk[index]['stkProductId']]=0;
      re[stk[index]['stkProductId']]+=parseInt(stk[index]['stkQty']);
    }
  }
  // console.log('re ?',re);
  return re;
}

function getItems() {
  const listPro = retrieveFromStorage(mapMenu['Products'].storageKey);
  // console.log(listPro);
  const x =  getStockQty();
  // console.log('x?',x);
  let rex = '';
  if(listPro!=undefined){
    for (let index = 0; index <listPro.length; index++) rex += itemsDiv(listPro[index],x[listPro[index]['id']]==undefined?0:parseInt(x[listPro[index]['id']]));
  }
  return rex;
}

function itemsDiv(pro,qty) {
  return ''
  +'<div onclick="doAddItem(\''+pro['id']+'\');" class="item_type" style="cursor:pointer;">' 
  +    '<h5><i class="fas fa-cart-arrow-down"></i>('+qty+')<br>'+pro['proName']+'</h5>'
  +    '<h5><i class="fas fa-barcode"></i>'+pro['id']+'</h5>'
  +    '<h5><i class="fas fa-money-check-alt"></i> $'+pro['proPrice']+' </h5>'
  +'</div>';
}

function doAddItem(proId) {
  // console.log('doAddItem?',proId);
  // console.clear();
  let doc = document['itemfm'];
  let pro = getRecord('Products',proId);
  if(pro==undefined||pro==null) return showToast('error','invalid product.');
  let item = {};
  item['qty'] = parseInt(doc['ordQty'].value);
  item['price'] = pro['proPrice'];
  item['itmProductId'] = pro['id'];
  item['product'] = pro;
  //exist ?? alredy added
  let existPro = null;
  if(items[item['itmProductId']]!=undefined) existPro = items[item['itmProductId']];
  //update stock validation?? outstock
  if(updateStock(pro['id'],item['qty'])==false){
    return showToast('warning','Product ['+pro['proName']+'] outstock.',{duration:3000});
  }
  else {
    ////exist ?? alredy added
    if(existPro!=null){
      items[item['itmProductId']]['qty']+=parseInt(item['qty']);
      items[item['itmProductId']]['itmAmount']=calAmount(items[item['itmProductId']]['qty'],item['price']);
    }
    //new item
    else{
      item['itmAmount'] = calAmount(item['qty'],item['price']);
      items[pro['id']]=item;
    }
  }
  // console.log(item);
  // console.log(items);
  refreshItem();
  loadItems();
}

function updateStock(proId,Qtyx) {
  let stock = mapMenu['Stocks'].data.length>0 ? mapMenu['Stocks'].data : retrieveFromStorage(mapMenu['Stocks'].storageKey); 
  // console.log('stock?',stock);
  // console.log(proId);
  // console.log('updateStockQty?'+Qty);
  let foundIndex = [], currentQty=0;
  for (let index = 0; index < stock.length; index++) {
    if (stock[index]['stkProductId']==proId) {
      foundIndex.push(index);
      currentQty+=parseInt(stock[index]['stkQty']);
      // console.log('stockQty?'+stock[index]['stkQty']);
    }
  }
  // console.log('currentQty ? '+currentQty+', Qtyx?'+Qtyx);
  let number = currentQty - parseInt(Qtyx);
  // console.log('foundIndex ?',foundIndex);
  // update stock
  if(number>=0) {
    // stock[index]['stkQty'] = number;
    let Qty = Qtyx;
    for (let x in foundIndex) {
      let i = foundIndex[x];
      // console.log('stk?',stock[i]);
      // console.log('stock[i][stkQty] ? '+stock[i]['stkQty']+', Qty?'+Qty);
      if((parseInt(stock[i]['stkQty'])-Qty)<=0){
        // console.log('<=0');
        Qty = Qty - parseInt(stock[i]['stkQty']);
        stock[i]['stkQty']=0;
        // console.log('stock[i][stkQty]?'+stock[i]['stkQty']);
      }
      else if((parseInt(stock[i]['stkQty'])-Qty)>0) {
        // console.log('>0');
        stock[i]['stkQty']=parseInt(stock[i]['stkQty'])-Qty;
        // console.log('stock[i][stkQty]?'+stock[i]['stkQty']);
        break;
      }
    }
    // console.log('stock?',stock);
    mapMenu['Stocks'].data=stock;
    // console.log('mapMenu[Stocks].data?',mapMenu['Stocks'].data);
    return true;
  }
  return false;
}

function calAmount(qty,price) {
  let res = parseInt(qty) * parseFloat(price);
  res = foat2digit(res);
  return isNaN(res) ? 0 : res;
}

function foat2digit(ftValue) {
  return Math.round(ftValue*100)/100;
}

function setInitValue(element,form,value) {
  document[form][element].value = value;
}

function moneyExchange(value,type) {
  let oneDulla = 4000; //1$=4100r
  if(type.toUpperCase()=='KH') return parseFloat(value) / oneDulla; //to dolla
  // type.toUpperCase=='USD'
  else return parseFloat(value) * oneDulla; //to real
}

function commaMoneyKhmer(value) {
  return value;
  // incorrect logic
  let str = ''+value;
  str = str.split("").reverse().join("");
  return str.match(/.{1,3}/g).reverse().join(",");
}

function doExchangeReturn(event) {
  let cur = event.target.name;
  if(cur.startsWith('ordKHReceived')) document['itemfm']['ordUSDReceived'].value=0;
  else if(cur.startsWith('ordUSDReceived')) document['itemfm']['ordKHReceived'].value=0;
  loadItems();
}

function createOrderRecord(rec) {
  let res = {}
  console.log(rec);
  console.log(items);
  res['id'] = rec['id'];
  res['invCreatedBy'] = rec['ordCreatedBy'];
  res['invCustomerName'] = rec['ordCustomerId'];
  res['invSaleData'] = rec['ordDate'];
  res['invDiscount'] = '';
  res['invTotal'] = parseFloat(items['payment']['ChangReturn']);
  res['invReccive'] = parseFloat(items['payment']['ReceivedAmount']);
  res['invReturn'] = items['payment']['completePay']==true?parseFloat(items['payment']['RemainAmount']):0;
  res['invPaymentSatus'] = items['payment']['completePay']==true?'Complete':'InComplete';
  res['invType'] = items['payment']['Type'];
  res['invInreccive'] = items['payment']['completePay']!=true?items['payment']['RemainAmount']:0;
  res['invDescription'] = '';
  res['items'] = items;
  return res;
}

function updateChangReturn() {
  let doc = document['itemfm'];
  let types = [];
  if(doc['ordKHReceived'].value!=''&&doc['ordKHReceived'].value!=0) types.push('KH');
  if(doc['ordUSDReceived'].value!=''&&doc['ordUSDReceived'].value!=0) types.push('USD');
  items['payment'] = {};
  if(types.length==0) types.push('USD');
  for (let x = 0; x < types.length; x++) {
    const type = types[x];
    let value = doc['ord'+type+'Received'].value;
    let total = foat2digit(type.toUpperCase()=='KH'?moneyExchange(getTotalCurrentOrder(),'USD'):getTotalCurrentOrder());
    // console.log('total ?'+total);
    var typ = {}, remain = value-total>=0?foat2digit(value-total):total-value;
    typ['Type'] = type;
    typ['ReceivedAmount'] = value;
    typ['ChangReturn'] = total;
    typ['RemainAmount'] = remain;
    typ['completePay'] = value-total>=0;
    items['payment'] = typ 
    document.getElementById(type+'ReceivedAmount').innerHTML=value;
    document.getElementById(type+'ChangReturn').innerHTML=total;
    document.getElementById(type+'RemainAmount').innerHTML=typ['completePay']?remain:'not enought['+remain+']';
  }
}

function getTotalCurrentOrder() {
  // console.log(items);
  let x = 0;
  for (const key in items) {
    let rec = items[key];
    // console.log(rec);
    if (Object.hasOwnProperty.call(rec, 'itmAmount')) {
      x += parseFloat(rec['itmAmount']);
    }
  }
  return x;
}

function loadItems(){
  var ix=0, tbdy = document.getElementById('itemTblbody');
  tbdy.innerHTML='';
  let total = 0;
  // console.log(items);
  for (let k in items) {
    if(k=='payment') continue;
    const itm = items[k];
    // console.log(itm);
    total += parseFloat(itm['itmAmount']);
    let tr = document.createElement('tr');
    let atd='';ix++;
    atd+='<td scope="row">'+(parseInt(ix))+'</td>'
    +'<td>'+itm['product']['id']+'</td>'
    +'<td>'+itm['product']['proName']+'</td>'
    +'<td>'+itm['qty']+'</td>'
    +'<td> $'+itm['product']['proPrice']+' </td>'
    +'<td> $'+itm['itmAmount']+' </td>'
    // +'<td><a class="btn btn-primary col-sm-6"><i class="fas fa-minus-circle"></i></a></td>';
    +'<td><a onclick="doRemoveItem(\''+itm['product']['id']+'\');" class="mx-1 px-1 py-0 btn btn-sm btn-outline-danger p-2">'
    +'<i class="fas fa-minus-circle"></i>'
    +'</a></td>';
    tr.innerHTML = atd;
    tbdy.prepend(tr);
  }
  if(ix>0){
    let cls = "table-primary";
    let tr = document.createElement('tr'),tr2 = document.createElement('tr');
    tr.className=cls;
    let tds ='<td colspan="5" style="text-align:right;"><b>Total</b></td>'
    +'<td colspan="2">($)<b id="USDtotal">'+(foat2digit(total))+'</b></td>';
    tr.innerHTML=tds;
    tr2.className=cls;
    tr2.innerHTML = '<td colspan="5"></td>'
    +'<td colspan="2">(រ)<b id="KHtotal">'+(commaMoneyKhmer(moneyExchange(foat2digit(total),'USD')))+'</b></td>';
    tbdy.append(tr);
    tbdy.append(tr2);
    document.getElementById('USDChangReturn').innerHTML=foat2digit(total);
    document.getElementById('KHChangReturn').innerHTML=moneyExchange(foat2digit(total),'USD');
  }
  updateChangReturn();
}

function doRemoveItem(itemId) {
  if(items[itemId]!=undefined) {
    delete items[itemId];
    loadItems();
  }
}

function doChangeProOrder(event) {
  let proId = event.target.value;
  let pro = getRecord('Products',proId);
  if(pro==null) return;
  // console.log(pro);
  let doc = document[activeMenu.formName];
  if (doc!=undefined) {
    let cat = getRecord('Categorys',pro['proCategory']);
    let qty = doc['ordQty'].value;
    doc['ordProductName'].value = pro['proName'];
    doc['ordCategory'].value = cat==null?'':cat['catName'];
    doc['ordPrice'].value = pro['proPrice'];
  }
}

function getRecord(objName,recId) {
  var obj = mapMenu[objName]; 
  if(obj==undefined||obj==null) return null;
  let dt = retrieveFromStorage(obj.storageKey);
  // console.log('getRecord?'+recId+'?',dt);
  for (const inx in dt) {
    const rec = dt[inx];
    if (Object.hasOwnProperty.call(rec,'id')) {
      if(rec['id']==recId) return rec;
    }
  }
  return null;
}

function cacheMenuText() {
  setActivePage();
  // console.log(mapMenu);
  var alLi = '';
  for (const nm in mapMenu) {
    if (Object.hasOwnProperty.call(mapMenu, nm)) {
      var menu = mapMenu[nm];
      var li = 
      '<li class="nav-item white-hover" style="font-size: 16px;">'
      +  '<a id="Dashboard" class="nav-link '+(menu.isActive?'active':'')+'" aria-current="page" href="'+menu.pageURL+'">'
      +    '<i class="'+menu.icon+'"></i>\n'
      +     nm
      +  '</a>'
      +'</li>'
      menu['li']=li;
      alLi+=li;
    }
  }
  mapMenu['allli']=alLi;
}

function getFileFromBaseURL() {
  let baseURL = window.location.href;
  let path = baseURL.split('/');
  return path[path.length-1];
}

function setActivePage() {
  let act=null;
  let fileName = getFileFromBaseURL();
  for (const nm in mapMenu) {
    if (Object.hasOwnProperty.call(mapMenu,nm)) {
      if (fileName.startsWith(mapMenu[nm].pageURL)) {
        mapMenu[nm].isActive = true;
        activeMenu = mapMenu[nm];
        act=nm;
      }
      else mapMenu[nm].isActive = false;
    }
  }
  if(activeMenu==null) return;
  const dt = retrieveFromStorage(activeMenu.storageKey);
  if(dt!=undefined&&dt!=null&&dt.length>0) activeMenu.data = dt;
  document.title = 'Inventory | '+act;
}

function save2Storage(key,data) {
  // console.log(key);
  // console.log(data);
  localStorage.setItem(key,JSON.stringify(data));
}

function retrieveFromStorage(key) {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch (e) {
    alert(e);
  }
}

function loadDataOfMenu(){
  if (activeMenu==null) return;
  if (!activeMenu.isOverrideFun) laodData();
  if(activeMenu.pageURL=='dasboard.html') dasboardAnalyRender(dasboardObj);
}

//Start Products Page ==========

function laodData() {
  // console.log('activeMenu ? ',activeMenu);
  var tbl = document.getElementById('table');
  if(!tbl) return;
  let tblbody = tbl.children[1];
  // console.log(tblbody);
  let atr ='',isSkip=false;
  isSkip = (activeMenu.pageURL=='invoice.html');
  for (let index = 0; index < activeMenu.data.length; index++) {
    let tr ='<tr>';
    const pro = activeMenu.data[index];
    // console.log(pro);
    let x=1, atd='';
    for (const ix in activeMenu.fields) {
      const key=activeMenu.fields[ix];
      if (Object.hasOwnProperty.call(pro, key)) {
        const element = pro[key];
        if(x==1) atd+='<td scope="row">'+(parseInt(index)+1)+'</td>'
        atd += '<td>'+element+'</td>';
        x++;
      }
    }
    let btn =
    '<td>'
    +    '<button onclick="doRemoveRecord(\''+pro.id+'\');" class="mx-1 px-1 py-0 btn btn-sm btn-outline-danger p-2">'
    +        '<i class="fas fa-trash-alt"></i>'
    +    '</button>';

    if(!isSkip)btn +=    '<a onclick="doEditRecord(\''+pro.id+'\');" class="mx-1 px-1 py-0 btn btn-sm btn-outline-primary p-2" href="#" role="button">'
    +        '<i class="fas fa-edit"></i>'
    +    '</a>';

    btn+='</td>';
    atd+=btn;
    tr+=atd+'</tr>';
    atr+=tr;
  }
  if(tblbody!=undefined&&tblbody!=null) tblbody.innerHTML = atr;
}

function validProduct(object) {
  const notRequiredfields = activeMenu.notRequired;
  for (const key in object) {
    if (!notRequiredfields.includes(key) && (object[key]==undefined || object[key]=='' || object[key]=='--None--')) return key.replace(key.substring(0,3),'');
  }
  return null;
}

function doAdd(evt) {
  var act = evt.target.innerHTML;
  let isOrder = activeMenu.pageURL=='order.html';
    const fields = activeMenu.fields;
    let fdoc = document[activeMenu.formName];
    var rec = {};
    for (let i in fields){
      const x = fields[i];
      if(fdoc[x]!=undefined) rec[x] = fdoc[x].value;
    }
    const max=9999,min=1000;
    let f = validProduct(rec);
    if(f!=null) return showToast('warning','please fill the value of ['+f+']',{duration: 5000});
    if(act=='Add'||isOrder) {
      rec['id'] = activeMenu.prefixKey+Math.floor(Math.random() * (max - min + 1) + min);
      if(isOrder){
        rec = createOrderRecord(rec);
      }
      activeMenu.data.unshift(rec);
      showToast('success','record created.');
    }
    else {
      updateRecord(rec);
      showToast('success','record updated.');
    }
    // console.log(rec);
    // console.log(activeMenu.data);
    let btnCancel = document.getElementById('cancel');
    if(btnCancel!=undefined&&btnCancel!=null) btnCancel.click();
    // top form
    if(activeMenu.pageURL=='Xproduct.html') clearProductForm();
    else if(activeMenu.pageURL=='order.html'){}
    else clearForm();
    if(isOrder) doSave(); 
  laodData();
}

function clearProductForm() {
  let fdoc = document[activeMenu.formName];
  for (let i in activeMenu.fields){
    const x = activeMenu.fields[i];
    if(fdoc[x]!=undefined){
      // console.log((x!='proCategory' && x!='proStatus' && x!='proAccount')+x);
      if (x!='proCategory' && x!='proStatus' && x!='proAccount') fdoc[x].value='';
    }
  }
}

function updateRecord(pro) {
  for (const ix in activeMenu.data) {
    if (activeMenu.data[ix].id==pro.id) activeMenu.data[ix] = pro;
  }
  var btn = document.getElementById('doAddBtn');
  if(btn!=undefined) btn.innerHTML='Add';
}

function clearForm() {
  let fdoc = document[activeMenu.formName];
  const fields = activeMenu.fields;
  for (let i in fields){
    const x = fields[i];
    if(fdoc[x]!=undefined){
      if(fdoc[x].disabled==true) continue;
      fdoc[x].value='';
    }
  }
  // preloadOption();
}

function doRemoveRecord(proId) {
  for (const ix in activeMenu.data) {
    if (activeMenu.data[ix].id==proId) {
      if (confirm('are you sure want to remove this record?')) {
        activeMenu.data.splice(ix, 1);
        laodData();
        showToast('success','record removed!');
      }
    }
  }
}

function doEditRecord(proId) {
  if(activeMenu.addNewFormId!=undefined){
    let btn = document.getElementById(activeMenu.addNewFormId);
    btn.click();
  }
  for (const ix in activeMenu.data) {
    if (activeMenu.data[ix].id==proId) {
      const fields = activeMenu.fields;
      let fdoc = document[activeMenu.formName];
      for (let i in fields){
        const x = fields[i];
        if(fdoc[x]!=undefined) fdoc[x].value=activeMenu.data[ix][x];
      }
    }
  }
  var btn = document.getElementById('doAddBtn');
  btn.innerHTML='Save Change';
}

function doSave() {
  if(confirm('save to local storage?')){
    save2Storage(activeMenu.storageKey,activeMenu.data);
    if(activeMenu.pageURL=='order.html'){
      save2Storage(mapMenu['Stocks'].storageKey,mapMenu['Stocks'].data);
      navigateTo('invoice.html'); 
    }
    //location.reload();
    showToast('success','data saved to local storage sucess.');
  }
}

function doCancel() {
  if(confirm('are you sure want to cancel?')) location.reload();
}

function doSingOut() {
  if (confirm('are you sure want to singout?')) navigateTo('index.html'); 
}

function updateMoneyDasboard() {
  const invoice = retrieveFromStorage(mapMenu['List Sale'].storageKey);
  var money = { USD:{Total:0,Inreccive:0},KH:{Total:0,Inreccive:0} };
  if(invoice!=null){
    for (let index = 0; index < invoice.length; index++) {
      const inc = invoice[index];
      money[inc['invType']]['Total'] += parseFloat(inc['invTotal']);
      money[inc['invType']]['Inreccive'] += parseFloat(inc['invInreccive']);
    }
  }
  
  var rew ='<div class="row">';
  for (const type in money) {
    if (Object.hasOwnProperty.call(money, type)) {
      const element = money[type];
      rew += getMoneyCard(element,type);
    }
  }
  rew += '<div>';
  document.getElementById('pageContent').innerHTML=rew;
}

function dasboardAnalyRender(listOBj) {
  let cards='';
  updateMoneyDasboard();
  for (const inx in listOBj) {
    const keyx = listOBj[inx];
    // console.log('keyx ?',keyx);
    let m = mapMenu[keyx];
    // console.log('m ?',m);
    if(m!=undefined){
      const data = retrieveFromStorage(m.storageKey);
      // console.log(data);
      let numberofrecord = data==undefined||data==null?0:data.length;
      let card=
      '<div class="card col-5 m-3 gray-hover" style="box-shadow: gray 3px 3px 5px;cursor:pointer" onclick="navigateTo(\''+m.pageURL+'\');">'
      +  '<div class="card-body">'
      +    '<div class="row">'
      +      '<div class="col mt-0">'
      +        '<h5 class="card-title">'+keyx+'</h5>'
      +      '</div>'
      +      '<div class="col-auto">'
      +        '<div class="stat text-primary">'
      +          '<i class="'+m.icon.replace('fa-lg','fa-3x')+'" style="color:#000;"></i>'
      +        '</div>'
      +      '</div>'
      +    '</div>'
      +    '<h1 class="mt-1 mb-3">'+numberofrecord+'</h1>'
      // +    '<div class="mb-0">'
      // +      '<span class="text-danger"><i class="mdi mdi-arrow-bottom-right"></i> -3.65% </span>'
      // +      '<span class="text-muted">Since last week</span>'
      // +    '</div>'
      +  '</div>'
      +'</div>';
      cards+=card;
    }
  }
  var chart =
  '<div class="row justify-content-left">'
  // +  '<div class="col-sm-6">'
  +   cards
  // +  '</div>'
  +'<div>';
  let pg = document.getElementById('pageContent');
  let initEle = pg.innerHTML;
  pg.innerHTML = initEle + chart;
}

function navigateTo(url) {
  window.location.href=url;
}

function loadOption(element,relateToKey,value,label) {
  if (relateToKey!=undefined&&relateToKey!='') {
    let menu = mapMenu[relateToKey];
    if(menu!=undefined){
      let opts = '<option value="">--None--</option>';
      let data = retrieveFromStorage(menu.storageKey);
      // console.log(data);
      for (const inx in data) {
        const rec = data[inx];
        opts+='<option value="'+rec[value]+'">'+rec[label]+'</option>';
      }
      document.getElementsByName(element)[0].innerHTML=opts;
      // console.log(document.getElementsByName(element));
      // console.log(opts);
    }
  }
}

function showToast(status,message,param) {
  const stt = status.toLowerCase();
  // console.log(tata);
  if(param==undefined || !param instanceof Object) param={duration: 1000};
  switch (stt) {
    case 'log': tata.log(status.toUpperCase(),message,param);break;
    case 'info': tata.info(status.toUpperCase(),message,param);break;
    case 'success': tata.success(status.toUpperCase(),message,param);break;
    case 'warning': tata.warn(status.toUpperCase(),message,param);break;
    case 'error': tata.error(status.toUpperCase(),message,param);break;
    default: tata.text(status.toUpperCase(),message,param); break;
  }
}

function doLogin() {
  var user = retrieveFromStorage(defaultUser.storageKey);
  if(user==undefined||user==null) navigateTo('index.html');
  var df = document.loginfm,next=false;
  let usern = df.email.value, pass = df.password.value;
  if(usern==''||pass=='') return showToast('warning','username, password can\'t be blank.');
  else if(usern==user.email && pass==user.password) next = true;
  else return showToast('error','incorrect username or password.\nDefault[\nusername='+user.email+', password='+user.password+'].',{duration: 5000});
  if(next){
    user.isLog=true;
    save2Storage(user.storageKey,user);
    navigateTo('dasboard.html');
  }
}
//End Products Page ==========

//@dasboard fix page

function getDasboardTemplete(menuLi) {
  return '<header class="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0 shadow">'
  +  '<a id="siteName" class="navbar-brand col-md-3 col-lg-2 me-0 px-3" href="index.html">'
  +      '<h4 style="text-shadow:green 2px 2px 2px; color:white;">WEB Assignment</h4>'
  +   '</a>'
  +  '<button class="navbar-toggler position-absolute d-md-none collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#sidebarMenu" aria-controls="sidebarMenu" aria-expanded="false" aria-label="Toggle navigation">'
  +    '<span class="navbar-toggler-icon"></span>'
  +  '</button>'
  // +  '<input class="form-control form-control-dark w-100" type="text" placeholder="Search" aria-label="Search">'
  +  '<div class="navbar-nav">'
  +    '<div class="nav-item text-nowrap">'
  +      '<a class="nav-link px-3" href="#" onclick="doSingOut();">Sign out</a>'
  +    '</div>'
  +  '</div>'
  +'</header>'
  +'<div class="container-fluid">'
  +  '<div class="row" id="toprow">'
  +    '<nav id="sidebarMenu" class="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse" style="border: 5px solid #191c1f;">'
  +      '<div class="position-sticky pt-2">'
  +        '<ul class="nav flex-column">'
  +             menuLi
  +        '</ul>'
  +        '<h6 class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">'
  +          '<span>Saved reports</span>'
  +          '<a class="link-secondary" href="#" aria-label="Add a new report">'
  +            '<span data-feather="plus-circle"></span>'
  +          '</a>'
  +       ' </h6>'
  +        '<ul class="nav flex-column mb-2">'
  +          '<li class="nav-item">'
  +            '<a class="nav-link" href="#">'
  +              '<span data-feather="file-text"></span>'
  +              'Current month'
  +            '</a>'
  +          '</li>'
  +          '<li class="nav-item">'
  +            '<b class="nav-link" href="#">'
  +              '<span data-feather="file-text"></span>'
  +               defaultUser.email
  +            '</b>'
  +          '</li>'
  +        '</ul>'
  +      '</div>'
  +    '</nav>'
  +  '</div>'
  +'</div>';
}

function getMoneyCard(element,type) {
  return '<div class="col-xl-5 col-md-6 mb-4">'
  +   '<div class="card border-left-primary shadow h-100 py-2" style="background:#d3d3d3;">'
  +       '<div class="card-body">'
  +           '<div class="row no-gutters align-items-center">'
  +               '<div class="col mr-2">'
  +                   '<div class="text-xs font-weight-bold text-dark text-uppercase mb-1">'
  +                       'Total'
  +                   '</div>'
  +                   '<div class="h5 mb-0 font-weight-bold text-gray-800">'+element['Total']+'</div>'
  +               '</div>'
  +               '<div class="col mr-2">'
  +                   '<div class="text-xs font-weight-bold text-dark text-uppercase mb-1">'
  +                       'Reccive'
  +                   '</div>'
  +                   '<div class="h5 mb-0 font-weight-bold text-gray-800">'+(parseFloat(element['Total']) - parseFloat(element['Inreccive']))+'</div>'
  +               '</div>'
  +               '<div class="col mr-2">'
  +                   '<div class="text-xs font-weight-bold text-dark text-uppercase mb-1">'
  +                       'indebted'
  +                   '</div>'
  +                   '<div class="h5 mb-0 font-weight-bold text-gray-800">'+element['Inreccive']+'</div>'
  +               '</div>'
  +               '<div class="col-auto">'
  +                   '<b style="font-size:25px;">'+type+'</b>'
  +               '</div>'
  +           '</div>'
  +       '</div>'
  +   '</div>'
  +'</div>'
}

//end dasboard