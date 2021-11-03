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
  }
}

function doCancel() {
  if(confirm('are you sure want to cancel?')) location.reload();
}

//End Products Page ==========
/*
var dasboard = '<h2>This is Dasboard page content</h2>';
var order = '<h2>This is order page content</h2>';


// Reak : My Task product menu ================================================================
const product = getProductContent();

var productJSON = 
[
  {
    'Id' : 'Default',
    'Title':'Default',
    'Tumnail':'Default',
    'Price':'Default',
    'Category':'Default',
    'Description':'Default',
    'Created Date':'Default',
    'Created By':'Default'
  }
];

function clearProductForm() {
  var docfm = document.productfm;
  docfm.Category.value = 'None';
  docfm.Title.value = docfm.Thumbnail.value = docfm.Price.value = docfm.Description.value = '';
}
function addProduct() {
  var docfm = document.productfm;
  var category = docfm.Category.value;
  var title = docfm.Title.value;
  var tumnail = docfm.Thumbnail.value;
  var price = docfm.Price.value;
  var description = docfm.Description.value;
  var productDraf = {
    'Id' : 'P'+Math.floor(Math.random() * 1000),
    'Title': title,
    'Thumbnail': tumnail,
    'Category': category,
    'Price': price,
    'Description': description,
    'Created Date': new Date(),
    'Created By':'Kiry TTR'
  }
  for (const key in productDraf) if(productDraf[key]=='' || productDraf[key]=='None') return alert(key+' can not blank.');
  productJSON.push(productDraf);
  updateTableProduct();
  clearProductForm();
}

function updateTableProduct() {
  var dt = '';
  for (const inx in productJSON) {
    const pro = productJSON[inx];
    dt += '<tr>'
        + '<td>'+(parseInt(inx)+1)+'</td>'
        + '<td>'+pro['Id']+'</td>'
        + '<td>'+pro['Title']+'</td>'
        +'<td>'+pro['Category']+'</td>'
        // + '<td><img src="'+pro['Thumbnail']+'" alt="Product" style="width:5%;"></td>'
        +'<td></td>'
        + '<td>'+pro['Price']+'</td>'
        + '<td>'+pro['Description']+'</td>'
        + '<td>'+pro['Created Date']+'</td>'
        + '<td>'+pro['Created By']+'</td>'
        + '</tr>';
  }
  var tb = document.getElementById('productTblBody');
  if (tb!=undefined && tb!=null) tb.innerHTML = dt;
}

function getProductContent() {
  var header = ['#','Id','Title','Category','Thumbnail','Price','Description','Created Date','Created By'];
  var hx = '';

  for (let i in header) {
    const headx = header[i];
    hx += '<th scope="col">'+headx+'</th>';
  }

  var res = 
    '<div class="p-2 .bg-light.bg-gradient">'
  +     '<div class="col add-new">'
  +       '<div class="d-flex justify-content-end">'
  +           '<a class="btn btn-primary" data-bs-toggle="modal" href="#exampleModalToggle" role="button" onclick="clearProductForm();">Add New</a>'
  +       '</div>'
  +       '<br>'
  +       '<div class="d-flex justify-content-end">'
  +         '<input type="text" name="searching"  class="m-1" :placeholder="search.." />'
  +         '<label for="">Search</label>'
  +       '</div>'
  +       '<table class="table">'
  +         '<thead class="bg-info">'
  +           '<tr>'
  +             hx
  +           '</tr>'
  +         '</thead>'
  +         '<tbody id="productTblBody">'
  +         '</tbody>'
  +       '</table>'
  +     '</div>'
  +  '</div>';

  //form add new product
  res +=
  '<div class="modal fade" id="exampleModalToggle" aria-hidden="true" aria-labelledby="exampleModalToggleLabel" tabindex="-1">'
  +  '<div class="modal-dialog">'
  +   ' <div class="modal-content col-sm-12">'
  +      '<div class="modal-header">'
  +          '<form name="productfm" class="col-sm-12 m-auto ">'
  +            '<h1>Product</h1>'
  +                '<div class="mb-3 col-sm-12">'
  +                    '<label for="exampleFormControlInput1" class="form-label">Category</label>'
  +                    '<select class="form-select" aria-label="" name="Category">'
  +                        '<option selected>None</option>'
  +                        '<option value="baverage">baverage</option>'
  +                        '<option value="bear">bear</option>'
  +                        '<option value="food">food</option>'
  +                    '</select>'
  +                '</div>'
  +              '<div class="mb-3 col-sm-12">'
  +                  '<label for="exampleFormControlInput1" class="form-label">Title</label>'
  +                  '<input name="Title" type="text" class="form-control" id="exampleFormControlInput11">'
  +              '</div>'
  +                '<div class="mb-3 col-sm-12">'
  +                    '<label for="exampleFormControlInput1" class="form-label">Thumbnail</label>'
  +                    '<input name="Thumbnail" type="text" class="form-control" id="exampleFormControlInput1">'
  +                '</div>'
  +              '<div class="mb-3 col-sm-12">'
  +                    '<label for="exampleFormControlInput1" class="form-label">Price</label>'
  +                    '<input name="Price" type="text" class="form-control" id="exampleFormControlInput11">'
  +                '</div>'
  +                '<div class="mb-3 col-sm-12">'
  +                    '<label for="exampleFormControlInput1" class="form-label">Description</label>'
  +                    '<input name="Description" type="text" class="form-control" id="exampleFormControlInput1">'
  +                '</div>'         
  +              '<div class="">'
  +                  '<button type="button" class="btn btn btn-danger" data-bs-dismiss="modal" style="margin-right:10px;">Cancel</button>'
  +                  '<button type="button" class="btn btn-success" onclick="addProduct();">Save</button>'
  +              '</div>'
  +          '</form>'
  +      '</div>'
  +    '</div>'
  +  '</div>'
  +'</div>';
  //End-form add new product

  return res;
}
//End Product ================================================================


//Generic Function ==========================================================

//Key: Id of menu in HTML (must the same)
//Value: Content of menu
// example:
//   <a id="Dashboard" class="nav-link" aria-current="page" href="#" onclick="loadContentMenu(event);">
//     <i class="fas fa-home fa-lg"></i>
//     Dashboard
//   </a>

var manu = {
   Dashboard : dasboard
  ,Orders    : order
  ,Products  : product
};

doRenderDefault();

//default
function doRenderDefault() {
  doRenderActive('Dashboard');
  setMainContent(manu.Dashboard);
  document.getElementById('siteName').innerHTML = 'Inventory Managerment System';
}

//manage active of menu
function doRenderActive(currentActiveId) {
  var cls = '';
  for (const key in manu) {
    if (key == currentActiveId) cls = 'nav-link active';
    else cls = 'nav-link';
    var eleDoc = document.getElementById(key);
    if (eleDoc!=undefined) eleDoc.className = cls;
  }
}

//menu click
function loadContentMenu(evt) {
  var trgEvt = evt.target;
  var id = trgEvt.id;
  doRenderActive(id);
  if (id!==undefined && id!='' && manu[id]!=undefined) setMainContent(manu[id]);
  else if(id=='') alert('manu must specify Id of tag.');
  else alert('menu ['+id+'] is not yet implement.');
  updateTableProduct();
}

//set content to main
function setMainContent(cont) {
  if(cont!=undefined || cont!=null) document.getElementById('mainboard').innerHTML = cont;
}
*/