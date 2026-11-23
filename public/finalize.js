var app = angular.module('shippingApp', []);

app.controller('ShippingController', function ($scope) {
    $scope.fullName = '';
    $scope.address = '';
    $scope.deliveryMethod = 'Standard Delivery';
    $scope.errorMessage = '';
    $scope.successMessage = '';

    // === BACKEND FETCH CALL (GET) ===
    fetch('/api/shipping')
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log('MySQL Shipping Records:', data);
        });

    $scope.submitShippingForm = function () {
        $scope.errorMessage = '';
        $scope.successMessage = '';

        if ($scope.fullName === '' || $scope.address === '' || $scope.deliveryMethod === '') {
            $scope.errorMessage = 'All shipping fields are required.';
            return;
        }

        var shippingData = {
            fullName: $scope.fullName,
            address: $scope.address,
            deliveryMethod: $scope.deliveryMethod
        };

        // === BACKEND FETCH CALL (POST) ===
        fetch('/api/shipping', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(shippingData)
        })
        .then(function (response) {
            return response.json();
        })
        .then(function (response) {
            $scope.$apply(function () {
                $scope.successMessage = response.message;
                $scope.fullName = '';
                $scope.address = '';
            });
        })
        .catch(function () {
            $scope.$apply(function () {
                $scope.errorMessage = 'Failed to connect to the Node.js server.';
            });
        });
    };
});