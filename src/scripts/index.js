var url = 'https://pc.hboss.com/',
  userId = '',
  userName = '',
  userHead = '',
  jobInfoConfig = '',
  someOneConfig = '';

$(document).ready(function() {
  var chioceCountry = false; //判断选择国家是否展开,false不展开
  user();
  jobConfig(1); //初始化搜索参数
  someoneConfig(1);
  $('.list').on('click', '.unlike', function(e) {
    e.stopPropagation();
    if (userId == '') {
      alert('请登录！');
    } else {
      var likeIndex = $(this).parent().parent().parent().index(),
        title = $('.list li:eq(' + likeIndex + ') .listTitle h2').text(),
        jobId = $(this).attr('id'),
        type = $(this).attr('type');
      like(title, type, jobId, 1);
      $(this)[0].className = 'collection like';
    }
  })
  $('.list').on('click', '.like', function(e) {
    e.stopPropagation();
    if (userId == '') {
      alert('请登录！');
    } else {
      var likeIndex = $(this).parent().parent().parent().index(),
        title = $('.list li:eq(' + likeIndex + ') .listTitle h2').text(),
        jobId = $(this).attr('id'),
        type = $(this).attr('type');
      like(title, type, jobId, 0);
      $(this)[0].className = 'collection unlike';
    }
  })
  $('.headRight').on('click', '.back', function() {
    sessionStorage.removeItem("userId");
    window.location.href = 'http://localhost/index.html';
  })
  $('.country a').click(function() {
    if (chioceCountry == false) {
      $('#chioceCountry').css('display', 'block');
    } else {
      $('#chioceCountry').css('display', 'none');
    }
    chioceCountry = !chioceCountry;
  })
  //切换选择国家是否展开
  $('#chioceCountry li').click(function() {
    index($(this).index() + 1);
    jobConfig($(this).index() + 1);
    someoneConfig($(this).index() + 1);
    $('.country a span').text($(this).text());
    $('.country a span')[0].id = $(this)[0].id;
    $('#chioceCountry').css('display', 'none');
    chioceCountry = false;
  })
  //切换国家
  $('.headRight span a,.headRight .login a').click(function() {
    login();
  })
  //登陆
  $('.option').on('click', 'li', function() {
    if ($(this)[0].className == "optionActive") {
      $(this).removeClass('optionActive')
    } else {
      $(this).addClass('optionActive')
    }
  })
  //选择搜索选项
  $('.jobType').next().click(function() {
    loading();
    searchJob();
  })
  //搜索职位
  $('.someone').next().click(function() {
    loading();
    searchSomeone();
  })
  //搜索找人办事
  $('#pages li').click(function() {
    var index = $(this).index();
    $('.active').removeClass('active');
    $(this).addClass('active');
    switch (index) {
      case 0:
        loading();
        if ($('.sort').length == 0) {
          mineBack();
        }
        if ($('.trans')[0].className != 'trans') {
          $('.trans').toggleClass('card-flipped');
        }
        $('.sort,.mineNav').css('display', 'block');
        searchJob();
        break;
      case 1:
        if (userId == '') {
          alert('请登录！');
        } else {
          unShade();
          shade();
          editCompany();
          recruitJob();
        }
        break;
      case 2:
        loading();
        searchSomeone();
        if ($('.sort').length == 0) {
          mineBack();
        }
        if ($('.trans')[0].className == 'trans') {
          $('.trans').toggleClass('card-flipped');
        }
        $('.sort,.mineNav').css('display', 'none');
        break;
      case 3:
        if (userId == '') {
          alert('请登录！');
        } else {
          if ($('.mineNav').length == 0) {
            loading();
            myMessage();
          }
          $('.sort,.mineNav').css('display', 'block');
          myPublish();
        }
        break;
      default:
    }
  })
  //nav
  $('body').on('click', '.ad, .return', function() {
    $('.card').toggleClass('card-flipped');
  })
  $('.list').on('click', 'li', function() {
    if ($(this)[0].className != "showDetails") {
      $(this).addClass('showDetails');
      $(this).find('.details').show();
      $(this).find('.tel').show();
      $(this).find('.companyName').css('font-size', '18px');
      $(this).find('.companyInfo').css('font-size', '12px');
    } else {
      $(this).removeClass('showDetails');
      $(this).find('.details').hide();
      $(this).find('.tel').hide();
      $(this).find('.companyName').css('font-size', '13px');
      $(this).find('.companyInfo').css('font-size', '10px');
    }
  })
  //展开或收起详情
  $('body').on('click', 'form a', function() {
    $(this).next().css('display', 'block');
    $(this).css('display', 'none');
    $(this).prev().css('display', 'none');
  })
  //重新选择图片
  $('.articleRight').on('click', '.sort li', function() {
    loading();
    sort($(this).index());
    $('.sortActive').removeClass();
    $(this).children().addClass('sortActive');
  })
  //sort
  $('.articleRight').on('click', '.mineNav li', function() {
    loading();
    if ($(this).index() == 0) {
      myPublish()
    } else {
      myCollection()
    }
    $('.sortActive').removeClass();
    $(this).children().addClass('sortActive');
  })
  //mineNav
  $('.publishSom').click(function() {
    $(window).scrollTop(0);
    unShade();
    shade();
    editCompany();
    recruitSomeone();
  })
  //发布找人办事
  $('body').on('click', '.recruit .backInput a', function() {
    $(this).parent().children().removeClass('recruitActive');
    $(this).addClass('recruitActive');
  })
  $('body').on('click', '#shade', function() {
    unShade();
  })
  //消除shade
  $('body').on('click', '.myPublishButtom a', function() {
    var index = $(this).index(),
      id = $(this).parent().next().next().next().children()[1].attributes[0].value,
      type = $(this).parent().next().next().next().children()[1].attributes[1].value;
    if (type == 1) {
      type = "job"
    } else {
      type = 'someone'
    }
    switch (index) {
      case 0:
        $.ajax({
          url: url + 'job/user/infoRefresh',
          data: {
            type: type,
            id: id
          },
          success: function() {
            if (type == "job") {
              $('#pages li:eq(0)').click();
            } else {
              $('#pages li:eq(2)').click();
            }
          }
        })
        break;
      case 1:

        break;
      default:

    }
  })
})

