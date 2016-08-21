var redtab={controllers:angular.module("redtab.controllers",[]),services:angular.module("redtab.services",[])};angular.module("redtab",["ionic","redtab.controllers","redtab.services","ngCordova","ngCordovaOauth"]).run(["$rootScope","$ionicPlatform","AuthenticationFactory","$state","$http","App",function(e,t,o,a,n,r){o.check(),o.isLogged?n.get(r.baseUrl+"me/stripe_pub_key").success(function(e){e.success&&(console.log(e.stripe_pub_key),Stripe.setPublishableKey(e.stripe_pub_key))}):a.go("login"),e.$on("$routeChangeStart",function(e,t,n){t.access&&t.access.requiredLogin&&!o.isLogged?a.go("login"):(o.user||(o.user=$window.sessionStorage.user),o.userRole||(o.userRole=$window.sessionStorage.userRole))}),t.ready(function(){window.cordova&&window.cordova.plugins.Keyboard&&(cordova.plugins.Keyboard.hideKeyboardAccessoryBar(!0),cordova.plugins.Keyboard.disableScroll(!0)),window.StatusBar&&StatusBar.styleDefault()})}]).config(["$stateProvider","$urlRouterProvider","$httpProvider",function(e,t,o){o.interceptors.push("TokenInterceptor"),e.state("app",{url:"/app","abstract":!0,templateUrl:"templates/menu.html",controller:"AppCtrl"}).state("login",{url:"/login",templateUrl:"templates/login.html",controller:"LoginCtrl"}).state("signup",{url:"/signup",templateUrl:"templates/signup.html",controller:"SignupCtrl"}).state("forgotPassword",{url:"/forgot-password",templateUrl:"templates/forgot-password.html",controller:"ForgotPasswordCtrl"}).state("app.home",{url:"/home",views:{menuContent:{templateUrl:"templates/home.html",controller:"HomeCtrl"}}}).state("app.venuelist",{url:"/venuelist",views:{menuContent:{templateUrl:"templates/venuelist.html",controller:"VenulistCtrl"}}}).state("app.venueselected",{url:"/venueselected",params:{location:null},views:{menuContent:{templateUrl:"templates/venue-selected.html",controller:"VenueSelectedCtrl"}}}).state("app.menu",{url:"/menu",params:{location:null},views:{menuContent:{templateUrl:"templates/tab-menu.html",controller:"MenuCtrl"}}}).state("app.history",{url:"/history",views:{menuContent:{templateUrl:"templates/history.html",controller:"HistoryCtrl"}}}).state("app.oldtab",{url:"/oldtab",params:{tabId:null},views:{menuContent:{templateUrl:"templates/oldtab.html",controller:"OldtabCtrl"}}}).state("app.payments",{url:"/payments",views:{menuContent:{templateUrl:"templates/payments.html",controller:"PaymentsCtrl"}}}).state("app.menuitem",{url:"/menuitem",params:{item:null,location:null},views:{menuContent:{templateUrl:"templates/menuitem.html",controller:"MenuitemCtrl"}}}).state("app.search",{url:"/search",views:{menuContent:{templateUrl:"templates/search.html"}}}).state("app.browse",{url:"/browse",views:{menuContent:{templateUrl:"templates/browse.html"}}}).state("app.playlists",{url:"/playlists",views:{menuContent:{templateUrl:"templates/playlists.html",controller:"PlaylistsCtrl"}}}).state("app.single",{url:"/playlists/:playlistId",views:{menuContent:{templateUrl:"templates/playlist.html",controller:"PlaylistCtrl"}}}),t.otherwise("/app/home")}]).filter("stripZip",function(){return function(e){e=e.trim();var t=e.substr(e.length-5);if(isNaN(t)||1>t)return e;var e=e.replace(t,"");return e}}),redtab.controllers.controller("AppCtrl",["$scope","$ionicModal","$timeout","UserAuthFactory","$window","$http","App",function(e,t,o,a,n,r,i){e.init=function(){n.localStorage.fbId?e.sideMenuName=n.localStorage.fbName:e.sideMenuName=n.localStorage.userEmail,r.get(i.baseUrl+"me/payments/cards").success(function(t){t.success&&(e.cards=t.data)}),e.userEmail=n.localStorage.userEmail,e.tab={is_open:1,tax:4,tip:0,processing:1.5,sub_total:0,total:0,tab_items:[{item_name:"item 1",item_price:8,item_desc:"#hello #hi #example"},{item_name:"item 2",item_price:5,item_desc:"#hello #hi #example"},{item_name:"item 5",item_price:7,item_desc:"#hello #hi #example"}]},angular.forEach(e.tab.tab_items,function(t){e.tab.sub_total+=t.item_price}),e.tipActive=10,e.tab.total=e.tab.sub_total+e.tab.tax+e.tab.processing,e.tip(10)},e.tip=function(t){return e.tipActive=t,1==t?(e.tab.tip+=1,void(e.tab.total+=1)):(e.tab.total-=e.tab.tip,e.tab.tip=t/100*e.tab.sub_total,void(e.tab.total+=e.tab.tip))},e.isTipActive=function(t){return e.tipActive===t},e.logout=function(){a.logout()},e.init()}]),redtab.controllers.controller("ForgotPasswordCtrl",["$scope","$stateParams","$state","$http","$window","App",function(e,t,o,a,n,r){e.init=function(){},e.init()}]),redtab.controllers.controller("HistoryCtrl",["$scope","$stateParams","$state",function(e,t,o){e.history=[{id:1,u_id:"G5A4R2",item_name:"item name 1",item_price:"12",item_date_time:"july 31, 20013 - 12:47 pm "},{id:2,u_id:"G5A6R2",item_name:"item name 2",item_price:"10",item_date_time:"july 31, 20013 - 12:47 pm "},{id:3,u_id:"H5A4G2",item_name:"item name 3",item_price:"12",item_date_time:"july 31, 20013 - 12:47 pm "},{id:4,u_id:"G5O4R9",item_name:"item name 4",item_price:"12",item_date_time:"july 31, 20013 - 12:40 pm "},{id:5,u_id:"G7A4R2",item_name:"item name 5",item_price:"12",item_date_time:"july 31, 20013 - 12:47 pm "}],e.oldTab=function(e){o.go("app.oldtab",{tabId:e})},e.goToHome=function(){o.go("app.home")}}]),redtab.controllers.controller("HomeCtrl",["$scope","$stateParams","$state","$cordovaGeolocation","$http","App",function(e,t,o,a,n,r){e.init=function(){n.get(r.baseUrl+"locations").success(function(t){if(t.success){e.locations=t.data;var o={timeout:1e4,enableHighAccuracy:!0};a.getCurrentPosition(o).then(function(e){var t=new google.maps.LatLng(34.076354,74.811446);i(t)},function(e){var t=new google.maps.LatLng(34.076354,74.811446);i(t)})}})};var i=function(t){var a={zoom:11,mapTypeId:google.maps.MapTypeId.ROADMAP},n=new google.maps.LatLngBounds;if(geocoder=new google.maps.Geocoder,map=new google.maps.Map(document.getElementById("home-map"),a),geocoder){var r=0;angular.forEach(e.locations,function(e){geocoder.geocode({address:e.address},function(t,a){if(a==google.maps.GeocoderStatus.OK&&a!=google.maps.GeocoderStatus.ZERO_RESULTS){var i=new google.maps.Marker({position:t[0].geometry.location,map:map,title:e.address,icon:"img/icons/ic_marker_blue.png"});google.maps.event.addListener(i,"click",function(){o.go("app.venueselected",{location:e})}),r++,n.extend(t[0].geometry.location),map.fitBounds(n)}})})}};e.goToVenueList=function(){o.go("app.venuelist")},e.selectVenue=function(e){o.go("app.venueselected",{venueId:e})},e.init()}]),redtab.controllers.controller("LoginCtrl",["$scope","$stateParams","$window","$state","UserAuthFactory","$cordovaOauth","AuthenticationFactory","$ionicPopup","App","$http",function(e,t,o,a,n,r,i,s,l,c){function u(e){c.get("https://graph.facebook.com/v2.2/me",{params:{access_token:e,fields:"id,email,first_name,last_name",format:"json"}}).then(function(e){userData={email:e.data.email,facebook:e.data.id,first_name:e.data.first_name,last_name:e.data.last_name},p(userData)},function(e){alert("Error: "+e)})}function p(e){c.post(l.baseUrl+"auth/facebook",e).success(function(t){1==t.success?(i.isLogged=!0,i.user=t.id,o.localStorage.userEmail=e.email,o.localStorage.token=t.api_token,o.localStorage.user=t.id,o.localStorage.fbId=e.facebook,o.localStorage.fbName=e.first_name+" "+e.last_name,a.go("app.home")):s.alert({content:status.showToUser}),l.hideLoading()}).error(function(e){s.alert({content:e.showToUser}),l.hideLoading()})}e.user={},console.log(o.localStorage.token),e.doLogin=function(){var t=e.user.email,r=e.user.password;void 0!==t&&void 0!==r?(l.showLoading(),n.login(t,r).success(function(e){1==e.success?(i.isLogged=!0,i.user=e.id,o.localStorage.userEmail=t,o.localStorage.token=e.api_token,o.localStorage.user=e.id,a.go("app.home")):s.alert({content:status.showToUser}),l.hideLoading()}).error(function(e){s.alert({content:e.showToUser}),l.hideLoading()})):s.alert({content:"Invalid credentials"})},e.fbLogin=function(){r.facebook("998938043530635",["email","public_profile"]).then(function(e){o.localStorage.accessToken=e.access_token,u(e.access_token)},function(e){alert("There was a problem signing in!  See the console for logs"),console.log(e)})}}]),redtab.controllers.controller("MenuitemCtrl",["$scope","$stateParams","$state","$http","App",function(e,t,o,a,n){e.item=t.item,e.location=t.location,e.title=e.location.name,e.goToHome=function(){o.go("app.home")}}]),redtab.controllers.controller("MenuCtrl",["$scope","$stateParams","$state","$http","App",function(e,t,o,a,n){e.init=function(){n.showLoading(),e.location=t.location,e.title=e.location.name,a.get(n.baseUrl+"locations/"+e.location._id+"/categories").success(function(t){t.success&&(n.hideLoading(),e.categories=t.data)}).error(function(e){n.hideLoading()})},e.toggleGroup=function(t){e.menuitems=[],e.isGroupShown(t)?e.shownGroup=null:(n.showLoading(),a.get(n.baseUrl+"locations/"+e.location._id+"/categories/"+t._id+"/menuitems").success(function(o){o.success&&(n.hideLoading(),e.shownGroup=t,e.menuitems=o.data)}).error(function(e){n.hideLoading()}))},e.isGroupShown=function(t){return e.shownGroup===t},e.goToHome=function(){o.go("app.home")},e.init()}]),redtab.controllers.controller("OldtabCtrl",["$scope","$stateParams","$state",function(e,t,o){e.title=t.tabId,e.goToHome=function(){o.go("app.home")}}]),redtab.controllers.controller("PaymentsCtrl",["$scope","$stateParams","$state","$http","App","$ionicPopup",function(e,t,o,a,n,r){function i(t,o){if(o.error)n.hideLoading(),r.alert({content:o.error.message});else{var i=o.id;a.put(n.baseUrl+"me/payments/cards",{stripeToken:i}).success(function(t){t.success&&(n.hideLoading(),e.cards.push(t.card),e.closeForm())}).error(function(e){n.hideLoading()})}}e.init=function(){e.showFormDiv=!1},e.showForm=function(){e.showFormDiv=!0},e.closeForm=function(){e.showFormDiv=!1},e.addCard=function(e){void 0!==e?(n.showLoading(),Stripe.card.createToken({number:e.number,cvc:e.cvc,exp_month:e.month,exp_year:e.year},i)):r.alert({content:"Invalid card entries"})},e["delete"]=function(t){e.cards.splice(e.cards.indexOf(t),1),a["delete"](n.baseUrl+"me/payments/cards/"+t.id).success(function(e){}).error(function(o){r.alert({content:"Could not delete card due to some error"}),e.cards.push(t)})},e.goToHome=function(){o.go("app.home")},e.init()}]),redtab.controllers.controller("SignupCtrl",["$scope","$state","$stateParams","$ionicPopup","UserAuthFactory","AuthenticationFactory","$window","App",function(e,t,o,a,n,r,i,s){e.signupData={},console.log(i.localStorage.token),e.signUp=function(){var o=e.signupData.email,l=e.signupData.password,c=e.signupData.confirmPassword,u=/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;if(void 0!==o&&void 0!==l){if(!u.test(o))return void a.alert({content:"Invalid email"});if(l!==c)return void a.alert({content:"Passwords does not match"});s.showLoading(),n.register(o,l).success(function(e){1==e.success?(r.isLogged=!0,r.user=e.id,i.localStorage.token=e.api_token,i.localStorage.user=e.id,t.go("app.home")):a.alert({content:status.showToUser}),s.hideLoading()}).error(function(e){a.alert({content:e.showToUser}),s.hideLoading()})}else a.alert({content:"Invalid details"})}}]),redtab.controllers.controller("VenulistCtrl",["$scope","$stateParams","$state","$http","$window","App",function(e,t,o,a,n,r){e.init=function(){a.get(r.baseUrl+"locations").success(function(t){t.success&&(e.venues=t.data,console.log(n.localStorage.token))})},e.goToHome=function(){o.go("app.home")},e.selectVenue=function(e){o.go("app.venueselected",{location:e})},e.init()}]),redtab.controllers.controller("VenueSelectedCtrl",["$scope","$stateParams","$state","$ionicPopup","$cordovaGeolocation","$http","App",function(e,t,o,a,n,r,i){e.init=function(){e.location=t.location,r.get(i.baseUrl+"locations").success(function(t){if(t.success){e.locations=t.data;var o={timeout:1e4,enableHighAccuracy:!0};n.getCurrentPosition(o).then(function(e){var t=new google.maps.LatLng(34.076354,74.811446);s(t)},function(e){var t=new google.maps.LatLng(34.076354,74.811446);s(t)})}})};var s=function(t){var n={zoom:14,mapTypeId:google.maps.MapTypeId.ROADMAP,disableDefaultUI:!0},r=new google.maps.LatLngBounds;if(geocoder=new google.maps.Geocoder,map=new google.maps.Map(document.getElementById("venue-map"),n),geocoder){var i=0,s=0;e.center="",angular.forEach(e.locations,function(t){geocoder.geocode({address:t.address},function(n,l){if(l==google.maps.GeocoderStatus.OK&&l!=google.maps.GeocoderStatus.ZERO_RESULTS){if(e.location._id==t._id){var c=new google.maps.Marker({position:n[0].geometry.location,map:map,title:t.address,icon:"img/icons/ic_marker_green.png"});a.alert({content:e.center})}else var c=new google.maps.Marker({position:n[0].geometry.location,map:map,title:t.address,icon:"img/icons/ic_marker_blue.png"});google.maps.event.addListener(c,"click",function(){o.go("app.venueselected",{location:t})}),s++,r.extend(n[0].geometry.location),map.fitBounds(r)}e.locations.length-1==i&&e.updateMap(),i++})})}};e.updateMap=function(){var t={zoom:18,mapTypeId:google.maps.MapTypeId.ROADMAP,disableDefaultUI:!0};map.setOptions(t),map.panTo(e.center)},e.goToHome=function(){o.go("app.home")},e.goToMenu=function(e){o.go("app.menu",{location:e})},e.radTab=function(e){var t=a.confirm({title:"Confirm",template:"Are you sure you  want to start a tab at '"+e.name+"' ?"});t.then(function(t){t?o.go("app.menu",{location:e}):console.log("You are not sure")})},e.init()}]),redtab.services.factory("App",["$rootScope",function(e){return{baseUrl:"http://admin.radtab.co/api/v1/",showLoading:function(){e.showLoading=!0},hideLoading:function(){e.showLoading=!1}}}]),redtab.services.factory("AuthenticationFactory",["$window",function(e){var t={isLogged:!1,check:function(){e.localStorage.token&&e.localStorage.user?this.isLogged=!0:(this.isLogged=!1,delete this.user)}};return t}]).factory("UserAuthFactory",["$window","$location","$http","AuthenticationFactory",function(e,t,o,a){return{login:function(e,t){return o({url:"http://admin.radtab.co/api/v1/login",method:"POST",data:{email:e,password:t}})},register:function(e,t){return o({url:"http://admin.radtab.co/api/v1/register",method:"POST",data:{email:e,password:t}})},logout:function(){a.isLogged&&(a.isLogged=!1,delete a.user,delete e.localStorage.token,delete e.localStorage.user,e.localStorage.fbId&&(delete e.localStorage.fbId,delete e.localStorage.fbName),t.path("/login"))}}}]).factory("TokenInterceptor",["$q","$window",function(e,t){return{request:function(o){return o.headers=o.headers||{},t.localStorage.token&&(o.headers["x-auth-token"]=t.localStorage.token),o||e.when(o)},response:function(t){return t||e.when(t)}}}]);