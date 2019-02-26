var productCart = [];
var productWishlist = [];
var checkbox_value = [];
var productData = [];
var company = new Set();
/*Sticky Navbar*/
$(document).ready(function() {
  var $navbar = $("#mNavbar");
  AdjustHeader(); // Incase the user loads the page from halfway down (or something);
  $(window).scroll(function() {
    AdjustHeader();
  });

  function AdjustHeader() {
    if ($(window).scrollTop() > 196) {
      if (!$navbar.hasClass("navbar-fixed-top")) {
        $navbar.addClass("navbar-fixed-top");
      }
    } else {
      $navbar.removeClass("navbar-fixed-top");
    }
  }
});

//Function adding the product to cart
function addProduct(prodId) {
  for (d of productData) {
    if (d.id == prodId) {
        obj = d;
        productCart.push(d);
        alert("Product Added to Cart");
        break;
    }
  }
}

//Function Loading the product
function loadProduct(id) {
  document.getElementById("Above_nav").innerHTML = "";
  document.getElementById("Main").innerHTML = "";
  jumbotron();
  for (d of productData) {
    if (d.id == id) {
      $("#Main").append(`<div class="card">
                  <img src="./images/${d.category}/${
        d.image
      }" alt="" style="width:100%">
                 <h2>${d.name}</h2>
                 <p class="title">${d.description}</p>
                 <p>Price:${d.price}</p>
                 <button class="btn btn-info cart_btn" onclick="addProduct(${
                   d.id
                 })">Add To Cart</button>
                 </div>`);
    }
  }
}

//Function removing product from cart
function removeProductCart(prodId) {
  for (d in productCart) {
    if (productCart[d].id == prodId) {
      console.log("inside if" + d);
      productCart.splice(d, 1);
      cartPage();
      console.log(productCart);
      break;
    }
  }
}

//Function adding the product to wishlist
function addProductWishlist(prodId) {
  var obj = {};
  for (d of productData) {
    if (d.id == prodId) {
      obj = d;
      productWishlist.push(d);
      alert("Product Added To Wishlist :-)");
      console.log(productWishlist);
      break;
    }
  }
}

//Function removing product from cart
function removeProductWishlist(prodId) {
  for (d in productWishlist) {
    if (productWishlist[d].id == prodId) {
      productWishlist.splice(d, 1);
      wishlistPage();
      console.log(productWishlist);
      break;
    }
  }
}

// Function Reading productCollection.JSON
function readProductCollection(cat) {
  for (d of productData) {
    if (d.category == cat) {
      $("#Main").append(`<div class="col-lg-3 col-md-4 col-xs-6">
            <div class=" text-center thumbnail">
                <a href="#" class="d-block mb-4 h-100" tabindex="-1">
                    <img class="img-fluid img-thumbnail" src="./images/${
                      d.category
                    }/${d.image}" alt="" onclick="loadProduct(${d.id})"></a>
                    <div class="caption">
                        <h3>${d.name}</h3>
                        <p>Price: ${d.price}</p>
                        <div>
                        <button class="btn btn-info btn-lg cartbtn" onClick="addProduct(${d.id})"><span class="glyphicon glyphicon-shopping-cart" ></span> Add To Cart</button>
                        <button class="btn glyphicon glyphicon-heart wishlistbtn" onClick="addProductWishlist(${d.id})"></button>
                        </div>
                        </div>
            </div>
        </div> `);
    }
  }
}