function user() {
  if (window.location.href.split('?userId=')[1] == undefined) {
    if (sessionStorage.userId) {
      userId = sessionStorage.userId;
      userInfo();
      index(1, userId); //初始化列表
      $('.headRight e a').text('退出');
      $('.headRight e')[0].className = 'back';
    } else {
      index(1); //初始化列表
    }
  } else {
    sessionStorage.userId = window.location.href.split('?userId=')[1];
    userId = sessionStorage.userId;
    userInfo();
    index(1, userId); //初始化列表
    $('.headRight e a').text('退出');
    $('.headRight e')[0].className = 'back';
  }
}
//初始化时判断登录状态

function userInfo() {
  $.ajax({
    url: url + 'job/user/getUserInfoByUserId',
    data: {
      userId: userId
    },
    success: function(res) {
      userName = res.user.name;
      userHead = res.user.head;
      $('.headRight span a').text('欢迎！' + userName);
    }
  })
}

function jobConfig(countriesId) {
  $.ajax({
    url: url + 'job/info/jobInfoConfig',
    data: {
      countriesId: countriesId
    },
    success: function(res) {
      jobInfoConfig = res.data;
      cityList(res.data.cityList);
      jobType(res.data.jobType);
    }
  })
}
//初始化搜索参数

function login() {
  $.ajax({
    url: url + 'weixin/config/getQrConnectURL',
    data: {
      "state": window.location.href + "?userId=okid"
    },
    success: function(res) {
      window.location.href = res.data;
    }
  })
}

