$('#ddlSearch').select2({
  placeholder: "Vyberte instituci",
  allowClear: true,
  width: '520px',
  data: menudata
});

$('#ddlSearch').on('select2:open', function(e) {

  $('#select2-ddlSearch-results').on('click', function(event) {

    event.stopPropagation();
    var data = $(event.target).html();
    var selectedOptionGroup = data.toString().trim();
    var groupchildren = [];

    for (var i = 0; i < menudata.length; i++) {

      if (selectedOptionGroup.toString() === menudata[i].text.toString()) {
        for (var j = 0; j < menudata[i].children.length; j++) {
          groupchildren.push(menudata[i].children[j].id);
        }
      }
    }

    var options = [];
    options = $('#ddlSearch').val();
    if (options === null || options === '') {
      options = [];
    }

    for (var i = 0; i < groupchildren.length; i++) {
      var count = 0;
      for (var j = 0; j < options.length; j++) {
        if (options[j].toString() === groupchildren[i].toString()) {
          count++;
          break;
        }
      }

      if (count === 0) {
        options.push(groupchildren[i].toString());
      }
    }

    $('#ddlSearch').val(options);
    $('#ddlSearch').trigger('change'); // Notify any JS components that the value changed
    $('#ddlSearch').select2('close');

    $('li.select2-selection__choice').remove()
    $('ul.select2-selection__rendered').append('<li class="select2-selection__choice" title="' + data + '"><span class="select2-selection__choice__remove" role="presentation">×</span>'+data+'</li>')

  });
});



function ddlChange() {
    //unselect all
    $.each(institutions,function(key,value)
            {
                value.selected = 0;
            })


    var lSelected = $('#ddlSearch').select2('val');
    var i;
    for (i=0; i < lSelected.length; i++) {
        singleID = lSelected[i]

        var obj = institutions[singleID];
        delete institutions[singleID];
        institutions[singleID] = obj;

        institutions[singleID].selected = 1;
    }
    $('#chart').empty();
    $('.tooltip').remove();
    DrawChart(institutions);

}
