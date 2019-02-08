$(document).ready(() => {
  $(".loader").hide();
  const t = $('#table').DataTable({
    "columns": [{
        "data": "highlight"
      },
      {
        "data": "content_type"
      },
    ]
  });

  function getSolr(id, start) {
    id = $(id).val();
    if (!start) start = 0;
    const url = 'https://fedora.hephaistos.arz.oeaw.ac.at/solr/arche/query';
    const header = {
      q: `*${id}*`,
      hl: 'on',
      'hl.fl': '_text_',
      rows: 200000,
      timeAllowed: 5000,
      start,
    }
    const ret = [];
    let numFound;
    $(".loader").show();
    $.getJSON(url, header, (data) => {
      const obj = data;
      numFound = obj.response.numFound;
      console.log(obj);
      for (let i = 0; i < obj.response.docs.length; i += 1) {
        if (obj.highlighting[obj.response.docs[i].id]._text_) {
          obj.response.docs[i].highlight = obj.highlighting[obj.response.docs[i].id]._text_[0]
            .replace(/\n/g, '')
            .replace(/\s+/g, ' ')
            .trim();
          ret.push(obj.response.docs[i]);
        }
      }
      $(".loader").hide();
      t.data().clear();
      t.rows.add(ret).draw();

      $("#output").html(`${ret.length} results usable, ${numFound} totally\n`);
    });
  }

  $("#send").click(() => {
    getSolr('input');
  });
});