function cityList(cityList) {
  $('.cityList').html('');
  var cityLi = '';
  for (var i = 0; i < cityList.length; i++) {
    cityLi += '<li><a href="javascript:;">' + cityList[i].name + '</a></li>'
  }
  $('.cityList').append(cityLi);
}
//append城市列表

function jobType(jobType) {
  $('.jobType').html('');
  var typeLi = ''
  for (var i = 0; i < jobType.length; i++) {
    typeLi += '<li><a href="javascript:;">' + jobType[i].codeDesc + '</a></li>'
  }
  $('.jobType').append(typeLi);
}
//append公众列表
function someone(someone) {
  $('.someone').html('');
  var typeLi = ''
  for (var i = 0; i < someone.length; i++) {
    typeLi += '<li><a href="javascript:;">' + someone[i].codeDesc + '</a></li>'
  }
  $('.someone').append(typeLi);
}
//append公众列表

function index(countriesId, userId) {
  loading();
  $.ajax({
    url: url + 'job/index/searchJobIndex',
    data: {
      countriesId: countriesId,
      userId: userId
    },
    success: function(res) {
      indexList(res.data);
    }
  })
}
//初始化列表数据

function indexList(data) {
  $('.list').html('');
  var indexList = ''; //列表
  for (var i = 0; i < data.length; i++) {
    var jobWelfareName, //城市，工种
      createDate = data[i].createDate.split(' ')[0], //创建时间
      companyName, //公司名
      companyInfo, //公司详情
      jobSalaryName, //工资
      status, //收藏状态
      type; //找人办事还是招聘
    if (data[i].jobTypeName != undefined) {
      jobWelfareName = '<dd>' + data[i].cityName + '</dd><dd>' + data[i].jobTypeName + '</dd>'
    } else {
      jobWelfareName = '<dd>' + data[i].cityName + '</dd><dd>' + data[i].someoneTypeName + '</dd>'
    }
    if (data[i].companyName == null) {
      companyName = ''
    } else {
      companyName = data[i].companyName
    }
    if (data[i].jobSalaryName == undefined) {
      type = 2;
      jobSalaryName = '找活挣钱';
    } else {
      type = 1;
      jobSalaryName = data[i].jobSalaryName
    }
    if (data[i].companyInfo == null) {
      companyInfo = ''
    } else {
      companyInfo = data[i].companyInfo
    }
    if (typeof data[i].cId == undefined || data[i].cId == null) {
      status = 'unlike'
    } else {
      status = 'like'
    }
    if (data[i].jobWelfareName != null) {
      var jobWelfareArr = data[i].jobWelfareName.split('&amp;');
      for (var j = 0; j < jobWelfareArr.length; j++) {
        jobWelfareName += '<dd>' + jobWelfareArr[j] + '</dd>';
      }
    }
    indexList += '<li><a href="javascript:;"><div class="listTitle"><h2>' + data[i].title + '</h2><span>' +
      jobSalaryName + '</span></div><div class="jobWelfareName"><dl>' +
      jobWelfareName + '</dl><span>' + createDate +
      '</span></div><div class="details">' + data[i].details +
      '</div><div class="company"><img src="' +
      data[i].companyLogo + '" alt=""><div class="companyName">' +
      companyName + '</div><div class="companyInfo">' +
      companyInfo + '</div></div><div class="tel"><img src="' +
      data[i].companyPublicity + '"><div id="' + data[i].id + '" type="' + type + '" class="collection ' +
      status + '"></div><div class="phone">' +
      data[i].tel + '</div></div></a></li>'
  }
  $('.list').append(indexList);
  endLoad();
}
//渲染列表

function like(title, type, jobId, status) {
  $.ajax({
    url: url + 'job/user/saveCollection',
    data: {
      userId: userId,
      title: title,
      type: type,
      jobId: jobId,
      status: status
    },
    success: function(res) {
      console.log(res);
    }
  })
}
//收藏或取消收藏