// Function rendering Html product page according to category clicked
function openProduct(evt, productName) {
  document.getElementById("Above_nav").innerHTML = "";
  document.getElementById("wrapper").innerHTML = "";
  $("#wrapper")
    .append(`<div id="productName" class="w3-container city  w3-animate-right">
                        <div id="mySidenav" class="sidenav" tabindex="0">
                            <a href="javascript:void(0)" class="closebtn" onclick="closeNav()" onkeypress="keyboardHandler(event)">&times;</a>
                            <a href="#">Brand</a>
                        </div>
                    </div>
                    <div id="Main">
                        <span id="sideFilter" style="font-size:30px;cursor:pointer; display:block" onclick="openNav()" tabindex="0" onkeypress="keyboardHandler(event)" >&#9776; Filter</span>
                    </div>`);
  $.ajax({
    // calling the ajax object of jquery
    type: "GET", // we are going to be getting info from this data source
    url: "./Schema/productCollection.json", //the datasource
    dataType: "json",
    success: function(data) {
      company.clear();
      productData = [];
      for (d of data) {
        if (d.category == productName) {
          productData.push(d);
          company.add(d.company);
        }
      }
      var count = 1;
      for (d of company) {
        $("#mySidenav")
          .append(`<div id="filter_check" class="checkbox filter_checkbox">
                <label><input type="checkbox" id="filter${count}" onclick="checkbox_click(this,'${productName}')" value="${d}">${d}</label>
                </div>`);
        count = count + 1;
      }
      readProductCollection(productName);
    }, // what happens when it is successful at loading the JSON
    error: function(e) {
      alert(e);
    }
  });
}

//Function for checkbox
function checkbox_click(control, productName) {
  var counter = 0;
  var value = control.value;
  if (control.checked) {
    checkbox_value.push(value);
  } else {
    for (d in checkbox_value) {
      if (checkbox_value[d] == value) {
        checkbox_value.splice(d, 1);
      }
    }
  }
  if (checkbox_value.length == 0) {
    document.getElementById("Above_nav").innerHTML = "";
    document.getElementById("Main").innerHTML = "";
    readProductCollection(productName);
  } else {
    for (var i = 0; i < checkbox_value.length; i++) {
      var check_value = checkbox_value[i];
      filterProductCollection(productName, check_value, i);
    }
  }
}

//Function for filtering
function filterProductCollection(cat, comp, i) {
  if (i == 0) {
    document.getElementById("Above_nav").innerHTML = "";
    document.getElementById("Main").innerHTML = "";
  }
  for (d of productData) {
    console.log(cat, comp);
    if (d.category == cat && d.company == comp) {
      $("#Main").append(`<div class="col-lg-3 col-md-4 col-xs-6">
            <div class=" text-center thumbnail">
                <a href="#" class="d-block mb-4 h-100">
                    <img class="img-fluid img-thumbnail" src="./images/${
                      d.category
                    }/${d.image}" alt="" onclick="loadProduct(${d.id})"></a>
                    <div class="caption">
                        <h3>${d.name}</h3>
                        <p>Price: ${d.price}</p>
                        <button class="btn btn-info btn-lg cartbtn" onClick="addProduct(${
                          d.id
                        })"><span class="glyphicon glyphicon-shopping-cart" ></span> Add To Cart</button>
                        <button class="btn glyphicon glyphicon-heart wishlistbtn" onClick="addProductWishlist(${
                          d.id
                        })"></button>
                    </div>
            </div>
        </div> `);
    }
  }
}

//Function for open sideNavbar
function openNav() {
  document.getElementById("mySidenav").style.width = "250px";
  document.getElementById("Main").style.marginLeft = "250px";
  $('#mySidenav').focus();
}

// Function for closing sideNavbar
function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
  document.getElementById("Main").style.marginLeft = "0";
}

//Reading Main category from JSON file and displaying in Navbar
$(document).ready(function() {
  $.getJSON("./Schema/categories.json", function(data) {
    $.each(data.categories, function(i, category) {
      var subjsondata = "";
      $.each(category.sub_categories, function(i, sub_categories) {
        subjsondata +=
          "<li onClick=\"openProduct(event,'" +
          sub_categories.name +
          '\')"><a href="#">' +
          sub_categories.name +
          "</a></li>";
      });
      if (subjsondata != "") {
        var jsondata =
          '<li class="tablink" "dropdown"><a class="dropdown-toggle" data-toggle="dropdown" href="#">' +
          category.name +
          '</a><ul class="dropdown-menu">' +
          subjsondata +
          "</ul></li>";
      } else {
        var jsondata =
          '<li class="tablink" "dropdown" onClick="openProduct(event,\'' +
          category.name +
          '\')"><a href="#">' +
          category.name +
          "</a></li>";
      }
      $(jsondata).appendTo("#menu_ul");
    });
  });
});

