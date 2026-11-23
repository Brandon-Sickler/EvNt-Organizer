var app = angular.module('returnsApp', []);
app.controller('ReturnsController', function ($scope) {
    $scope.fullName = '';
    $scope.email = '';
    $scope.orderId = '';
    $scope.returnReason = '';
    $scope.condition = '';
    $scope.additionalDetails = '';
    $scope.errorMessage = '';
    $scope.successMessage = '';
    $scope.searchKeyword = '';
    $scope.selectedItem = null;
    $scope.searchResults = [];
    $('#productSearchInput').val('');

    $scope.products = [];
    fetch('/api/returns')
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log('MySQL Return Records:', data);
        });

    $.getJSON('returns.json', function (data) {
        $scope.$apply(function () {
            $scope.products = data.products || [];
        });
    });
    $('#productSearchInput').on('keyup', function () {
        var keyword = $(this).val().toLowerCase().trim();
        $scope.$apply(function () {
            if (keyword === '') {
                $scope.searchResults = [];
                return;
            }
            $scope.searchResults = $scope.products.filter(function (product) {
                return product.name.toLowerCase().indexOf(keyword) !== -1;
            });
        });
    });
    $scope.selectResult = function (product) {
        $scope.selectedItem = product;
        $('#productSearchInput').val(product.name);
        $scope.searchResults = [];
    };
    $scope.clearSelection = function () {
        $scope.selectedItem = null;
        $('#productSearchInput').val('');
        $scope.searchResults = [];
    };
    $scope.submitReturnForm = function () {
        $scope.errorMessage = '';
        $scope.successMessage = '';
        if (!$scope.fullName || !$scope.email || !$scope.orderId || !$scope.condition || !$scope.returnReason || !$scope.selectedItem) {
            $scope.errorMessage = 'All fields (including product condition and return reason) are required.';
            return;
        }
        if (!$scope.additionalDetails || $scope.additionalDetails.length < 6) {
            $scope.errorMessage = 'Provide reason for the return if you can(at least 6 characters).';
            return;
        }
        var returnData = {
            name: $scope.fullName,
            email: $scope.email,
            orderId: $scope.orderId,
            selectedItem: $scope.selectedItem,
            returnReason: $scope.returnReason,
            additionalDetails: $scope.additionalDetails,
            condition: $scope.condition
        };
        fetch('/api/returns', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(returnData)
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                console.log('Return request saved to MySQL:', data);
                $scope.$apply(function () {
                    $scope.successMessage = 'Return request submitted successfully!';
                    $scope.fullName = '';
                    $scope.email = '';
                    $scope.orderId = '';
                    $scope.selectedItem = null;
                    $scope.returnReason = '';
                    $scope.additionalDetails = '';
                    $scope.condition = '';
                });
            })
            .catch(function (){
                $scope.$apply(function () {
                    $scope.errorMessage = 'Error submitting return request. Please try again.';
                });
            });
    };
});