function searchJob() {
  var countriesId = $('.country a span')[0].id,
    cityName = '',
    jobType = '';
  for (var i = 0; i < $('.cityList .optionActive').length; i++) {
    cityName += $('.cityList .optionActive')[i].textContent + ','
  }
  for (var i = 0; i < $('.jobType .optionActive').length; i++) {
    jobType += $('.jobType .optionActive')[i].textContent + ','
  }
  $.ajax({
    url: url + 'job/info/searchJobInfo',
    data: {
      countriesId: countriesId,
      userId: userId,
      cityName: cityName,
      jobType: jobType,
      pageNumber: 1,
      pageSize: 9999
    },
    success: function(res) {
      indexList(res.data.list);
    }
  })
}
//搜索职位

function searchSomeone() {
  var countriesId = $('.country a span')[0].id,
    cityName = '',
    someoneType = '';
  for (var i = 0; i < $('.cityList .optionActive').length; i++) {
    cityName += $('.cityList .optionActive')[i].textContent + ','
  }
  for (var i = 0; i < $('.someone .optionActive').length; i++) {
    someoneType += $('.someone .optionActive')[i].textContent + ','
  }
  $.ajax({
    url: url + 'job/someone/searchSomeone',
    data: {
      countriesId: countriesId,
      userId: userId,
      cityName: cityName,
      someoneType: someoneType,
      pageNumber: 1,
      pageSize: 9999
    },
    success: function(res) {
      indexList(res.data.list);
    }
  })
}
//搜索找人办事

function sort(index) {
  var countriesId = $('.country a span')[0].id;
  if (index == 0) {
    $.ajax({
      url: url + 'job/info/searchJobInfo',
      data: {
        countriesId: countriesId,
        userId: userId,
        pageNumber: 1,
        pageSize: 9999
      },
      success: function(res) {
        indexList(res.data.list);
      }
    })
  } else {
    $.ajax({
      url: url + 'job/info/searchJobInfo',
      data: {
        countriesId: countriesId,
        userId: userId,
        type: index,
        pageNumber: 1,
        pageSize: 9999
      },
      success: function(res) {
        indexList(res.data.list);
      }
    })
  }
}
//sort

