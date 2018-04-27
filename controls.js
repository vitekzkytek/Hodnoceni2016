function getIncludedIDs() {
    result = [];

    for (var org in menudata) {
        for (var inst in menudata[org].children) {
            if (menudata[org].children[inst].included === "True")
            {result.push(menudata[org].children[inst].id)}
        }
    }


    return result;
}


$('#ddlSearch').select2({
  placeholder: "Vyberte instituci",
  //theme:'paper',
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
    //TODO pri smazani ze searche se nezavira descBox
    // je to tim, ze v probiha nekolika nasobne volani ddlChange
    // a vj ednu chvili je proste lSelected.length == 1
    $.each(institutions,function(key,value)
            {
                value.selected = 0;
            })


    var lSelected = $('#ddlSearch').select2('val');
    for (i=0; i < lSelected.length; i++) {
        if (lIncluded.includes(lSelected[i])) {
            institutions[lSelected[i]].selected = 1;
        }
    }
    $("#ddlSearch").on("select2:unselecting", function (e) {
        location.reload(true);
        //TODO vylepsi tohle
//       $('#ddlSearch').val(null)
// //TODO check if upper doesnt solve my problem????
//         //$('#ddlSearch').val('');
    });

    if (lSelected.length === 1) {

        if (lIncluded.includes(lSelected[0])) {
        d = institutions[lSelected[0]]
            openDescBox(d)
        }
        else {
            openDescBoxNA()
        }
    }

    $('#circles').empty();
    $('.tooltip').empty();

    tooltip = d3.select('body')
                    .append('div')
                    .attr('class','tooltip')
                    .style('opacity',0);
    DrawData();
};

function openDescBoxNA() {
    $('#descBox').css('display','block');
    $('#descBox').animate({height:'40px'},250, function() {
        $('#iJednotka').html('Pro tuto instituci není k dispozici dostatečný počet výsledků a proto nebyla zařazena do analýzy.')
         $('#iPredkladatel').html('');
        $('#iResults').html('');
        $('#iExcel').html('');
        $('#closeDescLink').html('<a id="closeDescLink" href="#" onclick="closeDescBox(institutions);"><img src="CloseIcon.png" height="30" width="30"></img></a>')

    })
};

function openDescBox(d) {
    $('#descBox').css('display','block');
    $('#descBox').animate({height:'150px'},500, function() {
        $('#iJednotka').html('<strong>' + d.Jednotka_name + '</strong>')
        $('#iPredkladatel').html('Předkladatel: ' +  d.Predkladatel_long);
        $('#iResults').html('V letech 2011 - 2015 instituce do RIV přihlásila celkem ' + d.Total + ' výsledků. <br> Z nich ' + d.Czech + ' vyšlo v místních a dalších ' + d.Predatory + ' v predátorských časopisech')
        $('#closeDescLink').html('<a id="closeDescLink" href="#" onclick="closeDescBox(institutions);"><img src="CloseIcon.png" height="30" width="30"></img></a>')
        $('#iExcel').html('Ke stažení je k dispozici seznam <a href="xls/'+ d.JEDNOTKA +'_Local.xlsx">místních</a>, <a href="xls/'+ d.JEDNOTKA +'_Predatory.xlsx">predátorských</a> a i <a href="xls/'+ d.JEDNOTKA +'_All.xlsx">všech</a> výsledků přihlášených do RIV.')
  })
}

function closeDescBox()
{
	$('#descBox').animate({height:'0px'},500,
		function() {
			$('#descBox').css('display','none');

			$.each(institutions,function(key, value)
					{
					    value.selected = 0;
					});

			$("#circles").empty();
			$(".tooltip").remove();
            $('#ddlSearch').val(null).change();
			DrawData();
	});
};


function SelectSinglePoint(d) {
  $.each(institutions,function (key,value) {
    value.selected = 0;
  })
  $('#ddlSearch').val(d.ID).change()
  //$('#ddlSearch option[value='+d.ID + ']').attr('selected','selected');
  d.selected = 1;
  DrawData(institutions,[d]);
}
