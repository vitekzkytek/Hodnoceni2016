// function getIncludedIDs() {
//     result = [];
//
//     for (var org in menudata) {
//         for (var inst in menudata[org].children) {
//             if (menudata[org].children[inst].included === "True")
//             {result.push(menudata[org].children[inst].id)}
//         }
//     }
//     return result;
// }

var orgs = [],insts = [], includedInsts = [];

function sortMenudata() {
    for (var org in menudata) {
        o = menudata[org]
         if (o.level === 0) {
             orgs.push(o.id);
         }
         else {
             insts.push(org)
             if(o.included === "True") {
                 includedInsts.push(o.id);
             }
         }
    }
}

function formatResult(node) {
  var $result = $('<span style="padding-left:' + (20 * node.level) + 'px;">' + node.text + '</span>');
  return $result;
};



$('#ddlSearch').select2({
  // placeholder: "Vyberte instituci",
  //theme:'paper',
  placeholder: {id:'',text: 'Vyberte instituci ...'},
  allowClear: true,
  width: '520px',
  data: menudata,
  formatSelection: function(item) {
      return item.text
  },
  formatResult: function(item) {
      return item.text
  },
    templateResult: formatResult
});

function ddlChange() {
    var id  = $('#ddlSearch').select2('val');
    unselectAll();
    var anythingSelected = (id !== '') ? true : false;

    if (anythingSelected) {
        var IsOrg = (orgs.includes(id)) ? true : false;

        if (IsOrg) {
            listinst = $.map(institutions,function(el) {return el;});
            ds = listinst.filter(d => d.Predkladatel_short === id);

            $.each(ds,function(key,value)
                {
                    value.selected = 1
                });
        }
         else {
            if(includedInsts.includes(id)) {
                d = institutions[id];
                    d.selected = 1;
                    openDescBox(d);
                }
                else {
                    d = excludedInsts[id];
                    openDescBoxNA(d);
                }
        }
    }
    DrawData();
}
function unselectAll() {
    $.each(institutions,function(key,value)
        {
            value.selected = 0;
        })

}

function openDescBoxNA(d) {
    $('#descBox').css('display','block');
    $('#descBox').animate({height:'100px'},333, function() {
        $('#iJednotka').html('<strong>' + d.Jednotka_name + '</strong>')
        $('#iPredkladatel').html('Předkladatel: ' +  d.Predkladatel_long);
        $('#iResults').html('Není k dispozici dostatečný počet relevantních výsledků a proto do analýzy nebyla zařazena.');
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
