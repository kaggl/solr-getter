  $(".loader").hide();
  const t = $('#table').DataTable({
    "columns": [
      { "data": "meta_title" },
      { "data": "highlight" },
      { "data": "content_type" },
    ]
  });

  function getSolr(params) {
    const header = {
      q: `*${params.input}*`,
      hl: 'on',
      'hl.fl': '_text_',
      rows: params.pageSize,
    }
    const ret = [];
    let numFound;
    $(".loader").show();
    $.getJSON(params.solrEndpoint, header, (obj) => {
      numFound = obj.response.numFound;
      console.log(obj);
      for (let i = 0; i < obj.response.docs.length; i += 1) {
        if (obj.highlighting[obj.response.docs[i].id]._text_) {
          obj.response.docs[i].highlight = obj.highlighting[obj.response.docs[i].id]._text_[0]
            .replace(/\n|^\W|^\D/g, '')
            .replace(/\s+/g, ' ')
            .trim();
        } else obj.response.docs[i].highlight = 'zzzz';
        ret.push(obj.response.docs[i]);
      }
      $(".loader").hide();
      t.data().clear();
      t.rows.add(ret).draw();

      $("#output").html(`${ret.length} results usable, ${numFound} total\n`);
    });
  }