function editCompany() {
  var company = '<div class="card">' +
    '<div class="face front"><h2>免费广告</h2><a href="javascript:;" class="ad">制作展示广告</a><a href="javascript:;" class="why">为什么要制作展示广告?</a></div>' +
    '<div class="face back cardAK"><h2>公司或名牌名字</h2><div class="backInput"><input type="text" placeholder="请输入"/></div>' +
    '<h2>上传LOGO</h2><div class="backInput"><form id="LOGO" action="https://pc.hboss.com/job/index/uploadImage" method="post" enctype="multipart/form-data"><img><a href="javascript:;">更换图片</a><input id="imageFile" type="file" name="imageFile"></form></div>' +
    '<h2>上传宣传图片</h2><div class="backInput"><form id="myArticleForm" action="https://pc.hboss.com/job/index/uploadImage" method="post" enctype="multipart/form-data"><img><a href="javascript:;">更换图片</a><input id="imageFile" type="file" name="imageFile"></form></div>' +
    '<h2>上传宣传二维码</h2><div class="backInput"><form id="formBox1" action="https://pc.hboss.com/job/index/uploadImage" method="post" enctype="multipart/form-data"><input id="imageFile" type="file" name="imageFile"></form></div>' +
    '<h2>一句话广告语</h2><textarea name="name"></textarea>' +
    '<a href="javascript:;" class="return">取消</a>'
  '</div></div>';
  $('.article').append(company);
  $.ajax({
    url: url + 'job/user/findCompanyByUserId',
    data: {
      userId: userId
    },
    success: function(res) {
      $('.cardAK .backInput:eq(0) input').val(res.data.name);
      if (res.data.logo != '') {
        $('#LOGO input').css('display', 'none');
        $('#LOGO img').attr('src', res.data.logo);
      } else {
        $('#LOGO img,#LOGO a').css('display', 'none');
      }
      if (res.data.publicity != '') {
        $('#myArticleForm input').css('display', 'none');
        $('#myArticleForm img').attr('src', res.data.publicity);
      } else {
        $('#myArticleForm img,#myArticleForm a').css('display', 'none');
      }
      if (res.data.QRCode != '') {
        $('#formBox1 input').css('display', 'none');
        $('#formBox1 img').attr('src', res.data.QRCode);
      } else {
        $('#formBox1 img,#formBox1 a').css('display', 'none');
      }
      $('form input').change(function() {
        $(this).parent().submit();
      })
      $('#LOGO').ajaxForm({
        dataType: 'json',
        success: function(data) {
          $('#LOGO img').attr('src', data.urlPath);
          $('#LOGO input').css('display', 'none');
          $('#LOGO img').css('display', 'inline-block');
          $('#LOGO a').css('display', 'inline-block');
        }
      });
      $('#myArticleForm').ajaxForm({
        dataType: 'json',
        success: function(data) {
          $('#myArticleForm img').attr('src', data.urlPath);
          $('#myArticleForm input').css('display', 'none');
          $('#myArticleForm img').css('display', 'inline-block');
          $('#myArticleForm a').css('display', 'inline-block');
        }
      });
      $('#formBox1').ajaxForm({
        dataType: 'json',
        success: function(data) {
          $('#formBox1 img').attr('src', data.urlPath);
          $('#formBox1 input').css('display', 'none');
          $('#formBox1 img').css('display', 'inline-block');
          $('#formBox1 a').css('display', 'inline-block');
        }
      });
    }
  })
}
//编辑公司

function recruitJob() {
  var cityList = '',
    jobType = '',
    jobNature = '',
    jobWelfare = '',
    jobSalary = '',
    jobRequirements = '';
  for (var i = 0; i < jobInfoConfig.cityList.length; i++) {
    cityList += '<a class="' + jobInfoConfig.cityList[i].id + '" href="javascript:;">' + jobInfoConfig.cityList[i].name + '</a>';
  }
  for (var i = 0; i < jobInfoConfig.jobType.length; i++) {
    jobType += '<a href="javascript:;">' + jobInfoConfig.jobType[i].codeDesc + '</a>';
  }
  for (var i = 0; i < jobInfoConfig.jobNature.length; i++) {
    jobNature += '<a href="javascript:;">' + jobInfoConfig.jobNature[i].codeDesc + '</a>';
  }
  for (var i = 0; i < jobInfoConfig.jobWelfare.length; i++) {
    jobWelfare += '<a href="javascript:;">' + jobInfoConfig.jobWelfare[i].codeDesc + '</a>';
  }
  for (var i = 0; i < jobInfoConfig.jobSalary.length; i++) {
    jobSalary += '<a href="javascript:;">' + jobInfoConfig.jobSalary[i].code + '</a>';
  }
  for (var i = 0; i < jobInfoConfig.jobRequirements.length; i++) {
    jobRequirements += '<a href="javascript:;">' + jobInfoConfig.jobRequirements[i].codeDesc + '</a>';
  }
  var job = '<div class="recruit">' +
    '<h2>城市</h2><div id="cityList" class="backInput">' + cityList + '</div>' +
    '<h2>工作种类</h2><div id="jobType" class="backInput">' + jobType + '</div>' +
    '<h2>工作性质</h2><div id="jobNature" class="backInput">' + jobNature + '</div>' +
    '<h2>福利待遇</h2><div id="jobWelfare" class="backInput">' + jobWelfare + '</div>' +
    '<h2>薪资区间</h2><div id="jobSalary" class="backInput">' + jobSalary + '</div>' +
    '<h2>居留要求</h2><div id="jobRequirements" class="backInput">' + jobRequirements + '</div>' +
    '<div class="backInput border-top"><label><span>*</span>招聘标题</label><input id="recruitTitle" type="text" placeholder="请输入标题"></div>' +
    '<div class="backInput"><label><span>*</span>联系电话</label><input id="recruitTel" type="text" placeholder="请输入电话"></div>' +
    '<h3 class="border-top">详细工作要求或说明</h3>' +
    '<textarea placeholder="请输入要求"></textarea>' +
    '<div id="submit">发布</div>' +
    '</div>';
  $('.article').append(job);
  recruitSubmit();
}
//编辑招聘信息