//Function displaying Home Page
function home() {
  document.getElementById("Above_nav").innerHTML = "";
  document.getElementById("wrapper").innerHTML = "";
  $("#wrapper").append(`<div class="fluid-container">
            <div id="feature-carousel" class="carousel slide" data-ride="carousel">
                <ol class="carousel-indicators">
                  <li data-target="#feature-carousel" data-slide-to="0" class="active"></li>
                  <li data-target="#feature-carousel" data-slide-to="1"></li>
                  <li data-target="#feature-carousel" data-slide-to="2"></li>
                  <li data-target="#feature-carousel" data-slide-to="3"></li>
                </ol>
                <div class="carousel-inner" role="listbox">
                    <div class="item active">
                        <a href="#">
                            <img class="img-responsive" src="images/Home/home10.jpg" alt="">
                        </a>
                        <div class="carousel-caption">
                        </div>
                    </div>
                    <div class="item">
                        <a href="#">
                            <img class="img-responsive" src="images/Home/home12.png" alt="">
                        </a>
                        <div class="carousel-caption">
                        </div>
                    </div>
                    <div class="item">
                        <a href="#">
                            <img class="img-responsive" src="images/Home/home1.jpg"
                                 alt="">
                        </a>
                        <div class="carousel-caption">
                        </div>
                    </div>
                    <div class="item">
                        <a href="#">
                            <img class="img-responsive" src="images/Home/home2.jpg"
                                 alt="">
                        </a>
                        <div class="carousel-caption">
                        </div>
                    </div>
                </div>
                <a class="left carousel-control" href="#feature-carousel" role="button" data-slide="prev">
                  <span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
                  <span class="sr-only">Previous</span>
                </a>
                <a class="right carousel-control" href="#feature-carousel" role="button" data-slide="next">
                  <span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>
                  <span class="sr-only">Next</span>
                </a>
              </div>
            </div>
            <div class="container">
        <div class="row page-intro">
            <div class="col-lg-12">
                <h3>Top Trending</h3>
            </div>
        </div>
        <div class="span9">
            <div class="well well-small">
                <h4>Featured Products <small class="pull-right">200+ Featured Products</small></h4>
                <div class="row-fluid">
                    <div id="featured" class="carousel slide" data-ride="carousel">
                         <div class="carousel-inner" role="listbox">
                            <div class="item active">
                                <div class="row">
                                    <div class="col-md-3"><a href="#" class="thumbnil"><img src="images/Home/home21.jpg" alt="" style="max-width:100%;"></a></div>
                                    <div class="col-md-3"><a href="#" class="thumbnil"><img src="images/Home/home22.jpg" alt="" style="max-width:100%;"></a></div>
                                    <div class="col-md-3"><a href="#" class="thumbnil"><img src="images/Home/home23.jpg" alt="" style="max-width:100%;"></a></div>
                                    <div class="col-md-3"><a href="#" class="thumbnil"><img src="images/Home/home24.jpg" alt="" style="max-width:100%;"></a></div>
                                </div>
                            </div>
                            <div class="item">
                            <div class="row">
                                <div class="col-md-3"><a href="#" class="thumbnil"><img src="images/Home/home25.jpg" alt="" style="max-width:100%;"></a></div>
                                <div class="col-md-3"><a href="#" class="thumbnil"><img src="images/Home/home26.jpg" alt="" style="max-width:100%;"></a></div>
                                <div class="col-md-3"><a href="#" class="thumbnil"><img src="images/Home/home27.jpg" alt="" style="max-width:100%;"></a></div>
                                <div class="col-md-3"><a href="#" class="thumbnil"><img src="images/Home/home28.jpg" alt="asia" style="max-width:100%;"></a></div>
                            </div>
                            </div>
                            <div class="item">
                            <div class="row">
                                <div class="col-md-3"><a href="#" class="thumbnil"><img src="images/Home/home29.jpg" alt="" style="max-width:100%;"></a></div>
                                <div class="col-md-3"><a href="#" class="thumbnil"><img src="images/Home/home30.jpg" alt="" style="max-width:100%;"></a></div>
                                <div class="col-md-3"><a href="#" class="thumbnil"><img src="images/Home/home31.jpg" alt="" style="max-width:100%;"></a></div>
                                <div class="col-md-3"><a href="#" class="thumbnil"><img src="images/Home/home32.jpg" alt="" style="max-width:100%;"></a></div>
                            </div>
                            </div>
                         </div>
                        <a class="left carousel-control" href="#featured" role="button" data-slide="prev">
                            <span class="glyphicon glyphicon-chevron-left" ></span>
                        </a>
                        <a class="right carousel-control" href="#featured" role="button" data-slide="next">
                          <span class="glyphicon glyphicon-chevron-right" ></span>
                        </a>
                </div>
            </div>
        </div>
    </div>`);
}

