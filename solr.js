  $(".loader").hide();
  let t = $('#table').DataTable({
    "columns": [{
        "data": "meta_title"
      },
      {
        "data": "highlight_with_link"
      },
      {
        "data": "content_type"
      },
    ],
    // "processing": true,
    // "serverSide": true,
  });

  function getSolr(params) {
    const header = {
      q: `*${params.input}*`,
      hl: 'on',
      'hl.fl': '_text_',
      rows: params.pageSize,
      // sort: 'meta_title asc',
    }
    let ret = [];
    let sparqlRet = (params.sparqlQuery ? [] : null);
    let reqToGo = 1 + (params.sparqlQuery ? 1 : 0);

    let combineResults = function() {
      reqToGo -= 1;
      if (reqToGo <= 0) {
        if (sparqlRet !== null) {
        console.log(ret);
          const ret2 = [];
          for (let i = 0; i < ret.length; i += 1) {
            if (sparqlRet.indexOf(ret[i].id) >= 0) {
              ret2.push(ret[i]);
            }
          }
          ret = ret2;
        }

        $(".loader").hide();
        t.data().clear();
        t.rows.add(ret).draw();
        const numFound = ret.length;
        $("#output").html(`${ret.length} results usable, ${numFound} total\n`);
      }
    };

    if (params.columns.length) {
      let ret = '';
      const cols = params.columns.map(x => Object.keys(x)[0]);
      for (let i = 0; i < cols.length; i += 1) {
        ret += `<th>${cols[i]}</th>`
      }

      $('#columns').replaceWith(`<tr>${ret}</tr>`);

      t.destroy();
      t = $('#table').DataTable({
        "columns": params.columns.map(x => Object.values(x)[0]).map((x) => {
          return { "data": x };
        }),
        // "processing": true,
        // "serverSide": true,
      });
    }

    $(".loader").show();

    $.getJSON(params.solrEndpoint, header, (obj) => {
      console.log(obj);

      for (let i = 0; i < obj.response.docs.length; i += 1) {
        if (obj.highlighting[obj.response.docs[i].id]._text_) {
          obj.response.docs[i].highlight = obj.highlighting[obj.response.docs[i].id]._text_[0]
            .replace(/\n|^\W|^\D/g, '')
            .replace(/\s+/g, ' ')
            .trim();
          if (obj.response.docs[i].meta_identifier) {
            obj.response.docs[i].highlight_with_link = `<a href="${obj.response.docs[i].meta_identifier[0]}">${obj.response.docs[i].highlight}</a>`
          }
        } else {
          obj.response.docs[i].highlight = 'no highlighting given';
        }
        if (!obj.response.docs[i].meta_title) {
          obj.response.docs[i].meta_title = 'no title given';
        }
        ret.push(obj.response.docs[i]);
      }

      combineResults();
    });

    if (params.sparqlQuery) {
      $.getJSON(params.sparqlEndpoint, {query: params.sparqlQuery}, (obj) => {
        console.log(obj);
        for (let i = 0; i < obj.results.bindings.length; i++) {
          sparqlRet.push(obj.results.bindings[i].res.value);
        }
        combineResults();
      });
    }
  }