function recruitSubmit() {
  $('body').on('click', '.recruit #submit', function() {
    var cityId = '',
      companyName = '',
      companyLogo = '',
      companyPublicity = '',
      companyQRCode = '',
      companyInfo = '',
      jobType = '',
      jobNature = '',
      jobWelfare = '',
      jobSalary = '',
      jobRequirements = '',
      title = '',
      tel = '',
      details = '';
    if ($('#cityList .recruitActive').length != 0) {
      cityId = $('#cityList .recruitActive')[0].classList[0];
    } else {
      alert('请选择城市');
    }
    companyName = $('.cardAK .backInput:eq(0) input').val();
    if (companyName != '') {
      companyLogo = $('#LOGO img').attr('src');
      companyPublicity = $('#myArticleForm img').attr('src');
      companyQRCode = $('#formBox1 img').attr('src');
      companyInfo = $('.cardAK textarea').val();
    }
    if ($('#jobType .recruitActive').length != 0) {
      jobType = $('#jobType .recruitActive')[0].classList[0];
    } else {
      alert('请选择工作种类');
    }
    if ($('#jobNature .recruitActive').length != 0) {
      jobNature = $('#jobNature .recruitActive')[0].classList[0];
    } else {
      alert('请选择工作性质');
    }
    if ($('#jobWelfare .recruitActive').length != 0) {
      jobWelfare = $('#jobWelfare .recruitActive')[0].classList[0];
    } else {
      alert('请选择福利待遇');
    }
    if ($('#jobSalary .recruitActive').length != 0) {
      jobSalary = $('#jobSalary .recruitActive')[0].classList[0];
    } else {
      alert('请选择薪资区间');
    }
    if ($('#jobRequirements .recruitActive').length != 0) {
      jobRequirements = $('#jobRequirements .recruitActive')[0].classList[0];
    } else {
      alert('请选择居留要求');
    }
    if ($('#recruitTitle').val() != '') {
      title = $('#recruitTitle').val();
    } else {
      alert('请输入标题');
    }
    if ($('#recruitTel').val() != '') {
      tel = $('#recruitTel').val();
    } else {
      alert('请输入电话');
    }
    if ($('.recruit textarea').val() != '') {
      details = $('.recruit textarea').val();
    } else {
      alert('请输入详情');
    }
    if (cityId != '' && jobType != '' && jobNature != '' && jobWelfare != '' && jobSalary != '' && jobRequirements != '' && title != '' && tel != '' && details != '') {
      $.ajax({
        url: url + 'job/info/publishJob',
        data: {
          cityId: cityId,
          jobType: jobType,
          jobNature: jobNature,
          jobWelfare: jobWelfare,
          jobSalary: jobSalary,
          jobRequirements: jobRequirements,
          title: title,
          tel: tel,
          details: details,
          companyName: companyName,
          companyLogo: companyLogo,
          companyPublicity: companyPublicity,
          companyQRCode: companyQRCode,
          companyInfo: companyInfo
        },
        success: function(res) {
          console.log(res);
        }
      })
    }
  })
}

