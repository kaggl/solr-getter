/*
const Http = new XMLHttpRequest();
function getSolr(addVal, page) {
  Http.open("GET", document.getElementById("input").value);
  Http.send();
  Http.onreadystatechange = (e) => {
    const obj = JSON.parse(Http.responseText);
    let page = 1;
    let next = false;
    const ret = [];
    console.log(obj);
    for (let i = 0; i < obj.response.docs.length; i += 1) {
      if (obj.highlighting[obj.response.docs[i].id]._text_) {
        obj.response.docs[i].highlight = obj.highlighting[obj.response.docs[i].id]._text_[0];
        ret.push(obj.response.docs[i]);
      }
    }
    console.log(ret);
    document.getElementById("output").innerText = `${ret.length} results shown, ${obj.response.numFound} totally\n"`;
    document.getElementById("output").innerText += JSON.stringify(ret, null, "\t");
  }
}
*/
let t;
$(document).ready(() => {
  t = $('#table').DataTable({
    "columns": [
      {
        "data": "highlight"
      },
      {
        "data": "content_type"
      }
    ]
  });
});

function getSolr(id, start) {
  id = $(id).val();
  if (!start) start = 0;
  const url = 'https://fedora.hephaistos.arz.oeaw.ac.at/solr/arche/query';
  const header = {
    q: `*${id}*`,
    hl: 'on',
    'hl.fl': '_text_',
    rows: 200,
    start,
  }
  const ret = [];
  let numFound;
  //while (ret.length < 10) {
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

    t.data = ret;

    $("#output").html(`${ret.length} results usable, ${numFound} totally\n`);
  });
  //}
}
