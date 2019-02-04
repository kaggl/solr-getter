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

let rows = 1;
start = 0;
const header = {
  hl: 'on',
  'hl.fl': '_text_',
  rows,
  start,
}
function getSolr(id) {
  id = $(id).val();
  header.q = `*${id}*`;
    const ret = [];
    let numFound;
    getter(ret, id)
    $("#output").html(`${ret.length} results usable, ${numFound} totally\n`);
    $("#output").append(JSON.stringify(ret, null, "\t"));
}
function getter(ret, id) {
  const url = 'https://fedora.hephaistos.arz.oeaw.ac.at/solr/arche/query';
  $.getJSON(url, header, (data) => {
    const obj = data;
    numFound = obj.response.numFound;
    console.log(obj);
    for (let i = 0; i < obj.response.docs.length; i += 1) {
      if (obj.highlighting[obj.response.docs[i].id]._text_) {
        obj.response.docs[i].highlight = obj.highlighting[obj.response.docs[i].id]._text_[0];
        ret.push(obj.response.docs[i]);
      }
    }
    header.rows += rows;
    console.log('ret', ret);
    if (ret.length >= rows || !obj.response.docs.length) return ret;
    else getter(ret);
  });
}