function someoneConfig(countriesId) {
  $.ajax({
    url: url + 'job/someone/someoneConfig',
    data: {
      countriesId: countriesId
    },
    success: function(res) {
      someOneConfig = res.data.someoneType;
      someone(res.data.someoneType);
    }
  })
}
//获取找人办事参数

function recruitSomeone() {
  var cityList = '',
    someoneType = '';
  for (var i = 0; i < jobInfoConfig.cityList.length; i++) {
    cityList += '<a href="javascript:;">' + jobInfoConfig.cityList[i].name + '</a>';
  }
  for (var i = 0; i < someOneConfig.length; i++) {
    someoneType += '<a href="javascript:;">' + someOneConfig[i].codeDesc + '</a>';
  }
  var someone = '<div class="recruitSomeone">' +
    '<h2>城市</h2><div class="backInput">' + cityList + '</div>' +
    '<h2>分类</h2><div class="someoneType">' + someoneType + '</div>' +
    '<div class="backInput border-top"><label><span>*</span>招聘标题</label><input type="text" placeholder="请输入标题"></div>' +
    '<div class="backInput"><label><span>*</span>联系电话</label><input type="text" placeholder="请输入电话"></div>' +
    '<h3 class="border-top">详细说明</h3>' +
    '<textarea placeholder="请输入要求"></textarea>' +
    '<div id="submit">发布</div>' +
    '</div>';
  $('.article').append(someone);
}
//打开编辑找人办事页

function mineBack() {
  $('.mineMenu').remove();
  $('.articleLeft').css('display', 'block');
  $('.mineNav').html('<li><a href="javascript:;" class="sortActive">最新发布</a></li><li><a href="javascript:;">最高工资</a></li><li><a href="javascript:;">企业招聘专区</a></li>');
  $('.mineNav')[0].className = 'sort';
}
//从我的页面返回列表页

function myMessage() {
  var mineMenu = '<div class="mineMenu"><div class="head"><img src="' + userHead + '">' +
    '</div><div class="phoneNum"><h2>我的信息</h2><div><input type="text" placeholder="输入手机号码"><span>绑定</span><h5>招聘，找工作更方便！</h5></div></div>' +
    '<div class="suggestion"><h2>意见反馈</h2><textarea></textarea><span>提交</span></div>'
  '</div>';
  $('.articleLeft').css('display', 'none');
  $('.articleRight').before(mineMenu);
  $('.sort').html('<li><a href="javascript:;" class="sortActive">我的发布</a></li><li><a href="javascript:;">我的收藏</a></li>');
  $('.sort')[0].className = 'mineNav';
}
//打开我的页面

function myPublish() {
  $.ajax({
    url: url + 'job/user/myPublish',
    data: {
      userId: userId
    },
    success: function(res) {
      indexList(res.data.jobList.concat(res.data.someoneList));
      myPublishButtom();
    }
  })
}
//我的发布

function myPublishButtom() {
  $('.jobWelfareName').after('<div class="myPublishButtom"><a href="javascript:;">顶</a></div>'); //<a href="javascript:;">关闭</a><a href="javascript:;">编辑</a>
}
//我的发布按钮

function myCollection() {
  $.ajax({
    url: url + 'job/user/myCollection',
    data: {
      userId: userId
    },
    success: function(res) {
      indexList(res.data);
    }
  })
}
//我的收藏

function shade() {
  $('body').append('<div id="shade"></div>');
  $('body').css('overflow', 'hidden');
}

function loading() {
  $('body').append('<div id="loading"><img src="/images/loading.gif"></div>');
  $('body').css('overflow', 'hidden');
}

function endLoad() {
  $('#loading').remove();
}

function unShade() {
  $('#shade').remove();
  $('.card').remove();
  $('.recruit').remove();
  $('.recruitSomeone').remove();
  $('.articleLeft').css('zIndex', 0);
  $('body').css('overflow', 'auto');
}
