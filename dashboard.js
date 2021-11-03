//menu must setup in here
//@each menu must the same structure
//@add @remove @update @save @rendertable @clear @loadmenu 
//all this function using the same logic for each menu page
//@html file should be the same structure
var mapMenu = {
  //menu name
  'Accounts':{
    //file name with html extension
    pageURL:'account.html'
    //icon of menu
    ,icon:'fas fa-users fa-lg'
    //is active page?
    ,isActive:false
    //fields of table @should the same header of <th>
    ,fields : ['id','accStaff','accRole','accUsername','accPassword','accStatus','accDescription']
    //local storage @key for store JSON data
    ,storageKey:'account.html'
    //data for table
    ,data : []
    //name of input form
    ,formName:'accountfm'
    //fields could be blank
    ,notRequired:['id','accDescription']
    //Id prefix e.g: PRO001
    ,prefixKey:'ACC'
  }
  ,'Products':{
    pageURL:'product.html'
    ,icon:'fas fa-file-signature fa-lg'
    ,isActive:false
    ,fields : ['id','proCategory','proAccount','proName','proPrice','proThumnail','proDetail','proStatus']
    ,storageKey:'product.html'
    ,data : []
    ,formName:'productfm'
    ,notRequired:['id','proThumnail','proDetail']
    ,prefixKey:'PRO'
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
  }
};

//@key of all function, can't not null/undefined
var activeMenu = null;

init();

function init() {
  cacheMenuText();
  loadDataOfMenu();
  var dbs = 
  '<header class="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0 shadow">'
  +  '<a id="siteName" class="navbar-brand col-md-3 col-lg-2 me-0 px-3" href="#">WEB Assignment</a>'
  +  '<button class="navbar-toggler position-absolute d-md-none collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#sidebarMenu" aria-controls="sidebarMenu" aria-expanded="false" aria-label="Toggle navigation">'
  +    '<span class="navbar-toggler-icon"></span>'
  +  '</button>'
  +  '<input class="form-control form-control-dark w-100" type="text" placeholder="Search" aria-label="Search">'
  +  '<div class="navbar-nav">'
  +    '<div class="nav-item text-nowrap">'
  +      '<a class="nav-link px-3" href="#">Sign out</a>'
  +    '</div>'
  +  '</div>'
  +'</header>'
  +'<div class="container-fluid">'
  +  '<div class="row" id="toprow">'
  +    '<nav id="sidebarMenu" class="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse">'
  +      '<div class="position-sticky pt-3">'
  +        '<ul class="nav flex-column">'
  +             mapMenu["allli"]
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
  +            '<a class="nav-link" href="#">'
  +              '<span data-feather="file-text"></span>'
  +              'Last quarter'
  +            '</a>'
  +          '</li>'
  +          '<li class="nav-item">'
  +            '<a class="nav-link" href="#">'
  +              '<span data-feather="file-text"></span>'
  +              'Social engagement'
  +            '</a>'
  +          '</li>'
  +          '<li class="nav-item">'
  +            '<a class="nav-link" href="#">'
  +              '<span data-feather="file-text"></span>'
  +              'Year-end sale'
  +            '</a>'
  +          '</li>'
  +        '</ul>'
  +      '</div>'
  +    '</nav>'
  +  '</div>'
  +'</div>';
  var mainp = document.getElementById('pageContent');
  document.body.innerHTML = dbs;
  var domDsb = document.getElementById('toprow');
  mainp.className = 'col-md-9 ms-sm-auto col-lg-10 px-md-4';
  domDsb.append(mainp);
}

function cacheMenuText() {
  setActivePage();
  // console.log(mapMenu);
  var alLi = '';
  for (const nm in mapMenu) {
    if (Object.hasOwnProperty.call(mapMenu, nm)) {
      var menu = mapMenu[nm];
      var li = 
      '<li class="nav-item">'
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
  let baseURL = window.location.href;
  let path = baseURL.split('/');
  let fileName = path[path.length-1];
  for (const nm in mapMenu) {
    if (Object.hasOwnProperty.call(mapMenu,nm)) {
      if (fileName.startsWith(mapMenu[nm].pageURL)) {
        mapMenu[nm].isActive = true;
        activeMenu = mapMenu[nm];
      }
      else mapMenu[nm].isActive = false;
    }
  }
  const dt = retrieveFromStorage(activeMenu.storageKey);
  if(dt!=undefined&&dt!=null&&dt.length>0) activeMenu.data = dt;
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
  laodData();
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
  const fields = activeMenu.fields;
  let fdoc = document[activeMenu.formName];
  for (let i in fields){
    const x = fields[i];
    if(fdoc[x]!=undefined){
      fdoc[x].value='';
    }
  }
}

function doRemoveRecord(proId) {
  for (const ix in activeMenu.data) {
    if (activeMenu.data[ix].id==proId) {
      if (confirm('are you sure want to remove this record?')) {
        activeMenu.data.splice(ix, 1);
        laodData();
      }
    }
  }
}

function doEditRecord(proId) {
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

//End Products Page ==========