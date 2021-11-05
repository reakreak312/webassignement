//menu must setup in here
//@each menu must the same structure
//@add @remove @update @save @rendertable @clear @loadmenu 
//all this function using the same logic for each menu page
//@html file should be the same structure
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
    ,fields : ['id','accStaffId','accRole','accUsername','accPassword','accStatus']
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
    ,fields : ['id','stkProductId','stkProductName','stkCategory','stkExpotBy','stkExportData','stkExpiredDate']
    ,storageKey:'stock.html'
    ,data : []
    ,formName:'stockfm'
    ,notRequired:['id']
    ,prefixKey:'SUP'
    ,isOverrideFun:false
    ,isOverrideForm:true
    ,addNewFormId:'addNewModel'
  }
  ,'Orders':{
    pageURL:'order.html'
    ,icon:'fas fa-home fa-lg'
    ,isActive:false
    ,fields : []
    ,storageKey:''
    ,data : []
    ,formName:''
    ,prefixKey:''
    ,isOverrideFun:true
  }
};

//@key of all function, can't not null/undefined
var activeMenu = null;
var dasboardObj= ['Customers','Staffs','Accounts','Products','Suppliers','Orders'];

//form option relationship
function preloadOption() {
   //form: any, element: any, relateToKey: any, value: any, label: any)
  if(activeMenu.pageURL=='account.html') loadOption('accStaffId','Staffs','id','stfNameEN');
  if(activeMenu.pageURL=='Xproduct.html') {
    loadOption('proCategory','Categorys','id','catName');
    loadOption('proAccount','Accounts','id','accStaffId');
  }
}

//@menu render
init();

function init() {
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

function cacheMenuText() {
  setActivePage();
  // console.log(mapMenu);
  var alLi = '';
  for (const nm in mapMenu) {
    if (Object.hasOwnProperty.call(mapMenu, nm)) {
      var menu = mapMenu[nm];
      var li = 
      '<li class="nav-item white-hover" style="font-size: 15px;">'
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

function setActivePage() {
  let act=null;
  let baseURL = window.location.href;
  let path = baseURL.split('/');
  let fileName = path[path.length-1];
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
  var tblbody = document.getElementsByTagName('tbody')[0];
  let atr ='';
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
    +    '</button>'
    +    '<a onclick="doEditRecord(\''+pro.id+'\');" class="mx-1 px-1 py-0 btn btn-sm btn-outline-primary p-2" href="#" role="button">'
    +        '<i class="fas fa-edit"></i>'
    +    '</a>'
    +'</td>';
    atd+=btn;
    tr+=atd+'</tr>';
    atr+=tr;
  }
  tblbody.innerHTML = atr;
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

    const fields = activeMenu.fields;
    let fdoc = document[activeMenu.formName];
    var rec = {};
    for (let i in fields){
      const x = fields[i];
      if(fdoc[x]!=undefined) rec[x] = fdoc[x].value;
    }
    const max=9999,min=1000;
    let f = validProduct(rec);
    if(f!=null) return alert('please fill the value of ['+f+']');
    if(act=='Add') {
      rec['id'] = activeMenu.prefixKey+Math.floor(Math.random() * (max - min + 1) + min);
      activeMenu.data.unshift(rec);
    }
    else {
      updateRecord(rec);
    }
    // console.log(rec);
  
  laodData();
}

function clearProductForm(params) {
  let fdoc = document.productfm;
  for (let i in fields){
    const x = fields[i];
    if(fdoc[x]!=undefined){
      if (x=='proCategory' || x=='proAccount' || x=='proStatus') {
        fdoc[x].value='--None--';
      }
      else fdoc[x].value='';
    }
  }
}

function updateRecord(pro) {
  for (const ix in activeMenu.data) {
    if (activeMenu.data[ix].id==pro.id) activeMenu.data[ix] = pro;
  }
  var btn = document.getElementById('doAddBtn');
  btn.innerHTML='Add';
  clearForm();
}

function clearForm() {
  let fdoc = document[activeMenu.formName];
  const fields = activeMenu.fields;
  for (let i in fields){
    const x = fields[i];
    if(fdoc[x]!=undefined){
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
        // showToast('record remove success!');
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
    location.reload();
  }
}

function doCancel() {
  if(confirm('are you sure want to cancel?')) location.reload();
}

function doSingOut() {
  if (confirm('are you sure want to singout?')) navigateTo('index.html'); 
}

function dasboardAnalyRender(listOBj) {
  let cards='';
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
      let opts = '';
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

function showToast(message) {
  document.getElementById('toastBody').innerHTML='<b>'+message+'</b>';
  var toastElList = [].slice.call(document.querySelectorAll('.toast'))
  var toastList = toastElList.map(function(toastEl) {
    return new bootstrap.Toast(toastEl)
  })
  toastList.forEach(toast => toast.show()) 
}
//End Products Page ==========

function getToast() {
  return '<div class="toast top-0 start-50 translate-middle-x" role="alert" aria-live="assertive" aria-atomic="true" autohide="true">'
  +    '<div class="toast-header">'
  +      '<strong class="me-auto">Message</strong>'
  +      '<button type="button" class="btn-close" data-bs-dismiss="toast"></button>'
  +    '</div>'
  +    '<div class="toast-body" id="toastBody">'
  +      '<p>Some text inside the toast body</p>'
  +    '</div>'
  +  '</div>';
}
//@dasboard fix page

function getDasboardTemplete(menuLi) {
  return '<header class="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0 shadow">'
  +  '<a id="siteName" class="navbar-brand col-md-3 col-lg-2 me-0 px-3" href="index.html">'
  +      '<h4 style="text-shadow:green 2px 2px 2px; color:white;">WEB Assignment</h4>'
  +   '</a>'
  +  '<button class="navbar-toggler position-absolute d-md-none collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#sidebarMenu" aria-controls="sidebarMenu" aria-expanded="false" aria-label="Toggle navigation">'
  +    '<span class="navbar-toggler-icon"></span>'
  +  '</button>'
  +  '<input class="form-control form-control-dark w-100" type="text" placeholder="Search" aria-label="Search">'
  +  '<div class="navbar-nav">'
  +    '<div class="nav-item text-nowrap">'
  +      '<a class="nav-link px-3" href="#" onclick="doSingOut();">Sign out</a>'
  +    '</div>'
  +  '</div>'
  +'</header>'
  // sadasdasd
  // +getToast()
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
  +        '</ul>'
  +      '</div>'
  +    '</nav>'
  +  '</div>'
  +'</div>';
}

//end dasboard