//Function to display jumbotron
function jumbotron() {
  $("#Above_nav").append(`<div class="jumbotron">
  			<div class="container text-center">
    			<h1>Online Store</h1>
    			<p>Mission, Vission & Values</p>
  			</div>
		</div>`);
}

//Function displaying product added to cart
function cartPage() {
  document.getElementById("Above_nav").innerHTML = "";
  document.getElementById("Main").innerHTML = "";
  jumbotron();
  if (productCart.length == 0) {
    $("#Main").append(`<div class="jumbotron">
                <div class="container text-center">
                    <h1>Cart is Empty</h1>
                    <a href="#" class="btn btn-danger" onClick="home()"><span class="glyphicon glyphicon-home" ></span> Back To Home</a>
                     </div>
                </div>`);
  } else {
    for (d of productCart) {
      console.log(d);
      $("#Main").append(`<div class="col-lg-3 col-md-4 col-xs-6">
            <div class=" text-center thumbnail">
                <a href="#" class="d-block mb-4 h-100">
                <img class="img-fluid img-thumbnail" src="./images/${
                  d.category
                }/${d.image}" alt=""></a>
                <div class="caption">
                    <div class="caption">
                        <h3>${d.name}</h3>
                        <p>Price: ${d.price}</p>
                        <a href="#" class="btn btn-danger btn-lg cartbtn" onClick="removeProductCart(${
                          d.id
                        })"><span class="glyphicon glyphicon-trash" ></span> Remove</a>
                        </div>
                </div>
            </div>
        </div> `);
    }
  }
}

//Function displaying product added to cart
function wishlistPage() {
  document.getElementById("Above_nav").innerHTML = "";
  document.getElementById("Main").innerHTML = "";
  jumbotron();
  if (productWishlist.length == 0) {
    $("#Main").append(`<div class="jumbotron">
                <div class="container text-center">
                    <h1>Wishlist is Empty</h1>
                    <a href="#" class="btn btn-danger" onClick="home()"><span class="glyphicon glyphicon-home" ></span> Back To Home</a>
                     </div>
                </div>`);
  } else {
    for (d of productWishlist) {
      $("#Main").append(`<div class="col-lg-3 col-md-4 col-xs-6">
            <div class=" text-center thumbnail">
                <a href="#" class="d-block mb-4 h-100">
                <img class="img-fluid img-thumbnail" src="./images/${
                  d.category
                }/${d.image}" alt=""></a>
                <div class="caption">
                    <div class="caption">
                        <h3>${d.name}</h3>
                        <p>Price: ${d.price}</p>
                        <a href="#" class="btn btn-danger btn-lg cartbtn" onClick="removeProductWishlist(${
                          d.id
                        })"><span class="glyphicon glyphicon-trash" ></span> Remove</a>
                        </div>
                </div>
            </div>
        </div> `);
    }
  }
}

