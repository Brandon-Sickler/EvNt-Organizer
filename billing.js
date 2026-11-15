var app = angular.module('billingApp', []);

app.controller('BillingController', function ($scope) {
    $scope.fullName = '';
    $scope.address = '';
    $scope.cardNumber = '';
    $scope.expiration = '';
    $scope.cvv = '';
    $scope.cartItems = [
        { name: 'Conference VIP Pass', price: 299.00 },
        { name: 'Workshop Add-On', price: 50.00 }
    ];
    $scope.shippingCost = 10.00;
    $scope.totalAmount = 359.00;
    $scope.errorMessage = '';
    $scope.successMessage = '';

    $scope.submitForm = function () {
        $scope.errorMessage = '';
        $scope.successMessage = '';

        if ($scope.fullName === '' || $scope.address === '' || $scope.cardNumber === '' || $scope.expiration === '' || $scope.cvv === '') {
            $scope.errorMessage = 'All fields are required.';
            return;
        }

        if ($scope.cardNumber.length < 16) {
            $scope.errorMessage = 'Please enter a valid 16-digit credit card number.';
            return;
        }

        if ($scope.expiration.indexOf('/') === -1 || $scope.expiration.length !== 5) {
            $scope.errorMessage = 'Expiration date must be in MM/YY format.';
            return;
        }

        if ($scope.cvv.length < 3) {
            $scope.errorMessage = 'Security code must be 3 or 4 digits.';
            return;
        }

        var billingData = {
            name: $scope.fullName,
            address: $scope.address,
            paymentMethod: {
                cardNumber: $scope.cardNumber,
                expiration: $scope.expiration,
                cvv: $scope.cvv
            }
        };

        $.ajax({
            url: 'http://localhost:3000/api/billing',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(billingData),
            success: function (response) {
                $scope.$apply(function () {
                    $scope.successMessage = response.message;
                });
            },
            error: function () {
                $scope.$apply(function () {
                    $scope.errorMessage = 'Failed to connect to the Node.js server.';
                });
            }
        });
    };
});