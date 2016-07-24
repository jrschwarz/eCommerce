exports.ProductViewController = function($scope, $routeParams, $http) {
  $scope.price = undefined;

  $scope.handlePriceClick = function() {
    if ($scope.price === undefined) {
      $scope.price = -1;
    } else {
      $scope.price = 0 - $scope.price;
    }
    $scope.load();
  };

  $scope.load = function() {
    $http.
      get('/api/v1/products').
      success(function(data) {
        $scope.products = data.Products;
      });
  };

  $scope.load();

  setTimeout(function() {
    $scope.$emit('CategoryProductsController');
  }, 0);
};

exports.AddToCartController = function($scope, $http, $user, $timeout) {
  $scope.addToCart = function(product) {
    if($user.user) {
      var obj = { product: product._id, quantity: 1 };
      $user.user.data.cart.push(obj);

      $http.
        put('/api/v1/me/cart', { data: { cart: $user.user.data.cart } }).
        success(function(data) {
          $user.loadUser();
          $scope.success = true;

          $timeout(function() {
            $scope.success = false;
          }, 5000);
        });
    } else {
      alert("Please login before adding to your cart.");
    }
  };
};

exports.CategoryProductsController = function($scope, $routeParams, $http) {
  var encoded = encodeURIComponent($routeParams.category);

  $scope.price = undefined;

  $scope.handlePriceClick = function() {
    if ($scope.price === undefined) {
      $scope.price = -1;
    } else {
      $scope.price = 0 - $scope.price;
    }
    $scope.load();
  };

  $scope.load = function() {
    var queryParams = { price: $scope.price };
    $http.
      get('/api/v1/product/category/' + encoded, { params: queryParams }).
      success(function(data) {
        $scope.products = data.products;
      });
  };

  $scope.load();

  setTimeout(function() {
    $scope.$emit('CategoryProductsController');
  }, 0);
};

exports.CategoryTreeController = function($scope, $routeParams, $http) {
  var encoded = encodeURIComponent($routeParams.category);
  $http.
    get('/api/v1/category/id/' + encoded).
    success(function(data) {
      $scope.category = data.category;
      $http.
        get('/api/v1/category/parent/' + encoded).
        success(function(data) {
          $scope.children = data.categories;
        });
    });

  setTimeout(function() {
    $scope.$emit('CategoryTreeController');
  }, 0);
};

exports.CheckoutController = function($scope, $user, $http) {
  // For update cart
  $scope.user = $user;

  $scope.remove = function(item, index) {
    $scope.user.user.data.cart.splice(index, 1);
    updateCart();
  };

  var updateCart = function() {
    $http.
      put('/api/v1/me/cart', $user.user).
      success(function(data) {
        $scope.updated = true;
      });
  };

  // For checkout
  Stripe.setPublishableKey('pk_test_X46G23zw8ZvQd0Irpb2ZqyiS');

  $scope.stripeToken = {
    number: "4242424242424242",
    cvc: "123",
    exp_month: "12",
    exp_year: "2017"
  };

  $scope.checkout = function() {
    $scope.error = null;

    Stripe.card.createToken($scope.stripeToken, function(status, response) {
      if (status.error) {
        $scope.error = status.error;
        return;
      }

      if (response.error) {
        $scope.error = response.error;
        return;
      }

      if ($scope.stripeToken.number === "" ||
          $scope.stripeToken.cvc === "" ||
          $scope.stripeToken.exp_month === "" ||
          $scope.stripeToken.exp_year === "") {
            alert("Please fill out all fields of the payment form before checking out.");
            return;
      } else {
        console.log(response.id);
        $http.
          post('/api/v1/checkout', { stripeToken: response.id }).
          success(function(data) {
            $scope.checkedOut = true;
            $user.user.data.cart = [];
          });
      }
    });
  };
};

exports.NavBarController = function($scope, $user, $window) {
  $scope.user = $user;

  $scope.logout = function() {
    $user.logout();
    $window.location.href = '/';
  };

  setTimeout(function() {
    $scope.$emit('NavBarController');
  }, 0);
};

exports.ProductDetailsController = function($scope, $routeParams, $http) {
  var encoded = encodeURIComponent($routeParams.id);

  $http.
    get('/api/v1/product/id/' + encoded).
    success(function(data) {
      $scope.product = data.product;
    });

  setTimeout(function() {
    $scope.$emit('ProductDetailsController');
  }, 0);
};
