


/** require object and method -- smart.init */
window.smart=window.smart||{
  version:'1.0.0',
  uri:'https://github.com/9r3i/fw-theme-smart',
  products:[],
  init:async function(){
    ForceWebsite.theme.putHTML(ForceWebsite.theme.content);
    var files=[
      "js/jquery-3.6.0.min.js",
      "js/bootstrap.min.js",
      "js/jquery.scrollTo-min.js",
      "js/jquery.magnific-popup.min.js",
      "js/jquery.nav.js",
      "js/wow.js",
      "js/countdown.js",
      "js/plugins.js",
    ];
    ForceWebsite.theme.loadFiles(files);
    setTimeout(e=>{
      files=[
        "js/custom.js",
      ];
      ForceWebsite.theme.loadFiles(files);
    },(100*files.length)+300);
  },
  mainContent:function(query,post,bulk){
    var file='html/index.html',
    mainID='page-loader';
    if(query.hasOwnProperty('p')){
      file='html/post.html';
    }else if(query.hasOwnProperty('contact')){
      file='html/contact.html';
    }else if(query.hasOwnProperty('news')){
      file='html/news.html';
    }else if(query.hasOwnProperty('special')){
      file='html/special.html';
    }else if(query.hasOwnProperty('about')){
      file='html/about.html';
    }
    ForceWebsite.theme.loadHTML(file,r=>{
      var forms=document.querySelectorAll('form'),
      mainTag=document.getElementById(mainID).parentNode;
      mainTag.innerHTML=r;
      for(var form of forms){
        form.onsubmit=smart.formSubmit;
      }
      setTimeout(e=>{
        document.body.scroll({
          top: 0,
          left: 0,
          behavior:'smooth',
        });
        smart.formSubmitInit();
      },500);
    });
    return smart.loader(mainID);
  },
  afterContact:function(r){
    var modalBody=document.getElementById('contact-body');
    modalBody.innerHTML='<h3>Thank You!</h3>';
  },
  beforeContact:function(fd){
    var modalBody=document.getElementById('contact-body');
    modalBody.innerHTML='<h3>Sending...</h3>';
  },
  afterOrder:function(r){
    var modalBody=document.getElementById('modalOrderBody');
    modalBody.innerHTML='<h3>Thank You!</h3>';
  },
  beforeOrder:function(fd){
    var modalBody=document.getElementById('modalOrderBody');
    modalBody.innerHTML='<h3>Sending...</h3>';
  },
  download:function(el){
    return window.open(el.dataset.url,'_blank');
  },
  postContent:function(post){
    var url=ForceWebsite.contentURL(post.id),
    dls=['gzip','binary'];
    if(post.type=='text'){
      return post.content;
    }else if(post.type=='image'){
      return '<img src="'+url+'" class="img-fluid news-detail-image" alt="" />';
    }else if(post.type=='audio'){
      return '<audio src="'+url+'" controls style="width:100%;"></audio>';
    }else if(post.type=='video'){
      return '<video src="'+url+'" controls style="width:100%;"></video>';
    }else if(dls.indexOf(post.type)>=0){
      return '<button type="button" class="custom-btn btn btn-info btn-lg" data-url="'+url+'" onclick="Crispy.download(this)">Download</button>';
    }else if(post.type=='json'){
      var jdata=JSON.parse(post.content);
      if(jdata.type=='product'&&jdata.mode=='special'){
        jdata.title=post.title;
        jdata.picture=ForceWebsite.imageURL(post.id);
        return Crispy.specialMenus([jdata]);
      }else if(jdata.type=='news'||jdata.type=='event'){
        if(jdata.hasOwnProperty('content')){
          return jdata.content;
        }
      }
    }
    return '<button type="button" class="custom-btn btn btn-info btn-lg" data-url="'+url+'" onclick="Crispy.download(this)">Download ('+post.type+')</button>';
  },
  postImage:function(id){
    if(ForceWebsite.theme.data.post.type=='json'){
      var jdata=JSON.parse(ForceWebsite.theme.data.post.content);
      if(jdata.type=='product'&&jdata.mode=='special'){
        return '';
      }
    }
    var imageURL=ForceWebsite.imageURL(id);
    return '<img src="'+imageURL+'" class="img-fluid news-detail-image" alt="">';
  },
  bulkContent:function(){
    if(ForceWebsite.bulkRaw.length==0){
      return '<div class="col-md-12 text-center">'
        +'<h2>No Data.</h2></div>';
    }
    var res=[],
    i=ForceWebsite.bulkRaw.length;
    while(i--){
      if(ForceWebsite.bulkRaw[i].type!='text'){continue;}
      var p=ForceWebsite.bulkRaw[i],
      image=ForceWebsite.imageURL(p.id),
      col='<div class="col-md-4"><div class="blog-item">'
        +'<div class="popup-wrapper"><div class="popup-gallery">'
        +'<a href="?p='+p.slug+'">'
        +'<img src="'+image+'" class="width-100" alt="" />'
        +'<span class="eye-wrapper2">'
        +'<i class="bi bi-link-45deg"></i></span></a>'
        +'</div></div>'
        +'<div class="blog-item-inner">'
        +'<h3 class="blog-title"><a href="?p='+p.slug+'">'
        +p.title+'</a></h3>'
        +'<a href="?p='+p.slug+'" class="blog-icons last">'
        +'<i class="bi bi-card-text"></i> '+p.type+' &#8212; '
        +p.time.substr(0,10)+'</a>'
        +'</div>'
        +'</div></div>';
      res.push(col);
      if(res.length>=ForceWebsite.theme.config.data.limit){
        break;
      }
    }return res.join('\n');
  },
  navMenu:function(menus){
    menus=typeof menus==='object'&&menus!==null
      &&!Array.isArray(menus)?menus:{};
    var res=[];
    for(var i in menus){
      var men=menus[i],
      col='<li class="nav-item"><a class="nav-link" href="'
        +i+'" title="'+men+'">'+men+'</a></li>';
      res.push(col);
    }return res.join('\n');
  },
  footerSocial:function(social){
    var res=[];
    for(var i in social){
      var tmp='<li><a href="'
        +social[i]+'" target="_blank" class="'
        +i+'"><i class="bi bi-'+i+'"></i></a></li>';
      res.push(tmp);
    }return res.join('\n');
  },
  loader:function(id){
    var image=ForceWebsite.theme.path
      +'images/default.loader.gif';
    return '<div class="'+id+'" id="'+id+'">'
      +'<img src="'+image+'" /> Loading...'
      +'</div>';
  },
  formSubmitInit:function(){
    var forms=document.querySelectorAll('form');
    if(forms){
      for(var form of forms){
        form.onsubmit=smart.formSubmit;
      }
    }
  },
  formSubmit:function(e){
    e.preventDefault();
    var formdata={};
    for(var tar of e.target){
      if(tar.name){
        formdata[tar.name]=tar.value;
      }
    }
    var mtd=formdata.hasOwnProperty('method')
      ?formdata.method:'crispy.unknown',
    defAfter=function(r){
      alert(r.toString().match(/^error/i)?r:'Sent.');
    },
    defBefore=function(fd){},
    before=formdata.hasOwnProperty('before')
      &&smart.hasOwnProperty(formdata.before)
      &&typeof smart[formdata.before]==='function'
      ?smart[formdata.before]:defBefore,
    after=formdata.hasOwnProperty('after')
      &&smart.hasOwnProperty(formdata.after)
      &&typeof smart[formdata.after]==='function'
      ?smart[formdata.after]:defAfter,
    temp=null;
    before(formdata);
    ForceWebsite.request(mtd,r=>{
      after(r);
    },formdata);
    return false;
  },
};




