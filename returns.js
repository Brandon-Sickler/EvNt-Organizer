var app = angular.module('returnsApp', []);
app.controller('ReturnsController', function ($scope) {
    $scope.fullName = '';
    $scope.email = '';
    $scope.orderId = '';
    $scope.returnReason = '';
    $scope.additionalDetails = '';
    $scope.errorMessage = '';
    $scope.successMessage = '';
    $scope.searchKeyword = '';
    $scope.selectedItem = null;
    $scope.searchResults = [];

    $scope.products = [
        { id: 'PASS-ALL', name: 'Full Access Conference Pass', price: 299.00 },
        { id: 'WORK-CLOUD', name: 'Cloud Native Architecture Workshop', price: 99.50 },
        { id: 'SWAG-VIP', name: 'VIP Speaker Luncheon & Swag Pack', price: 39.99 }
    ];
    $scope.handleSearch = function () {
        if (!$scope.searchKeyword || $scope.searchKeyword.trim() === '') {
            $scope.searchResults = [];
            return;
        }
        $scope.searchResults = $scope.products.filter(product =>
            product.name.toLowerCase().includes($scope.searchKeyword.toLowerCase())
        );
    }
    $scope.selectResult = function (product) {
        $scope.selectedItem = product;
        $scope.searchKeyword = product.name;
        $scope.searchResults = [];
    }
    $scope.clearSelection = function () {
        $scope.selectedItem = null;
        $scope.searchKeyword = '';
    }
    $scope.submitReturnForm = function () {
        $scope.errorMessage = '';
        $scope.successMessage = 'Return request submitted successfully.';
        if (!$scope.fullName || !$scope.email || !$scope.orderId || !$scope.returnReason || !$scope.selectedItem) {
            $scope.errorMessage = 'All fields are required.';
            $scope.successMessage = 'Return request submitted successfully.';
            return;
        }
        if(!$scope.additionalDetails || $scope.additionalDetails.length < 6) {
            $scope.errorMessage = 'Provide reason for the return if you can(at least 6 characters).';
            return;
        }
        var returnData = {
            name: $scope.fullName,
            email: $scope.email,
            orderId: $scope.orderId,
            selectedItem: $scope.selectedItem,
            returnReason: $scope.returnReason,
            additionalDetails: $scope.additionalDetails
        };
        $scope.jsonPayload = JSON.stringify(returnData, null, 2);
        $.ajax({
            url: 'http://localhost:3000/api/returns',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(returnData),
            success: function (response) {
                $scope.$apply(function () {
                    $scope.successMessage = response.message || 'Return request submitted successfully.';
                    $scope.fullName = '';
                    $scope.email = '';
                    $scope.orderId = '';
                    $scope.returnReason = '';
                    $scope.additionalDetails = '';
                    $scope.selectedItem = null;
                    $scope.searchKeyword = '';
                });
            },
            error: function () {
                $scope.$apply(function () {
                    $scope.errorMessage = 'the return request did not work.';

                });
            }
        });
    };
});