/**
 * Created by flysh on 2016/1/31.
 */
'use strict';

var assetTable = $("#assetTable");
var otherTable = $("#otherTable");
var pagerElements = {
    prev: $("#pager .prev"),
    next: $("#pager .next"),
    page: $("#pager .page")
};
var pagerData = {
    hasPrev: true,
    page: 1,
    hasNext: true,

    totalPage: null,
    pageSize: 5
}
var allAssetData = [];
var selected = [];

pagerElements.prev.click(function() {
    pagerData.page -= 1;
    calcPager();
});

pagerElements.next.click(function() {
    pagerData.page += 1;
    calcPager();
});

function getAssets() {
    return $.post('../php/asset.php');
}

function renderAssetTable() {
    var tbody = assetTable.find("tbody");
    tbody.find("tr").remove();
    $.each(allAssetData, function (i, asset) {
        tbody.append(
            $("<tr></tr>")
                .append($("<td>{{value}}</td>".replace("{{value}}", asset.id)))
                .append($("<td>{{value}}</td>".replace("{{value}}", asset.name)))
                .append($("<td>{{value}}</td>".replace("{{value}}", asset.price)))
                .append($("<td>{{value}}</td>".replace("{{value}}", asset.city)))
                .append($("<td></td>").append($("<input type='checkbox'/>")
                    .prop('checked', selected.indexOf(asset) > -1)
                    .click(function () {
                        var checked = $(this).prop('checked');
                        selectAsset(asset, checked);
                    }))
                )
        );
    });
}

function renderOtherTable() {
    var tbody = otherTable.find("tbody");
    tbody.find("tr").remove();

    var skip = (pagerData.page - 1) * pagerData.pageSize;
    var take = pagerData.pageSize;
    var dataToDisplay = selected.concat().splice(skip, take);

    $.each(dataToDisplay, function (i, asset) {
        tbody.append(
            $("<tr></tr>")
                .append($("<td>{{value}}</td>".replace("{{value}}", asset.id)))
                .append($("<td>{{value}}</td>".replace("{{value}}", asset.name)))
                .append($("<td>{{value}}</td>".replace("{{value}}", asset.price)))
                .append($("<td>{{value}}</td>".replace("{{value}}", asset.city)))
                .append($("<td><button>移除</button></td>").click(function () {
                        removeItemFromSelected(asset);
                    })
                )
        );
    });

    pagerData.hasNext ? pagerElements.next.show() : pagerElements.next.hide();
    pagerData.hasPrev ? pagerElements.prev.show() : pagerElements.prev.hide();
    pagerElements.page.text(pagerData.page);
}

function calcPager() {
    pagerData.totalPage = Math.ceil(selected.length / pagerData.pageSize);
    pagerData.hasPrev = pagerData.page != 1;
    pagerData.hasNext = pagerData.page < pagerData.totalPage;
    renderOtherTable();
}

function removeItemFromSelected(asset) {
    var position = selected.indexOf(asset);
    selected.splice(position, 1);

    calcPager();
    renderAssetTable();
}

function selectAsset(asset, checked) {
    if (checked) {
        selected.push(asset);
    } else {
        var position = selected.indexOf(asset);
        selected.splice(position, 1);
    }
    calcPager();
}

getAssets().then(function (data) {
    allAssetData = data;
    renderAssetTable();
});

calcPager();