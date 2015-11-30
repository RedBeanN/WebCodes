$(function() {
    jQuery.fn.alternateRowColors = function() {
        $("tbody tr:odd, this").removeClass("even").addClass("odd");
        $("tbody tr:even, this").removeClass("odd").addClass("even");
        return this;
    };
    $("#staff").each(sorting);
    $("#todo").each(sorting);
})

function sorting() {
    var tb = $(this);
    tb.alternateRowColors(tb);
    $("th", tb).each(function(col) {
        var type;
        if ($(this).is(".sort-alpha")) {
            type = function($cell) {
                return $cell.find("sort-key").text().toUpperCase() + " "
                + $cell.text().toUpperCase();
            }
        } else if ($(this).is(".sort-date")) {
            type = function($cell) { return Date.parse($cell.text()); }
        }
        if (type) {
            $(this).click(function() {
                var dir = 1;
                if ($(this).is(".sorted-asc")) dir = -1;
                var rows = tb.find("tbody>tr").get();
                $.each(rows, function(index, row) {
                    row.sortKey = type($(row).children("td").eq(col));
                });
                rows.sort(function(a, b) {
                    if (a.sortKey < b.sortKey) return -dir;
                    if (a.sortKey > b.sortKey) return dir;
                    return 0;
                })
                $.each(rows, function(index, row) {
                    tb.children("tbody").append(row);
                    row.sortKey = null;
                })
                tb.find("th").removeClass("sorted-asc").removeClass("sorted-desc");
                if (dir === 1) $(this).addClass("sorted-asc");
                else $(this).addClass("sorted-desc");

                tb.find("th").removeClass("sorted");
                $(this).addClass("sorted");
                tb.alternateRowColors(tb);
            });
        }
    });
}