//Function displaying Login Page
function login() {
  document.getElementById("Above_nav").innerHTML = "";
  document.getElementById("wrapper").innerHTML = "";
  var mainClass = document.getElementById("Main");
  if (mainClass != null) document.getElementById("Main").innerHTML = "";
  else {
    $("#wrapper").append(`
                    <div id="Main">
                        
                    </div>`);
  }

  $("#Main").append(` <div class="container" style="margin-top:40px">
		<div class="row">
			<div class="col-xs-8 col-xs-offset-2 col-sm-6 col-md-4 col-md-offset-4 col-sm-offset-3">
				<div class="panel panel-default">
					<div class="panel-heading">
						<strong>Admin LogIn</strong>
					</div>
					<div class="panel-body">
						<form role="form">
							<fieldset>
								<div class="row">
									<div class="center-block">
										<img class="profile-img"
											src="https://lh5.googleusercontent.com/-b0-k99FZlyE/AAAAAAAAAAI/AAAAAAAAAAA/eu7opA4byxI/photo.jpg?sz=120" alt="">
									</div>
								</div>
								<div class="row">
									<div class="col-sm-12 col-md-10  col-md-offset-1 ">
										<div class="form-group">
											<div class="input-group">
												<span class="input-group-addon">
													<i class="glyphicon glyphicon-user"></i>
												</span>
												<input class="form-control" placeholder="Username" name="loginname" type="text" id="uname" autofocus>
											</div>
										</div>
										<div class="form-group">
											<div class="input-group">
												<span class="input-group-addon">
													<i class="glyphicon glyphicon-lock"></i>
												</span>
												<input class="form-control" placeholder="Password" name="password" type="password" id="pword" value="">
											</div>
										</div>
										<div class="form-group">
											<input type="button" class="btn btn-lg btn-primary btn-block" value="Log in" onclick="addCategory()">
										</div>
									</div>
								</div>
							</fieldset>
						</form>
					</div>
					<div class="panel-footer ">
				        Authorized Used Only
					</div>
                </div>
			</div>
		</div>
	</div>
`);
}

//Function to add category
function addCategory() {
  var uname = document.getElementById("uname").value;
  var pass = document.getElementById("pword").value;
  console.log(uname, pass);
  if (uname == "admin" && pass == "admin") {
    document.getElementById("Above_nav").innerHTML = "";
    document.getElementById("Main").innerHTML = "";
    $("#Main").append(`<div class="container">
        <h2>CRUD Operation</h2>
        <div class="panel panel-primary">
            <div class="panel-heading">
                <ul class="nav nav-tabs">
                    <li onclick="panel_read()"><a data-toggle="tab" href="#read">Read</a></li>
                    <li onclick="panel_add()"><a data-toggle="tab" href="#add">Add</a></li>
                    <li onclick="panel_delete()"><a data-toggle="tab" href="#delete">Delete</a></li>
                </ul>
            </div>
            <div class="panel-body">
              <div id="content" class="tab-content">
                <div id="read" class="tab-pane fade in active">
                    <h3>Read</h3>
                    <div class="radio-inline">
                        <label><input type="radio" name="optradio" value="show_category" onclick="checkRadio(this)" >Show Category</label>
                    </div>
                    <div class="radio-inline">
                        <label><input type="radio" name="optradio" value="show_product" onclick="checkRadio(this)">Show Product</label>
                    </div>
                </div>
                <div id="add" class="tab-pane fade">
                    <h3>Add</h3>
                    <div class="radio-inline">
                        <label><input type="radio" name="optradio" value="add_category" onclick="checkRadio(this)" >Add Category</label>
                    </div>
                    <div class="radio-inline">
                        <label><input type="radio" name="optradio" value="add_product" onclick="checkRadio(this)">Add Product</label>
                    </div>
                </div>
                <div id="delete" class="tab-pane fade">
                  <h3>DELETE</h3>
                </div>
              </div>
            </div>
            <div class="panel-footer">Authorized Person </div>
        </div>
    </div>
    `);
  }
}

//Function Render the json file
function panel_read() {
  document.getElementById("Above_nav").innerHTML = "";
  document.getElementById("content").innerHTML = "";
  $("#content").append(`<div id="read" class="tab-pane fade in active">
                    <h3>Read</h3>
                    <div class="radio-inline">
                        <label><input type="radio" name="optradio" value="show_category" onclick="checkRadio(this)" >Show Category</label>
                    </div>
                    <div class="radio-inline">
                        <label><input type="radio" name="optradio" value="show_product" onclick="checkRadio(this)">Show Product</label>
                    </div>
                </div>`);
}

