  $(".loader").hide();
  const t = $('#table').DataTable({
    "columns": [{
        "data": "meta_title"
      },
      {
        "data": "highlight"
      },
      {
        "data": "content_type"
      },
    ],
    // "processing": true,
    // "serverSide": true,
    // "ajax": "processor.php",
  });

  function getSolr(params) {
    const header = {
      q: `*${params.input}*`,
      hl: 'on',
      'hl.fl': '_text_',
      rows: params.pageSize,
      // sort: 'meta_title asc',
    }
    const ret = [];
    let numFound;
    $(".loader").show();
    $.getJSON(params.solrEndpoint, header, (obj) => {
      numFound = obj.response.numFound;
      console.log(obj);

      for (let i = 0; i < obj.response.docs.length; i += 1) {
        let inCollection = false;

        if (obj.response.docs[i].meta_identifier) {
          for (let j = 0; j < obj.response.docs[i].meta_identifier.length; j += 1) {
            if (obj.response.docs[i].meta_identifier[j].indexOf(params.searchInCollection) > -1) {
              console.log("put in col", obj.response.docs[i].meta_identifier[j]);
              inCollection = true;
            }
          }
        }
        if (!inCollection) continue;
        if (obj.highlighting[obj.response.docs[i].id]._text_) {
          obj.response.docs[i].highlight = obj.highlighting[obj.response.docs[i].id]._text_[0]
            .replace(/\n|^\W|^\D/g, '')
            .replace(/\s+/g, ' ')
            .trim();
        } else obj.response.docs[i].highlight = 'no highlighting given';
        if (!obj.response.docs[i].meta_title) obj.response.docs[i].meta_title = 'no title given';
        ret.push(obj.response.docs[i]);
      }

      $(".loader").hide();
      t.data().clear();
      t.rows.add(ret).draw();

      $("#output").html(`${ret.length} results usable, ${numFound} total\n`);
    });
  }