//Function to Render Panel's add page
function panel_add() {
  document.getElementById("Above_nav").innerHTML = "";
  document.getElementById("content").innerHTML = "";
  $("#content").append(` <div id="add" class="tab-pane fade in active">
            <h3>Add</h3>
            <div class="radio-inline">
                <label><input type="radio" name="optradio" value="add_category" onclick="checkRadio(this)" >Add Category</label>
            </div>
            <div class="radio-inline">
                <label><input type="radio" name="optradio" value="add_product" onclick="checkRadio(this)">Add Product</label>
            </div>
        </div>`);
}

//Function rendering Panel's delete page
function panel_delete() {
  document.getElementById("Above_nav").innerHTML = "";
  document.getElementById("content").innerHTML = "";
  $("#content").append(` <div id="add" class="tab-pane fade in active">
        <h3>Delete</h3>
        <div class="radio-inline">
            <label><input type="radio" name="optradio" value="delete_category" onclick="checkRadio(this)" >Delete Category</label>
        </div>
        <div class="radio-inline">
            <label><input type="radio" name="optradio" value="delete_product" onclick="checkRadio(this)">Delete Product</label>
        </div>
    </div>`);
}

//Function checking which radio button is selected
function checkRadio(control) {
  document.getElementById("Above_nav").innerHTML = "";
  document.getElementById("content").innerHTML = "";
  var radiobutton_value = control.value;
  if (radiobutton_value == "add_category") {
    $("#content").append(` <form action="" method="post">
                        <div class="form-group">
                          <label for="mCategory">Main Category:</label>
                          <input type="Text" class="form-control" id="mCategory" placeholder="Enter Main Category" name="mCat">
                        </div>
                        <div class="form-group">
                          <label for="subCategory">Sub Category:</label>
                          <input type="Text" class="form-control" id="subCategory" placeholder="Enter Main Category" name="mCat">
                        </div>
                        <button type="submit" class="btn btn-default">Submit</button>
                      </form>`);
  } else if (radiobutton_value == "add_product") {
    $("#content")
      .append(` <form action="http://127.0.0.1:8080/add" method="post">
                        <div class="form-group">
                            <label for="id">Product ID:</label>
                            <input type="number" class="form-control" id="id" placeholder="Enter Product ID" name="id">
                        </div>
                        <div class="form-group">
                          <label for="maincategory">Main Category:</label>
                          <input type="Text" class="form-control" id="maincategory" placeholder="Enter Main Category" name="maincategory">
                        </div>
                        <div class="form-group">
                          <label for="category">Sub Category:</label>
                          <input type="Text" class="form-control" id="category" placeholder="Enter Sub Category" name="category">
                        </div>
                        <div class="form-group">
                            <label for="company">Product Company:</label>
                            <input type="Text" class="form-control" id="company" placeholder="Enter Product Company" name="company">
                        </div>
                        <div class="form-group">
                          <label for="name">Product Name:</label>
                          <input type="Text" class="form-control" id="name" placeholder="Enter Name" name="name">
                        </div>
                        <div class="form-group">
                            <label for="id">Product Price:</label>
                            <input type="number" class="form-control" id="price" placeholder="Enter Product Price" name="price">
                        </div>
                        <div class="form-group">
                          <label for="description">Product Description:</label>
                          <input type="Text" class="form-control" id="description" placeholder="Enter Description" name="description">
                        </div>
                        <button type="submit" class="btn btn-primary">Submit</button>
                      </form>`);
  } else if (radiobutton_value == "show_category") {
    $("#content").append(`<h2>Pending....!!</h2>`);
  } else if (radiobutton_value == "show_product") {
    $.ajax({
      // calling the ajax object of jquery
      type: "GET", // we are going to be getting info from this data source
      url: "./Schema/productCollection.json", //the datasource
      dataType: "json",
      success: function(data) {
        $("#content").append(`<div style="text-align:center">
                  <h1>Welcome to Product Page</h1>
                  <h1>ProductList</h1>
                  <br/>
                    <table id="tblData" class="table table-hover table-striped">
                      <thead class="thead-light">
                        <tr>
                          <th>Id</th>
                          <th>Name</th>
                          <th>Description</th>
                          <th>Price</th>
                          <th></th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody id="display_container">

                      </tbody>
                    </table>
                  </div>`);

        for (d of data) {
          $("#display_container").append(`<tr>
                    <td>${d.id}</td>
                    <td>${d.name}</td>
                    <td>${d.description}</td>
                    <td>${d.price}</td>
                    <td><button type="button" class="btn btn-info" data-toggle="modal" data-target="#myModal">Edit</button>
                      <div class="modal fade" id="myModal" role="dialog">
                        <div class="modal-dialog">

                          <div class="modal-content">
                            <div class="modal-header">
                              <button type="button" class="close" data-dismiss="modal">&times;</button>
                              <h4 class="modal-title">Modal Header</h4>
                            </div>
                            <div class="modal-body">
                              <form action="http://127.0.0.1:8080/edit" method="post">
                        <div class="form-group">
                            <label for="id">Product ID:</label>
                            <input type="number" class="form-control" id="id" placeholder="Enter Product ID" name="id" value="${
                              d.id
                            }">
                        </div>
                        <div class="form-group">
                          <label for="maincategory">Main Category:</label>
                          <input type="Text" class="form-control" id="maincategory" placeholder="Enter Main Category" name="maincategory" value="${
                            d.maincategory
                          }">
                        </div>
                        <div class="form-group">
                          <label for="category">Sub Category:</label>
                          <input type="Text" class="form-control" id="category" placeholder="Enter Sub Category" name="category" value="${
                            d.category
                          }">
                        </div>
                        <div class="form-group">
                            <label for="company">Product Company:</label>
                            <input type="Text" class="form-control" id="company" placeholder="Enter Product Company" name="company" value="${
                              d.company
                            }">
                        </div>
                        <div class="form-group">
                            <label for="id">Product Price:</label>
                            <input type="number" class="form-control" id="price" placeholder="Enter Product Price" name="price" value="${
                              d.price
                            }">
                        </div>
                        <button type="submit" class="btn btn-primary">Submit</button>
                      </form>
                            </div>
                            <div class="modal-footer">
                              <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                            </div>
                          </div>

                        </div>
                      </div>
                    </td>
                    <td><form action="http://127.0.0.1:8080/delete/${d.id}" method="get"><button type="submit" class="btn btn-danger">Delete</button></span></form></td>
                </tr>`);
        }

        var totalRows = $("#tblData").find("tbody tr:has(td)").length;
        var recordPerPage = 5;
        var totalPages = Math.ceil(totalRows / recordPerPage);
        var $pages = $('<div id="pages"></div>');
        for (i = 0; i < totalPages; i++) {
          $('<span class="pageNumber">&nbsp;' + (i + 1) + "</span>").appendTo(
            $pages
          );
        }
        $pages.appendTo("#tblData");
        $(".pageNumber").hover(
          function() {
            $(this).addClass("focus");
          },
          function() {
            $(this).removeClass("focus");
          }
        );
        $("table")
          .find("tbody tr:has(td)")
          .hide();
        var tr = $("table tbody tr:has(td)");
        for (var i = 0; i < recordPerPage - 1; i++) {
          $(tr[i]).show();
        }
        $("span").click(function(event) {
          $("#tblData")
            .find("tbody tr:has(td)")
            .hide();
          var nBegin = ($(this).text() - 1) * recordPerPage;
          var nEnd = $(this).text() * recordPerPage - 1;
          for (var i = nBegin; i <= nEnd; i++) {
            $(tr[i]).show();
          }
        });
      }, // what happens when it is successful at loading the JSON
      error: function(e) {
        alert(e);
      }
    });
  }
}

//Function for accessibility 
function keyboardHandler(event) {
  switch (event.which || event.keyCode) {
    case 32: {
      event.stopPropagation;
      openNav();
      break;
    }
    case 96: {
      event.stopPropagation;
      closeNav();
      break;
    }
    case 101: {
      event.stopPropagation;
      $("#sideFilter").focus();
      break;
    }
    case 99: {
      event.stopPropagation;
      cartPage();
      break;
    }
    case 2: {
      event.stopPropagation;
      home();
      break;
    }
    case 70: {
      event.stopPropagation;
      openNav();
      break;
    }

  } //end switch
  return true;
}

